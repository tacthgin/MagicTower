import { ModelBase } from "../../../GameFramework/Scripts/Application/Model/ModelBase";
import { ModelContainer } from "../../../GameFramework/Scripts/Application/Model/ModelContainer";
import { Utility } from "../../../GameFramework/Scripts/Utility/Utility";

@ModelContainer.registerModel("ShopModel")
export class ShopModel extends ModelBase {
    private _beginGold: number = 0;
    private _hp: number = 0;
    private _attack: number = 0;
    private _defence: number = 0;
    private _count: number = 0;
    private _ratio: number = 0;
    private _level: number = 0;

    get needGold() {
        return this._beginGold + this._ratio * this._count;
    }

    get buyCount() {
        return this._count;
    }

    set level(value: number) {
        this._level = Math.floor(value / 10);
    }

    get level(): number {
        return this._level;
    }

    get hp() {
        return (this._count + 1) * this._hp;
    }

    get attack() {
        return (this.level + 1) * this._attack;
    }

    get defence() {
        return (this.level + 1) * this._defence;
    }

    buy() {
        this._beginGold = this.needGold;
        this._count += 1;
        return this._beginGold;
    }

    onLoad(data: any = null) {
        if (!data) {
            data = Utility.Json.getJsonElement("global", "shop");
            for (let key in data) {
                (this as any)[`_${key}`] = data[key];
            }
        } else {
            this.loadData(data);
        }
    }
}
