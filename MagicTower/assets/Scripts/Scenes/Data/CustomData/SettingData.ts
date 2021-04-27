import { BaseData } from "../../../Framework/Base/BaseData";
import { GameManager } from "../../../Framework/Managers/GameManager";

export class SettingData extends BaseData {
    protected data = { music: true, effect: true };

    load(data: any): void {
        if (data) {
            this.loadData(data);
        }
        this.setProxy();
    }

    setMusicEnabled(enabled: boolean) {
        this.data.music = enabled;
        GameManager.AUDIO.musicEnabled = enabled;
    }

    setEffectEnabled(enabled: boolean) {
        this.data.effect = enabled;
        GameManager.AUDIO.effectEnabled = enabled;
    }
}
