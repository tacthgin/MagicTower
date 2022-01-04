import { GameApp } from "../../GameFramework/Scripts/Application/GameApp";
import { ModelBase } from "../../GameFramework/Scripts/Application/Model/ModelBase";
import { ModelContainer } from "../../GameFramework/Scripts/Application/Model/ModelContainer";

@ModelContainer.registerModel("SettingModel")
export class SettingModel extends ModelBase {
    private musicEnabled: boolean = true;
    private effectEnabled: boolean = true;

    load(data: object | null = null): void {
        if (data) {
            this.loadData(data);
        }
    }

    setMusicEnabled(enabled: boolean) {
        if (this.musicEnabled === enabled) return;
        this.musicEnabled = enabled;
        GameApp.SoundManager.pauseSound(GameApp.SoundManager.backgroundSerialId);
    }

    setEffectEnabled(enabled: boolean) {
        if (this.effectEnabled == enabled) return;
        this.effectEnabled = enabled;
        GameApp.SoundManager.stopAllSoundsExceptBackground();
    }
}
