/**
 * Generate stress-test-compiled.json from stress-test-script.json
 * Manual compilation with full behavior and transition logic
 */

const fs = require('fs');
const path = require('path');

// Load stress test script
const scriptsPath = path.join(__dirname, '../src/data/stress-test-script.json');
const scripts = JSON.parse(fs.readFileSync(scriptsPath, 'utf-8'));

console.log(`\n🔥 Generating STRESS TEST video from ${scripts.length} scenes...\n`);

// Simple heuristics for scene decisions (mimicking the engines)
function analyzeEmotion(text) {
  const emotionalWords = ['crisis', 'fear', 'disaster', 'critical', 'devastating', 'urgent', 'threat', 'power', 'victory', 'limitless', 'maximum', 'unstoppable'];
  const hasEmotionalWords = emotionalWords.some(word => text.toLowerCase().includes(word));
  const hasExclamation = text.includes('!');
  const hasQuestion = text.includes('?');
  
  let score = 3; // baseline
  if (hasEmotionalWords) score += 3;
  if (hasExclamation) score += 2; // Exclamation increases emotion
  if (text.toUpperCase() === text && text.length > 5) score += 2; // ALL CAPS
  if (hasQuestion) score += 1;
  if (text.length > 150) score += 1;
  
  return Math.min(score, 10);
}

function predictStrategy(text, intentType) {
  if (intentType === 'context_setting') return 'title';
  if (intentType === 'scale_reveal' || intentType === 'statistic_reveal') return 'diagram';
  if (intentType === 'awe_scale' || intentType === 'future_scale') return 'hero';
  if (intentType === 'sequential_step' || intentType === 'process') return 'process';
  if (text.includes('%') || text.includes('TB') || text.includes('errors')) return 'data';
  if (text.length > 120) return 'diagram'; // High density -> diagram usually
  return 'title';
}

