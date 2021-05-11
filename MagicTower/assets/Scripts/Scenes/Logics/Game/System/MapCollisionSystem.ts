import { Vec2 } from "cc";
import { GameManager } from "../../../../Framework/Managers/GameManager";
import { NotifyCenter } from "../../../../Framework/Managers/NotifyCenter";
import { GameEvent } from "../../../Constant/GameEvent";
import { GameMap } from "../Map/GameMap";
import { Hero } from "../Map/Hero";
import { CalculateSystem } from "./CalculateSystem";
import { MonsterFightSystem } from "./MonsterFightSystem";
import { NpcInteractiveSystem } from "./NpcInteractiveSystem";

export class MapCollisionSystem {
    private gameMap: GameMap = null;
    private hero: Hero = null;

    init(gameMap: GameMap, hero: Hero) {
        this.gameMap = gameMap;
        this.hero = hero;
    }

    /**
     * 英雄和地图元素的交互
     * @param tile 交互坐标
     * @returns true表示交互结束，false表示交互正在进行
     */
    collision(tile: Vec2) {
        let layer = this.gameMap.getTileLayer(tile);

        switch (layer.getLayerName()) {
            case "prop":
                GameManager.AUDIO.playEffect("eat");
                this.hero.addProp(element.propInfo.id);
                this.removeElement(index, tileType);
                return true;
            case "door":
                return this.doorCollision(index, element);
            case "stair":
                if (!element.hide) {
                    NotifyCenter.emit(GameEvent.SWITCH_LEVEl, element);
                }
                return true;
            case "monster":
                {
                    if (!CalculateSystem.canHeroAttack(this.hero.HeroData, element.monsterInfo, !element.firstAttack)) {
                        GameManager.getInstance().showToast(`你打不过${element.monsterInfo.name}`);
                        return true;
                    }
                    new MonsterFightSystem().init(index, element, this, this.hero).execute(this.haveMagicHurt(index));
                }
                break;
            case "npc":
                new NpcInteractiveSystem().init(index, element, this, this.hero).execute();
                break;
            case "building":
                this.gotoShop();
                break;
            case "event":
                this.eventCollision(element.id);
                break;
            case "floor":
                return this.floorCollision(index);
            default:
                return true;
        }
        return false;
    }
}
