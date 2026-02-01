
import { validateCompiledScene } from './scene-compiler/validator';
import videoData from './data/video.json';

console.log('--- Verification Script for video.json ---');

let failureCount = 0;

videoData.scenes.forEach((scene: any) => {
    try {
        console.log(`Validating Scene ${scene.scene_id} (${scene.layout})...`);
        validateCompiledScene(scene);
        console.log(`Scene ${scene.scene_id} VALID.`);
    } catch (e: any) {
        console.error(`Scene ${scene.scene_id} FAILED:`);
        console.error(e.message);
        failureCount++;
    }
});

if (failureCount === 0) {
    console.log('ALL SCENES VALID.');
    process.exit(0);
} else {
    console.error(`Found ${failureCount} invalid scenes.`);
    process.exit(1);
}
