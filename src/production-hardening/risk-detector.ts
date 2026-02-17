
import { CompiledScene } from '../scene-compiler/scene-factory';

export interface RiskProfile {
  visualChaosScore: number;     // 0-10
  cognitiveLoadScore: number;   // 0-10
  styleDriftScore: number;      // 0-10
  aiMisfireRisk: boolean;
  warnings: string[];
}

export class RiskDetector {
  /**
   * Scan plan for specific risk patterns
   */
  static scan(scenes: CompiledScene[]): RiskProfile {
    const profile: RiskProfile = {
      visualChaosScore: 0,
      cognitiveLoadScore: 0,
      styleDriftScore: 0,
      aiMisfireRisk: false,
      warnings: []
    };

    scenes.forEach((scene: any, i) => {
      // 1. Visual Chaos
      // Too many layers?
      if (scene.layers.length > 5) {
        profile.visualChaosScore += 2;
        profile.warnings.push(`Scene ${i+1}: High layer count (${scene.layers.length})`);
      }

      // 2. Cognitive Overload
      // High density + Fast Pacing + Camera Movement
      const density = scene.trace?.densityAnalysis?.score || 0;
      const isFast = scene.duration_sec < 4;
      const hasMovement = scene.trace?.cameraMovement?.type !== 'static';
      
      if (density >= 7 && isFast && hasMovement) {
        profile.cognitiveLoadScore += 3;
        profile.warnings.push(`Scene ${i+1}: Cognitive Overload (Dense + Fast + Moving)`);
      }
      
      // 3. Style Drift (Simulated)
      // Check for mixed visual metaphors in same scene (e.g., 3D + Vector)
      const types = scene.layers.map((l: any) => l.type);
      if (types.includes('three') && types.includes('svg')) {
          profile.styleDriftScore += 2;
          profile.warnings.push(`Scene ${i+1}: Mixed Metaphor (3D + SVG)`);
      }
    });

    // Normalize scores
    profile.visualChaosScore = Math.min(profile.visualChaosScore, 10);
    profile.cognitiveLoadScore = Math.min(profile.cognitiveLoadScore, 10);
    profile.styleDriftScore = Math.min(profile.styleDriftScore, 10);

    return profile;
  }
}
