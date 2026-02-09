/**
 * Generate video-compiled.json from scripts.json
 * Simple manual compilation without complex imports
 */

const fs = require('fs');
const path = require('path');

// Load scripts
const scriptsPath = path.join(__dirname, '../evaluation/pipeline-tests/scripts.json');
const scripts = JSON.parse(fs.readFileSync(scriptsPath, 'utf-8'));

console.log(`\n🎬 Generating video from ${scripts.length} scripts...\n`);

// Simple heuristics for scene decisions (mimicking the engines)
function analyzeEmotion(text) {
  const emotionalWords = ['crisis', 'fear', 'disaster', 'critical', 'devastating', 'urgent', 'threat'];
  const hasEmotionalWords = emotionalWords.some(word => text.toLowerCase().includes(word));
  const hasExclamation = text.includes('!');
  const hasQuestion = text.includes('?');
  
  let score = 3; // baseline
  if (hasEmotionalWords) score += 3;
  if (hasExclamation) score += 2;
  if (hasQuestion) score += 1;
  if (text.length > 150) score += 1;
  
  return Math.min(score, 10);
}

function predictStrategy(text, intentType) {
  if (intentType === 'context_setting') return 'title';
  if (intentType === 'scale_reveal' || intentType === 'statistic_reveal') return 'diagram';
  if (intentType === 'awe_scale' || intentType === 'future_scale') return 'hero';
  if (intentType === 'sequential_step') return 'process';
  if (text.includes('%') || text.includes('terabits') || text.includes('zettabyte')) return 'data';
  if (text.length > 120) return 'diagram';
  return 'title';
}

function calculateDensity(text) {
  const wordCount = text.split(/\s+/).length;
  if (wordCount > 25) return 7;
  if (wordCount > 18) return 5;
  return 3;
}

function determineReveal(emotion, density) {
  if (emotion >= 7) return 'spotlight';
  if (density >= 6) return 'stagger';
  if (emotion >= 5 && density >= 5) return 'build';
  return 'instant';
}

function determineEmphasis(emotion, density, reveal, history) {
  // Check governor: max 1 strong per 3 scenes
  const recentStrong = history.slice(-3).filter(e => e === 'strong').length;
  
  if (emotion >= 7 || reveal === 'spotlight') {
    if (recentStrong >= 1) {
      return { level: 'soft', tier: 'secondary', reason: 'Governor downgraded strong to soft' };
    }
    return { level: 'strong', tier: 'primary', reason: `High emotion (${emotion})` };
  }
  
  if (emotion >= 4 || density >= 5) {
    return { level: 'soft', tier: 'secondary', reason: `Medium emotion (${emotion})` };
  }
  
  return { level: 'none', tier: 'background', reason: 'Low signals' };
}

function getEnterAnimation(reveal) {
  const map = {
    'instant': 'fade',
    'stagger': 'fade_up',
    'spotlight': 'scale_fade',
    'build': 'slide_up'
  };
  return map[reveal] || 'fade';
}

function getPosition(strategy) {
  const map = {
    'title': 'title.main',
    'hero': 'heroVisual',
    'diagram': 'diagram.mainVisual',
    'data': 'data.counter',
    'process': 'diagram.timeline'
  };
  return map[strategy] || 'title.main';
}

// Generate scenes
const scenes = [];
const emphasisHistory = [];

scripts.forEach((script, index) => {
  const sceneId = index + 1;
  const text = script.text;
  const intentType = script.intentType || 'context_setting';
  
  // Analyze
  const emotion = analyzeEmotion(text);
  const strategy = predictStrategy(text, intentType);
  const density = calculateDensity(text);
  const reveal = determineReveal(emotion, density);
  const emphasis = determineEmphasis(emotion, density, reveal, emphasisHistory);
  
  // Update history
  emphasisHistory.push(emphasis.level);
  
  // Duration based on density
  const duration = density > 6 ? 8 : density > 4 ? 6 : 5;
  
  // Create scene
  const scene = {
    scene_id: sceneId,
    grammarVersion: '1.0',
    duration_sec: duration,
    layout: strategy,
    layers: [
      {
        id: `content_${sceneId}`,
        type: 'group',
        position: getPosition(strategy),
        enter_animation: getEnterAnimation(reveal),
        children: [
          {
            type: 'text',
            content: text.length > 120 ? text.substring(0, 117) + '...' : text,
            font_size: strategy === 'title' ? 72 : strategy === 'hero' ? 56 : 48
          }
        ]
      }
    ],
    _trace: {
      emotion: emotion >= 7 ? 'high' : emotion >= 4 ? 'medium' : 'low',
      density: density >= 6 ? 'high' : density >= 4 ? 'medium' : 'low',
      reveal,
      emphasis: emphasis.level,
      emphasisTier: emphasis.tier,
      emphasisReason: emphasis.reason
    }
  };
  
  // Add focus effect for soft/strong emphasis (ONLY for hero and diagram layouts)
  const layoutsAllowingFocus = ['hero', 'diagram'];
  if (emphasis.level !== 'none' && layoutsAllowingFocus.includes(strategy)) {
    scene.layers.push({
      id: `emphasis_${sceneId}`,
      type: 'focus',
      target_id: `content_${sceneId}`,
      dim_opacity: emphasis.level === 'strong' ? 0.3 : 0.6,
      blur: emphasis.level === 'strong' ? 5 : 2
    });
  }
  
  scenes.push(scene);
  
  // Pretty CLI output
  const emotionLabel = emotion >= 7 ? 'high' : emotion >= 4 ? 'medium' : 'low';
  const densityLabel = density >= 6 ? 'high' : density >= 4 ? 'medium' : 'low';
  const pacing = density > 6 ? 'slow' : density > 4 ? 'normal' : 'fast';
  
  console.log(`scene_${String(sceneId).padStart(2, '0')}:`);
  console.log(`  weight: ${emotionLabel}`);
  console.log(`  strategy: ${strategy}`);
  console.log(`  reveal: ${reveal}`);
  console.log(`  emphasis: ${emphasis.level}`);
  console.log(`  pacing: ${pacing}`);
  console.log('');
});

// Generate video JSON
const videoData = {
  meta: {
    fps: 30,
    width: 1920,
    height: 1080
  },
  scenes
};

// Write output
const outputPath = path.join(__dirname, '../src/data/video-compiled.json');
fs.writeFileSync(outputPath, JSON.stringify(videoData, null, 2));

console.log(`\n✅ Generated ${scenes.length} scenes!`);
console.log(`📁 Output: ${outputPath}\n`);

// Summary
const emphasisCounts = {
  none: emphasisHistory.filter(e => e === 'none').length,
  soft: emphasisHistory.filter(e => e === 'soft').length,
  strong: emphasisHistory.filter(e => e === 'strong').length
};

console.log('📊 Emphasis Distribution:');
console.log(`   None:   ${emphasisCounts.none} (${Math.round(emphasisCounts.none / scenes.length * 100)}%)`);
console.log(`   Soft:   ${emphasisCounts.soft} (${Math.round(emphasisCounts.soft / scenes.length * 100)}%)`);
console.log(`   Strong: ${emphasisCounts.strong} (${Math.round(emphasisCounts.strong / scenes.length * 100)}%)`);
console.log('');
