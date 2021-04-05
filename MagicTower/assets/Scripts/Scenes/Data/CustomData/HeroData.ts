import { CustomEventTarget } from "../../../Frame/Managers/NotifyCenter";

enum HeroAttr {
    HP,
    ATTACK,
    DEFENCE,
    GOLD,
}

export default class HeroData extends CustomEventTarget {
    private heroAttr: number[] = [];
    private animation: string[] = null;
    private pos: number[] = null;
    private direction: number = 0;
    private props: any = {
        swardId: 0,
        shieldId: 0,
        prop: {},
    };
    private records: any[] = [];

    getAttr(attr: HeroAttr) {
        return this.heroAttr[attr];
    }

    setAttrDiff(attr: HeroAttr, diff: number) {
        this.heroAttr[attr] += diff;
    }

    clearEquip() {
        //this.props.swardId = 0;
        //this.props.shieldId = 0;
    }

    getProp(id: number | string) {
        //if (this.props.prop[id]) {
        //return this.props.prop[id];
        //}
        //return 0;
    }

    addProp(id: number | string, count: number = 1) {
        //let prop = DataManager.getJsonElement("prop", id);
        //if (prop.type == 5) {
        //this.props.swardId = id;
        //} else if (prop.type == 6) {
        //this.props.shieldId = id;
        //} else if (!prop.consumption) {
        //this.props.prop[id] = Util.clamp(this.getProp(id) + count, 0, Number.MAX_VALUE);
        //}
    }

    getProps() {
        //return this.props.prop;
    }

    recordTalk(npcId: number, chatStep: number | string) {
        //if (this.props.prop[19]) {
        //this.records.push({ npcId: npcId, chatStep: chatStep });
        //}
    }

    /** 是否拥有神圣盾，跟json绑定 */
    equipedDivineShield() {
        //return this.props.shieldId == 17;
    }

    load(info: any = null) {
        //if (info) {
        //this.hp = info.hp;
        //this.attack = info.attack;
        //this.defence = info.defence;
        //this.gold = info.gold;
        //this.animation = info.animation;
        //this.pos = info.pos;
        //this.direction = info.direction;
        //this.props = info.props || {};
        //this.records = info.records || [];
        //}
    }

    getRecordTalk() {
        //return this.records;
    }
}

/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// import { DataManager } from "../Managers/DataManager";
// import { Util } from "../Util/Util";
//
// export default class HeroInfo {
//     private hp: number = 0;
//
//     private attack: number = 0;
//
//     private defence: number = 0;
//
//     private gold: number = 0;
//
//     private animation: string[] = null;
//
//     private pos: number[] = null;
//
//     private direction: number = 0;
//
//     private props: any = {
//         swardId: 0,
//         shieldId: 0,
//         prop: {}
//     };
//
//     private records: any[] = [];
//
//     set Hp(value) {
//         this.hp = value;
//     }
//
//     get Hp() {
//         return this.hp;
//     }
//
//     set Attack(value) {
//         this.attack = value;
//     }
//
//     get Attack() {
//         return this.attack;
//     }
//
//     set Defence(value) {
//         this.defence = value;
//     }
//
//     get Defence() {
//         return this.defence;
//     }
//
//     set Gold(value) {
//         this.gold = value;
//     }
//
//     get Gold() {
//         return this.gold;
//     }
//
//     get Animation() {
//         return this.animation;
//     }
//
//     set Position(value) {
//         this.pos[0] = value.x;
//         this.pos[1] = value.y;
//     }
//
//     get Position() {
//         return cc.v2(this.pos[0], this.pos[1]);
//     }
//
//     set Direction(value) {
//         this.direction = value;
//     }
//
//     get Direction() {
//         return this.direction;
//     }
//
//     get sward() {
//         return this.props.swardId;
//     }
//
//     get shield() {
//         return this.props.shieldId;
//     }
//
//     clearEquip() {
//         this.props.swardId = 0;
//         this.props.shieldId = 0;
//     }
//
//     getProp(id: number | string) {
//         if (this.props.prop[id]) {
//             return this.props.prop[id];
//         }
//         return 0;
//     }
//
//     addProp(id: number | string, count: number = 1) {
//         let prop = DataManager.getJsonElement("prop", id);
//         if (prop.type == 5) {
//             this.props.swardId = id;
//         } else if (prop.type == 6) {
//             this.props.shieldId = id;
//         } else if (!prop.consumption) {
//             this.props.prop[id] = Util.clamp(this.getProp(id) + count, 0, Number.MAX_VALUE);
//         }
//     }
//
//     getProps() {
//         return this.props.prop;
//     }
//
//     recordTalk(npcId: number, chatStep: number | string) {
//         if (this.props.prop[19]) {
//             this.records.push({ npcId: npcId, chatStep: chatStep });
//         }
//     }
//
//     /** 是否拥有神圣盾，跟json绑定 */
//     equipedDivineShield() {
//         return this.props.shieldId == 17;
//     }
//
//     load(info: any = null) {
//         if (info) {
//             this.hp = info.hp;
//             this.attack = info.attack;
//             this.defence = info.defence;
//             this.gold = info.gold;
//             this.animation = info.animation;
//             this.pos = info.pos;
//             this.direction = info.direction;
//
//             this.props = info.props || {};
//             this.records = info.records || [];
//         }
//     }
//
//     getRecordTalk() {
//         return this.records;
//     }
// }
