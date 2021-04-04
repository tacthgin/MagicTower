import { AudioClip, Component, _decorator } from "cc";
import { BaseEvent } from "../Frame/Constant/BaseContant";
import { GameManager } from "../Frame/Managers/GameManager";
import { NotifyCenter } from "../Frame/Managers/NotifyCenter";
import { JsonParserMap } from "./Constant/JsonParserMap";

const { ccclass, property } = _decorator;

@ccclass("LoginScene")
export default class LoginScene extends Component {
    onLoad() {
        NotifyCenter.on(BaseEvent.ALL_RESOURCES_LOAD_SUCCESS, this.onAllResourcesLoadSuccess, this);
        NotifyCenter.on(BaseEvent.RESOURCE_PROGRESS, this.onResouceProgress);
    }

    start() {
        GameManager.DATA.setParserMap(JsonParserMap);
        GameManager.RESOURCE.loadResources();
    }

    onAllResourcesLoadSuccess() {
        this.gotoGameScene();
    }

    onResouceProgress() {}

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
    }
}
