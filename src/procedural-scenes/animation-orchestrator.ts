/**
 * Animation Orchestrator
 * 
 * IMPORTANT: Procedural animation must obey existing stack.
 * 
 * Procedural must plug into the ecosystem:
 * - motion behavior
 * - motion curves
 * - micro-interactions
 * - camera
 * 
 * Do NOT invent new animation logic.
 * 
 * Allowed Animation Patterns (6 ONLY):
 * - fade-in
 * - progressive-reveal
 * - connector-draw
 * - number-count
 * - soft-scale
 * - sequence-build
 * 
 * Avoid:
 * ❌ bounce
 * ❌ elastic
 * ❌ spins
 * ❌ flashy wipes
 * 
 * Those kill maturity instantly.
 */

import { Element } from './element-factory';

/**
 * Animation Pattern
 */
export type AnimationPattern =
  | 'fade-in'
  | 'progressive-reveal'
  | 'connector-draw'
  | 'number-count'
  | 'soft-scale'
  | 'sequence-build';

/**
 * Animation
 */
export interface Animation {
  elementId: string;
  pattern: AnimationPattern;
  delay: number;
  duration: number;
  easing: string;  // From motion-curves
}

/**
 * Animation Orchestrator
 */
export class AnimationOrchestrator {
  /**
   * Orchestrate animations for elements
   */
  static orchestrate(
    elements: Element[],
    pattern: AnimationPattern,
    options?: {
      motionCurve?: 'gentle' | 'confident' | 'swift' | 'deliberate';
      stagger?: number;
    }
  ): Animation[] {
    const animations: Animation[] = [];
    const motionCurve = options?.motionCurve || 'gentle';
    const stagger = options?.stagger || 100;  // ms
    
    // Get easing from motion curves
    const easing = this.getEasing(motionCurve);
    
    // Generate animations based on pattern
    switch (pattern) {
      case 'fade-in':
        animations.push(...this.generateFadeIn(elements, easing, stagger));
        break;
      
      case 'progressive-reveal':
        animations.push(...this.generateProgressiveReveal(elements, easing, stagger));
        break;
      
      case 'connector-draw':
        animations.push(...this.generateConnectorDraw(elements, easing));
        break;
      
      case 'number-count':
        animations.push(...this.generateNumberCount(elements, easing));
        break;
      
      case 'soft-scale':
        animations.push(...this.generateSoftScale(elements, easing, stagger));
        break;
      
      case 'sequence-build':
        animations.push(...this.generateSequenceBuild(elements, easing, stagger));
        break;
    }
    
    return animations;
  }
  
  /**
   * Get easing from motion curves
   */
  private static getEasing(curve: string): string {
    // Import from motion-curves module
    // Map semantic curves to cubic-bezier values
    const easings: Record<string, string> = {
      gentle: 'cubic-bezier(0.25, 0.1, 0.25, 1)',      // Smooth, approachable
      confident: 'cubic-bezier(0.4, 0, 0.2, 1)',       // Professional, decisive
      swift: 'cubic-bezier(0.4, 0, 0.6, 1)',           // Dynamic, exciting
      deliberate: 'cubic-bezier(0.4, 0, 0.2, 1)',      // Intentional, weighty
    };
    return easings[curve as keyof typeof easings] || easings.gentle;
  }
  
  /**
   * Generate fade-in animations
   */
  private static generateFadeIn(elements: Element[], easing: string, stagger: number): Animation[] {
    return elements.map((el, i) => ({
      elementId: el.id,
      pattern: 'fade-in',
      delay: i * stagger,
      duration: 400,
      easing,
    }));
  }
  
  /**
   * Generate progressive reveal animations
   */
  private static generateProgressiveReveal(elements: Element[], easing: string, stagger: number): Animation[] {
    return elements.map((el, i) => ({
      elementId: el.id,
      pattern: 'progressive-reveal',
      delay: i * stagger,
      duration: 600,
      easing,
    }));
  }
  
  /**
   * Generate connector draw animations
   */
  private static generateConnectorDraw(elements: Element[], easing: string): Animation[] {
    const connectors = elements.filter(el => el.type === 'connector' || el.type === 'arrow');
    return connectors.map((el, i) => ({
      elementId: el.id,
      pattern: 'connector-draw',
      delay: i * 200,
      duration: 800,
      easing,
    }));
  }
  
  /**
   * Generate number count animations
   */
  private static generateNumberCount(elements: Element[], easing: string): Animation[] {
    const labels = elements.filter(el => el.type === 'label' && el.content?.match(/\d+/));
    return labels.map(el => ({
      elementId: el.id,
      pattern: 'number-count',
      delay: 0,
      duration: 1200,
      easing,
    }));
  }
  
  /**
   * Generate soft scale animations
   */
  private static generateSoftScale(elements: Element[], easing: string, stagger: number): Animation[] {
    return elements.map((el, i) => ({
      elementId: el.id,
      pattern: 'soft-scale',
      delay: i * stagger,
      duration: 500,
      easing,
    }));
  }
  
  /**
   * Generate sequence build animations
   */
  private static generateSequenceBuild(elements: Element[], easing: string, stagger: number): Animation[] {
    return elements.map((el, i) => ({
      elementId: el.id,
      pattern: 'sequence-build',
      delay: i * stagger,
      duration: 700,
      easing,
    }));
  }
  
  /**
   * Get simultaneous animation count
   */
  static getSimultaneousCount(animations: Animation[]): number {
    // Group by delay to find max simultaneous
    const delayGroups = new Map<number, number>();
    
    animations.forEach(anim => {
      const count = delayGroups.get(anim.delay) || 0;
      delayGroups.set(anim.delay, count + 1);
    });
    
    return Math.max(...Array.from(delayGroups.values()));
  }
}
