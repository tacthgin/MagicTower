import { Component, Label, Sprite, _decorator } from "cc";
import { BaseEvent } from "../../../Framework/Base/BaseContant";
import { BasePoolNode } from "../../../Framework/Base/BasePoolNode";
import { GameManager } from "../../../Framework/Managers/GameManager";
import { NotifyCenter } from "../../../Framework/Managers/NotifyCenter";
import { JsonParserMap } from "../../Constant/JsonParserMap";

const { ccclass, property } = _decorator;

@ccclass("LoginScene")
export class LoginScene extends Component {
    @property(Label)
    private progressLabel: Label = null!;

    @property(Sprite)
    private sprite1: Sprite = null!;

    @property(Sprite)
    private sprite2: Sprite = null!;

    onLoad() {
        NotifyCenter.on(BaseEvent.ALL_RESOURCES_LOAD_SUCCESS, this.onAllResourcesLoadSuccess, this);
        NotifyCenter.on(BaseEvent.RESOURCE_PROGRESS, this.onResouceProgress, this);
    }

    start() {
        GameManager.DATA.setParserMap(JsonParserMap);
        GameManager.RESOURCE.loadResources();
    }

    onAllResourcesLoadSuccess() {
        GameManager.DATA.loadLocalStorage();
        this.gotoGameScene();
    }

    onResouceProgress(type: string, progress: number) {
        this.progressLabel.string = `资源加载中，${(progress * 100).toFixed(2)}%...`;
    }

    async gotoGameScene() {
        await GameManager.RESOURCE.loadPrefabDir("Elements");
        let test = await GameManager.POOL.createPoolNode("Prefabs/Elements/Test", null, true);
        if (test) {
            test.parent = this.node;
            test.getComponent(BasePoolNode)?.remove();
            this.scheduleOnce(async () => {
                test = await GameManager.POOL.createPoolNode("Prefabs/Elements/Test", null, true);
                if (test) {
                    test.parent = this.node;
                }
            }, 1);
        }

        //GameManager.getInstance().loadScene("GameScene");
    }
}
