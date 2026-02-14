/**
 * Global Distribution Governor
 * 
 * Cross-layer orchestration safeguard.
 * Prevents inflation, clustering, jitter, and intensity stacking.
 * 
 * Runs AFTER camera movement, BEFORE final compilation.
 * 
 * HARD RULES:
 * - Bias, don't bulldoze (nudge toward health)
 * - Only hard override for safety caps
 * - Never introduce randomness
 * - Never rewrite scene intent
 * - Never fight cognition
 * - Never override emphasis unless critical
 */

import { MetricsComputer, GlobalMetrics } from './distribution-metrics';
import { StreakDetector } from './streak-detector';
import { VolatilityChecker } from './volatility-checker';

/**
 * Recovery Profile
 * Applied after intensity clusters
 */
export interface RecoveryProfile {
  motion: 'calm';
  shot: 'standard';
  movement: 'static';
  transition: 'soft';
  curve: 'gentle';
}

/**
 * Stabilization Result
 */
export interface StabilizationResult {
  scenes: any[];
  metrics: GlobalMetrics;
  interventions: string[];
  status: 'HEALTHY' | 'BIASED' | 'UNSTABLE';
}

/**
 * Global Distribution Governor
 */
export class GlobalDistributionGovernor {
  /**
   * Analyze and stabilize sequence
   */
  static stabilize(scenes: any[]): StabilizationResult {
    if (scenes.length === 0) {
      return {
        scenes: [],
        metrics: MetricsComputer.compute([]),
        interventions: [],
        status: 'HEALTHY',
      };
    }
    
    const interventions: string[] = [];
    
    // Step 1: Compute initial metrics
    const initialMetrics = MetricsComputer.compute(scenes);
    
    // Step 2: Detect dangerous patterns
    const intensityStacks = this.detectIntensityStacking(scenes);
    const pressureChains = StreakDetector.detectConsecutivePressure(scenes);
    const volatility = VolatilityChecker.computeMotionVolatility(scenes);
    
    // Step 3: Apply interventions
    let stabilizedScenes = [...scenes];
    
    // Intervention 1: Intensity stacking
    if (intensityStacks.length > 0) {
      stabilizedScenes = this.downgradeIntensityStacks(stabilizedScenes, intensityStacks);
      interventions.push(`Downgraded ${intensityStacks.length} intensity stack(s)`);
    }
    
    // Intervention 2: Consecutive pressure
    if (pressureChains.length > 0) {
      stabilizedScenes = this.injectRecovery(stabilizedScenes, pressureChains);
      interventions.push(`Injected recovery after ${pressureChains.length} pressure chain(s)`);
    }
    
    // Intervention 3: Volatility spikes
    if (VolatilityChecker.isVolatile(volatility)) {
      stabilizedScenes = this.biasTowardDefaults(stabilizedScenes);
      interventions.push(`Biased toward defaults (volatility ${(volatility * 100).toFixed(0)}% > 45%)`);
    }
    
    // Step 4: Compute final metrics
    const finalMetrics = MetricsComputer.compute(stabilizedScenes);
    
    // Step 5: Determine status
    const status = this.determineStatus(finalMetrics, interventions.length);
    
    return {
      scenes: stabilizedScenes,
      metrics: finalMetrics,
      interventions,
      status,
    };
  }
  
  /**
   * Detect intensity stacking
   * Pattern: energetic + macro + push + firm
   * 
   * If ≥3 layers stack, mark for downgrade
   */
  private static detectIntensityStacking(scenes: any[]): number[] {
    const stacks: number[] = [];
    
    scenes.forEach((scene, i) => {
      const layers: string[] = [];
      
      // Check each pressure layer
      const behavior = scene.trace?.motionBehavior?.behavior;
      if (behavior === 'energetic') {
        layers.push('energetic');
      }
      
      const shot = scene.trace?.cameraShot?.type;
      if (shot === 'macro') {
        layers.push('macro');
      }
      
      const movement = scene.trace?.cameraMovement?.type;
      if (movement === 'push') {
        layers.push('push');
      }
      
      const transition = scene.trace?.transitionFromPrevious?.type;
      if (transition === 'firm') {
        layers.push('firm');
      }
      
      // If ≥3 layers, it's intensity stacking
      if (layers.length >= 3) {
        stacks.push(i);
      }
    });
    
    return stacks;
  }
  
