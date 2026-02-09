/**
 * Test Rhythm Controller
 * 
 * Demonstrates rhythm analysis on the undersea cable script.
 */

const fs = require('fs');
const path = require('path');

// Mock imports (since we can't use TypeScript imports in Node.js directly)
// In real usage, this would import from compiled JS

console.log('\n🎵 RHYTHM CONTROLLER TEST\n');
console.log('='.repeat(80));

// Load the compiled video data
const videoPath = path.join(__dirname, '../src/data/video-compiled.json');
const videoData = JSON.parse(fs.readFileSync(videoPath, 'utf-8'));

console.log(`\nAnalyzing ${videoData.scenes.length} scenes...\n`);

// Extract rhythm inputs from scenes
const inputs = videoData.scenes.map((scene, index) => {
  const trace = scene._trace || {};
  return {
    sceneIndex: index,
    emphasis: trace.emphasis || 'none',
    emotionalWeight: trace.emotion === 'high' ? 7 : trace.emotion === 'medium' ? 5 : 2,
    strategy: scene.layout,
    intentType: undefined, // Would come from original script
  };
});

// Simple narrative phase detection (mimicking the real detector)
function detectPhase(index, total) {
  const position = index / total;
  if (position < 0.2) return 'setup';
  if (position < 0.5) return 'expansion';
  if (position < 0.8) return 'escalation';
  if (position < 0.9) return 'peak';
  return 'resolution';
}

// Simple flatline detection
function detectFlatline(emphasisLevels) {
  let consecutive = 0;
  for (const level of emphasisLevels) {
    if (level === 'strong') {
      consecutive = 0;
    } else {
      consecutive++;
      if (consecutive >= 12) return true;
    }
  }
  return false;
}

// Simple clustering detection
function detectClustering(emphasisLevels) {
  const WINDOW = 4;
  for (let i = 0; i <= emphasisLevels.length - WINDOW; i++) {
    const window = emphasisLevels.slice(i, i + WINDOW);
    const strongCount = window.filter(l => l === 'strong').length;
    if (strongCount >= 2) return true;
  }
  return false;
}

// Analyze
const emphasisLevels = inputs.map(i => i.emphasis);
const flatline = detectFlatline(emphasisLevels);
const clustering = detectClustering(emphasisLevels);

console.log('📊 SEQUENCE ANALYSIS:\n');
console.log(`   Flatline detected: ${flatline ? '⚠️  YES' : '✅ NO'}`);
console.log(`   Clustering detected: ${clustering ? '⚠️  YES' : '✅ NO'}`);
console.log('');

// Show narrative arc
console.log('🎭 NARRATIVE ARC:\n');
const arc = inputs.map((input, i) => detectPhase(i, inputs.length));
const arcCounts = {
  setup: arc.filter(p => p === 'setup').length,
  expansion: arc.filter(p => p === 'expansion').length,
  escalation: arc.filter(p => p === 'escalation').length,
  peak: arc.filter(p => p === 'peak').length,
  resolution: arc.filter(p => p === 'resolution').length,
};

Object.entries(arcCounts).forEach(([phase, count]) => {
  const pct = Math.round((count / inputs.length) * 100);
  console.log(`   ${phase.padEnd(12)} ${count} scenes (${pct}%)`);
});
console.log('');

// Show scene-by-scene analysis
console.log('🎬 SCENE-BY-SCENE RHYTHM:\n');
inputs.forEach((input, index) => {
  const phase = arc[index];
  const sceneNum = String(index + 1).padStart(2, '0');
  
  console.log(`scene_${sceneNum}:`);
  console.log(`  phase: ${phase}`);
  console.log(`  emphasis: ${input.emphasis}`);
  console.log(`  strategy: ${input.strategy}`);
  console.log('');
});

// Summary
console.log('='.repeat(80));
console.log('\n✅ Rhythm analysis complete!\n');
console.log('💡 Next steps:');
console.log('   1. Review narrative arc distribution');
console.log('   2. Check for flatlines or clustering');
console.log('   3. Consider rhythm adjustments if needed');
console.log('');
