import { _decorator, Animation, SpriteFrame, Sprite, AnimationClip } from "cc";
import { GameManager } from "../../../Framework/Managers/GameManager";
import { NotifyCenter } from "../../../Framework/Managers/NotifyCenter";
import { GameEvent } from "../../Constant/GameEvent";
import { MapElement } from "./Base/MapElement";

const { ccclass, property } = _decorator;

@ccclass("Door")
export class Door extends MapElement {
    private doorInfo: any = null;
    /** 被动的墙 */
    private _passive: boolean = false;
    /** 点击出现的墙 */
    private _appear: boolean = false;
    /** 隐藏的墙 */
    private _hide: boolean = false;
    /** 开门条件 */
    private _condition: boolean = null;

    get id() {
        return this.doorInfo.id;
    }

    set passive(value: boolean) {
        this._passive = value;
    }

    get passive() {
        return this._passive;
    }

    set appear(value: boolean) {
        this.node.active = false;
        this._appear = value;
    }

    get appear() {
        return this._appear;
    }

    set hide(value: boolean) {
        this.node.active = false;
        this._hide = value;
    }

    get hide() {
        return this._hide;
    }

    set condition(value: boolean) {
        this._condition = value;
    }

    get condition() {
        return this._condition;
    }

    onLoad() {
        this.animation = this.getComponent(Animation);
        this.animation.on(Animation.EventType.FINISHED, this.onFinished, this);
    }

    init(id: number) {
        this._passive = false;
        this._appear = false;
        this._hide = false;
        this.doorInfo = GameManager.DATA.getJsonElement("door", id);
        this.getComponent(Sprite).spriteFrame = GameManager.RESOURCE.getSpriteFrame(`${this.doorInfo.spriteId}_0`);
        this.createAnimation(this.doorInfo.spriteId, this.doorInfo.spriteId, 4, AnimationClip.WrapMode.Normal, false, 17);
        this.createAnimation(`${this.doorInfo.spriteId}_reverse`, this.doorInfo.spriteId, 4, AnimationClip.WrapMode.Normal, true, 17);
    }

    private onFinished() {
        if (this.animation.defaultClip.name != `${this.doorInfo.spriteId}_reverse`) {
            super.remove(true);
            if (!this._passive) {
                NotifyCenter.emit(GameEvent.ELEMENT_ACTION_COMPLETE);
            }
        } else if (this._hide) {
            this._hide = false;
            NotifyCenter.emit(GameEvent.ELEMENT_ACTION_COMPLETE);
        }
    }

    private playAnimation(reverse: boolean) {
        let name = reverse ? `${this.doorInfo.spriteId}_reverse` : this.doorInfo.spriteId;
        this.animation.play(name);
    }

    add() {
        this.node.active = true;
        this.playAnimation(true);
    }

    remove() {
        this.playAnimation(false);
    }

    canWallOpen() {
        return !this._passive && this.doorInfo.id == 1006 && !this._appear && !this._condition;
    }

    isYellow() {
        return this.doorInfo.id == 1001;
    }
}
