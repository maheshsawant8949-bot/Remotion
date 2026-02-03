import { PACING_CONSTANTS } from './pacing-model';

export class RhythmController {
  private recentDurations: number[] = [];
  private readonly HISTORY_LIMIT = 6;
  private readonly MONOTONY_THRESHOLD = 0.5; // tolerance in seconds

  /**
   * Main entry point to refine a proposed duration.
   * Checks for monotony and adds variance.
   */
  processDuration(proposedDuration: number): number {
    let finalDuration = proposedDuration;

    // 1. Check for Monotony (Prevent 6 identical scenes)
    if (this.isMonotonous(proposedDuration)) {
       // Force a variation if we are about to add the 6th identical scene
       // Strategy: Shift duration by +/- 15% to break the pattern
       const shift = Math.random() > 0.5 ? 1.15 : 0.85;
       finalDuration = proposedDuration * shift;
    } else {
        // 2. Apply Natural Variance (Jitter)
        // Add subtle +/- 5% variation to feel organic
        const variance = 1 + (Math.random() * 0.1 - 0.05);
        finalDuration = proposedDuration * variance;
    }

    // 3. Re-clamp to safe bounds (Safety net)
    finalDuration = Math.min(
        Math.max(finalDuration, PACING_CONSTANTS.MIN_DURATION_SECONDS),
        PACING_CONSTANTS.MAX_DURATION_SECONDS
    );

    this.addToHistory(finalDuration);
    return finalDuration;
  }

  private addToHistory(duration: number) {
    this.recentDurations.push(duration);
    if (this.recentDurations.length > this.HISTORY_LIMIT) {
      this.recentDurations.shift();
    }
  }

  private isMonotonous(nextDuration: number): boolean {
    if (this.recentDurations.length < this.HISTORY_LIMIT - 1) {
        return false;
    }

    // Check if checks 1 to N-1 (5 items) are all similar to nextDuration
    // Basically, if we add this one, will we have 6 similar items?
    return this.recentDurations.every(d => Math.abs(d - nextDuration) < this.MONOTONY_THRESHOLD);
  }
  
  // Helper for testing
  reset() {
      this.recentDurations = [];
  }
}
