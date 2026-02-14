import { INTENT_MAP, PRIMITIVES, SceneIntent, TemplateType, NarrativeRole, DecisionTrace, GRAMMAR_VERSION, DENSITY_THRESHOLD_HIGH } from './grammar-rules';
import { SceneDensityController } from '../pacing-engine/density-controller';
import { EmotionalAnalyzer } from '../pacing-engine/emotional-analyzer';
import { getRevealStyle, isRevealEligible } from '../pacing-engine/reveal-eligibility';
import { RevealResolver } from '../reveal-engine/reveal-resolver';
import { EmphasisResolver } from '../emphasis-engine/emphasis-resolver';
import { BehaviorResolver } from '../motion-behavior/behavior-resolver';
import { TransitionResolver } from '../transition-intelligence/transition-resolver';
import { FramingEngine } from '../camera-intelligence/framing-engine';
import { Heuristics } from '../visual-reasoner/heuristics';

export interface CompiledScene {
  layout: TemplateType;
  role?: NarrativeRole;
  grammarVersion: string;
  layers: any[];
  warnings: string[];
  trace?: DecisionTrace;
}

export type ContentPayload = {
  primaryText?: string;
  secondaryText?: string;
  data?: any; // For charts/counters
  assetUrl?: string; // For 3D models, images, SVGs
  items?: string[]; // For timeline steps
};

