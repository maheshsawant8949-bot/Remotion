
/**
 * Consistency Lock
 * 
 * Prevent drift across videos.
 * Lock:
 * - typography scale
 * - color roles
 * - spacing
 * - diagram archetypes
 * - motion ranges
 */

export class ConsistencyLock {
  // Typography Constants (Locked)
  static readonly TYPOGRAPHY = {
    display: 72,
    headline: 56,
    body: 48,
    caption: 32,
    fontFamily: 'Inter, system-ui, sans-serif'
  };

  // Spacing Constants (Locked 8px Grid)
  static readonly SPACING = {
    xs: 8,
    s: 16,
    m: 24,
    l: 32,
    xl: 48,
    xxl: 64
  };

  /**
   * Verify value matches allowed set
   */
  static check(type: 'typography' | 'spacing', value: number): boolean {
    if (type === 'typography') {
      return Object.values(this.TYPOGRAPHY).some(v => typeof v === 'number' && Math.abs(v - value) < 1);
    }
    if (type === 'spacing') {
       // Allow multiples of 8 or specific tokens
       return value % 8 === 0;
    }
    return true;
  }

  /**
   * Enforce limit on motion duration
   */
  static clampMotionDuration(duration: number): number {
    // Max 1.2s for UI motion, Min 0.2s
    return Math.max(0.2, Math.min(duration, 1.2));
  }
}
