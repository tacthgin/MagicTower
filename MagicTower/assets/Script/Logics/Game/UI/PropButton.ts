import { _decorator, Component, Label, Sprite } from "cc";
import { GameApp } from "../../../../GameFramework/Application/GameApp";
import { PropInfo, PropType } from "../../../Model/HeroModel/Prop";
import { UsePropEventArgs } from "../../Event/UsePropEventArgs";
import { ElementFactory } from "../Map/ElementFactory";

const { ccclass, property } = _decorator;

@ccclass("PropButton")
export class PropButton extends Component {
    private propInfo: PropInfo = null!;

    init(propInfo: PropInfo) {
        this.propInfo = propInfo;
        this.getComponent(Sprite)!.spriteFrame = ElementFactory.getElementSpriteFrame(`${propInfo.spriteId}`);
    }

    onPropButtonClick() {
        let info: string = "";
        if (this.propInfo.type == PropType.FLYING_WAND) {
            info = this.node.getChildByName("label")?.getComponent(Label)?.string == "上" ? "up" : "down";
        }
        GameApp.EventManager.fireNow(this, UsePropEventArgs.create(this.propInfo, info));
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
