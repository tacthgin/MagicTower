import { _decorator, Component, Label, Sprite } from "cc";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { GameEvent } from "../../../Constant/GameEvent";
const { ccclass, property } = _decorator;

@ccclass("PropButton")
export class PropButton extends Component {
    private propInfo: any = null;

    init(propInfo: any) {
        this.propInfo = propInfo;
        this.getComponent(Sprite)!.spriteFrame = GameApp.ResourceManager.internalResourceLoader.getAsset(`Sprites/${propInfo.spriteId}`);
    }

    onPropButtonClick() {
        let info = null;
        if (this.propInfo.type == 9) {
            info = this.node.getChildByName("label")?.getComponent(Label)?.string == "上" ? "up" : "down";
        }
        NotifyCenter.emit(GameEvent.USE_PROP, this.propInfo, info);
    }

    setNum(num: number) {
        let label = this.node.getChildByName("label")!;
        if (num > 1) {
            label.getComponent(Label)!.string = num.toString();
            label.active = true;
        } else {
            label.active = false;
        }
    }
}
