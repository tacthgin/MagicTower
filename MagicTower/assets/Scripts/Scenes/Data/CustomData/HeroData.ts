import { BaseData } from "../../../Framework/Base/BaseData";
import { GameManager } from "../../../Framework/Managers/GameManager";
import { Fn } from "../../../Framework/Util/Fn";
import { Util } from "../../../Framework/Util/Util";

export enum HeroAttr {
    HP,
    ATTACK,
    DEFENCE,
    GOLD,
}

export enum PropType {
    SWARD = 5,
    SHIELD,
    /** 神圣盾 */
    DIVINE_SHIELD = 17,
    RECORD_BOOK = 19,
}

export enum HeroEvent {
    HERO_ATTR,
}

type TalkInfo = {
    npcID: number;
    chatStep: number;
};

class _HeroData {
    public heroAttr: number[] = [];
    public animation: string[] = null;
    public pos: number[] = null;
    public direction: number = 0;
    public records: TalkInfo[] = [];
    public props = {
        swardID: 0,
        shieldID: 0,
        prop: {},
    };
    load(data: any) {
        for (let key in data) {
            this[key] = data[key];
        }
    }
}

@Fn.registerClass("HeroData")
export class HeroData extends BaseData {
    protected data: _HeroData = new _HeroData();

    load(data: any = null) {
        if (data) {
            this.data.load(data);
        } else {
            this.data.load(GameManager.DATA.getJson("hero")[0]);
        }
        this.data = this.createProxy(this.data);
    }

    getAttr(attr: HeroAttr) {
        return this.data.heroAttr[attr];
    }

    setAttrDiff(attr: HeroAttr, diff: number) {
        this.data.heroAttr[attr] += diff;
        this.emit(HeroEvent.HERO_ATTR, attr, this.data.heroAttr[attr]);
    }

    clearEquip() {
        this.data.props.swardID = 0;
        this.data.props.shieldID = 0;
    }

    getProp(id: number | string) {
        if (this.data.props.prop[id]) {
            return this.data.props.prop[id];
        }
        return 0;
    }

    addProp(id: number, count: number = 1) {
        let prop = GameManager.DATA.getJsonElement("prop", id);
        switch (prop.type) {
            case PropType.SWARD:
                this.data.props.swardID = id;
                break;
            case PropType.SHIELD:
                this.data.props.shieldID = id;
                break;
            default:
                if (!prop.consumption) {
                    this.data.props.prop[id] = Util.clamp(this.getProp(id) + count, 0, Number.MAX_VALUE);
                }
                break;
        }
    }

    getProps() {
        return this.data.props.prop;
    }

    recordTalk(npcID: number, chatStep: number) {
        if (this.data.props.prop[PropType.RECORD_BOOK]) {
            this.data.records.push({ npcID: npcID, chatStep: chatStep });
        }
    }

    equipedDivineShield() {
        return this.data.props.shieldID == PropType.DIVINE_SHIELD;
    }

    getRecordTalk() {
        return this.data.records;
    }
}
