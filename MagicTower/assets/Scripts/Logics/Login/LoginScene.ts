import { AudioClip, Component, director, JsonAsset, Label, Prefab, SpriteFrame, TiledMapAsset, _decorator } from "cc";
import { GameApp } from "../../../GameFramework/Scripts/Application/GameApp";
import { UIConstant } from "../../../GameFramework/Scripts/Application/UI/UIConstant";
import { Utility } from "../../../GameFramework/Scripts/Utility/Utility";
import { ElementFactory } from "../Game/Map/ElementFactory";

const { ccclass, property } = _decorator;

@ccclass("LoginScene")
export class LoginScene extends Component {
    @property(Label)
    private progressLabel: Label = null!;

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
                this.progressLabel.string = `${((finished / total) * step * 100).toFixed(2)}%`;
            });
        }
    }

    gotoGameScene() {
        //director.loadScene("GameScene");
        GameApp.UIManager.openUIForm("Prefab/Dialogs/ChatDialog", UIConstant.DIALOG_LAYER_GROUP, false, {
            content: "hhahahaha",
            endCallback: () => {},
        });
    }
}
