require('ts-node').register();
const { SceneFactory } = require('../src/scene-compiler/scene-factory');
console.log('Imported SceneFactory');

try {
    const scene = SceneFactory.create({ type: 'context_setting' });
    console.log('Scene Created');
    console.log('Trace keys:', Object.keys(scene.trace || {}));
    if (scene.trace && scene.trace.cameraShot) {
        console.log('CameraShot found:', scene.trace.cameraShot);
    } else {
        console.log('CameraShot MISSING');
    }
} catch (e) {
    console.error(e);
}
