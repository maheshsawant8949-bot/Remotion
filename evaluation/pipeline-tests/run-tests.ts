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

// CLI Args
const args = process.argv.slice(2);
const snapshotMode = args.includes('--snapshot');
const scriptFilterIndex = args.indexOf('--script');
const scriptFilter = scriptFilterIndex !== -1 ? args[scriptFilterIndex + 1] : null;

// Load Data
const scripts: TestScript[] = JSON.parse(fs.readFileSync(SCRIPTS_PATH, 'utf-8'));
const expectedData: Record<string, ExpectedOutcome> = JSON.parse(fs.readFileSync(EXPECTED_PATH, 'utf-8'));

let passCount = 0;
let failCount = 0;
const actualResults: Record<string, any> = {};

console.log("\n🎬 PIPELINE EVALUATION HARNESS");
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
      emotionalWeight: emotion.score // Pass explicit weight to Factory
  };

  const scene = SceneFactory.create(intent);
  
  // Extract Results for Comparison
  // Calculate reveal eligibility using actual logic
  const { pattern } = Heuristics.normalizeIntent(script.text);
  const revealStyle = getRevealStyle(emotion.score, density.score, pattern);
  
  const actual = {
      emotionalWeight: emotion.level,
      strategy: scene.layout, // The final selected layout
      pacing: scene.trace?.pacing?.profile || 'normal',
      density: density.score >= 7 ? 'high' : (density.score >= 4 ? 'medium' : 'low'),
      revealEligible: revealStyle === 'gradual'
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
      console.log(PrettyPrinter.formatResult(scriptId, diffs));
  } else {
      console.log(`SCRIPT: ${scriptId}`);
      console.log(`[WARNING] No expected data found.\n`);
      console.log(`Actual: ${JSON.stringify(actual, null, 2)}\n`);
  }
});

// Summary
PrettyPrinter.printSummary(passCount + failCount, passCount, failCount);

// Snapshot
if (snapshotMode) {
    fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(actualResults, null, 2));
    console.log(`📸 Snapshot written to ${SNAPSHOT_PATH}`);
}

if (failCount > 0) process.exit(1);
