import fs from 'fs';
import path from 'path';
import { EmotionalAnalyzer } from '../../src/pacing-engine/emotional-analyzer';
import { StrategyEngine } from '../../src/visual-reasoner/strategy-engine';
import { SceneDensityController } from '../../src/pacing-engine/density-controller';
import { SceneFactory } from '../../src/scene-compiler/scene-factory';
import { SceneIntent } from '../../src/scene-compiler/grammar-rules';
import { getRevealStyle } from '../../src/pacing-engine/reveal-eligibility';
import { Heuristics } from '../../src/visual-reasoner/heuristics';
import { DiffEngine, DiffResult } from './diff-engine';
import { PrettyPrinter } from './pretty-printer';
import { CinematicValidator } from './cinematic-validator';

// Types
type TestScript = {
  text: string;
  intentType?: string; // Optional override, default 'context_setting'
};

// Auto-generate stable ID from script text
function generateScriptId(text: string): string {
  // Create a simple slug from first few words
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars
    .split(/\s+/)
    .slice(0, 3) // First 3 words
    .join('_');
}

type ExpectedOutcome = {
  emotionalWeight?: string | string[]; // "medium" or ["high", "medium"]
  strategy?: string | string[];
  pacing?: string | string[];
  revealEligible?: boolean;
  density?: string; // "low", "high" check
};

// Paths
const SCRIPTS_PATH = path.join(__dirname, 'scripts.json');
const EXPECTED_PATH = path.join(__dirname, 'expected.json');
const SNAPSHOT_PATH = path.join(__dirname, 'snapshot.json');
const CINEMATIC_BASELINE_PATH = path.join(__dirname, '../baselines/cinematic-v1.json');

// CLI Args
const args = process.argv.slice(2);
const snapshotMode = args.includes('--snapshot');
const sequenceMode = args.includes('--sequence');
const scriptFilterIndex = args.indexOf('--script');
const scriptFilter = scriptFilterIndex !== -1 ? args[scriptFilterIndex + 1] : null;

// Load Data
const scripts: TestScript[] = JSON.parse(fs.readFileSync(SCRIPTS_PATH, 'utf-8'));
const expectedData: Record<string, ExpectedOutcome> = JSON.parse(fs.readFileSync(EXPECTED_PATH, 'utf-8'));

let passCount = 0;
let failCount = 0;
const actualResults: Record<string, any> = {};

// Reveal Strategy Metrics
let spotlightCount = 0;
let buildCount = 0;
let staggerCount = 0;
let instantCount = 0;
let governorDowngradeCount = 0;

// Emphasis Level Metrics
let emphasisNoneCount = 0;
let emphasisSoftCount = 0;
let emphasisStrongCount = 0;
let emphasisGovernorDowngradeCount = 0;

// Sequence Mode: Track reveal history across scenes
const revealHistory: string[] = [];
let consecutiveRevealHeavyScenes = 0;
const MAX_CONSECUTIVE_REVEAL_HEAVY = 2;

console.log("\n🎬 PIPELINE EVALUATION HARNESS");
if (sequenceMode) {
    console.log("📊 SEQUENCE MODE: Tracking reveal frequency across scenes");
}
console.log("===============================\n");

// Execute
scripts.forEach(script => {
  const scriptId = generateScriptId(script.text);
  
  if (scriptFilter && scriptId !== scriptFilter) return;

  // 1. Emotional Analysis
  const emotionAnalyzer = new EmotionalAnalyzer();
  const emotion = emotionAnalyzer.analyze(script.text);

  // 2. Strategy Prediction (Visual Reasoner)
  // We treat the text as the intent for now
  const strategies = StrategyEngine.predictStrategy(script.text, emotion.score);
  const strategyNames = strategies.map(s => s.name);

  // 3. Density Analysis
  const densityController = new SceneDensityController();
  // We need a proposed strategy for density, pick top 1
  const topStrategy = strategyNames[0] || 'default_view';
  const density = densityController.analyze(script.text, topStrategy);
  
  // 4. Scene Compilation (Pacing & Final Decision)
  // Construct a minimal valid intent
  const intent: SceneIntent = {
      type: (script.intentType as any) || 'context_setting',
      role: 'context', 
      pacing: 'normal', // Engine will adjust this based on Weight/Density
      // timing removed
      competingStrategies: strategyNames,
      trace: { inputScript: script.text },
      emotionalWeight: emotion.score, // Pass explicit weight to Factory
      revealHistory: sequenceMode ? [...revealHistory] as ("instant" | "stagger" | "spotlight" | "build")[] : undefined // Pass history in sequence mode
  };

  const scene = SceneFactory.create(intent);
  
  // Extract Results for Comparison
  // Calculate reveal eligibility using actual logic
  const { pattern } = Heuristics.normalizeIntent(script.text);
  const revealStyle = getRevealStyle(emotion.score, density.score, pattern);
  
  // Extract reveal strategy from scene trace
  const revealStrategy = scene.trace?.revealStrategy;
  const revealChosen = revealStrategy?.chosen || 'instant';
  const revealReason = revealStrategy?.reason?.[0] || 'Default';
  const governorApplied = revealStrategy?.governorApplied || false;
  
  // Sequence Mode: Track reveal history and consecutive reveal-heavy scenes
  if (sequenceMode) {
      // Add to history (keep last 3)
      revealHistory.push(revealChosen);
      if (revealHistory.length > 3) {
          revealHistory.shift();
      }
      
      // Track consecutive reveal-heavy scenes (spotlight or build)
      if (revealChosen === 'spotlight' || revealChosen === 'build') {
          consecutiveRevealHeavyScenes++;
      } else {
          consecutiveRevealHeavyScenes = 0; // Reset counter
      }
  }
  
  // Track reveal metrics
  if (revealChosen === 'spotlight') spotlightCount++;
  else if (revealChosen === 'build') buildCount++;
  else if (revealChosen === 'stagger') staggerCount++;
  else if (revealChosen === 'instant') instantCount++;
  
  if (governorApplied) governorDowngradeCount++;
  
  // Extract emphasis from scene trace
  const emphasisLevel = scene.trace?.emphasis;
  const emphasisChosen = emphasisLevel?.level || 'none';
  const emphasisPrimary = emphasisLevel?.primary;
  const emphasisSecondary = emphasisLevel?.secondary;
  const emphasisTier = emphasisLevel?.tier || 'background';
  const emphasisGovernorApplied = emphasisLevel?.governorApplied || false;
  
  // Track emphasis metrics
  if (emphasisChosen === 'none') emphasisNoneCount++;
  else if (emphasisChosen === 'soft') emphasisSoftCount++;
  else if (emphasisChosen === 'strong') emphasisStrongCount++;
  
  if (emphasisGovernorApplied) emphasisGovernorDowngradeCount++;
  
  const actual = {
      emotionalWeight: emotion.level,
      strategy: scene.layout, // The final selected layout
      pacing: scene.trace?.pacing?.profile || 'normal',
      density: density.score >= 7 ? 'high' : (density.score >= 4 ? 'medium' : 'low'),
      revealEligible: revealStyle === 'gradual',
      revealStrategy: revealChosen,
      revealReason: revealReason
  };

  actualResults[scriptId] = actual;

  // Compare
  const expected = expectedData[scriptId];
  let diffs: Record<string, DiffResult> = {};
  
  if (expected) {
      diffs = DiffEngine.validate(actual, expected);
      
      // Check Pass/Fail
      const isPass = Object.values(diffs).every((d: DiffResult) => d.pass);
      if (isPass) passCount++; else failCount++;

      // Print
      console.log(PrettyPrinter.formatResult(scriptId, diffs, revealChosen, revealReason, governorApplied));
  } else {
      console.log(`SCRIPT: ${scriptId}`);
      console.log(`[WARNING] No expected data found.\n`);
      console.log(`Actual: ${JSON.stringify(actual, null, 2)}\n`);
      console.log(`Reveal: ${revealChosen.toUpperCase()}`);
      console.log(`Reason: ${revealReason}${governorApplied ? ' [GOVERNOR APPLIED]' : ''}\n`);
  }
});

