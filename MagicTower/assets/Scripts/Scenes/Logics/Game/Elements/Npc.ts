import { Animation, Sprite, _decorator } from "cc";
import { GameManager } from "../../../Framework/Managers/GameManager";
import { Actor } from "./Base/Actor";

const { ccclass } = _decorator;

@ccclass("Npc")
export class Npc extends Actor {
    private _npcInfo: any = null;
    private stepIndex: number = 0;
    private moveIndex: number = 0;

    get npcInfo() {
        return this._npcInfo;
    }

    get onceStep() {
        return this._npcInfo.talk.length == 1;
    }

    onLoad() {
        this.animation = this.getComponent(Animation);
    }

    init(id: number) {
        this._npcInfo = GameManager.DATA.getJsonElement("npc", id, true);
        this.getComponent(Sprite).spriteFrame = GameManager.RESOURCE.getSpriteFrame(`${this._npcInfo.spriteId}_0`);
        this.createAnimation(this._npcInfo.spriteId, this._npcInfo.spriteId, 2);
        this.stepIndex = 0;
        this.moveIndex = 0;
        this.animation.play(this._npcInfo.spriteId);
    }

    talk() {
        if (this._npcInfo.eventTalk) {
            return { talk: this._npcInfo.eventTalk, index: "event" };
        }
        return { talk: this._npcInfo.talk[this.stepIndex], index: this.stepIndex };
    }

    nextTalk() {
        if (!this._npcInfo.unlimit) {
            ++this.stepIndex;
        }
    }

    move() {
        if (this._npcInfo.move) {
            return this._npcInfo.move[this.moveIndex++] || null;
        }
        return null;
    }

    getWallIndex() {
        if (this._npcInfo.wall) {
            return this._npcInfo.wall[this.moveIndex] || null;
        }
        return null;
    }

    talkEnd() {
        return this.stepIndex >= this._npcInfo.talk.length;
    }

    moveEnd() {
        if (this._npcInfo.move) {
            return this.moveIndex >= this._npcInfo.move.length;
        }
        return false;
    }

    consumeProp() {
        if (this._npcInfo.unlimit) return;
        if (this._npcInfo.value.prop) {
            this._npcInfo.value.prop = null;
        }
        if (this._npcInfo.value.hp) {
            this._npcInfo.value.hp = null;
        }
    }

    canTrade() {
        return this._npcInfo.value && (this._npcInfo.value.prop || this._npcInfo.value.hp);
    }

    clearEvent() {
        this._npcInfo.eventTalk = null;
    }
}
