import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// TYPES
// ============================================================================

interface VideoData {
  meta: { fps: number; width: number; height: number };
  scenes: CompiledScene[];
}

interface CompiledScene {
  scene_id: number;
  grammarVersion: string;
  duration_sec: number;
  layout: string;
  layers: any[];
  trace?: {
    emotionalAnalysis?: { score: number; level: string; triggers: string[] };
    densityAnalysis?: { score: number; action: string; signals: any };
    revealStrategy?: { chosen: string; reason: string[]; governorApplied?: boolean };
    emphasis?: { level: string; tier: string; reason: string[]; governorApplied?: boolean };
    motionBehavior?: { behavior: string; reason: string[]; inflationPrevented?: boolean; recoveryBiasApplied?: boolean };
    transitionFromPrevious?: { type: string; reason: string[]; firmnessCapApplied?: boolean; consecutiveFirmPrevented?: boolean };
    cameraShot?: { type: string; reason: string[]; governorApplied?: boolean };
  };
}

interface AuditMetrics {
  cognition: {
    emotionDistribution: Record<string, number>;
    densityDistribution: Record<string, number>;
    strategyDistribution: Record<string, number>;
  };
  directorial: {
    revealTypes: Record<string, number>;
    strongEmphasisPercent: number;
    peakCount: number;
  };
  rhythm: {
    peakCount: number;
    clusteredPeaks: number;
    flatSegments: number;
    maxFlatSegmentLength: number;
  };
  kinetic: {
    motionDistribution: Record<string, number>;
    maxConsecutiveKinetic: number;
    motionVolatility: number;
  };
  transitions: {
    firmPercent: number;
    releasePercent: number;
    softPercent: number;
    minimalPercent: number;
  };
  camera: {
    standardPercent: number;
    widePercent: number;
    focusPercent: number;
    macroPercent: number;
    maxConsecutiveTightShots: number;
  };
}

interface SafetyCheck {
  name: string;
  status: 'PASS' | 'WARN' | 'FAIL';
  value: number | string;
  threshold: string;
  message: string;
}

// ============================================================================
// METRIC EXTRACTION
// ============================================================================