  /**
   * Downgrade intensity stacks
   * 
   * Priority downgrade order:
   * 1. movement (push → static)
   * 2. transition (firm → soft)
   * 3. motion (energetic → assertive)
   * 
   * NEVER downgrade emphasis first (attention hierarchy must survive)
   */
  private static downgradeIntensityStacks(scenes: any[], stackIndices: number[]): any[] {
    const stabilized = [...scenes];
    
    stackIndices.forEach(i => {
      const scene = stabilized[i];
      
      // Priority 1: Downgrade movement
      if (scene.trace?.cameraMovement?.type === 'push') {
        scene.trace.cameraMovement.type = 'static';
        scene.trace.cameraMovement.reason = 'Downgraded from push (intensity stacking prevention)';
        return;
      }
      
      // Priority 2: Downgrade transition
      if (scene.trace?.transitionFromPrevious?.type === 'firm') {
        scene.trace.transitionFromPrevious.type = 'soft';
        scene.trace.transitionFromPrevious.reason = ['Downgraded from firm (intensity stacking prevention)'];
        return;
      }
      
      // Priority 3: Downgrade motion
      if (scene.trace?.motionBehavior?.behavior === 'energetic') {
        scene.trace.motionBehavior.behavior = 'assertive';
        scene.trace.motionBehavior.reason = ['Downgraded from energetic (intensity stacking prevention)'];
        return;
      }
    });
    
    return stabilized;
  }
  
  /**
   * Inject recovery scenes
   * 
   * After pressure chains, force recovery profile:
   * - calm motion
   * - standard shot
   * - static camera
   * - soft transition
   * - gentle curve
   */
  private static injectRecovery(scenes: any[], pressureIndices: number[]): any[] {
    const stabilized = [...scenes];
    
    pressureIndices.forEach(i => {
      // Apply recovery to next scene (if exists)
      if (i + 1 < stabilized.length) {
        const nextScene = stabilized[i + 1];
        
        // Force recovery profile
        if (nextScene.trace?.motionBehavior) {
          nextScene.trace.motionBehavior.behavior = 'calm';
          nextScene.trace.motionBehavior.reason = ['Recovery injection (after pressure chain)'];
        }
        
        if (nextScene.trace?.cameraShot) {
          nextScene.trace.cameraShot.type = 'standard';
          nextScene.trace.cameraShot.reason = ['Recovery injection (after pressure chain)'];
        }
        
        if (nextScene.trace?.cameraMovement) {
          nextScene.trace.cameraMovement.type = 'static';
          nextScene.trace.cameraMovement.reason = 'Recovery injection (after pressure chain)';
        }
        
        if (nextScene.trace?.transitionFromPrevious) {
          nextScene.trace.transitionFromPrevious.type = 'soft';
          nextScene.trace.transitionFromPrevious.reason = ['Recovery injection (after pressure chain)'];
        }
        
        if (nextScene.trace?.motionCurve) {
          nextScene.trace.motionCurve.type = 'gentle';
          nextScene.trace.motionCurve.reason = 'Recovery injection (after pressure chain)';
        }
      }
    });
    
    return stabilized;
  }
  
  /**
   * Bias toward defaults
   * 
   * When volatility is too high, nudge resolvers toward:
   * - calm
   * - standard
   * - static
   * - soft
   * - gentle
   * 
   * This smooths jittery systems.
   */
  private static biasTowardDefaults(scenes: any[]): any[] {
    const stabilized = [...scenes];
    
    // Bias every 3rd scene toward defaults
    for (let i = 0; i < stabilized.length; i += 3) {
      const scene = stabilized[i];
      
      if (scene.trace?.motionBehavior?.behavior !== 'calm') {
        scene.trace.motionBehavior.behavior = 'calm';
        scene.trace.motionBehavior.reason = ['Biased to calm (volatility reduction)'];
      }
      
      if (scene.trace?.cameraMovement?.type !== 'static') {
        scene.trace.cameraMovement.type = 'static';
        scene.trace.cameraMovement.reason = 'Biased to static (volatility reduction)';
      }
    }
    
    return stabilized;
  }
  
