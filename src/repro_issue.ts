
import { SceneFactory } from './scene-compiler/scene-factory';
import { validateCompiledScene } from './scene-compiler/validator';
import { GRAMMAR_VERSION } from './scene-compiler/grammar-rules';

console.log('--- Reproduction Script ---');
console.log('Imported GRAMMAR_VERSION:', GRAMMAR_VERSION);

const intent = {
    type: 'context_setting' as const,
    role: 'context' as const
};

console.log('Creating scene with intent:', intent);
const scene = SceneFactory.create(intent);

console.log('Scene created.');
console.log('Scene GRAMMAR_VERSION:', scene.grammarVersion);

try {
    console.log('Validating scene...');
    validateCompiledScene(scene);
    console.log('Validation successful!');
} catch (e: any) {
    console.error('Caught validation error:');
    console.error(e.message);
}