export const SceneFactory = {
  // Initialize a scene structure based on high-level intent
  create: (intent: SceneIntent): CompiledScene => {
    const mapping = INTENT_MAP[intent.type];
    const script = intent.trace?.inputScript || "";


    // 0. Emotional Analysis (Influence Logic)
    let emotionalWeight = intent.emotionalWeight || 0;
    let emotionalTrace: DecisionTrace['emotionalAnalysis'] | undefined;
    
    if (script) {
        const emotionalAnalyzer = new EmotionalAnalyzer();
        const emotion = emotionalAnalyzer.analyze(script);
        emotionalWeight = emotion.score;
        emotionalTrace = emotion;
    }


    // PACING BIAS (Emotional Weight Influence)
    // High Emotion (7+) -> Probabilistic bias toward slower pacing (~25% increase)
    // Low Emotion (0-3) -> Faster (To keep energy)
    let pacingAdjustment = "";
    if (emotionalWeight >= 7) {
        // Probabilistic bias: ~25% chance to bias toward slow
        // We avoid rigidity - this is a soft preference, not a rule
        const shouldBiasSlow = Math.random() < 0.25;
        if (shouldBiasSlow && intent.pacing !== 'slow') {
            intent.pacing = 'slow';
            pacingAdjustment = "Biased to 'slow' (High Emotion, probabilistic)";
        }
    } else if (emotionalWeight <= 3 && emotionalWeight > 0) {
        if (intent.pacing !== 'fast') {
            intent.pacing = 'fast';
            pacingAdjustment = "Biased to 'fast' (Low Emotion)";
        }
    }
    
    // AWE SIGNAL BIAS: Awe-inspiring content deserves contemplation
    // Check if Awe signal is present, bias toward slower pacing
    const hasAweSignal = emotionalTrace?.triggers?.some(t => t.startsWith('Awe(')) || false;
    if (hasAweSignal && intent.pacing === 'fast') {
        intent.pacing = 'normal';
        pacingAdjustment += ` -> [AWE BIAS] Upgraded to 'normal' (Awe signals deserve contemplation)`;
    }

    // 1. Determine Candidates (Strategy override vs Default)
    // We start with the strategies suggested by the engine, but we MUST validate them against the physics (Grammar).
    let candidates = [...(intent.competingStrategies || [])];

    // STRATEGY CONFIDENCE BIASING (Emotional Weight Influence)
    // We bias the *order* of candidates so that valid preferred strategies are picked first.
    // This does NOT override validity checks (grammar rules).
    let selectionReason = "";

    if (emotionalWeight >= 7) {
        // High Emotion: Boost 'hero' and 'diagram'
        const bias = ['hero', 'diagram'];
        const boosted = candidates.filter(c => bias.includes(c));
        const others = candidates.filter(c => !bias.includes(c));
        candidates = [...boosted, ...others];
        if (boosted.length > 0) selectionReason += ` [Bias: Boosted High-Impact Strategies]`;
    } else if (emotionalWeight <= 3 && emotionalWeight > 0) {
        // Low Emotion (but not zero/unset): Boost 'diagram' and 'process'
        const bias = ['diagram', 'process'];
        const boosted = candidates.filter(c => bias.includes(c));
        const others = candidates.filter(c => !bias.includes(c));
        candidates = [...boosted, ...others];
        if (boosted.length > 0) selectionReason += ` [Bias: Preferring Explanatory Strategies]`;
    }
    
    // AWE SIGNAL BIAS: Awe-inspiring content often benefits from hero treatment
    if (hasAweSignal) {
        const bias = ['hero', 'diagram'];
        const boosted = candidates.filter(c => bias.includes(c));
        const others = candidates.filter(c => !bias.includes(c));
        candidates = [...boosted, ...others];
        if (boosted.length > 0) selectionReason += ` [Awe Bias: Preferring Hero/Diagram for contemplative content]`;
    }
    
    // 2. Select the Best Valid Candidate
    let selectedTemplate: TemplateType | null = null;
    const rejections: string[] = [];

    for (const candidate of candidates) {
        // Cast string to TemplateType for check
        const candidateType = candidate as TemplateType;
        
        // Emotional Boost Logic: 
        // If emotional weight is high (>7), we prefer 'Hero' or 'Title' (Focus layers) over data/diagrams if applicable.
        // This is a soft preference, currently implemented as logging, but could re-order candidates in a more complex engine.
        
        // Check Validity:
        // A candidate is valid if it is the Primary for this intent OR it is in the Allowed Variants.
        const isPrimary = mapping.primary === candidateType;
        const isVariant = mapping.allowedVariants?.includes(candidateType);
        
        if (isPrimary || isVariant) {
            selectedTemplate = candidateType;
            selectionReason = `Selected strategy '${candidate}' (Valid for '${intent.type}')`;
            
            if (emotionalWeight > 7) {
                selectionReason += ` [NOTE: High Emotional Weight ${emotionalWeight}. Ensure Emphasis is High.]`;
            }
            break; // Found the highest confidence valid match
        } else {
             // Rejection Logging
             rejections.push(`Rejected: ${candidate} | Reason: Not valid for intent '${intent.type}' (Allowed: ${[mapping.primary, ...(mapping.allowedVariants||[])].join(', ')})`);
        }
    }

    // 3. Fallback
    if (!selectedTemplate) {
        selectedTemplate = mapping.primary;
        selectionReason = `Fallback to primary '${selectedTemplate}' (No valid strategy found in [${candidates.join(', ')}])`;
    }

    // 3.5. Hero Eligibility Check (STRICT RULE)
    // Hero strategy allowed ONLY if: emotionalWeight == high OR aweSignal == true
    // Otherwise downgrade to diagram
    if (selectedTemplate === 'hero') {
        const hasAweSignal = emotionalTrace?.triggers?.some(t => t.startsWith('Awe(')) || false;
        const isHighEmotion = emotionalWeight >= 7;
        
        if (!isHighEmotion && !hasAweSignal) {
            selectedTemplate = 'diagram';
            selectionReason += ` -> [HERO RESTRICTION] Downgraded 'hero' to 'diagram' (Requires: emotionalWeight >= 7 OR Awe signal. Got: weight=${emotionalWeight}, awe=${hasAweSignal})`;
        }
    }

    // 4. Grammar Overrides (Physics Enforcement + Density Control)
    // Rule: High density content cannot be displayed in 'Hero' layout (too cluttered).
    // New: Use SceneDensityController for surgical analysis
    let densityTrace: DecisionTrace['densityAnalysis'] | undefined;
    
    if (script) {
        const densityController = new SceneDensityController();
        const analysis = densityController.analyze(script, selectedTemplate);
        
        densityTrace = {
            score: analysis.score,
            action: analysis.type,
            signals: { 
                conceptCount: 0, numericPresence: 0, comparisonWords: 0, calloutsRequired: 0, visualElementsPredicted: 0,
                ...((densityController as any).extractSignals ? (densityController as any).extractSignals(script) : {}) 
            } 
        };
        
        // Pacing Override: Density > Emotional Weight
        // If Density is High (7+), we MUST slow down to allow cognitive processing,
        // even if Emotional Weight blocked 'fast' pacing.
        if (analysis.score >= 7) {
            if (intent.pacing !== 'slow') {
                 intent.pacing = 'slow';
                 pacingAdjustment += ` -> [OVERRIDE] Forced 'slow' (Density ${analysis.score})`;
            }
        }
        
        if (analysis.type === 'split') {
            // ... (Existing Split logic)
            if (selectedTemplate === 'hero') {
                selectedTemplate = 'diagram';
                if (emotionalWeight > 8) {
                    selectionReason += ` -> [OVERRIDE] Downgraded 'hero' to 'diagram' (Density ${analysis.score} requires Split). High Emotion (${emotionalWeight}) -> SPLIT SCENE TO RESTORE.`;
                } else {
                    selectionReason += ` -> [OVERRIDE] Downgraded 'hero' to 'diagram' (Density ${analysis.score} > 7)`;
                }
            } else {
                selectionReason += ` -> [WARNING] Split Recommended (Density ${analysis.score})`;
            }
        } else if (analysis.type === 'downgrade_intensity') {
             // ... (Existing Downgrade logic)
             if (selectedTemplate === 'hero') {
                 selectedTemplate = 'diagram';
                 if (emotionalWeight > 8) {
                    selectionReason += ` -> [OVERRIDE] Downgraded 'hero' to 'diagram' (Grammar Rule: Density ${analysis.score}). High Emotion (${emotionalWeight}) requested Hero -> SPLIT SCENE TO RESTORE.`;
                 } else {
                    selectionReason += ` -> [OVERRIDE] Downgraded 'hero' to 'diagram' (Density ${analysis.score} > 4)`;
                 }
             }
        }
    } else {
         // Fallback to old heuristic if no script
        const density = intent.trace?.densityScore ?? 0;
        if (selectedTemplate === 'hero' && density > DENSITY_THRESHOLD_HIGH) {
            selectedTemplate = 'diagram'; 
            selectionReason += ` -> [OVERRIDE] Downgraded 'hero' to 'diagram' (Legacy Density ${density})`;
        }
        
        // Legacy Density Override
        if (density > DENSITY_THRESHOLD_HIGH && intent.pacing !== 'slow') {
             intent.pacing = 'slow';
             pacingAdjustment += ` -> [OVERRIDE] Forced 'slow' (Legacy Density ${density})`;
        }
    }
    
    // 5. Reveal Eligibility (STRICT RULES)
    const { pattern } = script ? Heuristics.normalizeIntent(script) : { pattern: 'unknown' as const };
    const densityScore = densityTrace?.score || 0;
    const revealStyle = getRevealStyle(emotionalWeight, densityScore, pattern);
    const revealReason = revealStyle === 'gradual' 
        ? `Reveal eligible: weight=${emotionalWeight >= 4 ? '✓' : '✗'} density=${densityScore >= 7 ? '✓' : '✗'} sequence=${pattern === 'progressive_steps' ? '✓' : '✗'}`
        : 'Instant (no reveal criteria met)';
    
    // 6. Reveal Strategy Resolution (AFTER pacing, BEFORE finalization)
    // This determines HOW content should be presented (narrative behavior, not animation)
    const revealDecision = RevealResolver.resolve({
        emotionalWeight,
        densityScore,
        pacing: intent.pacing || 'normal',
        strategy: selectedTemplate,
        recentHistory: intent.revealHistory || [] // Use provided history or empty
    });
    
    // 7. Emphasis Resolution (AFTER reveal, BEFORE finalization)
    // This determines perceptual hierarchy (priority, not animation)
    const emphasisDecision = EmphasisResolver.resolve({
        emotionalWeight,
        densityScore,
        revealStrategy: revealDecision.chosen,
        strategy: selectedTemplate,
        recentHistory: intent.emphasisHistory || [] // Use provided history or empty
    });

    // 8. Motion Behavior Resolution (AFTER emphasis, BEFORE finalization)
    // This determines motion philosophy (behavior, not animation)
    // CRITICAL: Motion is POST-RHYTHM conceptually, but we resolve per-scene with global context
    const motionDecision = BehaviorResolver.resolve({
        emotionalWeight,
        emotionalPolarity: BehaviorResolver.detectEmotionalPolarity(intent.type),
        density: densityScore,
        emphasis: emphasisDecision.level,
        strategy: selectedTemplate,
        intentType: intent.type,
        previousBehavior: intent.motionHistory?.[intent.motionHistory.length - 1],
        recentHistory: intent.motionHistory || [] // Use provided history or empty
    });

    // 9. Transition Intelligence Resolution (AFTER motion, BEFORE output)
    // Depends on motion decision and previous motion
    const transitionDecision = TransitionResolver.resolve({
        previousMotion: intent.motionHistory?.[intent.motionHistory.length - 1] || 'calm',
        currentMotion: motionDecision.behavior,
        density: densityScore,
        isPeak: emphasisDecision.level === 'strong' && emotionalWeight >= 7,
        previousTransition: intent.transitionHistory?.[intent.transitionHistory.length - 1],
        recentTransitions: intent.transitionHistory || []
    });

    // 10. Camera Intelligence Resolution (AFTER transitions, BEFORE finalization)
    // Determines framing intent (shot type)
    const cameraDecision = FramingEngine.determineShot({
        emotionalWeight,
        emphasis: emphasisDecision.level,
        density: densityScore,
        layout: selectedTemplate,
        rhythmPeak: emphasisDecision.level === 'strong' && emotionalWeight >= 7,
        motionBehavior: motionDecision.behavior,
        recentShots: intent.cameraHistory || []
    });

    
    // Augment trace with selection logic
    const finalTrace = {
        ...intent.trace,
        templateSelection: selectionReason,
        rejections: rejections,
        densityAnalysis: densityTrace,
        emotionalAnalysis: emotionalTrace,
        revealEligibility: {
            style: revealStyle,
            reason: revealReason,
            pattern: pattern
        },
        revealStrategy: revealDecision,
        emphasis: emphasisDecision,
        motionBehavior: motionDecision,
        transitionFromPrevious: transitionDecision,
        cameraShot: cameraDecision,

        pacing: {
            ...intent.trace?.pacing,
            // We might not have full pacing info here if DurationResolver runs elsewhere, 
            // but we can log the adjustment we made to the Intent.
            profile: intent.pacing || 'normal', // The "Requested" profile after adjustment
            reason: intent.trace?.pacing?.reason || "Default",
            baseDuration: intent.trace?.pacing?.baseDuration || 0,
            finalDuration: intent.trace?.pacing?.finalDuration || 0,
            emotionalAdjustment: pacingAdjustment || undefined
        }
    };
    
    // Fallback validation to prevent "undefined" error if import order is messed up
    const safeVersion = GRAMMAR_VERSION || "1.0";

    return {
      layout: selectedTemplate,
      role: intent.role,
      grammarVersion: safeVersion,
      trace: finalTrace,
      layers: [],
      warnings: []
    };
  },

  // "Correct by Construction": Only add layers if they satisfy the Contract
  addLayer: (scene: CompiledScene, layer: { id: string; type: string; position?: string; [key: string]: any }) => {
    const contract = PRIMITIVES[scene.layout];
    
    // 1. Check Layer Type
    if (!contract.allowedLayerTypes.includes(layer.type)) {
      console.warn(`[SceneFactory] Rejected layer '${layer.id}': Type '${layer.type}' is forbidden in '${scene.layout}'.`);
      return; 
    }

    // 2. Check Region (if explicit)
    if (typeof layer.position === 'string' && layer.position.includes('.')) {
      const region = layer.position.split('.')[1];
      if (!contract.allowedRegions.includes(region)) {
        console.warn(`[SceneFactory] Rejected layer '${layer.id}': Region '${region}' is not defined in '${scene.layout}'.`);
        return;
      }
    }

    // 3. Check Forbidden Pairs
    if (contract.forbiddenPairs) {
        const existingTypes = new Set(scene.layers.map(l => l.type));
        for (const [a, b] of contract.forbiddenPairs) {
            if ((layer.type === a && existingTypes.has(b)) || (layer.type === b && existingTypes.has(a))) {
                 console.warn(`[SceneFactory] Rejected layer '${layer.id}': Cannot mix '${layer.type}' with existing type in '${scene.layout}'.`);
                 return;
            }
        }
    }

    // 4. Check Max Per Type
    if (contract.maxPerType && contract.maxPerType[layer.type]) {
        const currentCount = scene.layers.filter(l => l.type === layer.type).length;
        if (currentCount >= contract.maxPerType[layer.type]) {
            console.warn(`[SceneFactory] Rejected layer '${layer.id}': Max limit (${contract.maxPerType[layer.type]}) reached for type '${layer.type}'.`);
            return;
        }
    }

    // 5. Check Max Primary Visuals
    // Primary Visuals = Heavy/Main elements
    const PRIMARY_TYPES = ['three', 'video', 'bar_chart', 'timeline', 'image', 'svg'];
    if (contract.maxPrimaryVisuals && PRIMARY_TYPES.includes(layer.type)) {
        const currentPrimaryCount = scene.layers.filter(l => PRIMARY_TYPES.includes(l.type)).length;
        if (currentPrimaryCount >= contract.maxPrimaryVisuals) {
            console.warn(`[SceneFactory] Rejected layer '${layer.id}': Scene allows only ${contract.maxPrimaryVisuals} primary visual.`);
            return;
        }
    }

    scene.layers.push(layer);
  },

  // Full Builder: Intent + Content -> Valid Scene
  buildScene: (intent: SceneIntent, payload: ContentPayload): CompiledScene => {
      const scene = SceneFactory.create(intent);

      // MAPPING STRATEGY pattern based on Layout
      switch (scene.layout) {
          case 'title':
              if (payload.primaryText) {
                  SceneFactory.addLayer(scene, { 
                      id: 'title_text', type: 'text', position: 'main', 
                      content: payload.primaryText, fontSize: 80 
                  });
              }
              if (payload.assetUrl) {
                  SceneFactory.addLayer(scene, {
                      id: 'title_logo', type: 'image', position: 'main',
                      src: payload.assetUrl
                  });
              }
              break;

          case 'hero':
              if (payload.assetUrl) {
                  SceneFactory.addLayer(scene, {
                      id: 'hero_model', type: 'three', position: 'hero.heroVisual',
                      model: payload.assetUrl
                  });
              }
              if (payload.primaryText) {
                  SceneFactory.addLayer(scene, {
                      id: 'hero_caption', type: 'text', position: 'hero.caption',
                      content: payload.primaryText, fontSize: 40
                  });
              }
              break;

          case 'data':
               if (payload.data && Array.isArray(payload.data)) {
                   SceneFactory.addLayer(scene, {
                       id: 'chart_main', type: 'bar_chart', position: 'chart',
                       data: payload.data
                   });
               } else if (payload.primaryText && payload.primaryText.match(/\d+/)) {
                   // Fallback: Text contains number -> Counter
                   SceneFactory.addLayer(scene, {
                       id: 'stat_counter', type: 'counter', position: 'counter',
                       value: parseInt(payload.primaryText.match(/\d+/)![0]),
                       label: payload.secondaryText || "Value"
                   });
               }
               break;

           case 'process':
               if (payload.items) {
                   SceneFactory.addLayer(scene, {
                       id: 'process_timeline', type: 'timeline', position: 'timeline',
                       steps: payload.items
                   });
               }
               break;

           case 'diagram':
               if (payload.assetUrl) {
                    SceneFactory.addLayer(scene, {
                        id: 'diagram_svg', type: 'svg', position: 'diagram.mainVisual',
                        src: payload.assetUrl
                    });
               }
               if (payload.primaryText) {
                   // Note: 'text' type is forbidden in strict Diagram. Must use Callout or Group.
                   // But let's try 'callout' which allows text content.
                   SceneFactory.addLayer(scene, {
                       id: 'diagram_note', type: 'callout', position: 'diagram.supporting',
                       text: payload.primaryText
                   });
               }
               break;
      }

      return scene;
  }
};