function extractMetrics(videoData: VideoData): AuditMetrics {
  const scenes = videoData.scenes;
  const totalScenes = scenes.length;

  // Cognition Metrics
  const emotionLevels: Record<string, number> = { low: 0, medium: 0, high: 0 };
  const densityLevels: Record<string, number> = { low: 0, medium: 0, high: 0 };
  const strategies: Record<string, number> = {};

  // Directorial Metrics
  const revealTypes: Record<string, number> = {};
  let strongEmphasisCount = 0;
  let peakCount = 0;

  // Rhythm Metrics
  const emotionScores: number[] = [];
  let currentFlatSegment = 0;
  let maxFlatSegment = 0;
  let flatSegmentCount = 0;
  let prevEmotionScore = -1;

  // Kinetic Metrics
  const motionBehaviors: Record<string, number> = {};
  let maxConsecutiveKinetic = 0;
  let currentKineticStreak = 0;
  let motionChanges = 0;
  let prevMotion: string | null = null;

  // Transition Metrics
  const transitionTypes: Record<string, number> = {};

  // Camera Metrics
  const cameraShots: Record<string, number> = {};
  let maxConsecutiveTightShots = 0;
  let currentTightStreak = 0;

  scenes.forEach((scene, index) => {
    const trace = scene.trace;
    if (!trace) return;

    // Cognition
    if (trace.emotionalAnalysis) {
      const level = trace.emotionalAnalysis.level || 'low';
      const score = trace.emotionalAnalysis.score;
      emotionLevels[level] = (emotionLevels[level] || 0) + 1;
      emotionScores.push(score);

      // Track flat segments (>6 scenes without intensity change)
      if (prevEmotionScore >= 0 && Math.abs(score - prevEmotionScore) < 1) {
        currentFlatSegment++;
        if (currentFlatSegment > 6) {
          maxFlatSegment = Math.max(maxFlatSegment, currentFlatSegment);
          if (currentFlatSegment === 7) flatSegmentCount++;
        }
      } else {
        currentFlatSegment = 0;
      }
      prevEmotionScore = score;
    }

    if (trace.densityAnalysis) {
      const score = trace.densityAnalysis.score;
      const level = score >= 7 ? 'high' : score >= 4 ? 'medium' : 'low';
      densityLevels[level] = (densityLevels[level] || 0) + 1;
    }

    const strategy = scene.layout;
    strategies[strategy] = (strategies[strategy] || 0) + 1;

    // Directorial
    if (trace.revealStrategy) {
      const reveal = trace.revealStrategy.chosen;
      revealTypes[reveal] = (revealTypes[reveal] || 0) + 1;
    }

    if (trace.emphasis) {
      if (trace.emphasis.level === 'strong') {
        strongEmphasisCount++;
        if (trace.emotionalAnalysis && trace.emotionalAnalysis.score >= 7) {
          peakCount++;
        }
      }
    }

    // Kinetic
    if (trace.motionBehavior) {
      const motion = trace.motionBehavior.behavior;
      motionBehaviors[motion] = (motionBehaviors[motion] || 0) + 1;

      // Track kinetic streaks (assertive + energetic)
      if (motion === 'assertive' || motion === 'energetic') {
        currentKineticStreak++;
        maxConsecutiveKinetic = Math.max(maxConsecutiveKinetic, currentKineticStreak);
      } else {
        currentKineticStreak = 0;
      }

      // Track volatility
      if (prevMotion && prevMotion !== motion) {
        motionChanges++;
      }
      prevMotion = motion;
    }

    // Transitions
    if (trace.transitionFromPrevious) {
      const transition = trace.transitionFromPrevious.type;
      transitionTypes[transition] = (transitionTypes[transition] || 0) + 1;
    }

    // Camera
    if (trace.cameraShot) {
      const shot = trace.cameraShot.type;
      cameraShots[shot] = (cameraShots[shot] || 0) + 1;

      // Track tight shot streaks (focus + macro)
      if (shot === 'focus' || shot === 'macro') {
        currentTightStreak++;
        maxConsecutiveTightShots = Math.max(maxConsecutiveTightShots, currentTightStreak);
      } else {
        currentTightStreak = 0;
      }
    }
  });

  // Detect clustered peaks (peaks within 3 scenes of each other)
  let clusteredPeaks = 0;
  let lastPeakIndex = -10;
  scenes.forEach((scene, index) => {
    const trace = scene.trace;
    if (
      trace?.emphasis?.level === 'strong' &&
      trace?.emotionalAnalysis?.score !== undefined &&
      trace.emotionalAnalysis.score >= 7
    ) {
      if (index - lastPeakIndex <= 3) {
        clusteredPeaks++;
      }
      lastPeakIndex = index;
    }
  });

  // Calculate percentages
  const motionVolatility = totalScenes > 1 ? (motionChanges / (totalScenes - 1)) : 0;

  return {
    cognition: {
      emotionDistribution: emotionLevels,
      densityDistribution: densityLevels,
      strategyDistribution: strategies,
    },
    directorial: {
      revealTypes,
      strongEmphasisPercent: (strongEmphasisCount / totalScenes) * 100,
      peakCount,
    },
    rhythm: {
      peakCount,
      clusteredPeaks,
      flatSegments: flatSegmentCount,
      maxFlatSegmentLength: maxFlatSegment,
    },
    kinetic: {
      motionDistribution: motionBehaviors,
      maxConsecutiveKinetic,
      motionVolatility,
    },
    transitions: {
      firmPercent: ((transitionTypes['firm'] || 0) / totalScenes) * 100,
      releasePercent: ((transitionTypes['release'] || 0) / totalScenes) * 100,
      softPercent: ((transitionTypes['soft'] || 0) / totalScenes) * 100,
      minimalPercent: ((transitionTypes['minimal'] || 0) / totalScenes) * 100,
    },
    camera: {
      standardPercent: ((cameraShots['standard'] || 0) / totalScenes) * 100,
      widePercent: ((cameraShots['wide'] || 0) / totalScenes) * 100,
      focusPercent: ((cameraShots['focus'] || 0) / totalScenes) * 100,
      macroPercent: ((cameraShots['macro'] || 0) / totalScenes) * 100,
      maxConsecutiveTightShots,
    },
  };
}

