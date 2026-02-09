/**
 * Motion Distribution Audit Script
 * 
 * Analyzes motion behavior distribution from compiled video output.
 * 
 * Target Profile (for ~25 scene video):
 * - Calm: 55-70%
 * - Technical: 15-25%
 * - Assertive: 5-12%
 * - Energetic: 0-5% (⚠️ >5% = inflation!)
 * 
 * Critical Metric:
 * - max_consecutive_kinetic <= 2 (kinetic = assertive + energetic)
 * - 3+ consecutive = rhythm-motion coupling bug
 */

const fs = require('fs');
const path = require('path');

// Target distribution profile
const TARGET_PROFILE = {
  calm: { min: 55, max: 70, label: 'Calm' },
  technical: { min: 15, max: 25, label: 'Technical' },
  assertive: { min: 5, max: 12, label: 'Assertive' },
  energetic: { min: 0, max: 5, label: 'Energetic' },
};

// Critical thresholds
const MAX_CONSECUTIVE_KINETIC = 2;
const HEALTHY_VOLATILITY_MIN = 0.25;
const HEALTHY_VOLATILITY_MAX = 0.40;
const INFLATION_THRESHOLD = 5; // Energetic >5% = inflation

/**
 * Load compiled video data.
 */
function loadCompiledVideo() {
  const videoPath = path.join(__dirname, '../src/data/video-compiled.json');
  
  if (!fs.existsSync(videoPath)) {
    throw new Error(`video-compiled.json not found at ${videoPath}`);
  }
  
  const data = JSON.parse(fs.readFileSync(videoPath, 'utf8'));
  return data.scenes || [];
}

/**
 * Extract motion behavior from scene trace.
 */
function extractMotionBehavior(scene) {
  return scene.trace?.motionBehavior?.behavior || 'unknown';
}

/**
 * Calculate motion distribution.
 */
function calculateDistribution(scenes) {
  const total = scenes.length;
  const counts = {
    calm: 0,
    technical: 0,
    assertive: 0,
    energetic: 0,
    unknown: 0,
  };
  
  scenes.forEach(scene => {
    const behavior = extractMotionBehavior(scene);
    counts[behavior] = (counts[behavior] || 0) + 1;
  });
  
  const percentages = {};
  Object.keys(counts).forEach(behavior => {
    percentages[behavior] = ((counts[behavior] / total) * 100).toFixed(1);
  });
  
  return { counts, percentages, total };
}

/**
 * Detect consecutive kinetic scenes.
 * Kinetic = assertive + energetic
 */
function detectConsecutiveKinetic(scenes) {
  let maxConsecutive = 0;
  let currentConsecutive = 0;
  const violations = [];
  
  scenes.forEach((scene, index) => {
    const behavior = extractMotionBehavior(scene);
    const isKinetic = behavior === 'assertive' || behavior === 'energetic';
    
    if (isKinetic) {
      currentConsecutive++;
      maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
      
      if (currentConsecutive > MAX_CONSECUTIVE_KINETIC) {
        violations.push({
          startIndex: index - currentConsecutive + 1,
          endIndex: index,
          count: currentConsecutive,
        });
      }
    } else {
      currentConsecutive = 0;
    }
  });
  
  return { maxConsecutive, violations };
}

/**
 * Calculate motion volatility score.
 * Volatility = behavior_switches / total_scenes
 * 
 * Healthy range: 0.25-0.40
 * >0.60 = twitchy (screams automation)
 */
function calculateVolatility(scenes) {
  let switches = 0;
  
  for (let i = 1; i < scenes.length; i++) {
    const prev = extractMotionBehavior(scenes[i - 1]);
    const curr = extractMotionBehavior(scenes[i]);
    
    if (prev !== curr) {
      switches++;
    }
  }
  
  const volatility = switches / scenes.length;
  return { switches, volatility: volatility.toFixed(2) };
}

/**
 * Check if distribution is within target profile.
 */
function checkTargetProfile(percentages) {
  const issues = [];
  const warnings = [];
  
  Object.keys(TARGET_PROFILE).forEach(behavior => {
    const target = TARGET_PROFILE[behavior];
    const actual = parseFloat(percentages[behavior] || 0);
    
    if (actual < target.min) {
      warnings.push(`${target.label}: ${actual}% (below target ${target.min}%)`);
    } else if (actual > target.max) {
      issues.push(`${target.label}: ${actual}% (exceeds target ${target.max}%)`);
    }
  });
  
  // Critical: Check energetic inflation
  const energeticPercent = parseFloat(percentages.energetic || 0);
  if (energeticPercent > INFLATION_THRESHOLD) {
    issues.push(`🚨 INFLATION DETECTED: Energetic ${energeticPercent}% (exceeds ${INFLATION_THRESHOLD}%)`);
  }
  
  return { issues, warnings };
}

/**
 * Generate motion distribution report.
 */
