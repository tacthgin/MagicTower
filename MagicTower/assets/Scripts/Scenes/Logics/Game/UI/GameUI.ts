import { _decorator, Component, Label, Sprite, SpriteFrame, Prefab, Node, NodePool, UITransform, Vec3 } from "cc";
import { BasePoolNode } from "../../../../Framework/Base/BasePoolNode";
import { GameManager } from "../../../../Framework/Managers/GameManager";
import { NotifyCenter } from "../../../../Framework/Managers/NotifyCenter";
import { Util } from "../../../../Framework/Util/Util";
import { GameEvent } from "../../../Constant/GameEvent";
import { HeroAttr, HeroData, HeroEvent, PropType } from "../../../Data/CustomData/HeroData";
import { MonsterIcon } from "./MonsterIcon";
import { PropButton } from "./PropButton";

const { ccclass, property } = _decorator;

@ccclass("GameUI")
export class GameUI extends Component {
    @property(Label)
    levelLabel: Label = null;
    @property(Label)
    heroAttrLabels: Label[] = [];
    @property(Label)
    equipLabels: Label[] = [];
    @property(Sprite)
    equipSprites: Sprite[] = [];
    @property(SpriteFrame)
    keySpriteFrames: SpriteFrame[] = [];
    @property(Prefab)
    keyPrefab: Prefab = null;
    @property(Node)
    keyLayout: Node = null;
    @property(Prefab)
    propButtonPrefab: Prefab = null;
    @property(Node)
    propButtonLayout: Node = null;
    @property(Label)
    monsterLabels: Label[] = [];
    @property(Node)
    monsterNode: Node = null;

    private heroData: HeroData = null;
    private keys: any = {};
    private propButtons: any = {};
    private monsterSprite: Node = null;

    onLoad() {
        this.heroData = GameManager.DATA.getData(HeroData);
        this.heroData.on(HeroEvent.HERO_ATTR, this.heroAttrChanged, this);
        this.heroData.on(HeroEvent.REFRESH_PROP, this.refreshProp, this);
        this.heroData.on(HeroEvent.REFRESH_EQUIP, this.refreshEquip, this);
        NotifyCenter.on(GameEvent.REFRESH_LEVEL, this.refreshLevel, this);
        NotifyCenter.on(GameEvent.REFRESH_ARCHIVE, this.refreshArchive, this);
        NotifyCenter.on(GameEvent.MONSTER_FIGHT, this.monsterFight, this);
        NotifyCenter.on(GameEvent.MOVE_PATH, this.movePath, this);

        for (let i = 0; i < this.keySpriteFrames.length; i++) {
            this.keys[i] = [];
        }

        this.monsterSprite = GameManager.POOL.createPrefabNode("MonsterIcon");
        this.monsterSprite.position = new Vec3(0, 0, 0);
        this.monsterSprite.parent = this.monsterNode;
        this.monsterSprite.active = false;
    }

    onDestroy() {
        this.heroData.targetOff(this);
    }

    heroAttrChanged(attr: HeroAttr) {
        this.heroAttrLabels[attr].string = this.heroData.getAttr(attr).toString();
    }

