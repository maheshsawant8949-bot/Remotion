/**
 * Complexity Governor
 * 
 * EXTREMELY IMPORTANT: Most procedural engines fail here.
 * 
 * Evaluate:
 * - elements per scene
 * - simultaneous motion
 * - label density
 * - visual noise
 * 
 * Hard caps:
 * - max nodes: 6-8
 * - max simultaneous animations: 2-3
 * 
 * If exceeded → simplify automatically.
 * Clarity > cleverness. Always.
 */

import { Element } from './element-factory';
import { Animation, AnimationOrchestrator } from './animation-orchestrator';

/**
 * Complexity Metrics
 */
export interface ComplexityMetrics {
  elementCount: number;
  nodeCount: number;
  simultaneousAnimations: number;
  labelDensity: number;
  visualNoise: number;
  score: 'safe' | 'moderate' | 'high';
}

/**
 * Complexity Governor
 */
export class ComplexityGovernor {
  // Hard caps
  private static readonly MAX_NODES = 8;
  private static readonly MAX_SIMULTANEOUS_ANIMATIONS = 3;
  private static readonly MAX_LABELS = 10;
  
  /**
   * Evaluate complexity
   */
  static evaluate(elements: Element[], animations: Animation[]): ComplexityMetrics {
    const elementCount = elements.length;
    const nodeCount = elements.filter(el => el.type === 'node').length;
    const simultaneousAnimations = AnimationOrchestrator.getSimultaneousCount(animations);
    const labelDensity = elements.filter(el => el.type === 'label').length / elementCount;
    const visualNoise = this.calculateVisualNoise(elements);
    
    // Calculate score
    let score: 'safe' | 'moderate' | 'high' = 'safe';
    
    if (
      nodeCount > this.MAX_NODES ||
      simultaneousAnimations > this.MAX_SIMULTANEOUS_ANIMATIONS ||
      visualNoise > 0.7
    ) {
      score = 'high';
    } else if (
      nodeCount > 6 ||
      simultaneousAnimations > 2 ||
      visualNoise > 0.5
    ) {
      score = 'moderate';
    }
    
    return {
      elementCount,
      nodeCount,
      simultaneousAnimations,
      labelDensity,
      visualNoise,
      score,
    };
  }
  
  /**
   * Calculate visual noise
   */
  private static calculateVisualNoise(elements: Element[]): number {
    // Simple heuristic: ratio of visible elements to total space
    const totalArea = 1920 * 1080;  // Assume 1080p
    const elementArea = elements.reduce((sum, el) => sum + (el.width * el.height), 0);
    
    return Math.min(elementArea / totalArea, 1);
  }
  
  /**
   * Simplify scene if complexity is too high
   */
  static simplify(elements: Element[], animations: Animation[]): {
    elements: Element[];
    animations: Animation[];
    changes: string[];
  } {
    const metrics = this.evaluate(elements, animations);
    const changes: string[] = [];
    
    let simplifiedElements = [...elements];
    let simplifiedAnimations = [...animations];
    
    // If complexity is high, simplify
    if (metrics.score === 'high') {
      // Remove lowest-priority elements
      if (metrics.nodeCount > this.MAX_NODES) {
        const nodesToRemove = metrics.nodeCount - this.MAX_NODES;
        simplifiedElements = this.removeLowestPriorityNodes(simplifiedElements, nodesToRemove);
        changes.push(`Removed ${nodesToRemove} nodes (exceeded max ${this.MAX_NODES})`);
      }
      
      // Reduce simultaneous animations
      if (metrics.simultaneousAnimations > this.MAX_SIMULTANEOUS_ANIMATIONS) {
        simplifiedAnimations = this.staggerAnimations(simplifiedAnimations);
        changes.push('Staggered animations to reduce simultaneity');
      }
      
      // Merge redundant labels
      if (metrics.labelDensity > 0.5) {
        simplifiedElements = this.mergeLabels(simplifiedElements);
        changes.push('Merged redundant labels');
      }
    }
    
    return {
      elements: simplifiedElements,
      animations: simplifiedAnimations,
      changes,
    };
  }
  
  /**
   * Remove lowest-priority nodes
   */
  private static removeLowestPriorityNodes(elements: Element[], count: number): Element[] {
    const nodes = elements.filter(el => el.type === 'node');
    const nonNodes = elements.filter(el => el.type !== 'node');
    
    // Keep first N nodes (assume they're ordered by priority)
    const keptNodes = nodes.slice(0, nodes.length - count);
    
    return [...keptNodes, ...nonNodes];
  }
  
  /**
   * Stagger animations to reduce simultaneity
   */
  private static staggerAnimations(animations: Animation[]): Animation[] {
    return animations.map((anim, i) => ({
      ...anim,
      delay: i * 150,  // Stagger by 150ms
    }));
  }
  
  /**
   * Merge redundant labels
   */
  private static mergeLabels(elements: Element[]): Element[] {
    // Simple implementation: remove every other label
    const labels = elements.filter(el => el.type === 'label');
    const nonLabels = elements.filter(el => el.type !== 'label');
    
    const keptLabels = labels.filter((_, i) => i % 2 === 0);
    
    return [...nonLabels, ...keptLabels];
  }
  
  /**
   * Validate complexity is within acceptable range
   */
  static validate(metrics: ComplexityMetrics): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    
    if (metrics.nodeCount > this.MAX_NODES) {
      issues.push(`Node count ${metrics.nodeCount} exceeds max ${this.MAX_NODES}`);
    }
    
    if (metrics.simultaneousAnimations > this.MAX_SIMULTANEOUS_ANIMATIONS) {
      issues.push(`Simultaneous animations ${metrics.simultaneousAnimations} exceeds max ${this.MAX_SIMULTANEOUS_ANIMATIONS}`);
    }
    
    if (metrics.visualNoise > 0.7) {
      issues.push(`Visual noise ${metrics.visualNoise.toFixed(2)} is too high (max 0.7)`);
    }
    
    return {
      isValid: issues.length === 0,
      issues,
    };
  }
}
