
import { SceneArchetype } from '../procedural-scenes/scene-archetypes';
import { InterpretedScene } from './scene-interpreter';

export interface VisualSuggestion {
  archetype?: SceneArchetype;
  diagramConcept?: string;
  layoutConstraint: 'grid' | 'centered' | 'split' | 'timeline';
  reasoning: string;
  confidence: number;
}

export class VisualSuggester {
  /**
   * Propose visual structure based on interpretation
   */
  static suggest(interpretation: InterpretedScene): VisualSuggestion {
    // 1. Check for Procedural Archetype Fit
    // Enforce whitelist: generic layouts are banned.
    
    // Timeline
    if (this.hasConcept(interpretation, ['time', 'history', 'evolution', 'year', 'future'])) {
      return {
        archetype: 'timeline',
        diagramConcept: 'Chronological progression',
        layoutConstraint: 'timeline',
        reasoning: 'Script implies temporal sequence',
        confidence: 0.9
      };
    }

    // Comparison
    if (this.hasConcept(interpretation, ['vs', 'versus', 'compare', 'difference', 'better', 'worse'])) {
      return {
        archetype: 'comparison',
        diagramConcept: 'Side-by-side analysis',
        layoutConstraint: 'split',
        reasoning: 'Script implies comparative structure',
        confidence: 0.85
      };
    }
    
    // Process / Flow
    if (this.hasConcept(interpretation, ['process', 'step', 'how to', 'workflow', 'pipeline'])) {
      return {
        archetype: 'flow',
        diagramConcept: 'Step-by-step flow',
        layoutConstraint: 'grid', // or linear flow
        reasoning: 'Script implies procedural steps',
        confidence: 0.85
      };
    }

    // Default: Return abstract visual suggestion without interfering
    // if no strong archetype match
    return {
      reasoning: 'No specific procedural archetype matched. Suggesting standard composition.',
      layoutConstraint: 'centered',
      confidence: 0.5
    };
  }

  private static hasConcept(interpretation: InterpretedScene, keywords: string[]): boolean {
    const combined = [
      interpretation.originalScript,
      ...interpretation.visualMetaphors,
      ...interpretation.potentialConcepts
    ].join(' ').toLowerCase();
    
    return keywords.some(k => combined.includes(k));
  }
}
