import { SceneIntent } from './grammar-rules';
import { SceneFactory, CompiledScene } from './scene-factory';
import { validateCompiledScene } from './validator';

export const SceneCompiler = {
  /**
   * Pipeline: Intent -> Factory -> Validator -> Result
   */
  compile: (intents: SceneIntent[]): CompiledScene[] => {
    return intents.map(intent => {
      // 1. Factory Phase (Scaffolding)
      const scene = SceneFactory.create(intent);

      // 2. Content Injection Phase (Placeholder)
      // In a real AI flow, the AI would generate calls to SceneFactory.addLayer() here.
      // For now, we return the validated shell or populated scene.
      
      // 3. Validation Phase (The Police)
      try {
        validateCompiledScene(scene);
      } catch (e: any) {
        if (e.name === 'SceneValidationError') {
           scene.warnings.push(`CRITICAL: ${e.message}`);
        } else {
           throw e;
        }
      }

      return scene;
    });
  }
};
