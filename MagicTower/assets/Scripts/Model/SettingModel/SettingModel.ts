import { GameApp } from "../../../GameFramework/Scripts/Application/GameApp";
import { ModelBase } from "../../../GameFramework/Scripts/Application/Model/ModelBase";
import { ModelContainer } from "../../../GameFramework/Scripts/Application/Model/ModelContainer";
import { saveMark } from "../../../GameFramework/Scripts/Application/Model/ModelDecorator";
import { SoundConstant } from "../../../GameFramework/Scripts/Application/Sound/SoundConstant";
import { SoundFactory } from "../../../GameFramework/Scripts/Application/Sound/SoundFactory";

@ModelContainer.registerModel("SettingModel")
export class SettingModel extends ModelBase {
    @saveMark
    private _musicEnabled: boolean = true;
    @saveMark
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

    load(data: object | null = null): void {
        if (data) {
            this.loadData(data);
        }
    }
}
