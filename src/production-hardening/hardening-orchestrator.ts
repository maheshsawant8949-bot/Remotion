
import { CompiledScene } from '../scene-compiler/scene-factory';
import { StressTestEngine } from './stress-test-engine';
import { RiskDetector } from './risk-detector';
import { ConfidenceRouter, SystemConfidence } from './confidence-router';
import { QualityGate, QualityDecision } from './quality-gate';
import { FailureRecovery } from './failure-recovery';
import { SafeMode } from './safe-mode';

export class HardeningOrchestrator {
  /**
   * Run the full hardening layer
   */
  static validate(
    scenes: CompiledScene[],
    fullScript: string,
    confidenceScores: SystemConfidence
  ): { scenes: CompiledScene[]; approved: boolean; report: QualityDecision } {
    
    console.log('\n🛡️  RUNNING PRODUCTION HARDENING LAYER');
    console.log('========================================');

    // 1. Confidence Routing
    const confidence = ConfidenceRouter.evaluate(confidenceScores);
    if (confidence !== 'high') {
       SafeMode.setMode('conservative');
    }

    // 2. Stress Testing
    const stressReport = StressTestEngine.run(scenes, fullScript);
    if (stressReport.recommendations.length > 0) {
        console.log('   ⚠️  Stress Failures:', stressReport.recommendations.join(' | '));
    }

    // 3. Risk Detection
    const risks = RiskDetector.scan(scenes);
    if (risks.warnings.length > 0) {
        console.log('   Warning:', risks.warnings.join(' | '));
    }

    // 4. Failure Recovery (Auto-Fix)
    let finalScenes = scenes;
    if (risks.cognitiveLoadScore > 5 || stressReport.highEmotionStacking || stressReport.pacingCollapse) {
        finalScenes = FailureRecovery.recover(scenes, risks, stressReport);
    }

    // 5. Quality Gate
    const decision = QualityGate.decide(risks, stressReport, confidence);
    
    console.log(`\n✅ HARDENING COMPLETE (Score: ${decision.score})`);
    console.log(`   Status: ${decision.status.toUpperCase()}`);
    if (decision.blockers.length > 0) {
        console.log('   ⛔ BLOCKERS:', decision.blockers.join(' | '));
    }
    console.log('========================================\n');

    return {
        scenes: finalScenes,
        approved: decision.status !== 'rejected',
        report: decision
    };
  }
}
