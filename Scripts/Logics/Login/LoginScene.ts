import { AudioClip, Component, JsonAsset, Label, SpriteFrame, _decorator } from "cc";
import { GameApp } from "../../../GameFramework/Scripts/Application/GameApp";
import { GameFrameworkLog } from "../../../GameFramework/Scripts/Base/Log/GameFrameworkLog";

const { ccclass, property } = _decorator;

@ccclass("LoginScene")
export class LoginScene extends Component {
    @property(Label)
    private progressLabel: Label = null!;

    onLoad() {}

    start() {
        this.loadResources();
    }

    async loadResources() {
        let resouceInfos = [
            {
                path: "Json",
                assetType: JsonAsset,
            },
            {
                path: "Sound",
                assetType: AudioClip,
            },
            {
                path: "Sprites",
                assetType: SpriteFrame,
            },
        ];

        for (let i = 0; i < resouceInfos.length; i++) {
            let info = resouceInfos[i];
            let step = (i + 1) / resouceInfos.length;
            await GameApp.ResourceManager.internalResourceLoader.loadAssetWithCallback(info.path, info.assetType as any, (finished: number, total: number) => {
                this.progressLabel.string = `${(finished / total) * step * 100}%`;
                GameFrameworkLog.log(info.path, this.progressLabel.string);
            });
        }
    }

    gotoGameScene() {}
}
