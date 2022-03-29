import { ISoundManager } from "../../Sound/ISoundManager";
import { PlaySoundParams } from "../../Sound/PlaySoundParams";
import { SoundConstant } from "./SoundConstant";

/**
 * 声音工厂
 */
export class SoundFactory {
    private static _soundManager: ISoundManager = null!;
    private static _backgroundId: number = -1;

    static setSoundManager(soundManager: ISoundManager): void {
        this._soundManager = soundManager;
    }

    static async playBackgroundSound(soundAssetPath: string, playSoundParams?: PlaySoundParams): Promise<void> {
        this._backgroundId = await this._soundManager.playSound(soundAssetPath, SoundConstant.SOUND_BACKGROUND_GROUP, playSoundParams);
    }

    static resumeBackgroundSound() {
        this._soundManager.resumeSound(this._backgroundId);
    }

    static pauseBackgroundSound() {
        this._soundManager.pauseSound(this._backgroundId);
    }

    static stopBackgroundSound() {
        this._soundManager.stopSound(this._backgroundId);
    }

    static async playEffectSound(soundAssetPath: string, playSoundParams?: PlaySoundParams): Promise<number> {
        return await this._soundManager.playSound(soundAssetPath, SoundConstant.SOUND_EFFECT_GROUP, playSoundParams);
    }
}
