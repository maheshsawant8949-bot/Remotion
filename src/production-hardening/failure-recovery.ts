
import { CompiledScene } from '../scene-compiler/scene-factory';
import { RiskProfile } from './risk-detector';
import { StressReport } from './stress-test-engine';

export class FailureRecovery {
  /**
   * Recover from detected risks
   */
  static recover(
    scenes: CompiledScene[],
    risks: RiskProfile,
    stress: StressReport
  ): CompiledScene[] {
    let recoveredScenes = [...scenes];

    // 1. Cognitive Overload Recovery
    // Downgrade movement/camera
    if (risks.cognitiveLoadScore > 5) {
      console.log('🩹 RECOVERY: Reducing Cognitive Load (Removing Camera Movement)');
      recoveredScenes = recoveredScenes.map((s: any) => {
        if (s.trace?.densityAnalysis?.score >= 7) {
            // Modify trace/props to kill movement
            if (s.trace.cameraMovement) s.trace.cameraMovement.type = 'static';
            if (s.trace.motionBehavior) s.trace.motionBehavior.behavior = 'calm';
        }
        return s;
      });
    }

    // 2. High Emotion Stacking Recovery
    if (stress.highEmotionStacking) {
       console.log('🩹 RECOVERY: De-escalating Emotion Stacking');
       recoveredScenes = recoveredScenes.map((s: any) => {
           if (s.trace?.emotionalAnalysis?.score >= 8) {
               // Remove macro/push combo
               if (s.trace.cameraShot?.type === 'macro') s.trace.cameraShot.type = 'focus';
               if (s.trace.cameraMovement?.type === 'push') s.trace.cameraMovement.type = 'static';
           }
           return s;
       });
    }

    // 3. Pacing Collapse Recovery
    if (stress.pacingCollapse) {
        console.log('🩹 RECOVERY: Fixing Rapid Pacing (Simplifying Transitions)');
        recoveredScenes = recoveredScenes.map((s: any) => {
            if (s.duration_sec < 3) {
                // Ensure cut transitions for speed
                 if (s.trace.transitionFromPrevious) s.trace.transitionFromPrevious.type = 'minimal';
            }
            return s;
        });
    }

    return recoveredScenes;
  }
}
