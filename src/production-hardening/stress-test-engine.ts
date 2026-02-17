
import { CompiledScene } from '../scene-compiler/scene-factory';

export interface StressReport {
  denseScriptRisk: boolean;
  highEmotionStacking: boolean;
  pacingCollapse: boolean;
  abstractConceptGap: boolean;
  minimalScriptEmptiness: boolean;
  recommendations: string[];
}

export class StressTestEngine {
  /**
   * Simulate difficult conditions based on plan data
   */
  static run(scenes: CompiledScene[], fullScript: string): StressReport {
    const report: StressReport = {
      denseScriptRisk: false,
      highEmotionStacking: false,
      pacingCollapse: false,
      abstractConceptGap: false,
      minimalScriptEmptiness: false,
      recommendations: []
    };

    // 1. Dense Script Test
    // Detect visual overload potential
    const avgWordsPerScene = fullScript.split(' ').length / scenes.length;
    if (avgWordsPerScene > 40) { // Very dense
      report.denseScriptRisk = true;
      report.recommendations.push("High density detected: Use 'Split' layout or slow pacing.");
    }

    // 2. High Emotion Test
    // Ensure system does NOT escalate: energetic + push + macro + firm transition
    scenes.forEach((scene: any, i) => {
      const trace = scene.trace;
      if (
        trace?.emotionalAnalysis?.score >= 8 &&
        trace?.motionBehavior?.behavior === 'energetic' &&
        trace?.cameraMovement?.type === 'push' &&
        trace?.cameraShot?.type === 'macro'
      ) {
        report.highEmotionStacking = true;
        report.recommendations.push(`Scene ${i+1}: Intensity Stacking detected. Downgrade camera or motion.`);
      }
    });

    // 3. Rapid Narration Test
    // If phrase durations collapse
    const shortScenes = scenes.filter((s: any) => s.duration_sec < 3).length;
    if (shortScenes / scenes.length > 0.3) {
      report.pacingCollapse = true;
      report.recommendations.push("Rapid narration: 30%+ scenes under 3s. Reduce complexity.");
    }

    // 4. Abstract Concept Test (Heuristic)
    // If text mentions 'concept', 'theory', 'future' but confidence is low (simulated)
    if (fullScript.includes('concept') || fullScript.includes('theory')) {
      // In real engine, we'd check Asset Confidence here
      // For now, assume risk if asset is just 'stock_photo' for abstract topic
      const genericPhotoUsage = scenes.filter(s => s.layout === 'data' || s.layout === 'process').length === 0;
      if (genericPhotoUsage) {
         report.abstractConceptGap = true;
         report.recommendations.push("Abstract topics detected with generic assets. Switch to Procedural?");
      }
    }

    // 5. Minimal Script Test
    if (avgWordsPerScene < 5) {
      report.minimalScriptEmptiness = true;
      report.recommendations.push("Minimal script: Increase durations or add ambient motion.");
    }

    return report;
  }
}