    refreshProp(id: number, count: number = 1) {
        let propInfo = GameManager.DATA.getJsonElement("prop", id);
        switch (propInfo.type) {
            case PropType.SWARD:
            case PropType.SHIELD:
                //装备
                let index = propInfo.type - PropType.SWARD;
                this.equipLabels[index].string = propInfo.name;
                this.equipSprites[index].spriteFrame = GameManager.RESOURCE.getSpriteFrame(propInfo.spriteId);
                break;
            case 1:
                //钥匙
                if (count < 0) {
                    for (let i = 0; i < -count; i++) {
                        this.removeKey(propInfo);
                    }
                } else {
                    //钥匙最多18个
                    let childrenCount = this.keyLayout.children.length;
                    if (childrenCount + count > 18) {
                        count = 18 - childrenCount;
                    }
                    for (let i = 0; i < count; i++) {
                        this.createKey(propInfo);
                    }
                }
                break;
            case 9:
                let jsonData = GameManager.DATA.getJsonElement("prop", propInfo.id);
                //up
                let button = this.createPropButton(jsonData, 1);
                let label = button.getChildByName("label");
                label.active = true;
                label.getComponent(Label).string = "上";
                //down
                button = this.createPropButton(jsonData, 1);
                label = button.getChildByName("label");
                label.active = true;
                label.getComponent(Label).string = "下";
                break;
            default:
                if (!propInfo.consumption) {
                    let propNum = this.heroData.getPropNum(propInfo.id);
                    if (propNum <= 0) {
                        this.removePropButton(propInfo);
                    } else if (!this.propButtons[propInfo.id]) {
                        this.createPropButton(propInfo, propNum);
                    } else {
                        this.propButtons[propInfo.id].setNum(propNum);
                    }
                }
                break;
        }
    }

    refreshLevel(level: number) {
        if (level == 0) {
            this.levelLabel.string = "魔塔地下室";
        } else {
            this.levelLabel.string = `魔塔第${Util.formatInt(level)}层`;
        }
    }

    refreshArchive() {
        this.refreshHeroAttr();
        let props = this.heroData.getProps();
        let prop = null;
        for (let id in props) {
            this.refreshProp(parseInt(id), props[id]);
        }
        this.refreshEquip(PropType.SWARD);
        this.refreshEquip(PropType.SHIELD);
    }

    refreshHeroAttr() {
        for (let key in HeroAttr) {
            this.heroAttrChanged(HeroAttr[key]);
        }
    }

    refreshEquip(propType: PropType) {
        let id = this.heroData.getEquips(propType);
        let index = propType == PropType.SWARD ? 0 : 1;
        if (id == 0) {
            this.equipLabels[index].string = "无";
            this.equipSprites[index].spriteFrame = null;
        } else {
            this.refreshProp(id);
        }
    }

    movePath() {
        this.refreshMonsterInfo();
    }

    monsterFight(monsterInfo: any) {
        this.refreshHeroAttr();
        this.refreshMonsterInfo(monsterInfo);
    }

    refreshMonsterInfo(monsterInfo: any = null) {
        this.monsterLabels[0].string = monsterInfo ? monsterInfo.name : "怪物名字";
        this.monsterLabels[1].string = monsterInfo ? monsterInfo.hp : "生命";
        this.monsterLabels[2].string = monsterInfo ? monsterInfo.attack : "攻击";
        this.monsterLabels[3].string = monsterInfo ? monsterInfo.defence : "防御";
        this.monsterSprite.active = monsterInfo != null;
        if (monsterInfo) {
            this.monsterSprite.getComponent(MonsterIcon).init(monsterInfo.id);
        }
    }

    createKey(propInfo: any) {
        let index = propInfo.id - 1;
        let key = GameManager.POOL.createPrefabNode(this.keyPrefab, true);
        key.getComponent(Sprite).spriteFrame = this.keySpriteFrames[index];
        key.getComponent(UITransform).priority = this.keySpriteFrames.length - index;
        key.parent = this.keyLayout;
        this.keys[index].push(key);
        return key;
    }

    removeKey(propInfo: any) {
        if (this.keys.length == 0) return;
        let index = propInfo.id - 1;
        let key = this.keys[index].pop();
        if (key) {
            key.getComponent(BasePoolNode).remove();
        }
    }

    createPropButton(propInfo: any, num: number) {
        let propButton = GameManager.POOL.createPrefabNode(this.propButtonPrefab);
        let control = propButton.getComponent(PropButton);
        control.init(propInfo);
        control.setNum(num);
        propButton.parent = this.propButtonLayout;
        this.propButtons[propInfo.id] = control;
        return propButton;
    }

    removePropButton(propInfo: any) {
        let propButton = this.propButtons[propInfo.id];
        if (propButton) {
            propButton.remove();
            delete this.propButtons[propInfo.id];
        }
    }
}
