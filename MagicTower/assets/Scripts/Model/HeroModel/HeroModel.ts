import { GameApp } from "../../../GameFramework/Application/GameApp";
import { IVec2 } from "../../../GameFramework/Scripts/Base/GameStruct/IVec2";
import { GameFrameworkLog } from "../../../GameFramework/Scripts/Base/Log/GameFrameworkLog";
import { ModelBase } from "../../../GameFramework/Scripts/MVC/Model/ModelBase";
import { ModelContainer } from "../../../GameFramework/Scripts/MVC/Model/ModelContainer";
import { Utility } from "../../../GameFramework/Scripts/Utility/Utility";
import { CommonEventArgs } from "../../Logics/Event/CommonEventArgs";
import { GameEvent } from "../../Logics/Event/GameEvent";
import { HeroAttr } from "./HeroAttr";
import { HeroEvent } from "./HeroEvent";
import { HeroAttrEventArgs, HeroPropEventArgs } from "./HeroModelEventArgs";
import { PropId, PropInfo, PropType } from "./Prop";

type TalkInfo = {
    npcID: number;
    chatStep: number;
};

@ModelContainer.registerModel("HeroModel")
export class HeroModel extends ModelBase {
    @ModelBase.saveMark
    private heroAttr: number[] = null!;
    @ModelBase.saveMark
    private position: IVec2 = null!;
    @ModelBase.saveMark
    private direction: number = 0;
    @ModelBase.saveMark
    private records: TalkInfo[] = null!;
    @ModelBase.saveMark
    private swardId: number = 0;
    @ModelBase.saveMark
    private shieldId: number = 0;
    @ModelBase.saveMark
    private props: { [key: number | string]: number } = {};
    private animation: string[] = ["player_up", "player_right", "player_down", "player_left"];
    private heroSpeed: number = 0.2;
    /** 临时血量计算 */
    private tempHp: number = 0;

    constructor() {
        super();
        this.heroAttr = [];
        this.records = [];
    }

    protected onLoad(data: object | null = null) {
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

    /**
     * 从怪物那赚取金币
     * @param gold 怪物金币
     */
    earnGold(gold: number): void {
        //幸运金币,获取金币翻倍
        let ratio = this.getPropNum(PropType.LUCKY_GOLD) ? 2 : 1;
        this.setAttrDiff(HeroAttr.GOLD, gold * ratio);
    }

    setPosition(tile: IVec2, heroDireciton: number | null = null) {
        this.position = tile;
        if (heroDireciton != null) {
            this.direction = heroDireciton;
        }
    }

    getPosition() {
        return this.position;
    }

    weak(): boolean {
        let info = Utility.Json.getJsonElement<any>("global", "weakenAttr");
        if (info) {
            this.heroAttr[HeroAttr.ATTACK] = info.attack;
            this.heroAttr[HeroAttr.DEFENCE] = info.defence;
            this.heroAttr[HeroAttr.HP] = info.hp;
            this.swardId = 0;
            this.shieldId = 0;
            GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.REFRESH_ARCHIVE));

            return true;
        } else {
            GameFrameworkLog.error(`can't find weakenAttr json`);
            return false;
        }
    }

    addProp(id: number, mapLevel: number, count: number = 1): boolean {
        let prop = Utility.Json.getJsonElement<PropInfo>("prop", id);
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
                    if (count > 0) {
                        count *= prop.initNum;
                    }
                    this.props[id] = this.getPropNum(id) + count;

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
        if (this.props[PropId.RECORD_BOOK]) {
            this.records.push({ npcID: npcID, chatStep: chatStep });
        }
    }

    getRecordTalk() {
        return this.records;
    }

    equipedDivineShield() {
        return this.shieldId == PropId.DIVINE_SHIELD;
    }

    getDireciton() {
        return this.direction;
    }

    getAnimation() {
        return this.animation;
    }

    getHeroSpeed() {
        return this.heroSpeed;
    }

    magicDamage(damage: number) {
        if (damage < 1) {
            this.setAttr(HeroAttr.HP, Math.ceil(this.getAttr(HeroAttr.HP) * damage));
        } else {
            this.setAttrDiff(HeroAttr.HP, -damage);
        }
    }

    buy(shopType: string, value: number, gold: number): boolean {
        if (gold > this.heroAttr[HeroAttr.GOLD]) {
            return false;
        }
        let attrName = null;
        switch (shopType) {
            case "hp":
                attrName = HeroAttr.HP;
                break;
            case "attack":
                attrName = HeroAttr.ATTACK;
                break;
            case "defence":
                attrName = HeroAttr.DEFENCE;
                break;
            default:
                GameFrameworkLog.error("shop type is invalid");
                break;
        }

        if (attrName != null) {
            this.setAttrDiff(attrName, value);
            this.setAttrDiff(HeroAttr.GOLD, -gold);
        }

        return true;
    }

    private useTestLoad() {
        let useTestload = Utility.Json.getJsonElement("global", "useTestLoad");
        if (useTestload) {
            let testLoadData: any = Utility.Json.getJsonElement("global", "testLoad");
            if (testLoadData) {
                this.loadData(testLoadData.hero);
            } else {
                GameFrameworkLog.error("hero model test laod data is null");
            }
        }
    }
}
