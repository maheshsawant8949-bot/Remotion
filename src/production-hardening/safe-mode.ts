
/**
 * Safe Mode Configuration
 * 
 * When uncertainty rises → system self-stabilizes.
 */

export type OperationMode = 'normal' | 'conservative';

export interface HardeningConfig {
  mode: OperationMode;
  maxMotionIntensity: 'energetic' | 'assertive' | 'calm';
  allowCameraMovement: boolean;
  allowMicroInteractions: boolean;
  preferredTransition: 'cut' | 'mix'; // cut = instant, mix = standard
}

export class SafeMode {
  private static currentMode: OperationMode = 'normal';

  static setMode(mode: OperationMode) {
    this.currentMode = mode;
    if (mode === 'conservative') {
      console.log('🛡️  SAFE MODE ACTIVATED: System stabilizing...');
    }
  }

  static getConfig(): HardeningConfig {
    if (this.currentMode === 'conservative') {
      return {
        mode: 'conservative',
        maxMotionIntensity: 'calm',
        allowCameraMovement: false, // Static camera
        allowMicroInteractions: false,
        preferredTransition: 'cut' // Simple cuts
      };
    }

    return {
      mode: 'normal',
      maxMotionIntensity: 'energetic',
      allowCameraMovement: true,
      allowMicroInteractions: true,
      preferredTransition: 'mix'
    };
  }
}
