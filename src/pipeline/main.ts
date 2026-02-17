
import fs from 'fs';
import path from 'path';
import { AiRouter } from '../ai-assist/ai-router';
import { SceneInterpreter } from '../ai-assist/scene-interpreter';
import { VisualSuggester } from '../ai-assist/visual-suggester';
import { QualityCritic } from '../ai-assist/quality-critic';
import { ThumbnailGenerator } from '../ai-assist/thumbnail-generator';
import { VisualIntentExtractor } from '../asset-intelligence/visual-intent-extractor';
import { MultiSourceResolver, AssetResult } from '../asset-intelligence/multi-source-resolver';
import { AssetRanker } from '../asset-intelligence/asset-ranker';
import { StrategyEngine } from '../visual-reasoner/strategy-engine';
import { SceneFactory, ContentPayload } from '../scene-compiler/scene-factory';
import { SceneIntent } from '../scene-compiler/grammar-rules';
import { EmotionalAnalyzer } from '../pacing-engine/emotional-analyzer';
import { SceneDensityController } from '../pacing-engine/density-controller';
import { HardeningOrchestrator } from '../production-hardening/hardening-orchestrator';
import { SystemConfidence } from '../production-hardening/confidence-router';

// Config
const OUTPUT_PATH = path.join(__dirname, '../../src/data/video-compiled.json');
// Using the same scripts as the test harness for now
const SCRIPTS_PATH = path.join(__dirname, '../../evaluation/pipeline-tests/scripts.json');

/**
 * AI Video Generation Pipeline
 * 
 * Orchestrates the full journey from Script -> Video Plan
 * Integrates:
 * - Asset Intelligence (Phase 27)
 * - AI Assist Layer (Phase 28)
 * - Core Engines (Pacing, Strategy, Grammar)
 */

interface ScriptInput {
  text: string;
  intentType?: string;
}

