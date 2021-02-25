import { _decorator, Component, Label, Sprite, SpriteFrame, Prefab, Node, NodePool } from 'cc';
const { ccclass, property } = _decorator;

import { NotifyCenter } from "../../Managers/NotifyCenter";
import { GameEvent } from "../../Constant/GameEvent";
import { DataManager } from "../../Managers/DataManager";
import HeroInfo from "../../Data/HeroInfo";
import { ElementManager } from "./ElementManager";
import { Util } from "../../Util/Util";

@ccclass('GameUI')
export default class GameUI extends Component {
    @property(Label)
    levelLabel: Label | null = null;
    @property(Label)
    heroAttrLabels: Label[] = [];
    @property(Label)
    equipLabels: Label[] = [];
    @property(Sprite)
    equipSprites: Sprite[] = [];
    @property(SpriteFrame)
    keySpriteFrames: SpriteFrame[] = [];
    @property(Prefab)
    keyPrefab: Prefab | null = null;
    @property(Node)
    keyLayout: Node | null = null;
    @property(Prefab)
    propButtonPrefab: Prefab | null = null;
    @property(Node)
    propButtonLayout: Node | null = null;
    @property(Label)
    monsterLabels: Label[] = [];
    @property(Node)
    monsterNode: Node | null = null;
    private heroInfo: HeroInfo = null;
    private keyPool: NodePool = new NodePool();
    private propButtonPool: NodePool = new NodePool();
    private keys: any = {};
    private propButtons: any = {};
    private monsterSprite: Node | null = null;
    onLoad() {
        //NotifyCenter.on(GameEvent.HERO_ATTR_CHANGED, this.heroAttrChanged, this);
        //NotifyCenter.on(GameEvent.REFRESH_PROP, this.refreshProp, this);
        //NotifyCenter.on(GameEvent.REFRESH_LEVEL, this.refreshLevel, this);
        //NotifyCenter.on(GameEvent.REFRESH_ARCHIVE, this.refreshArchive, this);
        //NotifyCenter.on(GameEvent.REFRESH_EQUIP, this.refreshEquip, this);
        //NotifyCenter.on(GameEvent.MONSTER_FIGHT, this.monsterFight, this);
        //NotifyCenter.on(GameEvent.MOVE_PATH, this.movePath, this);

        //this.heroInfo = DataManager.getCustomData("GameInfo").HeroInfo;
        //for (let i = 0; i < this.keySpriteFrames.length; i++) {
        //this.keys[i] = [];
        //}

        //this.monsterSprite = ElementManager.getElement("MonsterIcon");
        //this.monsterSprite.position = cc.Vec3.ZERO;
        //this.monsterSprite.parent = this.monsterNode;
        //this.monsterSprite.active = false;
    }
    onDestroy() {
        //NotifyCenter.targetOff(this);
        //this.propButtonPool.clear();
        //this.keyPool.clear();
    }
    heroAttrChanged() {
        //this.heroAttrLabels[0].string = this.heroInfo.Hp.toString();
        //this.heroAttrLabels[1].string = this.heroInfo.Attack.toString();
        //this.heroAttrLabels[2].string = this.heroInfo.Defence.toString();
        //this.heroAttrLabels[3].string = this.heroInfo.Gold.toString();
    }
    refreshProp(propInfo: any, count: number = 1) {
        //switch (propInfo.type) {
        //case 5:
        //case 6:
                //装备
        //let index = propInfo.type - 5;
        //this.equipLabels[index].string = propInfo.name;
        //this.equipSprites[index].spriteFrame = ElementManager.getSpriteFrame(propInfo.spriteId);
        //break;
        //case 1:
                //钥匙
        //if (count < 0) {
        //for (let i = 0; i < -count; i++) {
        //this.removeKey(propInfo);
        //}
        //} else {
                    //钥匙最多18个
        //let childrenCount = this.keyLayout.children.length;
        //if (childrenCount + count > 18) {
        //count = 18 - childrenCount;
        //}
        //for (let i = 0; i < count; i++) {
        //this.createKey(propInfo);
        //}
        //}
        //break;
        //case 9:
                //up
        //let button = this.createPropButton(DataManager.getJsonElement("prop", propInfo.id), 1);
        //let label = button.getChildByName("label");
        //label.active = true;
        //label.getComponent(cc.Label).string = "上";
                //down
        //button = this.createPropButton(DataManager.getJsonElement("prop", propInfo.id), 1);
        //label = button.getChildByName("label");
        //label.active = true;
        //label.getComponent(cc.Label).string = "下";
        //break;
        //default:
        //if (!propInfo.consumption) {
        //let propNum = this.heroInfo.getProp(propInfo.id);
        //if (propNum <= 0) {
        //this.removePropButton(propInfo);
        //} else if (!this.propButtons[propInfo.id]) {
        //this.createPropButton(propInfo, propNum);
        //} else {
        //this.propButtons[propInfo.id].getComponent("PropButton").setNum(propNum);
        //}
        //}
        //break;
        //}
    }
    refreshLevel(level: number) {
        //if (level == 0) {
        //this.levelLabel.string = "魔塔地下室";
        //} else {
        //this.levelLabel.string = `魔塔第${Util.formatInt(level)}层`;
        //}
    }
    refreshArchive() {
        //this.heroAttrChanged();
        //let props = this.heroInfo.getProps();
        //let prop = null;
        //for (let id in props) {
        //prop = DataManager.getJsonElement("prop", id);
        //this.refreshProp(prop, props[id]);
        //}

        //this.refreshEquip();
    }
    refreshEquip() {
        //if (this.heroInfo.sward == 0) {
        //this.equipLabels[0].string = "无";
        //this.equipSprites[0].spriteFrame = null;
        //} else {
        //this.refreshProp(DataManager.getJsonElement("prop", this.heroInfo.sward));
        //}

        //if (this.heroInfo.shield == 0) {
        //this.equipLabels[1].string = "无";
        //this.equipSprites[1].spriteFrame = null;
        //} else {
        //this.refreshProp(DataManager.getJsonElement("prop", this.heroInfo.shield));
        //}
    }
    movePath() {
        //this.refreshMonsterInfo();
    }
    monsterFight(monsterInfo: any) {
        //this.heroAttrChanged();
        //this.refreshMonsterInfo(monsterInfo);
    }
    refreshMonsterInfo(monsterInfo: any = null) {
        //this.monsterLabels[0].string = monsterInfo ? monsterInfo.name : "怪物名字";
        //this.monsterLabels[1].string = monsterInfo ? monsterInfo.hp : "生命";
        //this.monsterLabels[2].string = monsterInfo ? monsterInfo.attack : "攻击";
        //this.monsterLabels[3].string = monsterInfo ? monsterInfo.defence : "防御";

        //this.monsterSprite.active = monsterInfo != null;
        //if (monsterInfo) {
        //this.monsterSprite.getComponent("MonsterIcon").init(monsterInfo.id);
        //}
    }
    createKey(propInfo: any) {
        //let index = propInfo.id - 1;
        //let key = Util.generatePrefabFromPool(this.keyPool, this.keyPrefab);
        //key.getComponent(cc.Sprite).spriteFrame = this.keySpriteFrames[index];
        //key.zIndex = this.keySpriteFrames.length - index;
        //key.parent = this.keyLayout;
        //this.keys[index].push(key);
        //return key;
    }
    removeKey(propInfo: any) {
        //if (this.keys.length == 0) return;
        //let index = propInfo.id - 1;
        //let key = this.keys[index].pop();
        //if (key) {
        //this.keyPool.put(key);
        //}
    }
    createPropButton(propInfo: any, num: number) {
        //let propButton = Util.generatePrefabFromPool(this.propButtonPool, this.propButtonPrefab);
        //propButton.getComponent("PropButton").init(propInfo);
        //propButton.getComponent("PropButton").setNum(num);
        //propButton.parent = this.propButtonLayout;
        //this.propButtons[propInfo.id] = propButton;
        //return propButton;
    }
    removePropButton(propInfo: any) {
        //let propButton = this.propButtons[propInfo.id];
        //if (propButton) {
        //this.propButtonPool.put(propButton);
        //delete this.propButtons[propInfo.id];
        //}
    }
}

