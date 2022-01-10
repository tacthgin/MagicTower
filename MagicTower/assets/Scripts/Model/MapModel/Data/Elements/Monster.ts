import { Utility } from "../../../../../GameFramework/Scripts/Utility/Utility";
import { Element } from "./Element";

export enum MonsterType {
    JUNIOR_WIZARD = 125,
    SENIOR_WIZARD = 126,
    /** 魔法警卫 */
    MAGIC_GUARD = 130,
}

export class Monster extends Element {
    private _monsterInfo: any = null;

    set id(value: number) {
        this._id = value;
        this._monsterInfo = Utility.Json.getJsonElement("monster", this._id, true);
    }

    get monsterInfo() {
        return this._monsterInfo;
    }

    get firstAttack(): boolean {
        return this._monsterInfo.firstAttack;
    }

    get boss(): boolean {
        return this._monsterInfo.boss;
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
}