function calculateDensity(text) {
  const wordCount = text.split(/\s+/).length;
  if (wordCount > 25) return 8; // Very high
  if (wordCount > 18) return 6;
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

function checkFirmAllowed(history) {
  if (history.length === 0) return true;
  const recent = history.slice(-20);
  const firmCount = recent.filter(t => t === 'firm').length;
  return (firmCount / recent.length) < 0.15;
}

function determineTransition(prevMotion, currMotion, density, isPeak, prevTransition, history) {
  let type = 'soft'; // Default
  const reasons = [];
  
  // 1. Base Mapping
  if (prevMotion === 'calm' && currMotion === 'assertive') {
    type = 'firm';
    reasons.push('Energy increase: calm → assertive');
  } else if ((prevMotion === 'assertive' || prevMotion === 'energetic') && currMotion === 'calm') {
    type = 'release';
    reasons.push(`Energy drop: ${prevMotion} → calm`);
  } else if (prevMotion === 'technical' && currMotion === 'technical') {
    type = 'minimal';
    reasons.push('Technical flow continuity');
  } else {
    reasons.push(`Default continuity: ${prevMotion} → ${currMotion}`);
  }
  
  // 2. Constraints
  
  // Density: High density → soft (cognitive load)
  if (density >= 7 && type !== 'minimal') {
    if (type !== 'soft') {
      type = 'soft';
      reasons.push(`High density (${density}) requires soft transition`);
    }
  }
  
  // Peak: Peak scenes → soft (let content carry intensity)
  if (isPeak && type === 'firm') {
    type = 'soft';
    reasons.push('Peak scene requires soft transition (content carries intensity)');
  }
  
  // Consecutive Firm: Prev firm → next soft (anti-aggression)
  if (type === 'firm' && prevTransition === 'firm') {
    type = 'soft';
    reasons.push('Consecutive firm prevented');
    return { type, reason: reasons, consecutiveFirmPrevented: true };
  }
  
  // Firm Cap: Max 15% firm
  if (type === 'firm') {
    if (!checkFirmAllowed(history)) {
      type = 'soft';
      reasons.push('Firm transition cap reached (max 15%)');
      return { type, reason: reasons, firmnessCapApplied: true };
    }
  }
  
  return { type, reason: reasons };
}

function detectEmotionalPolarity(intentType, text) {
  const upwardKeywords = ['awe', 'triumph', 'excitement', 'urgency', 'breakthrough', 'celebration', 'power', 'victory', 'limitless', 'maximum', 'unstoppable'];
  const downwardKeywords = ['somber', 'reflective', 'melancholic', 'loss', 'quiet', 'contemplative', 'scary', 'fear', 'crisis'];
  
  const combined = (intentType + ' ' + text).toLowerCase();
  
  if (upwardKeywords.some(kw => combined.includes(kw))) return 'upward';
  if (downwardKeywords.some(kw => combined.includes(kw))) return 'downward';
  
  return 'neutral';
}

function determineMotionBehavior(emotion, polarity, density, emphasis, strategy, previousBehavior, motionHistory) {
  const reasons = [];
  
  // STEP 1: Recovery bias
  if (previousBehavior === 'assertive' || previousBehavior === 'energetic') {
    if (emotion < 8) {
      reasons.push(`Recovery bias after ${previousBehavior}`, `Emotion ${emotion} < 8`);
      return { behavior: 'calm', reason: reasons, recoveryBiasApplied: true };
    }
  }
  
  // STEP 2: High density → calm
  if (density >= 7) {
    reasons.push(`High density (${density}) requires calm motion`);
    return { behavior: 'calm', reason: reasons };
  }
  
  // STEP 3: Process/diagram → technical (WITH FREQUENCY GOVERNOR)
  if ((strategy === 'process' || strategy === 'diagram') && (emphasis === 'none' || density <= 5)) {
    const recentTechnical = motionHistory.slice(-10).filter(b => b === 'technical').length;
    const technicalPercent = motionHistory.length > 0 ? (recentTechnical / Math.min(motionHistory.length, 10)) * 100 : 0;
    const technicalAllowed = technicalPercent < 25;
    
    if (technicalAllowed) {
      reasons.push(`${strategy} strategy (density=${density}, emphasis=${emphasis})`);
      return { behavior: 'technical', reason: reasons };
    } else {
      reasons.push(`${strategy} strategy but technical frequency limit reached`, `Technical already at ${Math.round(technicalPercent)}% (max 25%)`);
      return { behavior: 'calm', reason: reasons, governorApplied: true };
    }
  }
  
  // Check inflation (25% limit on assertive/energetic)
  const recentKinetic = motionHistory.slice(-10).filter(b => b === 'assertive' || b === 'energetic').length;
  const inflationPercent = motionHistory.length > 0 ? (recentKinetic / Math.min(motionHistory.length, 10)) * 100 : 0;
  const inflationAllowed = inflationPercent < 25;
  
  // STEP 4: Peak moment → energetic (ONLY if upward polarity + allowed)
  if (emphasis === 'strong' && emotion >= 7) {
    if (polarity === 'upward') {
      if (inflationAllowed) {
        reasons.push(`Peak moment (strong emphasis, emotion ${emotion})`, 'Upward polarity allows energetic');
        return { behavior: 'energetic', reason: reasons };
      } else {
        reasons.push('Peak moment but inflation prevented', `Assertive/energetic already at ${Math.round(inflationPercent)}%`);
        return { behavior: 'calm', reason: reasons, inflationPrevented: true };
      }
    }
    
    // Downward or neutral → assertive
    if (inflationAllowed) {
      reasons.push(`Peak moment (strong emphasis, emotion ${emotion})`, `${polarity} polarity → assertive (not energetic)`);
      return { behavior: 'assertive', reason: reasons };
    } else {
      reasons.push('Peak moment but inflation prevented', `Assertive/energetic already at ${Math.round(inflationPercent)}%`);
      return { behavior: 'calm', reason: reasons, inflationPrevented: true };
    }
  }
  
  // STEP 5: Emphasis → assertive (if allowed)
  if (emphasis === 'soft' || emphasis === 'strong') {
    if (inflationAllowed) {
      reasons.push(`${emphasis} emphasis moment`);
      return { behavior: 'assertive', reason: reasons };
    } else {
      reasons.push(`${emphasis} emphasis but inflation prevented`, `Assertive/energetic already at ${Math.round(inflationPercent)}%`);
      return { behavior: 'calm', reason: reasons, inflationPrevented: true };
    }
  }
  
  // STEP 6: Default → calm
  reasons.push('Default state (no emphasis, normal weight)');
  return { behavior: 'calm', reason: reasons };
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
const motionHistory = [];
const transitionHistory = [];

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
  const polarity = detectEmotionalPolarity(intentType, text);
  const previousBehavior = motionHistory[motionHistory.length - 1] || 'calm';
  const motion = determineMotionBehavior(emotion, polarity, density, emphasis.level, strategy, previousBehavior, motionHistory);
  
  // Determine Transition
  const isPeak = emphasis.level === 'strong' && emotion >= 7;
  const previousTransition = transitionHistory[transitionHistory.length - 1];
  const transition = determineTransition(
    previousBehavior,
    motion.behavior,
    density,
    isPeak,
    previousTransition,
    transitionHistory
  );
  
  // Update history
  emphasisHistory.push(emphasis.level);
  motionHistory.push(motion.behavior);
  transitionHistory.push(transition.type);
  
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
    trace: {
      emotionalAnalysis: {
        score: emotion,
        level: emotion >= 7 ? 'high' : emotion >= 4 ? 'medium' : 'low',
        triggers: []
      },
      densityAnalysis: {
        score: density,
        action: density >= 6 ? 'split' : 'maintain',
        signals: {}
      },
      revealStrategy: {
        chosen: reveal,
        reason: [],
        governorApplied: false
      },
      emphasis: {
        level: emphasis.level,
        tier: emphasis.tier,
        reason: [emphasis.reason],
        governorApplied: false
      },
      motionBehavior: {
        behavior: motion.behavior,
        reason: motion.reason,
        inflationPrevented: motion.inflationPrevented || false,
        recoveryBiasApplied: motion.recoveryBiasApplied || false
      },
      transitionFromPrevious: {
        type: transition.type,
        reason: transition.reason,
        firmnessCapApplied: transition.firmnessCapApplied || false,
        consecutiveFirmPrevented: transition.consecutiveFirmPrevented || false
      }
    }
  };
  
  // Add focus effect for soft/strong emphasis
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
  const motionIcon = motion.behavior === 'calm' ? '😌' : motion.behavior === 'technical' ? '🔧' : motion.behavior === 'assertive' ? '💪' : '⚡';
  
  console.log(`\${String(sceneId).padStart(2, '0')}: [${pacing.toUpperCase()}] ${motionIcon} ${motion.behavior} -> ${transition.type}`);
  if (motion.inflationPrevented) console.log(`   ⚠️ Inflation Prevented!`);
  if (motion.recoveryBiasApplied) console.log(`   ⚠️ Recovery Bias Applied!`);
  if (transition.firmnessCapApplied) console.log(`   ⚠️ Firmness Cap Applied!`);
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
const outputPath = path.join(__dirname, '../src/data/video-compiled.json'); // OVERWRITE main file for rendering
fs.writeFileSync(outputPath, JSON.stringify(videoData, null, 2));

console.log(`\n✅ Generated ${scenes.length} stress scenes!`);
console.log(`📁 Output: ${outputPath}`);
