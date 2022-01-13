import { Component, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, Vec3, _decorator } from "cc";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { GameFrameworkLog } from "../../../../GameFramework/Scripts/Base/Log/GameFrameworkLog";
import { GameEventArgs } from "../../../../GameFramework/Scripts/Event/GameEventArgs";
import { Utility } from "../../../../GameFramework/Scripts/Utility/Utility";
import { HeroAttr } from "../../../Model/HeroModel/HeroAttr";
import { HeroEvent } from "../../../Model/HeroModel/HeroEvent";
import { HeroModel } from "../../../Model/HeroModel/HeroModel";
import { HeroAttrEventArgs, HeroPropEventArgs } from "../../../Model/HeroModel/HeroModelEventArgs";
import { PropType } from "../../../Model/HeroModel/PropType";
import { MonsterInfo } from "../../../Model/MapModel/Data/Elements/Monster";
import { MapEvent } from "../../../Model/MapModel/MapEvent";
import { MapModel } from "../../../Model/MapModel/MapModel";
import { GameEvent } from "../../Event/GameEvent";
import { MonsterFightEventArgs } from "../../Event/MonsterFightEventArgs";
import { ElementFactory } from "../Map/ElementFactory";
import { MonsterIcon } from "./MonsterIcon";
import { PropButton } from "./PropButton";

const { ccclass, property } = _decorator;

