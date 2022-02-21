import { GameApp } from "../../../GameFramework/Scripts/Application/GameApp";
import { ModelBase } from "../../../GameFramework/Scripts/Application/Model/ModelBase";
import { ModelContainer } from "../../../GameFramework/Scripts/Application/Model/ModelContainer";
import { IVec2 } from "../../../GameFramework/Scripts/Base/GameStruct/IVec2";
import { GameFrameworkLog } from "../../../GameFramework/Scripts/Base/Log/GameFrameworkLog";
import { Utility } from "../../../GameFramework/Scripts/Utility/Utility";
import { CommonEventArgs } from "../../Logics/Event/CommonEventArgs";
import { GameEvent } from "../../Logics/Event/GameEvent";
import { HeroAttr } from "./HeroAttr";
import { HeroEvent } from "./HeroEvent";
import { HeroAttrEventArgs, HeroPropEventArgs } from "./HeroModelEventArgs";
import { PropId, PropType } from "./Prop";

type TalkInfo = {
    npcID: number;
    chatStep: number;
};

@ModelContainer.registerModel("HeroModel")
export class HeroModel extends ModelBase {
    private heroAttr: HeroAttr[] = null!;
    private position: IVec2 = null!;
    private direction: number = 0;
    private records: TalkInfo[] = null!;
    private swardId: number = 0;
    private shieldId: number = 0;
    private props: { [key: number | string]: number } = {};
    private animation: string[] = null!;

    constructor() {
        super();
        this.heroAttr = [];
        this.records = [];
    }

    load(data: object | null = null) {
        let heroInitData = Utility.Json.getJsonElement("global", "hero");
        let loadData = data || heroInitData;
        if (loadData) {
            this.loadData(loadData);
        } else {
            GameFrameworkLog.error("hero model load data is null");
        }
        this.useTestLoad();
    }

    setAttr(attr: HeroAttr, value: number) {
        this.heroAttr[attr] = value;
        this.save();
        this.fireNow(HeroAttrEventArgs.create(attr, value));
    }

    setAttrDiff(attr: HeroAttr, diff: number) {
        let value = this.heroAttr[attr] + diff;
        if (value < 0) {
            value = 0;
        }
        this.setAttr(attr, value);
    }

    getAttr(attr: HeroAttr) {
        return this.heroAttr[attr];
    }

    setPosition(tile: IVec2, heroDireciton: number | null = null) {
        this.position = tile;
        if (heroDireciton != null) {
            this.direction = heroDireciton;
        }
        this.save();
    }

    getPosition() {
        return this.position;
    }

    weak(): boolean {
        let info = Utility.Json.getJsonElement("global", "weakenAttr") as any;
        if (info) {
            this.heroAttr[HeroAttr.ATTACK] = info.attack;
            this.heroAttr[HeroAttr.DEFENCE] = info.defence;
            this.heroAttr[HeroAttr.HP] = info.hp;
            this.swardId = 0;
            this.shieldId = 0;
            GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.REFRESH_ARCHIVE));
            this.save();
            return true;
        } else {
            GameFrameworkLog.error(`can't find weakenAttr json`);
            return false;
        }
    }

    addProp(id: number, mapLevel: number, count: number = 1): boolean {
        let prop = Utility.Json.getJsonElement("prop", id) as any;
        if (!prop) {
            GameFrameworkLog.error(`can't find prop id:${id}`);
            return false;
        }

        switch (prop.type) {
            case PropType.SWARD:
                this.swardId = id;
                this.setAttrDiff(HeroAttr.ATTACK, prop.value);
                this.fireNow(HeroPropEventArgs.create(HeroEvent.REFRESH_EQUIP, PropType.SWARD, this.swardId));
                break;
            case PropType.SHIELD:
                this.shieldId = id;
                this.setAttrDiff(HeroAttr.DEFENCE, prop.value);
                this.fireNow(HeroPropEventArgs.create(HeroEvent.REFRESH_EQUIP, PropType.SHIELD, this.shieldId));
                break;
            default:
                if (!prop.consumption) {
                    this.props[id] = this.getPropNum(id) + count;
                    this.save();
                    this.fireNow(HeroPropEventArgs.create(HeroEvent.REFRESH_PROP, id, count));
                } else if (prop.type >= PropType.HEALING_SALVE && prop.type <= PropType.DEFENCE_GEM) {
                    let value = prop.value + Math.floor((mapLevel - 1) / 10 + 1);
                    this.setAttrDiff(prop.type - PropType.HEALING_SALVE + HeroAttr.HP, value);
                }
                break;
        }

        return true;
    }

    getPropNum(id: number | string): number {
        return this.props[id] || 0;
    }

    forEachProps(callbackfn: (propId: number | string, count: number) => void, thisArg?: any) {
        for (let id in this.props) {
            callbackfn.call(thisArg, id, this.props[id]);
        }
    }

    getEquips(propType: PropType) {
        switch (propType) {
            case PropType.SWARD:
                return this.swardId;
            case PropType.SHIELD:
                return this.shieldId;
        }
        return 0;
    }

    recordTalk(npcID: number, chatStep: number) {
        if (this.props[PropType.RECORD_BOOK]) {
            this.records.push({ npcID: npcID, chatStep: chatStep });
            this.save();
        }
    }

    getRecordTalk() {
        return this.records;
    }

    equipedDivineShield() {
        return this.props.shieldId == PropId.DIVINE_SHIELD;
    }

    getDireciton() {
        return this.direction;
    }

    getAnimation() {
        return this.animation;
    }

    getHeroSpeed() {
        let heroSpeed = Utility.Json.getJsonElement("global", "heroSpeed");
        if (heroSpeed) {
            return heroSpeed as number;
        }
        return 0;
    }

    magicDamage(damage: number) {
        if (damage < 1) {
            this.setAttr(HeroAttr.HP, Math.ceil(this.getAttr(HeroAttr.HP) * damage));
        } else {
            this.setAttrDiff(HeroAttr.HP, -damage);
        }
    }

    private useTestLoad() {
        let useTestload = Utility.Json.getJsonElement("global", "useTestLoad");
        if (useTestload) {
            let testLoadData: any = Utility.Json.getJsonElement("global", "testLoad");
            if (testLoadData) {
                this.loadData(testLoadData);
            } else {
                GameFrameworkLog.error("hero model test laod data is null");
            }
        }
    }
}
