import { ISoundManager } from "../../Script/Sound/ISoundManager";
import { PlaySoundParams } from "../../Script/Sound/PlaySoundParams";
import { SoundConstant } from "./SoundConstant";

/**
 * 声音工厂
 */
export class SoundFactory {
    private static _soundManager: ISoundManager = null!;
    private static _backgroundSoundId: number = -1;

    static setSoundManager(soundManager: ISoundManager): void {
        this._soundManager = soundManager;
    }

    /**
     * 播放背景音乐
     * @param soundAssetPath  声音资源路径
     * @param playSoundParams 声音播放参数
     */
    static async playBackgroundSound(soundAssetPath: string, playSoundParams?: PlaySoundParams): Promise<void> {
        if (this._backgroundSoundId != -1) {
            this.stopBackgroundSound();
        }
        if (!playSoundParams) {
            playSoundParams = PlaySoundParams.create(true);
        }
        this._backgroundSoundId = await this._soundManager.playSound(soundAssetPath, SoundConstant.SOUND_BACKGROUND_GROUP, playSoundParams);
    }

    /**
     * 恢复背景音乐
     */
    static resumeBackgroundSound() {
        this._soundManager.resumeSound(this._backgroundSoundId);
    }

    /**
     * 暂停背景音乐
     */
    static pauseBackgroundSound() {
        this._soundManager.pauseSound(this._backgroundSoundId);
    }

    /**
     * 停止背景音乐
     */
    static stopBackgroundSound() {
        this._soundManager.stopSound(this._backgroundSoundId);
        this._backgroundSoundId = -1;
    }

    /**
     * 播放声音特效
     * @param soundAssetPath  声音资源路径
     * @param playSoundParams 声音播放参数
     */
    static async playEffectSound(soundAssetPath: string, playSoundParams?: PlaySoundParams): Promise<number> {
        return await this._soundManager.playSound(soundAssetPath, SoundConstant.SOUND_EFFECT_GROUP, playSoundParams);
    }
}