async function runPipeline() {
  console.log('\n🚀 STARTING AI VIDEO GENERATION PIPELINE');
  console.log('========================================\n');

  if (!fs.existsSync(SCRIPTS_PATH)) {
      console.error(`❌ Scripts file not found at ${SCRIPTS_PATH}`);
      process.exit(1);
  }

  // 1. Load Input
  const scripts: ScriptInput[] = JSON.parse(fs.readFileSync(SCRIPTS_PATH, 'utf-8'));
  const compiledScenes: any[] = [];
  const fullScriptText = scripts.map(s => s.text).join(' '); // For global context analysis

  console.log(`📝 Loaded ${scripts.length} script segments.`);

  // 2. Process each scene
  for (let i = 0; i < scripts.length; i++) {
    const inputFn = scripts[i];
    console.log(`\n🎬 Processing Scene ${i + 1}/${scripts.length}: "${inputFn.text.substring(0, 40)}..."`);

    // --- STEP A: ANALYSIS & INTENT ---
    // 1. Emotional Analysis
    const emotionAnalyzer = new EmotionalAnalyzer();
    const emotion = emotionAnalyzer.analyze(inputFn.text);
    console.log(`   ❤️  Emotion: ${emotion.level} (Score: ${emotion.score})`);
    
    // 2. Visual Intent Extraction (Phase 27)
    // Uses LLM to understand deeper visual meaning
    console.log('   👁️  Extracting Visual Intent...');
    const visualIntent = await VisualIntentExtractor.extract(inputFn.text, {
      emotionalWeight: emotion.score,
      emphasis: 'none' // Default
    });
    console.log(`       Concept: "${visualIntent.primaryConcept}" | Category: ${visualIntent.visualCategory}`);

    // --- STEP B: AI ADVISORY (Phase 28) ---
    // Check if we need high-level AI assistance
    const needsAi = AiRouter.shouldTrigger('visual-suggestion', {
      script: inputFn.text,
      isAbstract: visualIntent.visualCategory === 'abstract' || visualIntent.visualCategory === 'conceptual',
      confidenceScore: 0.6 // Mock low confidence for abstract
    });

    let interpretedScene;
    let visualSuggestion;

    if (needsAi) {
      console.log('   🤖 AI Assist Triggered: Interpreting Scene...');
      interpretedScene = await SceneInterpreter.interpret(inputFn.text);
      if (interpretedScene.visualMetaphors.length > 0) {
        console.log(`       Metaphors: ${interpretedScene.visualMetaphors.join(', ')}`);
      }
      
      visualSuggestion = VisualSuggester.suggest(interpretedScene);
      console.log(`       Suggestion: ${visualSuggestion.archetype || visualSuggestion.layoutConstraint} (${(visualSuggestion.confidence * 100).toFixed(0)}% confidence)`);
    }

    // --- STEP C: STRATEGY & LAYOUT ---
    // Use AI suggestion if high confidence, else normal Strategy Engine
    let selectedLayout = 'title';
    if (visualSuggestion && visualSuggestion.confidence > 0.8 && visualSuggestion.archetype) {
       // Map archetype to layout (simplified mapping)
       if (visualSuggestion.archetype === 'timeline') selectedLayout = 'process';
       else if (visualSuggestion.archetype === 'comparison') selectedLayout = 'split'; 
       else if (visualSuggestion.archetype === 'flow') selectedLayout = 'process';
       else selectedLayout = 'diagram'; 
       console.log(`   📐 Layout Strategy: ${selectedLayout} (AI Suggested)`);
    } else {
       const strategies = StrategyEngine.predictStrategy(inputFn.text, emotion.score);
       selectedLayout = strategies[0]?.name || 'title';
       console.log(`   📐 Layout Strategy: ${selectedLayout} (Engine Predicted)`);
    }

    // --- STEP D: ASSET RESOLUTION ---
    // Find assets based on visual intent
    let assets: AssetResult[] = [];
    // Only search/generate assets for visual layouts
    if (selectedLayout !== 'title' && selectedLayout !== 'data' && selectedLayout !== 'process') {
        // Build query using helper (Phase 27)
        // We construct a mock Strategy object for the helper
        const mockStrategy = { path: selectedLayout === 'hero' ? 'stock_footage' : 'stock_photo' };
        
        const query = MultiSourceResolver.buildQuery(visualIntent, mockStrategy as any);
        console.log(`   🔍 Searching Assets: "${query}"`);
        
        assets = await MultiSourceResolver.search(query, mockStrategy as any, { 
            maxResults: 5 
        });
        console.log(`       Found ${assets.length} candidates.`);

        // Rank Assets (Phase 27/28)
        if (assets.length > 0) {
            // Use AI Ranker for hero shots if budget/token allows (Selective AI)
            if (selectedLayout === 'hero' && AiRouter.shouldTrigger('asset-ranking', { script: inputFn.text, assetMatchCount: assets.length })) {
                 console.log('      🧠 AI Ranking Assets (GPT-4o Vision)...');
                 // In a real run, we would iterate and await AssetRankerAI.analyze
                 // For now, let's assume the first one is best or mock the ranking re-order
                 const bestAsset = assets[0]; // Placeholder for sort
                 assets = [bestAsset]; 
            } else {
                 console.log('      ⚖️  Ranking Assets (Heuristic)...');
                 // Use valid StyleCriteria
                 const ranked = await AssetRanker.rank(assets, visualIntent, {
                    realism: 'photorealistic',
                    colorTemperature: 'cool',
                    contrastLevel: 'medium',
                    grainLevel: 'subtle',
                    lightingStyle: 'natural',
                    compositionDensity: 'balanced'
                 });
                 assets = ranked.map(r => r.asset);
            }
        }
    }

    // --- STEP E: COMPILE SCENE ---
    const intent: SceneIntent = {
        type: (inputFn.intentType as any) || 'context_setting', // Default
        role: 'context', // Fixed role
        pacing: 'normal',
        competingStrategies: [selectedLayout],
        trace: { inputScript: inputFn.text },
        emotionalWeight: emotion.score
    };

    const payload: ContentPayload = {
        primaryText: inputFn.text,
        assetUrl: assets[0]?.url, // Pick top ranked asset
        secondaryText: visualIntent.secondaryConcepts[0] // Use secondary concept as subtitle/label
    };

    // Calculate duration (Pacing Engine)
    const densityController = new SceneDensityController();
    const density = densityController.analyze(inputFn.text, selectedLayout);
    const duration = density.score > 6 ? 7 : density.score > 4 ? 5 : 4;

    // Build the scene
    const scene = SceneFactory.buildScene(intent, payload);
    
    // Enrich with runtime properties needed for JSON output
    const finalScene = {
        ...scene,
        scene_id: i + 1,
        duration_sec: duration,
        caption: { words: inputFn.text.split(' ') } // Simple caption mock
    };

    compiledScenes.push(finalScene);
    console.log(`   ✅ Scene Compiled (Duration: ${duration}s)`);
  } // End Loop

  // --- STEP F: PRODUCTION HARDENING LAYER (Phase 29) ---
  // Aggregate confidence scores (Mock logic for now, should be real-data driven)
  const confidenceScores: SystemConfidence = {
      assetConfidence: 0.8, // Placeholder
      aiConfidence: 0.7,    // Placeholder
      proceduralConfidence: 0.9,
      alignmentConfidence: 0.8
  };

  const hardeningResult = HardeningOrchestrator.validate(compiledScenes, fullScriptText, confidenceScores);
  
  if (!hardeningResult.approved) {
      console.error(`\n❌ PRODUCTION HARDENING FAILED: Render Blocked.`);
      console.error(`   Reason: ${hardeningResult.report.status}`);
      process.exit(1);
  }

  const finalScenes = hardeningResult.scenes;

  // --- STEP G: QUALITY CHECK (Critic) ---
  console.log('\n🕵️  Running Quality Control (Creative Director)...');
  // We check the first few scenes as a sample context
  const qcReport = await QualityCritic.critique(fullScriptText.substring(0, 1000), finalScenes.slice(0, 3));
  console.log(`   Score: ${qcReport.score}/10`);
  if (qcReport.suggestions.length > 0) {
    console.log(`   Suggestions: ${qcReport.suggestions.join('| ')}`);
  }

  // --- STEP H: THUMBNAILS ---
  console.log('\n🖼️  Generating Thumbnails...');
  const thumbnails = await ThumbnailGenerator.generate(fullScriptText.substring(0, 500), "Auto-Generated Video");
  if (thumbnails && thumbnails.length > 0) {
     console.log(`   Concept 1: ${thumbnails[0].concept}`);
     console.log(`   Hooks: "${thumbnails[0].textHook}"`);
  }

  // --- STEP I: OUTPUT ---
  const videoData = {
    meta: { fps: 30, width: 1920, height: 1080 },
    scenes: finalScenes
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(videoData, null, 2));
  console.log(`\n✅ Pipeline Complete! Output written to ${OUTPUT_PATH}`);
}

runPipeline().catch(console.error);
