import { AudioClip, Component, JsonAsset, Label, Prefab, SpriteFrame, TiledMapAsset, _decorator } from "cc";
import { GameApp } from "../../../GameFramework/Scripts/Application/GameApp";
import { Utility } from "../../../GameFramework/Scripts/Utility/Utility";

const { ccclass, property } = _decorator;

@ccclass("LoginScene")
export class LoginScene extends Component {
    @property(Label)
    private progressLabel: Label = null!;

    private progress: number = 0;

    onLoad() {}

    async start() {
        await this.loadResources();
        GameApp.instance.loadLocalModel();
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
                path: "Sprite",
                assetType: SpriteFrame,
            },
            {
                path: "Prefab/Elements",
                assetType: Prefab,
            },
            {
                path: "TiledMap",
                assetType: TiledMapAsset,
            },
        ];

        for (let i = 0; i < resouceInfos.length; i++) {
            let info = resouceInfos[i];
            let step = (i + 1) / resouceInfos.length;
            await GameApp.ResourceManager.loadDirWithCallback(info.path, info.assetType as any, (finished: number, total: number) => {
                let progress = finished / total;
                if (progress > this.progress) {
                    this.progress = progress * step;
                    this.progressLabel.string = `${(this.progress * 100).toFixed(2)}%`;
                }
            });
        }
    }

    gotoGameScene() {
        GameApp.SceneManager.loadScene("GameScene");
    }
}
