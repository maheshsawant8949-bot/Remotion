/**
 * Final Cinematic Quality Audit
 * 
 * Master evaluation tool that analyzes the FULL compiled video
 * and flags risks that degrade perceived quality.
 * 
 * This is NOT optional tooling. It becomes permanent infrastructure.
 * Run this AFTER full compilation. Never before.
 */

export {
  StackingDetector,
  type StackingRisk,
} from './stacking-detector';

export {
  MotionHealthChecker,
  type MotionHealthReport,
} from './motion-health';

export {
  CameraHealthChecker,
  type CameraHealthReport,
} from './camera-health';

export {
  ReadabilityScanner,
  type ReadabilityRisk,
} from './readability-check';

export {
  IntensityBalanceChecker,
  type IntensityBalanceReport,
} from './intensity-balance';

export {
  QualityAudit,
  type QualityAuditReport,
} from './quality-audit';
