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
    KEY = 1,
    HEALING_SALVE = 2,
    ATTACK_GEM,
    DEFENCE_GEM,
    SWARD = 5,
    SHIELD,
    FEATHER = 9,
    /** 神圣盾 */
    DIVINE_SHIELD = 17,
    RECORD_BOOK = 19,
}

export enum HeroEvent {
    HERO_ATTR,
    REFRESH_PROP,
    REFRESH_EQUIP,
}

type TalkInfo = {
    npcID: number;
    chatStep: number;
};

class _HeroData {
    public heroAttr: number[] = [];
    public animation: string[] | null = null;
    public pos: number[] | null = null;
    public direction: number = 0;
    public records: TalkInfo[] = [];
    public props = {
        swardID: 0,
        shieldID: 0,
        prop: {} as { [key: string]: any },
    };
}

@Fn.registerClass("HeroData")
export class HeroData extends BaseData {
    protected data: _HeroData = new _HeroData();

    load(data: any = null) {
        this.loadData(data || GameManager.DATA.getJsonElement("global", "hero"));
        this.setProxy();
    }

    getAttr(attr: HeroAttr) {
        return this.data.heroAttr[attr];
    }

    setAttr(attr: HeroAttr, value: number) {
        this.data.heroAttr[attr] = value;
        this.save();
        this.emit(HeroEvent.HERO_ATTR, attr);
    }

    setAttrDiff(attr: HeroAttr, diff: number) {
        this.data.heroAttr[attr] += diff;
        this.save();
        this.emit(HeroEvent.HERO_ATTR, attr);
    }

    weak() {
        let info = GameManager.DATA.getJsonElement("global", "weakenAttr");
        this.data.heroAttr[HeroAttr.ATTACK] = info.attack;
        this.data.heroAttr[HeroAttr.DEFENCE] = info.defence;
        this.data.heroAttr[HeroAttr.HP] = info.hp;
        this.data.props.swardID = 0;
        this.data.props.shieldID = 0;
        this.save();
    }

    getPropNum(id: number | string): number {
        if (this.data.props.prop[id]) {
            return this.data.props.prop[id];
        }
        return 0;
    }

    addProp(id: number, mapLevel: number, count: number = 1) {
        let prop = GameManager.DATA.getJsonElement("prop", id);

        switch (prop.type) {
            case PropType.SWARD:
                this.data.props.swardID = id;
                this.setAttrDiff(HeroAttr.ATTACK, prop.value);
                this.emit(HeroEvent.REFRESH_EQUIP, PropType.SWARD);
                break;
            case PropType.SHIELD:
                this.data.props.shieldID = id;
                this.setAttrDiff(HeroAttr.DEFENCE, prop.value);
                this.emit(HeroEvent.REFRESH_EQUIP, PropType.SHIELD);
                break;
            default:
                if (!prop.consumption) {
                    this.data.props.prop[id] = Util.clamp(this.getPropNum(id) + count, 0, Number.MAX_VALUE);
                    this.save();
                    this.emit(HeroEvent.REFRESH_PROP, id);
                } else {
                    if (prop.type >= PropType.HEALING_SALVE && prop.type <= PropType.DEFENCE_GEM) {
                        let value = prop.value + Math.floor((mapLevel - 1) / 10 + 1);
                        this.setAttrDiff(prop.type - PropType.HEALING_SALVE + HeroAttr.HP, value);
                    }
                }
                break;
        }
    }

    getProps() {
        return this.data.props.prop;
    }

    getEquips(propType: PropType) {
        switch (propType) {
            case PropType.SWARD:
                return this.data.props.swardID;
            case PropType.SHIELD:
                return this.data.props.shieldID;
        }
        return 0;
    }

    recordTalk(npcID: number, chatStep: number) {
        if (this.data.props.prop[PropType.RECORD_BOOK]) {
            this.data.records.push({ npcID: npcID, chatStep: chatStep });
            this.save();
        }
    }

    equipedDivineShield() {
        return this.data.props.shieldID == PropType.DIVINE_SHIELD;
    }

    getRecordTalk() {
        return this.data.records;
    }
}
