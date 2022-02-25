import { GameFrameworkError } from "../../../../../GameFramework/Scripts/Base/GameFrameworkError";
import { Utility } from "../../../../../GameFramework/Scripts/Utility/Utility";
import { Element } from "./Element";

export enum MonsterType {
    JUNIOR_WIZARD = 125,
    SENIOR_WIZARD = 126,
    /** 魔法警卫 */
    MAGIC_GUARD = 130,
}

export interface MonsterInfo {
    hp: number;
    attack: number;
    defence: number;
    gold: number;
    name: string;
    id: string;
    boss: boolean;
    spriteId: number;
    firstAttack: boolean;
    extraDamage: number | null;
}

export class Monster extends Element {
    private _monsterInfo: MonsterInfo = null!;
    private _monsterMove: boolean = false;

    set id(value: number) {
        this._id = value;
        this._monsterInfo = Utility.Json.getJsonElement("monster", this._id, true) as MonsterInfo;
        if (!this._monsterInfo) {
            throw new GameFrameworkError("cant find monster info");
        }
    }

    get monsterInfo() {
        return this._monsterInfo;
    }

    set firstAttack(value: boolean) {
        this._monsterInfo.firstAttack = value;
    }

    get firstAttack(): boolean {
        return this._monsterInfo.firstAttack;
    }

    set monsterMove(value: boolean) {
        this._monsterMove = value;
    }

    get monsterMove(): boolean {
        return this._monsterMove;
    }

    get boss(): boolean {
        return this._monsterInfo!.boss;
    }

    hurt(damage: number) {
        this._monsterInfo.hp -= damage;
        if (this._monsterInfo.hp < 0) {
            this._monsterInfo.hp = 0;
        }
        return this._monsterInfo.hp == 0;
    }

    weak(ratio: number) {
        this._monsterInfo.attack *= ratio;
        this._monsterInfo.defence *= ratio;
        this._monsterInfo.hp *= ratio;
    }

    clear(): void {
        this._monsterInfo = null!;
    }
}
