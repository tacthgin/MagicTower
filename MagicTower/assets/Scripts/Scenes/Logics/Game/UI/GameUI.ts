import { Component, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, Vec3, _decorator } from "cc";
import { BasePoolNode } from "../../../../Framework/Base/BasePoolNode";
import { GameManager } from "../../../../Framework/Managers/GameManager";
import { NotifyCenter } from "../../../../Framework/Managers/NotifyCenter";
import { Util } from "../../../../Framework/Util/Util";
import { GameEvent } from "../../../Constant/GameEvent";
import { HeroAttr, HeroData, HeroEvent, PropType } from "../../../Data/CustomData/HeroData";
import { MapData } from "../../../Data/CustomData/MapData";
import { ElementManager } from "../ElementManager";
import { MonsterIcon } from "./MonsterIcon";
import { PropButton } from "./PropButton";

const { ccclass, property } = _decorator;

@ccclass("GameUI")
export class GameUI extends Component {
    @property(Label)
    private levelLabel: Label = null!;
    @property(Label)
    private heroAttrLabels: Label[] = [];
    @property(Label)
    private equipLabels: Label[] = [];
    @property(Sprite)
    private equipSprites: Sprite[] = [];
    @property(SpriteFrame)
    private keySpriteFrames: SpriteFrame[] = [];
    @property(Prefab)
    private keyPrefab: Prefab = null!;
    @property(Node)
    private keyLayout: Node = null!;
    @property(Prefab)
    private propButtonPrefab: Prefab = null!;
    @property(Node)
    private propButtonLayout: Node = null!;
    @property(Label)
    private monsterLabels: Label[] = [];
    @property(Node)
    private monsterNode: Node = null!;
    @property(Prefab)
    private monsterIconPrefab: Prefab = null!;

    private heroData: HeroData = null!;
    private keys: any = {};
    private propButtons: any = {};
    private monsterSprite: Node = null!;

    onLoad() {
        this.heroData = GameManager.DATA.getData(HeroData)!;
        this.heroData.on(HeroEvent.HERO_ATTR, this.onHeroAttrChanged, this);
        this.heroData.on(HeroEvent.REFRESH_PROP, this.onRefreshProp, this);
        this.heroData.on(HeroEvent.REFRESH_EQUIP, this.onRefreshEquip, this);
        NotifyCenter.on(GameEvent.REFRESH_LEVEL, this.onRefreshLevel, this);
        NotifyCenter.on(GameEvent.REFRESH_ARCHIVE, this.onRefreshArchive, this);
        NotifyCenter.on(GameEvent.MONSTER_FIGHT, this.onMonsterFight, this);
        NotifyCenter.on(GameEvent.MOVE_PATH, this.onMovePath, this);

        for (let i = 0; i < this.keySpriteFrames.length; i++) {
            this.keys[i] = [];
        }

        this.monsterSprite = instantiate(this.monsterIconPrefab);
        this.monsterSprite.position = new Vec3(0, 0, 0);
        this.monsterSprite.parent = this.monsterNode;
        this.monsterSprite.active = false;

        this.loadArchive();
    }

    onDestroy() {
        this.heroData.targetOff(this);
    }

    loadArchive() {
        this.onRefreshArchive();
        let mapData = GameManager.DATA.getData(MapData);
        this.onRefreshLevel(mapData?.level);
    }

    onHeroAttrChanged(attr: HeroAttr) {
        this.heroAttrLabels[attr].string = this.heroData.getAttr(attr).toString();
    }

    onRefreshProp(id: number | string, count: number = 1) {
        let propInfo = GameManager.DATA.getJsonElement("prop", id);
        switch (propInfo.type) {
            case PropType.SWARD:
            case PropType.SHIELD:
                //装备
                let index = propInfo.type - PropType.SWARD;
                this.equipLabels[index].string = propInfo.name;
                this.equipSprites[index].spriteFrame = ElementManager.getInstance().getElementSpriteFrame(propInfo.spriteId);
                break;
            case PropType.KEY:
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
            case PropType.FEATHER:
                let jsonData = GameManager.DATA.getJsonElement("prop", propInfo.id);
                //up
                let strs = ["上", "下"];
                for (let i = 0; i < 2; i++) {
                    let button = this.createPropButton(jsonData, 1);
                    if (button) {
                        let label = button.getChildByName("label")!;
                        label.active = true;
                        label.getComponent(Label)!.string = strs[i];
                    }
                }
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

    onRefreshLevel(level: number) {
        if (level == 0) {
            this.levelLabel.string = "魔塔地下室";
        } else {
            this.levelLabel.string = `魔塔第${Util.formatInt(level)}层`;
        }
    }

    onRefreshArchive() {
        this.refreshHeroAttr();
        let props = this.heroData.getProps();
        for (let id in props) {
            this.onRefreshProp(parseInt(id), props[id]);
        }
        this.onRefreshEquip(PropType.SWARD);
        this.onRefreshEquip(PropType.SHIELD);
    }

    refreshHeroAttr() {
        for (let key in HeroAttr) {
            if (!isNaN(parseInt(key))) {
                this.onHeroAttrChanged(parseInt(key) as any);
            } else {
                break;
            }
        }
    }

    onRefreshEquip(propType: PropType) {
        let id = this.heroData.getEquips(propType);
        let index = propType == PropType.SWARD ? 0 : 1;
        if (id == 0) {
            this.equipLabels[index].string = "无";
            this.equipSprites[index].spriteFrame = null;
        } else {
            this.onRefreshProp(id);
        }
    }

    onMovePath() {
        this.refreshMonsterInfo();
    }

    onMonsterFight(monsterInfo: any) {
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
            this.monsterSprite.getComponent(MonsterIcon)?.init(monsterInfo.id);
        }
    }

    createKey(propInfo: any) {
        let index = propInfo.id - 1;
        let key = GameManager.POOL.createPrefabNode(this.keyPrefab, null, true);
        if (key) {
            key.getComponent(Sprite)!.spriteFrame = this.keySpriteFrames[index];
            key.setSiblingIndex(this.keySpriteFrames.length - index);
            key.parent = this.keyLayout;
            this.keys[index].push(key);
        }
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
        if (propButton) {
            let control = propButton.getComponent(PropButton)!;
            control.init(propInfo);
            control.setNum(num);
            propButton.parent = this.propButtonLayout;
            this.propButtons[propInfo.id] = control;
        }
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
