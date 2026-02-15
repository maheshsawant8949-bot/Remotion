/**
 * Final Cinematic Quality Audit
 * 
 * Master evaluation tool that analyzes the FULL compiled video
 * and flags risks that degrade perceived quality.
 * 
 * This is NOT optional tooling. It becomes permanent infrastructure.
 * 
 * HARD RULE: Audit must NEVER modify scenes. Only diagnose.
 * Governors handle correction.
 */

import { StackingDetector, StackingRisk } from './stacking-detector';
import { MotionHealthChecker, MotionHealthReport } from './motion-health';
import { CameraHealthChecker, CameraHealthReport } from './camera-health';
import { ReadabilityScanner, ReadabilityRisk } from './readability-check';
import { IntensityBalanceChecker, IntensityBalanceReport } from './intensity-balance';

/**
 * Quality Audit Report
 */
export interface QualityAuditReport {
  healthScore: number;
  healthBand: 'production-ready' | 'strong' | 'noticeable-risk' | 'not-safe';
  majorRisks: string[];
  minorRisks: string[];
  stackingRisks: StackingRisk[];
  motionHealth: MotionHealthReport;
  cameraHealth: CameraHealthReport;
  intensityBalance: IntensityBalanceReport;
  readabilityRisks: ReadabilityRisk[];
}

/**
 * Quality Audit
 */
export class QualityAudit {
  /**
   * Run full quality audit
   * 
   * Run this AFTER full compilation. Never before.
   */
  static audit(scenes: any[]): QualityAuditReport {
    // Run all checks
    const stackingRisks = StackingDetector.detect(scenes);
    const motionHealth = MotionHealthChecker.check(scenes);
    const cameraHealth = CameraHealthChecker.check(scenes);
    const intensityBalance = IntensityBalanceChecker.check(scenes);
    const readabilityRisks = ReadabilityScanner.scan(scenes);
    
    // Calculate health score
    let score = 100;
    const majorRisks: string[] = [];
    const minorRisks: string[] = [];
    
    // Deduct for stacking (major risk)
    if (stackingRisks.length > 0) {
      const highRiskCount = stackingRisks.filter(r => r.riskLevel === 'high').length;
      score -= highRiskCount * 15;
      score -= (stackingRisks.length - highRiskCount) * 8;
      majorRisks.push(`${stackingRisks.length} intensity stacking issue(s)`);
    }
    
    // Deduct for readability (major risk - comprehension > flair)
    if (readabilityRisks.length > 0) {
      const highLoadCount = readabilityRisks.filter(r => r.cognitiveLoad === 'high').length;
      score -= highLoadCount * 12;
      score -= (readabilityRisks.length - highLoadCount) * 6;
      majorRisks.push(`${readabilityRisks.length} cognitive load risk(s)`);
    }
    
    // Deduct for motion health (minor risk)
    if (!motionHealth.isHealthy) {
      score -= motionHealth.issues.length * 5;
      minorRisks.push(...motionHealth.issues);
    }
    
    // Deduct for camera health (minor risk)
    if (!cameraHealth.isHealthy) {
      score -= cameraHealth.issues.length * 5;
      minorRisks.push(...cameraHealth.issues);
    }
    
    // Deduct for intensity balance (minor risk)
    if (!intensityBalance.isHealthy) {
      score -= intensityBalance.issues.length * 4;
      minorRisks.push(...intensityBalance.issues);
    }
    
    // Clamp score
    score = Math.max(0, Math.min(100, score));
    
    // Determine health band
    let healthBand: QualityAuditReport['healthBand'];
    if (score >= 90) {
      healthBand = 'production-ready';
    } else if (score >= 75) {
      healthBand = 'strong';
    } else if (score >= 60) {
      healthBand = 'noticeable-risk';
    } else {
      healthBand = 'not-safe';
    }
    
    return {
      healthScore: score,
      healthBand,
      majorRisks,
      minorRisks,
      stackingRisks,
      motionHealth,
      cameraHealth,
      intensityBalance,
      readabilityRisks,
    };
  }
  
  /**
   * Print clean CLI report
   * 
   * NO raw JSON. Make it readable.
   */
  static printReport(report: QualityAuditReport): void {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║   CINEMATIC HEALTH AUDIT               ║');
    console.log('╚════════════════════════════════════════╝\n');
    
    // Health score
    console.log(`HEALTH SCORE: ${report.healthScore}/100`);
    console.log(`STATUS: ${this.formatHealthBand(report.healthBand)}\n`);
    
    // Major risks
    if (report.majorRisks.length > 0) {
      console.log('⚠️  MAJOR RISKS:');
      report.majorRisks.forEach(r => console.log(`   • ${r}`));
      console.log('');
    }
    
    // Minor risks
    if (report.minorRisks.length > 0) {
      console.log('⚡ MINOR RISKS:');
      report.minorRisks.forEach(r => console.log(`   • ${r}`));
      console.log('');
    }
    
    // All clear
    if (report.majorRisks.length === 0 && report.minorRisks.length === 0) {
      console.log('✅ No risks detected. Production-ready.\n');
    }
    
    // Detailed breakdown
    console.log('─────────────────────────────────────────');
    console.log('DETAILED BREAKDOWN:\n');
    
    console.log(`Motion Health: ${motionHealth.isHealthy ? '✅' : '⚠️'}`);
    console.log(`  Kinetic Streak: ${report.motionHealth.kineticStreak} (max 2)`);
    console.log(`  Avg Duration: ${report.motionHealth.avgDuration.toFixed(0)}ms (max 500ms)`);
    console.log(`  Curve Volatility: ${(report.motionHealth.curveVolatility * 100).toFixed(1)}% (max 45%)\n`);
    
    console.log(`Camera Health: ${report.cameraHealth.isHealthy ? '✅' : '⚠️'}`);
    console.log(`  Tight Streak: ${report.cameraHealth.tightStreak} (max 2)`);
    console.log(`  Push Frequency: ${(report.cameraHealth.pushFrequency * 100).toFixed(1)}% (max 10%)`);
    console.log(`  Movement Ratio: ${(report.cameraHealth.movementRatio * 100).toFixed(1)}% (max 40%)\n`);
    
    console.log(`Intensity Balance: ${report.intensityBalance.isHealthy ? '✅' : '⚠️'}`);
    console.log(`  Match-cut: ${(report.intensityBalance.transitionHealth.matchCutRatio * 100).toFixed(1)}% (max 15%)`);
    console.log(`  Hold-cut: ${(report.intensityBalance.transitionHealth.holdCutRatio * 100).toFixed(1)}% (max 8%)`);
    console.log(`  Interaction Ratio: ${(report.intensityBalance.interactionRatio * 100).toFixed(1)}% (max 45%)\n`);
    
    console.log(`Stacking Risks: ${report.stackingRisks.length === 0 ? '✅' : '⚠️'} (${report.stackingRisks.length} detected)`);
    console.log(`Readability Risks: ${report.readabilityRisks.length === 0 ? '✅' : '⚠️'} (${report.readabilityRisks.length} detected)\n`);
    
    console.log('─────────────────────────────────────────\n');
  }
  
  /**
   * Format health band for display
   */
  private static formatHealthBand(band: string): string {
    switch (band) {
      case 'production-ready': return '🟢 PRODUCTION-READY';
      case 'strong': return '🟡 STRONG (minor tuning)';
      case 'noticeable-risk': return '🟠 NOTICEABLE RISK';
      case 'not-safe': return '🔴 NOT PRODUCTION SAFE';
      default: return band.toUpperCase();
    }
  }
}
