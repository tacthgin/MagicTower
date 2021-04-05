import { Component, director, Label, _decorator } from "cc";
import { BaseData } from "../Frame/Base/BaseData";
import { BaseEvent } from "../Frame/Constant/BaseContant";
import { GameManager } from "../Frame/Managers/GameManager";
import { NotifyCenter } from "../Frame/Managers/NotifyCenter";
import { ResourceType } from "../Frame/Managers/ResourceManager";
import { JsonParserMap } from "./Constant/JsonParserMap";
import { HeroData } from "./Data/CustomData/HeroData";

const { ccclass, property } = _decorator;

@ccclass("LoginScene")
export default class LoginScene extends Component {
    @property(Label)
    private progressLabel: Label = null;

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

    onResouceProgress(type: ResourceType, progress: number) {
        this.progressLabel.string = `资源加载中，${progress}...`;
    }

    gotoGameScene() {
        //ElementManager.loadRes((success: boolean) => {
        //cc.director.preloadScene("GameScene", null, (error: Error, asset: cc.SceneAsset) => {
        //if (error) {
        //cc.error(error.message);
        //return;
        //}
        //cc.director.loadScene("GameScene");
        //});
        //});
        director.loadScene("GameScene");
    }
}
