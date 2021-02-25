import { _decorator, Toggle } from "cc";
import BaseDialog from "../../Frame/Base/BaseDialog";

const { ccclass, property } = _decorator;

import { DataManager } from "../../Managers/DataManager";
import { SoundManager } from "../../Managers/SoundManager";

@ccclass("SettingDialog")
export default class SettingDialog extends BaseDialog {
    @property([Toggle])
    toogles: Toggle[] = [];
    onLoad() {
        //super.onLoad();
        //this.toogles[0].isChecked = DataManager.getMusicEnable();
        //this.toogles[1].isChecked = DataManager.getEffectsEnable();
        //this.toogles[2].isChecked = DataManager.getVibrateEnable();
    }
    protected onBgButtonClick() {
        //if (this.clickBgClose) {
        //this.onCloseBtnClick();
        //}
    }
    onCloseBtnClick() {
        //DataManager.saveGameConfig();
        //this.close();
    }
    onToogleClick(toggle: Toggle, customEventData: string) {
        //switch (parseInt(customEventData)) {
        //case 1:
        //DataManager.setMusicEnable(toggle.isChecked);
        //break;
        //case 2:
        //DataManager.setEffectsEnable(toggle.isChecked);
        //break;
        //case 3:
        //DataManager.setVibrateEnable(toggle.isChecked);
        //break;
        //}
        //SoundManager.loadMusicConfig(
        //DataManager.getMusicEnable(),
        //DataManager.getEffectsEnable()
        //);
    }
}

/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// import { DataManager } from "../../Managers/DataManager";
// import { SoundManager } from "../../Managers/SoundManager";
// import BaseDialog from "./BaseDialog";
//
// const { ccclass, property } = cc._decorator;
//
// @ccclass
// export default class SettingDialog extends BaseDialog {
//     @property([cc.Toggle])
//     toogles: cc.Toggle[] = [];
//
//     onLoad() {
//         super.onLoad();
//         this.toogles[0].isChecked = DataManager.getMusicEnable();
//         this.toogles[1].isChecked = DataManager.getEffectsEnable();
//         this.toogles[2].isChecked = DataManager.getVibrateEnable();
//     }
//
//     protected onBgButtonClick() {
//         if (this.clickBgClose) {
//             this.onCloseBtnClick();
//         }
//     }
//
//     onCloseBtnClick() {
//         DataManager.saveGameConfig();
//         this.close();
//     }
//
//     onToogleClick(toggle: cc.Toggle, customEventData: string) {
//         switch (parseInt(customEventData)) {
//             case 1:
//                 DataManager.setMusicEnable(toggle.isChecked);
//                 break;
//             case 2:
//                 DataManager.setEffectsEnable(toggle.isChecked);
//                 break;
//             case 3:
//                 DataManager.setVibrateEnable(toggle.isChecked);
//                 break;
//         }
//
//         SoundManager.loadMusicConfig(
//             DataManager.getMusicEnable(),
//             DataManager.getEffectsEnable()
//         );
//     }
// }
