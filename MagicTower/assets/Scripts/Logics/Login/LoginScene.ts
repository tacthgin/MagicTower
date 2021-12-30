import { AudioClip, Component, director, JsonAsset, Label, SpriteFrame, _decorator } from "cc";
import { GameApp } from "../../../GameFramework/Scripts/Application/GameApp";
import { Utility } from "../../../GameFramework/Scripts/Utility/Utility";

const { ccclass, property } = _decorator;

@ccclass("LoginScene")
export class LoginScene extends Component {
    @property(Label)
    private progressLabel: Label = null!;

    onLoad() {}

    async start() {
        await this.loadResources();
        this.gotoGameScene();
    }

    async loadResources() {
        Utility.Json.setJsonDirPath("Json");
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
            await GameApp.ResourceManager.internalResourceLoader.loadDirWithCallback(info.path, info.assetType as any, (finished: number, total: number) => {
                this.progressLabel.string = `${(finished / total) * step * 100}%`;
            });
        }
    }

    gotoGameScene() {
        director.loadScene("GameScene");
    }
}