// Summary
const totalScripts = instantCount + staggerCount + spotlightCount + buildCount;
const instantPercentage = totalScripts > 0 ? Math.round((instantCount / totalScripts) * 100) : 0;

PrettyPrinter.printSummary(passCount + failCount, passCount, failCount);

// Reveal Strategy Metrics
console.log("\n📊 REVEAL STRATEGY METRICS");
console.log("===================================");
console.log(`Instant:   ${instantCount} (${instantPercentage}%)`);
console.log(`Stagger:   ${staggerCount}`);
console.log(`Spotlight: ${spotlightCount}`);
console.log(`Build:     ${buildCount}`);
if (governorDowngradeCount > 0) {
    console.log(`\n⚠️  Governor Downgrades: ${governorDowngradeCount}`);
}
if (sequenceMode) {
    console.log(`\n📈 Sequence Tracking:`);
    console.log(`   Reveal History: [${revealHistory.join(', ')}]`);
    console.log(`   Consecutive Reveal-Heavy: ${consecutiveRevealHeavyScenes}`);
    if (consecutiveRevealHeavyScenes > MAX_CONSECUTIVE_REVEAL_HEAVY) {
        console.log(`   ⚠️  WARNING: Exceeded max consecutive reveal-heavy scenes (${MAX_CONSECUTIVE_REVEAL_HEAVY})`);
    }
}
console.log("===================================\n");

// Emphasis Level Metrics
console.log("\n🎯 EMPHASIS LEVEL METRICS");
console.log("===================================");
const totalEmphasisScripts = emphasisNoneCount + emphasisSoftCount + emphasisStrongCount;
const nonePercentage = totalEmphasisScripts > 0 ? Math.round((emphasisNoneCount / totalEmphasisScripts) * 100) : 0;
const softPercentage = totalEmphasisScripts > 0 ? Math.round((emphasisSoftCount / totalEmphasisScripts) * 100) : 0;
const strongPercentage = totalEmphasisScripts > 0 ? Math.round((emphasisStrongCount / totalEmphasisScripts) * 100) : 0;

console.log(`None:   ${emphasisNoneCount} (${nonePercentage}%)`);
console.log(`Soft:   ${emphasisSoftCount} (${softPercentage}%)`);
console.log(`Strong: ${emphasisStrongCount} (${strongPercentage}%)`);
if (emphasisGovernorDowngradeCount > 0) {
    console.log(`\n⚠️  Governor Downgrades: ${emphasisGovernorDowngradeCount}`);
}
console.log("===================================\n");

// Cinematic Baseline Validation
if (fs.existsSync(CINEMATIC_BASELINE_PATH)) {
    const cinematicResult = CinematicValidator.validate(actualResults, CINEMATIC_BASELINE_PATH);
    CinematicValidator.printResults(cinematicResult);
    
    if (!cinematicResult.pass) {
        console.log("\n❌ CINEMATIC REGRESSION DETECTED");
        console.log("Spotlight/build frequency increased beyond baseline constraints.");
        console.log("This violates the scarcity principle of cinematic reveals.\n");
        process.exit(1);
    }
}

// Snapshot
if (snapshotMode) {
    fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(actualResults, null, 2));
    console.log(`📸 Snapshot written to ${SNAPSHOT_PATH}`);
}

if (failCount > 0) process.exit(1);