// ============================================================================
// SAFETY CHECKS
// ============================================================================

function runSafetyChecks(metrics: AuditMetrics, totalScenes: number): SafetyCheck[] {
  const checks: SafetyCheck[] = [];

  // Kinetic: Energetic ≤ 7%
  const energeticPercent = ((metrics.kinetic.motionDistribution['energetic'] || 0) / totalScenes) * 100;
  checks.push({
    name: 'Energetic Motion Inflation',
    status: energeticPercent > 7 ? 'FAIL' : energeticPercent > 5 ? 'WARN' : 'PASS',
    value: energeticPercent,
    threshold: '≤ 7%',
    message: energeticPercent > 7 ? 'CRITICAL: Energetic motion exceeds safe threshold' : 'OK',
  });

  // Camera: Macro ≤ 5%
  checks.push({
    name: 'Macro Shot Inflation',
    status: metrics.camera.macroPercent > 5 ? 'FAIL' : 'PASS',
    value: metrics.camera.macroPercent,
    threshold: '≤ 5%',
    message: metrics.camera.macroPercent > 5 ? 'CRITICAL: Macro shots exceed safe threshold' : 'OK',
  });

  // Directorial: Strong Emphasis ≤ 15%
  checks.push({
    name: 'Strong Emphasis Inflation',
    status: metrics.directorial.strongEmphasisPercent > 15 ? 'FAIL' : metrics.directorial.strongEmphasisPercent > 12 ? 'WARN' : 'PASS',
    value: metrics.directorial.strongEmphasisPercent,
    threshold: '≤ 15%',
    message: metrics.directorial.strongEmphasisPercent > 15 ? 'CRITICAL: Strong emphasis exceeds safe threshold' : 'OK',
  });

  // Transitions: Firm ≤ 18%
  checks.push({
    name: 'Firm Transition Inflation',
    status: metrics.transitions.firmPercent > 18 ? 'FAIL' : metrics.transitions.firmPercent > 15 ? 'WARN' : 'PASS',
    value: metrics.transitions.firmPercent,
    threshold: '≤ 18%',
    message: metrics.transitions.firmPercent > 18 ? 'CRITICAL: Firm transitions exceed safe threshold' : 'OK',
  });

  // Reveal: Spotlight ≤ 15%
  const spotlightPercent = ((metrics.directorial.revealTypes['spotlight'] || 0) / totalScenes) * 100;
  checks.push({
    name: 'Spotlight Reveal Inflation',
    status: spotlightPercent > 15 ? 'FAIL' : 'PASS',
    value: spotlightPercent,
    threshold: '≤ 15%',
    message: spotlightPercent > 15 ? 'CRITICAL: Spotlight reveals exceed safe threshold' : 'OK',
  });

  // Camera: Focus Streak ≤ 2
  checks.push({
    name: 'Focus Streak Prevention',
    status: metrics.camera.maxConsecutiveTightShots > 2 ? 'FAIL' : 'PASS',
    value: metrics.camera.maxConsecutiveTightShots,
    threshold: '≤ 2',
    message: metrics.camera.maxConsecutiveTightShots > 2 ? 'CRITICAL: Consecutive tight shots exceed limit' : 'OK',
  });

  // Kinetic: Kinetic Streak ≤ 2
  checks.push({
    name: 'Kinetic Streak Prevention',
    status: metrics.kinetic.maxConsecutiveKinetic > 2 ? 'FAIL' : 'PASS',
    value: metrics.kinetic.maxConsecutiveKinetic,
    threshold: '≤ 2',
    message: metrics.kinetic.maxConsecutiveKinetic > 2 ? 'CRITICAL: Consecutive kinetic scenes exceed limit' : 'OK',
  });

  // Motion: Volatility 0.25-0.40 (healthy), >0.45 (fail)
  checks.push({
    name: 'Motion Volatility',
    status: metrics.kinetic.motionVolatility > 0.45 ? 'FAIL' : metrics.kinetic.motionVolatility < 0.25 || metrics.kinetic.motionVolatility > 0.40 ? 'WARN' : 'PASS',
    value: metrics.kinetic.motionVolatility,
    threshold: '0.25-0.40',
    message: metrics.kinetic.motionVolatility > 0.45 ? 'CRITICAL: Motion changes too frequently' : metrics.kinetic.motionVolatility < 0.25 ? 'WARNING: Motion too static' : 'OK',
  });

  // Rhythm: Clustered Peaks
  checks.push({
    name: 'Peak Clustering',
    status: metrics.rhythm.clusteredPeaks > 0 ? 'FAIL' : 'PASS',
    value: metrics.rhythm.clusteredPeaks,
    threshold: '0',
    message: metrics.rhythm.clusteredPeaks > 0 ? 'CRITICAL: Peaks are clustered (within 3 scenes)' : 'OK',
  });

  // Rhythm: Flat Segments
  checks.push({
    name: 'Flat Segments',
    status: metrics.rhythm.flatSegments > 0 ? 'WARN' : 'PASS',
    value: metrics.rhythm.flatSegments,
    threshold: '0',
    message: metrics.rhythm.flatSegments > 0 ? `WARNING: ${metrics.rhythm.flatSegments} flat segment(s) detected (>6 scenes without intensity change)` : 'OK',
  });

  return checks;
}

