import { Sprite, _decorator } from "cc";
import { GameManager } from "../../../Framework/Managers/GameManager";
import { MapElement } from "./MapElement";
const { ccclass } = _decorator;

@ccclass("Prop")
export class Prop extends MapElement {
    private _propInfo: any = null;
    get id() {
        return this._propInfo.id;
    }
    get propInfo() {
        return this._propInfo;
    }
    init(id: number) {
        this._propInfo = GameManager.DATA.getJsonElement("prop", id);
        this.getComponent(Sprite).spriteFrame = GameManager.RESOURCE.getSpriteFrame(this._propInfo.spriteId);
    }
}
