import { Asset, AudioClip, Component, JsonAsset, Label, Prefab, SpriteFrame, sys, TiledMapAsset, _decorator } from "cc";
import { GameApp } from "../../../GameFramework/Application/GameApp";
import { Utility } from "../../../GameFramework/Script/Utility/Utility";

const { ccclass, property } = _decorator;

@ccclass("LoginScene")
export class LoginScene extends Component {
    @property(Label)
    private progressLabel: Label = null!;
    @property(Label)
    private descLabel: Label = null!;
    @property(Asset)
    private manifestAsset: Asset = null!;

    private progress: number = 0;

    start() {
        this.initHotUpdate();
    }

    private initHotUpdate() {
        this.descLabel.string = "检测更新...";
        GameApp.ResourceManager.setHotUpdateCallback(this.onUpdateFail.bind(this), this.onUpdateComplete.bind(this));
        GameApp.ResourceManager.startHotUpdate(this.manifestAsset ? this.manifestAsset.nativeUrl : "");
    }

    private onUpdateFail() {}

    private onUpdateComplete(restart: boolean) {
        if (restart) {
            //重启虚拟机
            sys.restartVM();
            //重启游戏
            //game.restart();
        } else {
            this.initGame();
        }
    }

    private async initGame() {
        await this.loadResources();
        GameApp.instance.initModels();
        this.gotoGameScene();
    }

    private retryUpdate() {}

    private async loadResources() {
        let resouceInfos = [
            {
                path: "Json",
                assetType: JsonAsset,
                completeCallback: (err: Error | null, data: any[]) => {
                    if (!err) {
                        data.forEach((jsonAsset) => {
                            Utility.Json.addJson(jsonAsset.name, jsonAsset.json);
                        });
                    }
                },
            },
            {
                path: "Sound",
                assetType: AudioClip,
            },
        ];

        for (let i = 0; i < resouceInfos.length; i++) {
            let info = resouceInfos[i];
            let step = (i + 1) / resouceInfos.length;
            await GameApp.ResourceManager.loadDirWithCallback(
                info.path,
                info.assetType as any,
                (finished: number, total: number) => {
                    let progress = finished / total;
                    this.setProgress(progress, step);
                },
                resouceInfos[i].completeCallback
            );
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