// ============================================================================
// GLOBAL FAILURE CHECKS
// ============================================================================

function detectGlobalFailures(videoData: VideoData, metrics: AuditMetrics): SafetyCheck[] {
  const failures: SafetyCheck[] = [];
  const scenes = videoData.scenes;

  // Check for hierarchy inversion (high density with strong emphasis)
  let hierarchyInversions = 0;
  scenes.forEach((scene) => {
    const trace = scene.trace;
    if (
      trace?.densityAnalysis?.score !== undefined &&
      trace.densityAnalysis.score >= 7 &&
      trace?.emphasis?.level === 'strong'
    ) {
      hierarchyInversions++;
    }
  });

  if (hierarchyInversions > 0) {
    failures.push({
      name: 'Hierarchy Inversion',
      status: 'FAIL',
      value: hierarchyInversions,
      threshold: '0',
      message: `CRITICAL: ${hierarchyInversions} scene(s) have high density + strong emphasis (cognitive overload)`,
    });
  }

  // Check for intensity stacking (consecutive strong emphasis)
  let intensityStacking = 0;
  let consecutiveStrong = 0;
  scenes.forEach((scene) => {
    if (scene.trace?.emphasis?.level === 'strong') {
      consecutiveStrong++;
      if (consecutiveStrong > 1) {
        intensityStacking++;
      }
    } else {
      consecutiveStrong = 0;
    }
  });

  if (intensityStacking > 0) {
    failures.push({
      name: 'Intensity Stacking',
      status: 'FAIL',
      value: intensityStacking,
      threshold: '0',
      message: `CRITICAL: ${intensityStacking} instance(s) of consecutive strong emphasis`,
    });
  }

  return failures;
}

// ============================================================================
// REPORT FORMATTER
// ============================================================================