function generateReport(scenes) {
  console.log('=== MOTION DISTRIBUTION AUDIT ===\n');
  
  const distribution = calculateDistribution(scenes);
  const kinetic = detectConsecutiveKinetic(scenes);
  const volatility = calculateVolatility(scenes);
  const profile = checkTargetProfile(distribution.percentages);
  
  // 1. Scene count
  console.log(`📊 Total Scenes: ${distribution.total}\n`);
  
  // 2. Distribution
  console.log('📈 Motion Behavior Distribution:');
  console.log(`   Calm:       ${distribution.counts.calm.toString().padStart(2)} scenes (${distribution.percentages.calm}%)`);
  console.log(`   Technical:  ${distribution.counts.technical.toString().padStart(2)} scenes (${distribution.percentages.technical}%)`);
  console.log(`   Assertive:  ${distribution.counts.assertive.toString().padStart(2)} scenes (${distribution.percentages.assertive}%)`);
  console.log(`   Energetic:  ${distribution.counts.energetic.toString().padStart(2)} scenes (${distribution.percentages.energetic}%)`);
  if (distribution.counts.unknown > 0) {
    console.log(`   Unknown:    ${distribution.counts.unknown.toString().padStart(2)} scenes (${distribution.percentages.unknown}%)`);
  }
  console.log('');
  
  // 3. Target profile check
  console.log('🎯 Target Profile Check:');
  if (profile.issues.length === 0 && profile.warnings.length === 0) {
    console.log('   ✅ All behaviors within target range');
  } else {
    if (profile.issues.length > 0) {
      console.log('   ❌ Issues:');
      profile.issues.forEach(issue => console.log(`      ${issue}`));
    }
    if (profile.warnings.length > 0) {
      console.log('   ⚠️  Warnings:');
      profile.warnings.forEach(warning => console.log(`      ${warning}`));
    }
  }
  console.log('');
  
  // 4. Consecutive kinetic check
  console.log('🔥 Consecutive Kinetic Check:');
  console.log(`   Max consecutive: ${kinetic.maxConsecutive}`);
  if (kinetic.maxConsecutive <= MAX_CONSECUTIVE_KINETIC) {
    console.log(`   ✅ Within limit (≤${MAX_CONSECUTIVE_KINETIC})`);
  } else {
    console.log(`   ❌ EXCEEDS LIMIT (>${MAX_CONSECUTIVE_KINETIC})`);
    console.log(`   🚨 Rhythm-motion coupling bug detected!`);
    console.log('   Violations:');
    kinetic.violations.forEach(v => {
      console.log(`      Scenes ${v.startIndex}-${v.endIndex}: ${v.count} consecutive kinetic`);
    });
  }
  console.log('');
  
  // 5. Volatility check
  console.log('📉 Motion Volatility:');
  console.log(`   Switches: ${volatility.switches}`);
  console.log(`   Score: ${volatility.volatility}`);
  console.log(`   Healthy range: ${HEALTHY_VOLATILITY_MIN}-${HEALTHY_VOLATILITY_MAX}`);
  
  const vol = parseFloat(volatility.volatility);
  if (vol < HEALTHY_VOLATILITY_MIN) {
    console.log('   ⚠️  Too static (engine may be overly conservative)');
  } else if (vol > HEALTHY_VOLATILITY_MAX && vol <= 0.60) {
    console.log('   ⚠️  Moderate volatility (acceptable but watch for jitter)');
  } else if (vol > 0.60) {
    console.log('   ❌ TWITCHY (screams automation)');
  } else {
    console.log('   ✅ Healthy variance');
  }
  console.log('');
  
  // 6. Scene-by-scene breakdown
  console.log('📋 Scene-by-Scene Breakdown:');
  scenes.forEach((scene, index) => {
    const behavior = extractMotionBehavior(scene);
    const trace = scene.trace?.motionBehavior;
    const icon = behavior === 'calm' ? '😌' : behavior === 'technical' ? '🔧' : behavior === 'assertive' ? '💪' : behavior === 'energetic' ? '⚡' : '❓';
    
    let flags = [];
    if (trace?.inflationPrevented) flags.push('INFLATION_PREVENTED');
    if (trace?.recoveryBiasApplied) flags.push('RECOVERY_BIAS');
    
    const flagStr = flags.length > 0 ? ` [${flags.join(', ')}]` : '';
    const reason = trace?.reason ? ` - ${trace.reason.join(', ')}` : '';
    
    console.log(`   ${(index + 1).toString().padStart(2)}. ${icon} ${behavior.toUpperCase().padEnd(10)}${flagStr}${reason}`);
  });
  console.log('');
  
  // 7. Summary
  const hasIssues = profile.issues.length > 0 || kinetic.maxConsecutive > MAX_CONSECUTIVE_KINETIC || vol > 0.60;
  
  console.log('=== SUMMARY ===');
  if (hasIssues) {
    console.log('❌ AUDIT FAILED - Issues detected');
    console.log('\nAction required:');
    if (profile.issues.length > 0) {
      console.log('  • Fix distribution issues');
    }
    if (kinetic.maxConsecutive > MAX_CONSECUTIVE_KINETIC) {
      console.log('  • Fix rhythm-motion coupling bug');
    }
    if (vol > 0.60) {
      console.log('  • Reduce motion volatility (engine is twitchy)');
    }
  } else {
    console.log('✅ AUDIT PASSED - Motion distribution healthy');
  }
  
  return hasIssues ? 1 : 0;
}

/**
 * Main execution.
 */
try {
  const scenes = loadCompiledVideo();
  
  if (scenes.length === 0) {
    console.error('❌ No scenes found in video-compiled.json');
    process.exit(1);
  }
  
  const exitCode = generateReport(scenes);
  process.exit(exitCode);
} catch (error) {
  console.error('❌ Audit failed:', error.message);
  process.exit(1);
}
