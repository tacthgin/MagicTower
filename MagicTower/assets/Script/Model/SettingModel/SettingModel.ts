import { GameApp } from "../../../GameFramework/Application/GameApp";
import { SoundConstant } from "../../../GameFramework/Application/Sound/SoundConstant";
import { SoundFactory } from "../../../GameFramework/Application/Sound/SoundFactory";
import { ModelBase } from "../../../GameFramework/Script/MVC/Model/ModelBase";
import { ModelManager } from "../../../GameFramework/Script/MVC/Model/ModelManager";

@ModelManager.registerModel("SettingModel")
export class SettingModel extends ModelBase {
    @ModelBase.saveMark
    private _musicEnabled: boolean = true;
    @ModelBase.saveMark
    private _effectEnabled: boolean = true;

    set musicEnabled(enabled: boolean) {
        if (this._musicEnabled === enabled) return;
        this._musicEnabled = enabled;
        if (this._musicEnabled) {
            SoundFactory.resumeBackgroundSound();
        } else {
            SoundFactory.pauseBackgroundSound();
        }
    }

    get musicEnabled(): boolean {
        return this._musicEnabled;
    }

    set efectEnabled(enabled: boolean) {
        if (this._effectEnabled == enabled) return;
        this._effectEnabled = enabled;
        let effectSoundGroup = GameApp.SoundManager.getSoundGroup(SoundConstant.SOUND_EFFECT_GROUP);
        if (!effectSoundGroup) return;
        effectSoundGroup.mute = !this._effectEnabled;
    }

    get effectEnabled(): boolean {
        return this._effectEnabled;
    }

    protected onLoad(data: object | null = null): void {
        if (data) {
            this.loadData(data);
        }
    }
}