const MAX_KEY_COUNT: number = 18;
const STAIR_NAMES: string[] = ["上", "下"];

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

    private heroModel: HeroModel = null!;
    private mapModel: MapModel = null!;
    private keys: Map<number, Array<Node>> = new Map<number, Array<Node>>();
    private propButtons: Map<number, PropButton> = new Map<number, PropButton>();
    private monsterSprite: Node = null!;

    onLoad() {
        this.registerEvent();
        this.initUI();
    }

    onDestroy() {
        this.heroModel.unsubscribeTarget(this);
        this.mapModel.unsubscribeTarget(this);
        GameApp.EventManager.unsubscribeTarget(this);
    }

    start() {
        this.loadArchive();
    }

    loadArchive() {
        this.refreshHeroAttr();
        this.refreshProps();
        this.refreshLevel(this.mapModel.level);
    }

    private registerEvent() {
        this.heroModel = GameApp.getModel(HeroModel);
        this.heroModel.subscribe(HeroEvent.HERO_ATTR, this.onHeroAttrChanged, this);
        this.heroModel.subscribe(HeroEvent.REFRESH_PROP, this.onRefreshProp, this);
        this.heroModel.subscribe(HeroEvent.REFRESH_EQUIP, this.onRefreshEquip, this);

        this.mapModel = GameApp.getModel(MapModel);
        this.mapModel.subscribe(MapEvent.SWITCH_LEVEL, this.onRefreshLevel, this);

        let eventManager = GameApp.EventManager;
        eventManager.subscribe(GameEvent.REFRESH_ARCHIVE, this.onRefreshArchive, this);
        eventManager.subscribe(GameEvent.MONSTER_FIGHT, this.onMonsterFight, this);
        eventManager.subscribe(GameEvent.MOVE_PATH, this.onMovePath, this);
    }

    private initUI() {
        for (let i = 0; i < this.keySpriteFrames.length; i++) {
            this.keys.set(i, new Array<Node>());
        }

        this.monsterSprite = instantiate(this.monsterIconPrefab);
        this.monsterSprite.position = new Vec3(0, 0, 0);
        this.monsterSprite.parent = this.monsterNode;
        this.monsterSprite.active = false;

        GameApp.NodePoolManager.createNodePool(PropButton);
        GameApp.NodePoolManager.createNodePool("key");
    }

    private onHeroAttrChanged(sender: object, event: HeroAttrEventArgs) {
        this.heroAttrLabels[event.attr].string = event.attrValue.toString();
    }

    private onRefreshProp(sender: object, event: HeroPropEventArgs) {
        let propInfo = Utility.Json.getJsonElement("prop", event.propTypeOrId) as any;
        if (propInfo) {
            this.refreshProp(event.propTypeOrId, event.propValue);
        } else {
            GameFrameworkLog.error(`prop id:${event.propTypeOrId} does not exist`);
        }
    }

    private onRefreshEquip(sender: object, event: HeroPropEventArgs) {
        this.refreshEquip(event.propTypeOrId, event.propValue);
    }

    private onRefreshLevel(sender: object, event: HeroPropEventArgs) {}

    private onRefreshArchive(sender: object, event: GameEventArgs) {
        this.loadArchive();
    }

    private onMovePath() {
        this.refreshMonsterInfo();
    }

    private onMonsterFight(sender: object, eventArgs: MonsterFightEventArgs) {
        this.refreshHeroAttr();
        this.refreshMonsterInfo(eventArgs.monsterInfo);
    }

    private refreshHeroAttr() {
        for (let i = HeroAttr.HP; i <= HeroAttr.GOLD; ++i) {
            this.heroAttrLabels[i].string = this.heroModel.getAttr(i).toString();
        }
    }

    private refreshProps() {
        this.heroModel.forEachProps((propId, count) => {
            this.refreshProp(propId, count);
        });
        this.refreshEquip(PropType.SWARD, this.heroModel.getEquips(PropType.SWARD));
        this.refreshEquip(PropType.SHIELD, this.heroModel.getEquips(PropType.SHIELD));
    }

    private refreshProp(propId: number | string, count: number = 1) {
        let propInfo = Utility.Json.getJsonElement("prop", propId) as any;
        if (propInfo) {
            switch (propInfo.type) {
                case PropType.KEY:
                    //钥匙
                    if (count < 0) {
                        for (let i = 0; i < -count; i++) {
                            this.removeKey(propInfo);
                        }
                    } else {
                        //钥匙最多18个
                        let childrenCount = this.keyLayout.children.length;
                        if (childrenCount + count > MAX_KEY_COUNT) {
                            count = MAX_KEY_COUNT - childrenCount;
                        }
                        for (let i = 0; i < count; i++) {
                            this.createKey(propInfo);
                        }
                    }
                    break;
                case PropType.FEATHER:
                    //up
                    for (let i = 0; i < STAIR_NAMES.length; i++) {
                        let button = this.createPropButton(propInfo, 1);
                        if (button) {
                            let label = button.getChildByName("label")!;
                            label.active = true;
                            label.getComponent(Label)!.string = STAIR_NAMES[i];
                        }
                    }
                    break;
                default:
                    if (!propInfo.consumption) {
                        let propNum = this.heroModel.getPropNum(propInfo.id);
                        if (propNum <= 0) {
                            this.removePropButton(propInfo);
                        } else {
                            let propButton = this.propButtons.get(propInfo.id);
                            if (propButton) {
                                propButton.setNum(propNum);
                            } else {
                                this.createPropButton(propInfo, propNum);
                            }
                        }
                    }
                    break;
            }
        } else {
            GameFrameworkLog.error(`prop id:${propId} does not exist`);
        }
    }

    private refreshEquip(equipType: PropType, equipId: number) {
        let index = equipType == PropType.SWARD ? 0 : 1;
        if (equipId == 0) {
            this.equipLabels[index].string = "无";
            this.equipSprites[index].spriteFrame = null;
        } else {
            let equipInfo = Utility.Json.getJsonElement("prop", equipId) as any;
            if (equipInfo) {
                this.equipLabels[index].string = equipInfo.name;
                this.equipSprites[index].spriteFrame = ElementFactory.getElementSpriteFrame(equipInfo.spriteId);
            } else {
                GameFrameworkLog.error(`prop id:${equipId} does not exist`);
            }
        }
    }

    private refreshLevel(level: number) {
        if (level == 0) {
            this.levelLabel.string = "魔塔地下室";
        } else {
            this.levelLabel.string = `魔塔第${Utility.Text.formatNumberWidth(level)}层`;
        }
    }

    private refreshMonsterInfo(monsterInfo: MonsterInfo | null = null) {
        this.monsterLabels[0].string = monsterInfo ? monsterInfo.name : "怪物名字";
        this.monsterLabels[1].string = monsterInfo ? monsterInfo.hp.toString() : "生命";
        this.monsterLabels[2].string = monsterInfo ? monsterInfo.attack.toString() : "攻击";
        this.monsterLabels[3].string = monsterInfo ? monsterInfo.defence.toString() : "防御";
        this.monsterSprite.active = monsterInfo != null;
        if (monsterInfo) {
            this.monsterSprite.getComponent(MonsterIcon)?.init(parseInt(monsterInfo.id));
        }
    }

    private async createKey(propInfo: any) {
        let index = propInfo.id - 1;
        let key = GameApp.NodePoolManager.createNode("key", this.keyPrefab) as Node;
        if (key) {
            key.getComponent(Sprite)!.spriteFrame = this.keySpriteFrames[index];
            key.setSiblingIndex(this.keySpriteFrames.length - index);
            key.parent = this.keyLayout;
            let keys = this.keys.get(index);
            if (keys) {
                keys.push(key);
            }
        }
        return key;
    }

    private removeKey(propInfo: any) {
        let index = propInfo.id - 1;
        let keys = this.keys.get(index);
        if (keys) {
            let key = keys.pop();
            if (key) {
            }
        }
    }

    private createPropButton(propInfo: any, num: number) {
        let propButton = GameApp.NodePoolManager.createNode(PropButton, this.propButtonPrefab) as Node;
        if (propButton) {
            let control = propButton.getComponent(PropButton)!;
            control.init(propInfo);
            control.setNum(num);
            propButton.parent = this.propButtonLayout;
            this.propButtons.set(propInfo.id, control);
        }
        return propButton;
    }

    private removePropButton(propInfo: any) {
        let propButton = this.propButtons.get(propInfo.id);
        if (propButton) {
            this.propButtons.delete(propInfo.id);
            GameApp.NodePoolManager.releaseNode(PropButton, propButton.node);
        }
    }
}
