import { GameFrameworkError } from "../../../../../GameFramework/Scripts/Base/GameFrameworkError";
import { Utility } from "../../../../../GameFramework/Scripts/Utility/Utility";
import { Element } from "./Element";

export interface NpcInfo {
    id: string;
    type: number;
    spriteId: string;
    value: any;
    desc: string;
    wall: number[];
    move: number[];
    talk: string[];
    unlimit: boolean;
    eventTalk: string | null;
    event: number;
}

export class Npc extends Element {
    private _npcInfo: NpcInfo = null!;
    private stepIndex: number = 0;
    private moveIndex: number = 0;

    set id(value: number) {
        this._id = value;
        this._npcInfo = Utility.Json.getJsonElement("npc", this._id, true) as NpcInfo;
        if (!this._npcInfo) {
            throw new GameFrameworkError("cant find npc info");
        }
    }

    get npcInfo(): NpcInfo {
        return this._npcInfo;
    }

    get onceStep() {
        return this._npcInfo.talk.length == 1;
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

    static parse(propertiesInfo: any, tiles: number[] | null = null, parseGidFn: Function | null = null): any {
        let npcInfos: any = {};
        for (let key in propertiesInfo) {
            let npc = new Npc();
            npc.id = parseInt(propertiesInfo[key]);
            npc.index = parseInt(key);
            npcInfos[key] = npc;
        }
        return npcInfos;
    }
}
