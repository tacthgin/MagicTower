// import { v2, Vec2 } from "cc";
// import { BaseData } from "../../../Framework/Base/BaseData";
// import { GameManager } from "../../../Framework/Managers/GameManager";
// import { Fn } from "../../../Framework/Util/Fn";
// import { Util } from "../../../Framework/Util/Util";

// export enum HeroAttr {
//     HP,
//     ATTACK,
//     DEFENCE,
//     GOLD,
// }

// export enum PropType {
//     KEY = 1,
//     HEALING_SALVE = 2,
//     ATTACK_GEM,
//     DEFENCE_GEM,
//     SWARD = 5,
//     SHIELD,
//     MONSTER_HAND_BOOK,
//     RECORD_BOOK,
//     /** 飞行魔杖 */
//     FLYING_WAND,
//     /** 镐 */
//     PICKAXE,
//     EARTHQUAKE_SCROLL,
//     /** 冰冻魔法 */
//     ICE_MAGIC,
//     BOMB,
//     MAGIC_KEY,
//     HOLY_WATER,
//     LUCKY_GOLD,
//     CROSS,
//     DRAGON_SLAYING_KNIFE,
//     /** 上下飞行 */
//     FEATHER,
//     /** 中心飞行 */
//     CENTER_FEATHER,
// }

// export enum HeroEvent {
//     HERO_ATTR,
//     REFRESH_PROP,
//     REFRESH_EQUIP,
// }

// type TalkInfo = {
//     npcID: number;
//     chatStep: number;
// };

// class _HeroData {
//     public heroAttr: number[] = [];
//     public animation: string[] | null = null;
//     public pos: number[] | null = null;
//     public direction: number = 0;
//     public records: TalkInfo[] = [];
//     public props = {
//         swardID: 0,
//         shieldID: 0,
//         prop: {} as { [key: string]: any },
//     };
// }

// @Fn.registerClass("HeroData")
// export class HeroData extends BaseData {
//     protected data: _HeroData = new _HeroData();
//     private position: Vec2 = null!;

//     load(data: any = null) {
//         this.loadData(data || GameManager.DATA.getJsonElement("global", "hero"));
//         let pos = this.data.pos!;
//         this.position = v2(pos[0], pos[1]);
//         //this.setProxy();
//     }

//     useTestLoad() {
//         let useTestload = GameManager.DATA.getJsonElement("global", "useTestLoad");
//         if (useTestload) {
//         }
//     }

//     getAttr(attr: HeroAttr) {
//         return this.data.heroAttr[attr];
//     }

//     setAttr(attr: HeroAttr, value: number) {
//         this.data.heroAttr[attr] = value;
//         this.save();
//         this.emit(HeroEvent.HERO_ATTR, attr);
//     }

//     setAttrDiff(attr: HeroAttr, diff: number) {
//         this.data.heroAttr[attr] += diff;
//         this.save();
//         this.emit(HeroEvent.HERO_ATTR, attr);
//     }

//     setPosition(tile: Vec2, heroDireciton: number | null = null) {
//         this.position = tile;
//         this.data.pos = [tile.x, tile.y];
//         if (heroDireciton != null) {
//             this.data.direction = heroDireciton;
//         }
//         this.save();
//     }

//     getPosition() {
//         return this.position;
//     }

//     weak() {
//         let info = GameManager.DATA.getJsonElement("global", "weakenAttr");
//         this.data.heroAttr[HeroAttr.ATTACK] = info.attack;
//         this.data.heroAttr[HeroAttr.DEFENCE] = info.defence;
//         this.data.heroAttr[HeroAttr.HP] = info.hp;
//         this.data.props.swardID = 0;
//         this.data.props.shieldID = 0;
//         this.save();
//     }

//     getPropNum(id: number | string): number {
//         if (this.data.props.prop[id]) {
//             return this.data.props.prop[id];
//         }
//         return 0;
//     }

//     addProp(id: number, mapLevel: number, count: number = 1) {
//         let prop = GameManager.DATA.getJsonElement("prop", id);

//         switch (prop.type) {
//             case PropType.SWARD:
//                 this.data.props.swardID = id;
//                 this.setAttrDiff(HeroAttr.ATTACK, prop.value);
//                 this.emit(HeroEvent.REFRESH_EQUIP, PropType.SWARD);
//                 break;
//             case PropType.SHIELD:
//                 this.data.props.shieldID = id;
//                 this.setAttrDiff(HeroAttr.DEFENCE, prop.value);
//                 this.emit(HeroEvent.REFRESH_EQUIP, PropType.SHIELD);
//                 break;
//             default:
//                 if (!prop.consumption) {
//                     this.data.props.prop[id] = this.getPropNum(id) + count;
//                     this.save();
//                     this.emit(HeroEvent.REFRESH_PROP, id, count);
//                 } else if (prop.type >= PropType.HEALING_SALVE && prop.type <= PropType.DEFENCE_GEM) {
//                     let value = prop.value + Math.floor((mapLevel - 1) / 10 + 1);
//                     this.setAttrDiff(prop.type - PropType.HEALING_SALVE + HeroAttr.HP, value);
//                 }
//                 break;
//         }
//     }

//     getProps() {
//         return this.data.props.prop;
//     }

//     getEquips(propType: PropType) {
//         switch (propType) {
//             case PropType.SWARD:
//                 return this.data.props.swardID;
//             case PropType.SHIELD:
//                 return this.data.props.shieldID;
//         }
//         return 0;
//     }

//     recordTalk(npcID: number, chatStep: number) {
//         if (this.data.props.prop[PropType.RECORD_BOOK]) {
//             this.data.records.push({ npcID: npcID, chatStep: chatStep });
//             this.save();
//         }
//     }

//     equipedDivineShield() {
//         return this.data.props.shieldID == 17;
//     }

//     getRecordTalk() {
//         return this.data.records;
//     }
// }