  /**
   * Determine status
   */
  private static determineStatus(metrics: GlobalMetrics, interventionCount: number): 'HEALTHY' | 'BIASED' | 'UNSTABLE' {
    const isHealthy = MetricsComputer.isHealthy(metrics);
    
    if (isHealthy && interventionCount === 0) {
      return 'HEALTHY';
    } else if (isHealthy && interventionCount > 0) {
      return 'BIASED';
    } else {
      return 'UNSTABLE';
    }
  }
  
  /**
   * Generate distribution report
   * 
   * CLI-friendly table format (NO JSON dump)
   */
  static generateReport(metrics: GlobalMetrics, status: string, interventions: string[]): string {
    const lines: string[] = [];
    
    lines.push('');
    lines.push('═══════════════════════════════════════════════════════════');
    lines.push(`  PIPELINE DISTRIBUTION: ${status}`);
    lines.push('═══════════════════════════════════════════════════════════');
    lines.push('');
    
    // Motion
    lines.push('Motion:');
    lines.push(`  calm:       ${metrics.motion.calm.toFixed(1)}%`);
    lines.push(`  technical:  ${metrics.motion.technical.toFixed(1)}%`);
    lines.push(`  assertive:  ${metrics.motion.assertive.toFixed(1)}%`);
    lines.push(`  energetic:  ${metrics.motion.energetic.toFixed(1)}% ${metrics.motion.energetic <= 7 ? '✅' : '❌'}`);
    lines.push(`  kinetic_streak: ${metrics.motion.maxKineticStreak} ${metrics.motion.maxKineticStreak <= 2 ? '✅' : '❌'}`);
    lines.push(`  volatility: ${(metrics.motion.motionVolatility * 100).toFixed(0)}% ${metrics.motion.motionVolatility >= 0.25 && metrics.motion.motionVolatility <= 0.40 ? '✅' : '❌'}`);
    lines.push('');
    
    // Camera
    lines.push('Camera:');
    lines.push(`  standard:   ${metrics.camera.standard.toFixed(1)}%`);
    lines.push(`  wide:       ${metrics.camera.wide.toFixed(1)}%`);
    lines.push(`  focus:      ${metrics.camera.focus.toFixed(1)}%`);
    lines.push(`  macro:      ${metrics.camera.macro.toFixed(1)}% ${metrics.camera.macro <= 5 ? '✅' : '❌'}`);
    lines.push(`  tight_streak: ${metrics.camera.tightStreak} ${metrics.camera.tightStreak <= 2 ? '✅' : '❌'}`);
    lines.push('');
    
    // Movement
    lines.push('Movement:');
    lines.push(`  static:     ${metrics.movement.static.toFixed(1)}% ${metrics.movement.static >= 60 && metrics.movement.static <= 75 ? '✅' : '❌'}`);
    lines.push(`  drift:      ${metrics.movement.drift.toFixed(1)}%`);
    lines.push(`  push:       ${metrics.movement.push.toFixed(1)}% ${metrics.movement.push <= 10 ? '✅' : '❌'}`);
    lines.push(`  hold:       ${metrics.movement.hold.toFixed(1)}%`);
    lines.push(`  push_streak: ${metrics.movement.pushStreak} ${metrics.movement.pushStreak <= 1 ? '✅' : '❌'}`);
    lines.push(`  movement_ratio: ${(metrics.movement.movementRatio * 100).toFixed(0)}% ${metrics.movement.movementRatio <= 0.40 ? '✅' : '❌'}`);
    lines.push('');
    
    // Emphasis
    lines.push('Emphasis:');
    lines.push(`  strong:     ${metrics.emphasis.strong.toFixed(1)}% ${metrics.emphasis.strong <= 15 ? '✅' : '❌'}`);
    lines.push('');
    
    // Transition
    lines.push('Transition:');
    lines.push(`  firm:       ${metrics.transition.firm.toFixed(1)}% ${metrics.transition.firm <= 18 ? '✅' : '❌'}`);
    lines.push('');
    
    // Interventions
    if (interventions.length > 0) {
      lines.push('Interventions:');
      interventions.forEach(intervention => {
        lines.push(`  • ${intervention}`);
      });
      lines.push('');
    }
    
    lines.push('═══════════════════════════════════════════════════════════');
    lines.push('');
    
    return lines.join('\n');
  }
}
