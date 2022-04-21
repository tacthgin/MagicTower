import { AudioClip, Component, JsonAsset, Label, Prefab, SpriteFrame, TiledMapAsset, _decorator } from "cc";
import { GameApp } from "../../../GameFramework/Scripts/Application/GameApp";
import { Utility } from "../../../GameFramework/Scripts/Utility/Utility";

const { ccclass, property } = _decorator;

@ccclass("LoginScene")
export class LoginScene extends Component {
    @property(Label)
    private progressLabel: Label = null!;

    private progress: number = 0;

    async start() {
        await this.loadResources();
        GameApp.instance.initModels();
        this.gotoGameScene();
    }

    private async loadResources() {
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

        //单独加载json
        let info = resouceInfos[0];
        let step = 1 / resouceInfos.length;
        await GameApp.ResourceManager.loadDirWithCallback(info.path, info.assetType as any, (finished: number, total: number, item: any) => {
            let progress = finished / total;
            this.setProgress(progress, 1);
            Utility.Json.addJson(item.file._name, item.file);
        });

        for (let i = 1; i < resouceInfos.length; i++) {
            info = resouceInfos[i];
            step = (i + 1) / resouceInfos.length;
            await GameApp.ResourceManager.loadDirWithCallback(info.path, info.assetType as any, (finished: number, total: number, item: any) => {
                let progress = finished / total;
                this.setProgress(progress, step);
            });
        }
    }

    private gotoGameScene() {
        GameApp.SceneManager.loadScene("GameScene");
    }

    private setProgress(progress: number, step: number) {
        if (progress > this.progress) {
            this.progress = progress * step;
            this.progressLabel.string = `${(this.progress * 100).toFixed(2)}%`;
        }
    }
}
