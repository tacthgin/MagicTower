import { BaseData } from "../../../Framework/Base/BaseData";
import { GameManager } from "../../../Framework/Managers/GameManager";
import { Fn } from "../../../Framework/Util/Fn";

class _ShopData {
    public beginGold: number = 0;
    public hp: number = 0;
    public attack: number = 0;
    public defence: number = 0;
    public count: number = 0;
    public ratio: number = 0;
    public level: number = 0;

    load(data: any) {
        for (let key in data) {
            this[key] = data[key];
        }
    }
}

@Fn.registerClass("ShopData")
export class ShopData extends BaseData {
    protected data: _ShopData = new _ShopData();

    get needGold() {
        return this.data.beginGold + this.data.ratio * this.data.count;
    }

    get buyCount() {
        return this.data.count;
    }

    set level(value: number) {
        this.data.level = Math.floor(value / 10);
    }

    get hp() {
        return (this.data.count + 1) * this.data.hp;
    }

    get attack() {
        return (this.data.level + 1) * this.data.attack;
    }

    get defence() {
        return (this.data.level + 1) * this.data.defence;
    }

    buy() {
        this.data.beginGold = this.needGold;
        this.data.count += 1;
        return this.data.beginGold;
    }

    load(data: any = null) {
        if (data) {
            this.data.load(data);
        } else {
            this.data.load(GameManager.DATA.getJsonElement("global", "shop"));
        }
        this.data = this.createProxy(this.data);
    }
}
