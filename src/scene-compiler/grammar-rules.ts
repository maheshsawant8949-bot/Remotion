
// Grammar Rules
// Purpose: Define the "Physics" of the video generation.
// What can go where? (Migrated from model/templates.ts)

export const GRAMMAR_VERSION = "1.0";
export const DENSITY_THRESHOLD_HIGH = 0.8;

export type TemplateType = 'title' | 'hero' | 'process' | 'diagram' | 'data';

export type TemplateSchema = {
  name: string;
  allowedRegions: string[];
  allowedLayerTypes: string[];
  forbiddenPairs?: [string, string][];
  maxPerType?: Record<string, number>; // e.g. { callout: 2, focus: 1 }
  maxPrimaryVisuals?: number; // Limit "Hero" elements (charts, timelines, videos, 3D)
};

export const PRIMITIVES: Record<TemplateType, TemplateSchema> = {
  title: {
    name: 'Title Sequence',
    allowedRegions: ['main'], 
    allowedLayerTypes: ['group', 'text', 'image', 'svg'],
    maxPrimaryVisuals: 1
  },
  hero: {
    name: 'Hero Visual',
    allowedRegions: ['heroVisual', 'caption'], 
    allowedLayerTypes: ['three', 'group', 'text', 'focus'],
    maxPerType: { focus: 1 },
    maxPrimaryVisuals: 1
  },
  process: {
    name: 'Process Flow',
    allowedRegions: ['mainVisual', 'timeline'], 
    allowedLayerTypes: ['timeline', 'group', 'svg', 'image'],
    forbiddenPairs: [['timeline', 'bar_chart']], // Explicit rule: No mixing timeline + charts
    maxPrimaryVisuals: 1
  },
  diagram: {
    name: 'Technical Diagram',
    allowedRegions: ['mainVisual', 'supporting', 'timeline'],
    allowedLayerTypes: ['group', 'svg', 'callout', 'motion_lines', 'focus'], 
    forbiddenPairs: [
      ['three', 'video'], 
    ],
    maxPerType: { callout: 2, focus: 1 }, // Rule: Max 2 callouts, 1 focus
    maxPrimaryVisuals: 1
  },
  data: {
    name: 'Data Visualization',
    allowedRegions: ['counter', 'chart'], 
    allowedLayerTypes: ['bar_chart', 'counter', 'meter'],
    forbiddenPairs: [['timeline', 'bar_chart']], // Rule: Never mix timeline + bar chart
    maxPrimaryVisuals: 1
  }
};

// Intent Mapping Structure (User Request)
export type IntentType = 
  | 'context_setting'
  | 'emotional_anchor'
  | 'spatial_explanation'
  | 'chronological_sequence'
  | 'quantitative_proof';

export type NarrativeRole = "hook" | "context" | "explain" | "proof" | "payoff";


export type DecisionTrace = {
  inputScript?: string;
  densityScore?: number;
  splitReason?: string;
  classification?: string;
  templateSelection?: string;
  rejections?: string[];
  // Extended Pacing Trace
  densityAnalysis?: {
    score: number;
    action: 'maintain' | 'split' | 'downgrade_intensity';
    signals: {
        conceptCount: number;
        numericPresence: number;
        comparisonWords: number;
        calloutsRequired: number;
        visualElementsPredicted: number;
    };
  };
  pacing?: {
     profile: string;
     reason: string;
     baseDuration: number;
     finalDuration: number;
     forces?: string[];
     emotionalAdjustment?: string;
  };
  // Emotional Weight Trace
  emotionalAnalysis?: {
      score: number;
      level: "low" | "medium" | "high";
      triggers: string[];
  };
  // Reveal Strategy Trace
  revealStrategy?: {
      chosen: "instant" | "stagger" | "spotlight" | "build";
      reason: string[];
      governorApplied?: boolean;
  };
  // Emphasis Level Trace
  emphasis?: {
      level: "none" | "soft" | "strong";
      primary?: string;      // ONE primary target element
      secondary?: string[];  // Supporting elements
      tier: "primary" | "secondary" | "background";  // Priority tier
      reason: string[];
      governorApplied?: boolean;
  };
  // Motion Behavior Trace
  motionBehavior?: {
      behavior: "calm" | "assertive" | "energetic" | "technical";
      reason: string[];
      inflationPrevented?: boolean;
      recoveryBiasApplied?: boolean;
  };
};

export type SceneIntent = {
  type: IntentType;
  role?: NarrativeRole;
  intensity?: "low" | "medium" | "high";
  pacing?: "slow" | "normal" | "fast";
  trace?: DecisionTrace; // Debug artifact
  purpose?: string;
  // competingStrategies: List of preferred configurations from Strategy Engine, sorted by confidence
  competingStrategies?: string[]; 
  // Pre-calculated emotional weight (optional override)
  emotionalWeight?: number; 
  // Reveal history for frequency governor (last 3 scenes)
  revealHistory?: ("instant" | "stagger" | "spotlight" | "build")[];
  // Emphasis history for frequency governor (last 3 scenes)
  emphasisHistory?: ("none" | "soft" | "strong")[];
  // Motion history for inflation prevention and recovery bias (last 10 scenes)
  motionHistory?: ("calm" | "assertive" | "energetic" | "technical")[];
};

export type IntentTemplateMap = {
  primary: TemplateType;
  allowedVariants?: TemplateType[];
};

export const INTENT_MAP: Record<IntentType, IntentTemplateMap> = {
    'context_setting': { 
        primary: 'hero', 
        allowedVariants: ['diagram'] 
    },
    'emotional_anchor': {
        primary: 'hero',
        allowedVariants: ['diagram']
    },
    'spatial_explanation': {
        primary: 'diagram',
        allowedVariants: ['process'] // A process is often a spatial explanation in time
    },
    'chronological_sequence': {
        primary: 'process',
        allowedVariants: ['diagram']
    },
    'quantitative_proof': {
        primary: 'data',
        allowedVariants: [] // Data is strict. No variants usually.
    }
};
