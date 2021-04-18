import { _decorator, Animation, Vec2, Sprite, SpriteFrame } from "cc";
import { GameManager } from "../../../Framework/Managers/GameManager";
import { MapElement } from "./MapElement";
const { ccclass } = _decorator;

@ccclass("Npc")
export class Npc extends MapElement {
    private _npcInfo: any = null;
    private stepIndex: number = 0;
    private moveIndex: number = 0;
    private animation: Animation | null = null;
    private globalInfo: any = null;

    get npcInfo() {
        return this._npcInfo;
    }

    get onceStep() {
        return this._npcInfo.talk.length == 1;
    }

    onLoad() {
        this.animation = this.getComponent(Animation);
        this.globalInfo = GameManager.DATA.getJson("global");
    }

    init(id: number) {
        this._npcInfo = GameManager.DATA.getJsonElement("npc", id, true);
        this.getComponent(Sprite).spriteFrame = GameManager.RESOURCE.getSpriteFrame(`${this._npcInfo.spriteId}_0`);
        this.createAnimation(this._npcInfo.spriteId);
        this.stepIndex = 0;
        this.moveIndex = 0;
        this.animation.play(this._npcInfo.spriteId);
    }

    protected createAnimationClip(reverse: boolean): SpriteFrame[] {
        let spriteFrames = [];
        for (let i = 0; i < 2; i++) {
            spriteFrames.push(GameManager.RESOURCE.getSpriteFrame(`${this._npcInfo.spriteId}_${i}`));
        }
        return spriteFrames;
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

    movePath(path: Vec2[]) {
        return new Promise((resolve) => {
            let moveActions = [];
            path.forEach((position) => {
                moveActions.push(cc.moveTo(this.globalInfo.npcSpeed, position));
            });
            moveActions.push(
                cc.callFunc(() => {
                    resolve();
                })
            );
            this.node.runAction(cc.sequence(moveActions));
        });
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