/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// import { NotifyCenter } from "../../Managers/NotifyCenter";
// import { GameEvent } from "../../Constant/GameEvent";
// import { DataManager } from "../../Managers/DataManager";
// import HeroInfo from "../../Data/HeroInfo";
// import { ElementManager } from "./ElementManager";
// import { Util } from "../../Util/Util";
// 
// const { ccclass, property } = cc._decorator;
// 
// @ccclass
// export default class GameUI extends cc.Component {
//     @property(cc.Label)
//     levelLabel: cc.Label = null;
// 
//     @property(cc.Label)
//     heroAttrLabels: cc.Label[] = [];
// 
//     @property(cc.Label)
//     equipLabels: cc.Label[] = [];
// 
//     @property(cc.Sprite)
//     equipSprites: cc.Sprite[] = [];
// 
//     @property(cc.SpriteFrame)
//     keySpriteFrames: cc.SpriteFrame[] = [];
// 
//     @property(cc.Prefab)
//     keyPrefab: cc.Prefab = null;
// 
//     @property(cc.Node)
//     keyLayout: cc.Node = null;
// 
//     @property(cc.Prefab)
//     propButtonPrefab: cc.Prefab = null;
// 
//     @property(cc.Node)
//     propButtonLayout: cc.Node = null;
// 
//     @property(cc.Label)
//     monsterLabels: cc.Label[] = [];
// 
//     @property(cc.Node)
//     monsterNode: cc.Node = null;
// 
//     private heroInfo: HeroInfo = null;
// 
//     private keyPool: cc.NodePool = new cc.NodePool();
// 
//     private propButtonPool: cc.NodePool = new cc.NodePool();
// 
//     private keys: any = {};
// 
//     private propButtons: any = {};
// 
//     private monsterSprite: cc.Node = null;
// 
//     onLoad() {
//         NotifyCenter.on(GameEvent.HERO_ATTR_CHANGED, this.heroAttrChanged, this);
//         NotifyCenter.on(GameEvent.REFRESH_PROP, this.refreshProp, this);
//         NotifyCenter.on(GameEvent.REFRESH_LEVEL, this.refreshLevel, this);
//         NotifyCenter.on(GameEvent.REFRESH_ARCHIVE, this.refreshArchive, this);
//         NotifyCenter.on(GameEvent.REFRESH_EQUIP, this.refreshEquip, this);
//         NotifyCenter.on(GameEvent.MONSTER_FIGHT, this.monsterFight, this);
//         NotifyCenter.on(GameEvent.MOVE_PATH, this.movePath, this);
// 
//         this.heroInfo = DataManager.getCustomData("GameInfo").HeroInfo;
//         for (let i = 0; i < this.keySpriteFrames.length; i++) {
//             this.keys[i] = [];
//         }
// 
//         this.monsterSprite = ElementManager.getElement("MonsterIcon");
//         this.monsterSprite.position = cc.Vec3.ZERO;
//         this.monsterSprite.parent = this.monsterNode;
//         this.monsterSprite.active = false;
//     }
// 
//     onDestroy() {
//         NotifyCenter.targetOff(this);
//         this.propButtonPool.clear();
//         this.keyPool.clear();
//     }
// 
//     heroAttrChanged() {
//         this.heroAttrLabels[0].string = this.heroInfo.Hp.toString();
//         this.heroAttrLabels[1].string = this.heroInfo.Attack.toString();
//         this.heroAttrLabels[2].string = this.heroInfo.Defence.toString();
//         this.heroAttrLabels[3].string = this.heroInfo.Gold.toString();
//     }
// 
//     refreshProp(propInfo: any, count: number = 1) {
//         switch (propInfo.type) {
//             case 5:
//             case 6:
//                 //装备
//                 let index = propInfo.type - 5;
//                 this.equipLabels[index].string = propInfo.name;
//                 this.equipSprites[index].spriteFrame = ElementManager.getSpriteFrame(propInfo.spriteId);
//                 break;
//             case 1:
//                 //钥匙
//                 if (count < 0) {
//                     for (let i = 0; i < -count; i++) {
//                         this.removeKey(propInfo);
//                     }
//                 } else {
//                     //钥匙最多18个
//                     let childrenCount = this.keyLayout.children.length;
//                     if (childrenCount + count > 18) {
//                         count = 18 - childrenCount;
//                     }
//                     for (let i = 0; i < count; i++) {
//                         this.createKey(propInfo);
//                     }
//                 }
//                 break;
//             case 9:
//                 //up
//                 let button = this.createPropButton(DataManager.getJsonElement("prop", propInfo.id), 1);
//                 let label = button.getChildByName("label");
//                 label.active = true;
//                 label.getComponent(cc.Label).string = "上";
//                 //down
//                 button = this.createPropButton(DataManager.getJsonElement("prop", propInfo.id), 1);
//                 label = button.getChildByName("label");
//                 label.active = true;
//                 label.getComponent(cc.Label).string = "下";
//                 break;
//             default:
//                 if (!propInfo.consumption) {
//                     let propNum = this.heroInfo.getProp(propInfo.id);
//                     if (propNum <= 0) {
//                         this.removePropButton(propInfo);
//                     } else if (!this.propButtons[propInfo.id]) {
//                         this.createPropButton(propInfo, propNum);
//                     } else {
//                         this.propButtons[propInfo.id].getComponent("PropButton").setNum(propNum);
//                     }
//                 }
//                 break;
//         }
//     }
// 
//     refreshLevel(level: number) {
//         if (level == 0) {
//             this.levelLabel.string = "魔塔地下室";
//         } else {
//             this.levelLabel.string = `魔塔第${Util.formatInt(level)}层`;
//         }
//     }
// 
//     refreshArchive() {
//         this.heroAttrChanged();
//         let props = this.heroInfo.getProps();
//         let prop = null;
//         for (let id in props) {
//             prop = DataManager.getJsonElement("prop", id);
//             this.refreshProp(prop, props[id]);
//         }
// 
//         this.refreshEquip();
//     }
// 
//     refreshEquip() {
//         if (this.heroInfo.sward == 0) {
//             this.equipLabels[0].string = "无";
//             this.equipSprites[0].spriteFrame = null;
//         } else {
//             this.refreshProp(DataManager.getJsonElement("prop", this.heroInfo.sward));
//         }
// 
//         if (this.heroInfo.shield == 0) {
//             this.equipLabels[1].string = "无";
//             this.equipSprites[1].spriteFrame = null;
//         } else {
//             this.refreshProp(DataManager.getJsonElement("prop", this.heroInfo.shield));
//         }
//     }
// 
//     movePath() {
//         this.refreshMonsterInfo();
//     }
// 
//     monsterFight(monsterInfo: any) {
//         this.heroAttrChanged();
//         this.refreshMonsterInfo(monsterInfo);
//     }
// 
//     refreshMonsterInfo(monsterInfo: any = null) {
//         this.monsterLabels[0].string = monsterInfo ? monsterInfo.name : "怪物名字";
//         this.monsterLabels[1].string = monsterInfo ? monsterInfo.hp : "生命";
//         this.monsterLabels[2].string = monsterInfo ? monsterInfo.attack : "攻击";
//         this.monsterLabels[3].string = monsterInfo ? monsterInfo.defence : "防御";
// 
//         this.monsterSprite.active = monsterInfo != null;
//         if (monsterInfo) {
//             this.monsterSprite.getComponent("MonsterIcon").init(monsterInfo.id);
//         }
//     }
// 
//     createKey(propInfo: any) {
//         let index = propInfo.id - 1;
//         let key = Util.generatePrefabFromPool(this.keyPool, this.keyPrefab);
//         key.getComponent(cc.Sprite).spriteFrame = this.keySpriteFrames[index];
//         key.zIndex = this.keySpriteFrames.length - index;
//         key.parent = this.keyLayout;
//         this.keys[index].push(key);
//         return key;
//     }
// 
//     removeKey(propInfo: any) {
//         if (this.keys.length == 0) return;
//         let index = propInfo.id - 1;
//         let key = this.keys[index].pop();
//         if (key) {
//             this.keyPool.put(key);
//         }
//     }
// 
//     createPropButton(propInfo: any, num: number) {
//         let propButton = Util.generatePrefabFromPool(this.propButtonPool, this.propButtonPrefab);
//         propButton.getComponent("PropButton").init(propInfo);
//         propButton.getComponent("PropButton").setNum(num);
//         propButton.parent = this.propButtonLayout;
//         this.propButtons[propInfo.id] = propButton;
//         return propButton;
//     }
// 
//     removePropButton(propInfo: any) {
//         let propButton = this.propButtons[propInfo.id];
//         if (propButton) {
//             this.propButtonPool.put(propButton);
//             delete this.propButtons[propInfo.id];
//         }
//     }
// }
