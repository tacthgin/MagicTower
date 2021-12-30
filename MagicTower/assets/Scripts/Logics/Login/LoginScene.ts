import { Component, Label, SpriteFrame, _decorator } from "cc";
import { ElementManager } from "../Game/Map/ElementManager";

const { ccclass, property } = _decorator;

@ccclass("LoginScene")
export class LoginScene extends Component {
    @property(Label)
    private progressLabel: Label = null!;

    onLoad() {
       
    }

    start() {
       
    }

    gotoGameScene() {
        ElementManager.getInstance().loadAsset();
        //GameManager.getInstance().loadScene("GameScene");
    }
}
