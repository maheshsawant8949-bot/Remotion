import { EmotionalAnalyzer } from '../src/pacing-engine/emotional-analyzer';
import { SceneFactory } from '../src/scene-compiler/scene-factory';
import { SceneIntent } from '../src/scene-compiler/grammar-rules';

// Simple CLI to test the pipeline
const text = process.argv[2] || "Over 50 million tons of plastic enter the ocean every year, killing thousands of marine animals.";

console.log("=== Manual Pipeline Test ===\n");
console.log(`Input: "${text}"\n`);

// 1. Emotional Analysis
console.log("--- 1. Emotional Analysis ---");
const analyzer = new EmotionalAnalyzer();
const emotion = analyzer.analyze(text);
console.log(`Score: ${emotion.score.toFixed(1)}`);
console.log(`Level: ${emotion.level.toUpperCase()}`);
console.log(`Triggers: ${emotion.triggers.join(', ')}`);

// 2. Scene Simulation
console.log("\n--- 2. Strategy & Pacing (SceneFactory) ---");

// Mock Intent - let's assume Visual Reasoner suggested 'data' and 'hero'
const mockIntent: SceneIntent = {
    type: 'quantitative_proof', // Valid IntentType
    role: 'proof', // Valid NarrativeRole
    pacing: 'normal', // Valid Pacing ('slow' | 'normal' | 'fast')
    competingStrategies: ['data', 'hero', 'diagram'], 
    trace: { inputScript: text }
};

const scene = SceneFactory.create(mockIntent);
const pacing = scene.trace?.pacing;
const selection = scene.trace?.templateSelection;

console.log(`Initial Pacing: ${mockIntent.pacing}`);
console.log(`Strategies: ${mockIntent.competingStrategies?.join(', ')}`);
console.log(`\n>>> DECISION <<<`);
console.log(`Selected Layout: ${scene.layout.toUpperCase()}`);
console.log(`Reason: ${selection}`);
console.log(`Final Pacing: ${pacing?.profile.toUpperCase()} (${pacing?.emotionalAdjustment || 'No Change'})`);

if (scene.trace?.densityAnalysis) {
    console.log(`Density Score: ${scene.trace.densityAnalysis.score} (${scene.trace.densityAnalysis.action})`);
}

console.log("\n===========================\n");