function formatReport(
  videoPath: string,
  metrics: AuditMetrics,
  safetyChecks: SafetyCheck[],
  globalFailures: SafetyCheck[],
  totalScenes: number,
  debugMode: boolean
): string {
  const lines: string[] = [];

  // Header
  lines.push('═'.repeat(80));
  lines.push('                        PIPELINE HEALTH AUDIT');
  lines.push('═'.repeat(80));
  lines.push(`Video: ${path.basename(videoPath)}`);
  lines.push(`Total Scenes: ${totalScenes}`);
  lines.push('');

  // Overall Status
  const allChecks = [...safetyChecks, ...globalFailures];
  const failCount = allChecks.filter((c) => c.status === 'FAIL').length;
  const warnCount = allChecks.filter((c) => c.status === 'WARN').length;
  const overallStatus = failCount > 0 ? 'FAIL' : warnCount > 0 ? 'WARN' : 'PASS';

  const statusColor = overallStatus === 'PASS' ? '✅' : overallStatus === 'WARN' ? '⚠️' : '❌';
  lines.push(`${statusColor} PIPELINE HEALTH: ${overallStatus}`);
  lines.push('');

  // Safety Checks
  lines.push('─'.repeat(80));
  lines.push('SAFETY CHECKS');
  lines.push('─'.repeat(80));
  safetyChecks.forEach((check) => {
    const icon = check.status === 'PASS' ? '✅' : check.status === 'WARN' ? '⚠️' : '❌';
    const valueStr = typeof check.value === 'number' ? check.value.toFixed(2) : check.value;
    lines.push(`${icon} ${check.name}: ${valueStr} (Threshold: ${check.threshold})`);
    if (check.status !== 'PASS') {
      lines.push(`   └─ ${check.message}`);
    }
  });
  lines.push('');

  // Global Failures
  if (globalFailures.length > 0) {
    lines.push('─'.repeat(80));
    lines.push('GLOBAL FAILURES');
    lines.push('─'.repeat(80));
    globalFailures.forEach((failure) => {
      lines.push(`❌ ${failure.name}: ${failure.value}`);
      lines.push(`   └─ ${failure.message}`);
    });
    lines.push('');
  }

  // Debug Mode: Detailed Metrics
  if (debugMode) {
    // Cognition Metrics
    lines.push('─'.repeat(80));
    lines.push('COGNITION LAYER');
    lines.push('─'.repeat(80));
    lines.push('Emotion Distribution:');
    Object.entries(metrics.cognition.emotionDistribution).forEach(([level, count]) => {
      const percent = ((count / totalScenes) * 100).toFixed(1);
      lines.push(`  ${level.padEnd(8)}: ${String(count).padStart(3)} (${percent}%)`);
    });
    lines.push('');
    lines.push('Density Distribution:');
    Object.entries(metrics.cognition.densityDistribution).forEach(([level, count]) => {
      const percent = ((count / totalScenes) * 100).toFixed(1);
      lines.push(`  ${level.padEnd(8)}: ${String(count).padStart(3)} (${percent}%)`);
    });
    lines.push('');
    lines.push('Strategy Distribution:');
    Object.entries(metrics.cognition.strategyDistribution).forEach(([strategy, count]) => {
      const percent = ((count / totalScenes) * 100).toFixed(1);
      lines.push(`  ${strategy.padEnd(8)}: ${String(count).padStart(3)} (${percent}%)`);
    });
    lines.push('');

    // Directorial Metrics
    lines.push('─'.repeat(80));
    lines.push('DIRECTORIAL LAYER');
    lines.push('─'.repeat(80));
    lines.push('Reveal Types:');
    Object.entries(metrics.directorial.revealTypes).forEach(([type, count]) => {
      const percent = ((count / totalScenes) * 100).toFixed(1);
      lines.push(`  ${type.padEnd(10)}: ${String(count).padStart(3)} (${percent}%)`);
    });
    lines.push('');
    lines.push(`Strong Emphasis: ${metrics.directorial.strongEmphasisPercent.toFixed(1)}%`);
    lines.push(`Peak Moments: ${metrics.directorial.peakCount}`);
    lines.push('');

    // Rhythm Metrics
    lines.push('─'.repeat(80));
    lines.push('RHYTHM LAYER');
    lines.push('─'.repeat(80));
    lines.push(`Peak Count: ${metrics.rhythm.peakCount}`);
    lines.push(`Clustered Peaks: ${metrics.rhythm.clusteredPeaks}`);
    lines.push(`Flat Segments: ${metrics.rhythm.flatSegments}`);
    lines.push(`Max Flat Segment Length: ${metrics.rhythm.maxFlatSegmentLength}`);
    lines.push('');

    // Kinetic Metrics
    lines.push('─'.repeat(80));
    lines.push('KINETIC LAYER');
    lines.push('─'.repeat(80));
    lines.push('Motion Distribution:');
    Object.entries(metrics.kinetic.motionDistribution).forEach(([behavior, count]) => {
      const percent = ((count / totalScenes) * 100).toFixed(1);
      lines.push(`  ${behavior.padEnd(10)}: ${String(count).padStart(3)} (${percent}%)`);
    });
    lines.push('');
    lines.push(`Max Consecutive Kinetic: ${metrics.kinetic.maxConsecutiveKinetic}`);
    lines.push(`Motion Volatility: ${metrics.kinetic.motionVolatility.toFixed(2)}`);
    lines.push('');

    // Transition Metrics
    lines.push('─'.repeat(80));
    lines.push('TRANSITION LAYER');
    lines.push('─'.repeat(80));
    lines.push(`Firm:     ${metrics.transitions.firmPercent.toFixed(1)}%`);
    lines.push(`Release:  ${metrics.transitions.releasePercent.toFixed(1)}%`);
    lines.push(`Soft:     ${metrics.transitions.softPercent.toFixed(1)}%`);
    lines.push(`Minimal:  ${metrics.transitions.minimalPercent.toFixed(1)}%`);
    lines.push('');

    // Camera Metrics
    lines.push('─'.repeat(80));
    lines.push('CAMERA LAYER');
    lines.push('─'.repeat(80));
    lines.push(`Standard: ${metrics.camera.standardPercent.toFixed(1)}%`);
    lines.push(`Wide:     ${metrics.camera.widePercent.toFixed(1)}%`);
    lines.push(`Focus:    ${metrics.camera.focusPercent.toFixed(1)}%`);
    lines.push(`Macro:    ${metrics.camera.macroPercent.toFixed(1)}%`);
    lines.push('');
    lines.push(`Max Consecutive Tight Shots: ${metrics.camera.maxConsecutiveTightShots}`);
    lines.push('');
  }

  lines.push('═'.repeat(80));

  return lines.join('\n');
}

// ============================================================================
// MAIN
// ============================================================================

function auditPipeline(videoPath: string, debugMode: boolean): void {
  // Load video data
  const videoData: VideoData = JSON.parse(fs.readFileSync(videoPath, 'utf-8'));
  const totalScenes = videoData.scenes.length;

  // Extract metrics
  const metrics = extractMetrics(videoData);

  // Run safety checks
  const safetyChecks = runSafetyChecks(metrics, totalScenes);

  // Detect global failures
  const globalFailures = detectGlobalFailures(videoData, metrics);

  // Format and print report
  const report = formatReport(videoPath, metrics, safetyChecks, globalFailures, totalScenes, debugMode);
  console.log(report);

  // Exit with error code if failed
  const allChecks = [...safetyChecks, ...globalFailures];
  const failCount = allChecks.filter((c) => c.status === 'FAIL').length;
  if (failCount > 0) {
    process.exit(1);
  }
}

// CLI
const args = process.argv.slice(2);
const debugMode = args.includes('--debug');
const videoPath = args.find((arg) => !arg.startsWith('--')) || path.join(__dirname, '../src/data/video-compiled.json');

auditPipeline(videoPath, debugMode);
