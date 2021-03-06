import { v2, Vec2 } from "cc";
import { GameManager } from "../../../../Framework/Managers/GameManager";
import { NotifyCenter } from "../../../../Framework/Managers/NotifyCenter";
import { GameEvent } from "../../../Constant/GameEvent";
import { MapData } from "../../../Data/CustomData/MapData";
import { GameMap } from "../Map/GameMap";
import { Hero } from "../Map/Hero";
import { CalculateSystem } from "./CalculateSystem";
import { MonsterFightSystem } from "./MonsterFightSystem";
import { NpcInteractiveSystem } from "./NpcInteractiveSystem";

/** 在楼梯旁的index差值 */
let INDEX_DIFFS = [1, 11];

/** 地块4个方向 */
let DIRECTION_INDEX_DIFFS = {
    "-1": v2(1, 0),
    "1": v2(-1, 0),
    "-11": v2(0, -1),
    "11": v2(0, 1),
};

/** 英雄面朝方向上，右，下，左 */
let HERO_FACE_DIRECTION = [-11, 1, 11, -1];

export class MapCollisionSystem {
    private gameMap: GameMap = null!;
    private hero: Hero = null!;

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
        let { layerName, spriteFrame } = this.gameMap.getTileInfo(tile);
        if (!layerName) return true;
        let jsonData = this.getJsonData(layerName, spriteFrame!.name);
        let mapData = GameManager.DATA.getData(MapData);
        switch (layerName) {
            case "prop":
                GameManager.AUDIO.playEffect("eat");
                this.hero.heroData.addProp(jsonData.id, mapData?.level);
                this.gameMap.setTileGIDAt(layerName, tile, 0);
                return true;
            case "door":
                return this.doorCollision(index, element);
            case "stair":
                NotifyCenter.emit(GameEvent.SWITCH_LEVEl, element);
                return true;
            case "monster":
                {
                    if (!CalculateSystem.canHeroAttack(this.hero.heroData, element.monsterInfo, !element.firstAttack)) {
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

    getJsonData(layerName: string, spriteFrameName: string) {
        if (!spriteFrameName) return null;
        let name = spriteFrameName.split("_")[0];
        switch (layerName) {
            case "prop":
            case "monster":
                return GameManager.DATA.getJsonParser(layerName)?.getJsonElementByKey("spriteID", name);
        }
    }

    show() {
        //跨层事件
        //let eventId = this.eventInfo.get(this.mapData.level);
        //if (eventId) {
        //this.excuteEvent(eventId);
        //this.eventInfo.clear(this.mapData.level);
        //}
    }

    private parseLayer(layerName: string, info: any) {
        //this.layers[layerName] = {};
        //this.monsterInfo.magicHurt = {};
        //if (!info) return;
        //switch (layerName) {
        //case "wall":
        //this.parseWall(layerName, info);
        //break;
        //case "door":
        //this.parseDoor(layerName, info);
        //break;
        //case "prop":
        //this.parseTile(layerName, info, "Prop");
        //break;
        //case "monster":
        //this.parseMonster(layerName, info);
        //解析怪物魔法伤害
        //this.parseMagicHurt();
        //break;
        //case "stair":
        //this.parseStair(layerName, info);
        //break;
        //case "npc":
        //this.parseTile(layerName, info, "Npc");
        //break;
        //case "building":
        //this.parseBuilding(layerName, info);
        //break;
        //case "event":
        //this.parseEvent(layerName, info);
        //break;
        //case "damage":
        //this.parseDamage(info);
        //break;
        //default:
        //break;
        //}
    }
    private parseWall(layerName: string, info: any) {
        //for (let name in info) {
        //info[name].forEach((tileIndex) => {
        //this.addElement(tileIndex, layerName, "Common", name).node.zIndex = 2;
        //});
        //}
    }

    private parseDoor(layerName: string, info: any) {
        //info.tile.forEach((elementInfo) => {
        //this.addElement(elementInfo[0], layerName, "Door", elementInfo[1]).node.zIndex = 2;
        //});
        //if (info.passive) {
        //info.passive.forEach((index) => {
        //this.getElement(index, layerName).passive = true;
        //});
        //}
        //if (info.appear) {
        //info.appear.forEach((index) => {
        //this.getElement(index, layerName).appear = true;
        //});
        //}
        //if (info.hide) {
        //this.getElement(info.hide, layerName).hide = true;
        //}
        //if (info.monsterCondition) {
        //for (let doorIndex in info.monsterCondition) {
        //this.getElement(doorIndex, layerName).condition = info.monsterCondition[doorIndex];
        //this.doorInfo.monsterCondition = {};
        //this.doorInfo.monsterCondition[info.monsterCondition[doorIndex]] = doorIndex;
        //}
        //}
        //this.doorInfo.monsterDoor = Util.clone(info.monster);
        //this.doorInfo.appearEventDoor = Util.clone(info.appearEvent);
        //this.doorInfo.disappearEventDoor = Util.clone(info.disappearEvent);
    }
    private parseMonster(layerName: string, info: any) {
        //if (!info) return;
        //if (info.tile) {
        //info.tile.forEach((elementInfo) => {
        //let element = this.addElement(elementInfo[0], layerName, "Monster", elementInfo[1]);
        //element.node.zIndex = 1;
        //if (element.monsterInfo.big) {
        //this.monsterInfo.bigMonster = element.monsterInfo.big;
        //}
        //});
        //}
        //if (info.monsterEvent) {
        //this.monsterInfo.monsterEvent = Util.clone(info.monsterEvent);
        //}
        //if (info.firstAttack) {
        //info.firstAttack.forEach((index) => {
        //this.getElement(index, layerName).firstAttack = true;
        //});
        //}
        //if (info.monsterMove) {
        //info.monsterMove.forEach((index) => {
        //this.getElement(index, layerName).monsterMove = true;
        //});
        //}
    }
    private parseStair(layerName: string, info: any) {
        //let hide = info.hide;
        //if (hide) {
        //delete info.hide;
        //}
        //for (let key in info) {
        //this.addElement(info[key][0], layerName, "Stair", key, info[key][1], info[key][2]);
        //}
        //if (hide) {
        //let stair = this.getElement(hide[0], layerName);
        //stair.hide = true;
        //stair.node.active = false;
        //}
    }
    private parseBuilding(layerName: string, info: any) {
        //info.forEach((tileIndex) => {
        //this.addElement(tileIndex, layerName, "Shop");
        //});
    }
    private parseEvent(layerName: string, info: any) {
        //info.forEach((elementInfo) => {
        //this.addElement(elementInfo[0], layerName, "EventTrigger", elementInfo[1]);
        //});
    }
    private parseDamage(info: any) {
        //魔法警卫
        //this.monsterInfo.magicHurt.magic = {};
        //for (let index in info) {
        //this.monsterInfo.magicHurt.magic[index] = info[index];
        //}
    }
    /**
     * 获取巫师周围伤害地块index
     * @param index
     */
    private getMagicHurtIndexs(index: number) {
        //let indexs = [];
        //for (let diff in DIRECTION_INDEX_DIFFS) {
        //let coord = this.indexToTile(index).add(DIRECTION_INDEX_DIFFS[diff]);
        //if (this.inBoundary(coord)) {
        //let { tileType } = this.getTileLayer(coord);
        //if (tileType == "floor" || tileType == "door") {
        //indexs.push(index + parseInt(diff));
        //}
        //}
        //}
        //return indexs;
    }
    private parseMagicHurt() {
        //解析巫师的伤害tile
        //let layer = this.layers["monster"];
        //let targetIndexs = Object.keys(layer).filter((index: string) => {
        //let magicAttack = layer[index].monsterInfo.magicAttack;
        //if (magicAttack) {
        //return magicAttack >= 1;
        //}
        //return false;
        //});
        //let wizard = {};
        //if (targetIndexs.length > 0) {
        //targetIndexs.forEach((index) => {
        //let indexs = this.getMagicHurtIndexs(parseInt(index));
        //indexs.forEach((hurtIndex) => {
        //if (!wizard[hurtIndex]) {
        //wizard[hurtIndex] = [];
        //}
        //wizard[hurtIndex].push(parseInt(index));
        //});
        //});
        //}
        //this.monsterInfo.magicHurt.wizard = wizard;
    }
    /**
     * 是否终点tile可以移动
     * @param tile tile坐标
     * @returns -1不能走，0可走但提留在前一格，1可走
     */
    canEndTileMove(tile: Vec2) {
        //let { tileType, element, index } = this.getTileLayer(tile);
        //switch (tileType) {
        //case "floor":
        //return this.hero.HeroData.Hp > this.getWizardMagicDamage(index);
        //case "monster":
        //return CalculateSystem.canHeroAttack(this.hero.HeroData, element.monsterInfo, !element.firstAttack);
        //case "door":
        //return element.hide;
        //}
        //return this.canEndMoveTiles.indexOf(tileType) != -1;
        return true;
    }
    private heroMoveJudge(tile: Vec2, endTile: Vec2) {
        let { tileType, index } = this.getTileLayer(tile);
        if (
            (this.monsterInfo.bigMonster && this.monsterInfo.bigMonster.indexOf(index) != -1) ||
            this.hero.HeroData.Hp <= this.getWizardMagicDamage(index)
        )
            return false;
        if (tile.equals(endTile)) {
            //假设终点都可以走，然后在门和npc这种类型停在寻路前一格
            return true;
        } else {
            //中途过程遇到事件也可以走
            return tileType == "floor" || tileType == "event" || tileType == "prop";
        }
    }
    private elementMoveJudge(tile: Vec2) {
        let { tileType } = this.getTileLayer(tile);
        return tileType == "floor" || tileType == "monster" || tileType == "event" || tileType == "stair";
    }

    /** astar判断是否可行走 */
    isEmpty(tile: Vec2, endTile: Vec2) {
        switch (this._astarMoveType) {
            case "hero":
                return this.heroMoveJudge(tile, endTile);
            default:
                return this.elementMoveJudge(tile);
        }
    }
    /** 勇士在楼梯旁边 */
    isHeroNextToStair() {
        //for (let index in this.layers["stair"]) {
        //let diff = Math.abs(parseInt(index) - this.tileToIndex(this.hero.HeroData.Position));
        //if (INDEX_DIFFS.indexOf(diff) != -1) {
        //return true;
        //}
        //}
        //return false;
    }

    getTileLayer(tile: Vec2) {
        let layers = this.getLayers();
        let layer = null;
        for (let i = 0; i < layers.length; i++) {
            if (layers[i].getTileGIDAt(tile.x, tile.y) != 0) {
                layer = layers[i];
            }
        }

        return layer;
    }

    /**
     * 地图上转移元素
     * @param srcIndex 原始位置
     * @param dstIndex 目标位置
     * @param layerName 层名
     * @param control 元素控制器
     */
    changeElementInfo(srcIndex: number, dstIndex: number, layerName: string, control: any) {
        //this.removeElement(srcIndex, layerName, false);
        //let layer = this.layers[layerName];
        //if (layer) {
        //layer[dstIndex] = control;
        //}
    }

    /**
     * 勇士和地块之间的交互，返回为false，表示交互有延迟，是异步的，true表示交互完成
     * @param tile tile坐标
     */
    collision(tile: Vec2) {
        //let { tileType, element, index } = this.getTileLayer(tile);
        //switch (tileType) {
        //case "prop":
        //SoundManager.playEffect("eat");
        //this.hero.addProp(element.propInfo.id);
        //this.removeElement(index, tileType);
        //return true;
        //case "door":
        //return this.doorCollision(index, element);
        //case "stair":
        //if (!element.hide) {
        //NotifyCenter.emit(GameEvent.SWITCH_LEVEl, element);
        //}
        //return true;
        //case "monster":
        //{
        //if (!CalculateSystem.canHeroAttack(this.hero.HeroData, element.monsterInfo, !element.firstAttack)) {
        //GameManager.getInstance().showToast(`你打不过${element.monsterInfo.name}`);
        //return true;
        //}
        //new MonsterFightSystem().init(index, element, this, this.hero).execute(this.haveMagicHurt(index));
        //}
        //break;
        //case "npc":
        //new NpcInteractiveSystem().init(index, element, this, this.hero).execute();
        //break;
        //case "building":
        //this.gotoShop();
        //break;
        //case "event":
        //this.eventCollision(element.id);
        //break;
        //case "floor":
        //return this.floorCollision(index);
        //default:
        //return true;
        //}
        //return false;
    }
    private monsterDie(monster: Monster, index: number, magic: boolean) {
        //幸运金币
        //let ratio = this.hero.HeroData.getPropNum(27) ? 2 : 1;
        //this.hero.HeroData.Gold += monster.monsterInfo.gold * ratio;
        //this.removeElement(index, "monster");
        //this.removeMonsterDoor();
        //this.monsterEventTrigger(index);
        //this.removeMagicHurt(index, monster);
        //if (monster.monsterInfo.big) {
        //this.monsterInfo.bigMonster = null;
        //}
        //if (this.doorInfo.monsterCondition) {
        //let doorIndex = this.doorInfo.monsterCondition[index];
        //if (doorIndex) {
        //let door = this.getElement(doorIndex, "door");
        //if (door) {
        //door.condition = null;
        //}
        //}
        //delete this.doorInfo.monsterCondition[index];
        //}
        //if (monster.monsterInfo.eventId) {
        //this.eventCollision(monster.monsterInfo.eventId);
        //} else if (this.gameEventSystem && !this.gameEventSystem.executeComplete()) {
        //this.gameEventSystem.execute();
        //} else if (magic) {
        //this.floorCollision(index);
        //} else {
        //this.elementActionComplete();
        //}
    }
    private removeMonsterDoor() {
        //if (!this.doorInfo.monsterDoor) return;
        //let monsterIndexs = null;
        //let needDeletesIndexs = [];
        //let clearFlag = false;
        //for (let index in this.doorInfo.monsterDoor) {
        //monsterIndexs = index.split(",");
        //clearFlag = true;
        //for (let i = 0; i < monsterIndexs.length; i++) {
        //if (this.layers["monster"][monsterIndexs[i]]) {
        //clearFlag = false;
        //break;
        //}
        //}
        //if (clearFlag) {
        //needDeletesIndexs.push(index);
        //}
        //}
        //if (needDeletesIndexs.length > 0) {
        //SoundManager.playEffect("door");
        //}
        //needDeletesIndexs.forEach((index) => {
        //this.doorInfo.monsterDoor[index].forEach((doorIndex) => {
        //this.removeElement(doorIndex, "door");
        //});
        //delete this.doorInfo.monsterDoor[index];
        //});
    }
    private monsterEventTrigger(monsterIndex: number) {
        //if (!this.monsterInfo.monsterEvent) return;
        //let id = null;
        //for (let eventId in this.monsterInfo.monsterEvent) {
        //let eventInfo = this.monsterInfo.monsterEvent[eventId];
        //let index = eventInfo.tile.indexOf(monsterIndex);
        //if (index != -1) {
        //eventInfo.tile.splice(index, 1);
        //if (eventInfo.tile.length == 0) {
        //if (eventInfo.condition) {
        //let exist = true;
        //for (let i = 0; i < eventInfo.condition.length; i++) {
        //if (!this.getElement(eventInfo.condition[i], "monster")) {
        //exist = false;
        //break;
        //}
        //}
        //if (exist) {
        //id = eventId;
        //}
        //} else {
        //id = eventId;
        //}
        //}
        //}
        //if (this.monsterInfo.monsterEvent[eventId].length == 0) {
        //}
        //}
        //if (id != null) {
        //this.monsterInfo.monsterEvent = null;
        //this.eventCollision(id);
        //}
    }
    private removeMagicHurt(index: number, monster: Monster) {
        //let magicHurt = monster.monsterInfo.magicAttack;
        //if (magicHurt) {
        //if (magicHurt < 1) {
        //for (let tileIndex in this.monsterInfo.magicHurt.magic) {
        //if (this.monsterInfo.magicHurt.magic[tileIndex].indexOf(index) != -1) {
        //delete this.monsterInfo.magicHurt.magic[tileIndex];
        //}
        //}
        //} else {
        //this.parseMagicHurt();
        //}
        //}
    }
    /** 返回值为false表示异步 */
    private doorCollision(index: number, element: Door) {
        //if (element.canWallOpen()) {
        //墙门
        //this.removeElement(index, "door");
        //return false;
        //} else if (element.appear) {
        //if (!element.node.active) {
        //隐藏的墙门
        //element.add();
        //门事件
        //if (this.doorInfo.appearEventDoor) {
        //for (let eventId in this.doorInfo.appearEventDoor) {
        //let indexs = this.doorInfo.appearEventDoor[eventId];
        //indexs.splice(indexs.indexOf(index), 1);
        //if (indexs.length != 0) {
        //this.eventCollision(eventId);
        //}
        //}
        //}
        //}
        //return true;
        //} else if (!element.hide && !element.passive) {
        //let keyId = this.propParser.getKeyByDoor(element.id);
        //if (keyId && this.hero.HeroData.getPropNum(keyId) > 0) {
        //this.hero.removeProp(keyId);
        //this.removeElement(index, "door");
        //this.disappearDoorEventTrigger(index);
        //SoundManager.playEffect("door");
        //return false;
        //} else {
        //GameManager.getInstance().showToast("你无法打开这个门");
        //}
        //}
        //return true;
    }
    private disappearDoorEventTrigger(index: number) {
        //for (let eventId in this.doorInfo.disappearEventDoor) {
        //let info = this.doorInfo.disappearEventDoor[eventId];
        //if (info.condition.indexOf(index) != -1) {
        //delete this.doorInfo.disappearEventDoor[eventId];
        //} else {
        //let disappearIndex = info.tile.indexOf(index);
        //if (disappearIndex != -1) {
        //info.tile.splice(disappearIndex, 1);
        //if (info.tile.length == 0) {
        //delete this.doorInfo.disappearEventDoor[eventId];
        //this.eventCollision(eventId);
        //}
        //}
        //}
        //}
    }
    changePathCoord(path: Vec2[]) {
        //for (let i = 0; i < path.length; i++) {
        //path[i] = this.tileToNodeSpaceAR(path[i]);
        //}
        //return path;
    }
    private gotoShop() {
        //this.shopInfo.level = this.mapData.level;
        //GameManager.getInstance()
        //.showDialog("ShopDialog", this.shopInfo, this.hero.HeroData.Gold, (attr: string) => {
        //switch (attr) {
        //case "hp":
        //this.hero.HeroData.Hp += this.shopInfo.hp;
        //break;
        //case "attack":
        //this.hero.HeroData.Attack += this.shopInfo.attack;
        //break;
        //case "defence":
        //this.hero.HeroData.Defence += this.shopInfo.defence;
        //break;
        //default:
        //break;
        //}
        //if (attr != "no") {
        //this.hero.HeroData.Gold -= this.shopInfo.buy();
        //NotifyCenter.emit(GameEvent.HERO_ATTR_CHANGED);
        //}
        //this.elementActionComplete();
        //})
        //.then((control: any) => {
        //control.node.position = this._dialogPos;
        //});
    }
    eventCollision(eventId: number | string) {
        //let eventInfo = GameManager.DATA.getJsonElement("event", eventId);
        //if (!eventInfo.save || eventInfo.save == this.mapData.level) {
        //this.excuteEvent(eventId);
        //} else {
        //this.eventInfo.put(eventInfo.save, eventId);
        //}
    }
    haveMagicHurt(index: number) {
        //let magic = false;
        //if (!this.hero.HeroData.equipedDivineShield()) {
        //if (this.monsterInfo.magicHurt.wizard) {
        //magic = this.monsterInfo.magicHurt.wizard[index] != undefined;
        //}
        //if (!magic && this.monsterInfo.magicHurt.magic) {
        //magic = this.monsterInfo.magicHurt.magic[index] != undefined;
        //}
        //}
        //return magic;
    }
    /** 获取巫师的魔法伤害 */
    getWizardMagicDamage(index: number) {
        //let totalDamage = 0;
        //if (!this.hero.HeroData.equipedDivineShield()) {
        //if (this.monsterInfo.magicHurt.wizard) {
        //let hurtInfo = this.monsterInfo.magicHurt.wizard[index];
        //if (hurtInfo) {
        //hurtInfo.forEach((monsterIndex) => {
        //let element = this.getElement(monsterIndex, "monster");
        //totalDamage += element.monsterInfo.magicAttack;
        //});
        //}
        //}
        //}
        //return totalDamage;
    }
    floorCollision(index: number) {
        //if (!this.hero.HeroData.equipedDivineShield()) {
        //if (this.monsterInfo.magicHurt.magic) {
        //如果通过魔法守卫中间
        //let hurtInfo = this.monsterInfo.magicHurt.magic[index];
        //if (hurtInfo) {
        //let element = this.getElement(hurtInfo[0], "monster");
        //this.hero.magicDamage(hurtInfo, element.monsterInfo.magicAttack);
        //return false;
        //}
        //}
        //if (this.monsterInfo.magicHurt.wizard) {
        //let wizardDamage = this.getWizardMagicDamage(index);
        //if (this.hero.HeroData.Hp <= wizardDamage) {
        //GameManager.getInstance().showToast("不能过去，你将被巫师杀死！");
        //return true;
        //}
        //如果通过巫师的空地
        //let hurtInfo = this.monsterInfo.magicHurt.wizard[index];
        //if (hurtInfo) {
        //this.hero.magicDamage(hurtInfo, wizardDamage);
        //let monster = this.getElement(hurtInfo[0], "monster");
        //if (monster && monster.monsterMove) {
        //let diff = index - hurtInfo[0];
        //let newIndex = hurtInfo[0] - diff;
        //cc.log(newIndex, this.maxIndex);
        //if (newIndex >= 0 && newIndex <= this.maxIndex && !this.getElement(newIndex)) {
        //monster.move(DIRECTION_INDEX_DIFFS[`${diff}`].mul(this.mapData.tileWidth), () => {
        //this.changeElementInfo(hurtInfo[0], newIndex, "monster", monster);
        //this.parseMagicHurt();
        //});
        //}
        //}
        //return false;
        //}
        //}
        //}
        //return true;
    }
    private excuteEvent(eventId: number | string) {
        //this.gameEventSystem = new GameEventSystem();
        //this.gameEventSystem.init(eventId, this, this.hero).execute();
    }
    clearGameEventSystem() {
        //this.gameEventSystem = null;
    }
    public getStair(stairType: string) {
        //let layer = this.layers["stair"];
        //if (layer) {
        //for (let type in layer) {
        //if (layer[type].stairType == stairType) {
        //return layer[type];
        //}
        //}
        //}
        //return null;
    }

    private elementActionComplete() {
        //NotifyCenter.emit(GameEvent.COLLISION_COMPLETE);
    }
    getMonsters() {
        //let layer = this.layers["monster"];
        //let monsters = {};
        //for (let index in layer) {
        //let monster = layer[index];
        //monsters[monster.monsterInfo.id] = monster;
        //}
        //return Object.keys(monsters)
        //.map((id) => {
        //return monsters[id];
        //})
        //.sort((l, r) => {
        //return parseInt(l.id) - parseInt(r.id);
        //});
    }
    removeHeroFaceWall() {
        //let heroData = this.hero.HeroData;
        //let direction = heroData.Direction;
        //let index = this.tileToIndex(heroData.Position) + HERO_FACE_DIRECTION[direction];
        //let element = this.getElement(index, "wall");
        //if (element && element.isWall()) {
        //this.removeElement(index, "wall");
        //return true;
        //}
        //return false;
    }
    removeAllWalls() {
        //let wallLayer = this.layers["wall"];
        //let length = Object.keys(wallLayer).length;
        //for (let index in wallLayer) {
        //if (wallLayer[index].isWall()) {
        //this.removeElement(index, "wall");
        //}
        //}
        //return length > 0;
    }
    removeLava() {
        //let heroIndex = this.tileToIndex(this.hero.HeroData.Position);
        //HERO_FACE_DIRECTION.forEach((diff) => {
        //let index = heroIndex + diff;
        //let element = this.getElement(index, "wall");
        //if (element && element.isLava()) {
        //this.removeElement(index, "wall");
        //}
        //});
    }
    bomb() {
        //let heroIndex = this.tileToIndex(this.hero.HeroData.Position);
        //let remove = false;
        //HERO_FACE_DIRECTION.forEach((diff) => {
        //let index = heroIndex + diff;
        //let element = this.getElement(index, "monster");
        //if (element && !element.isBoss()) {
        //this.removeElement(index, "monster");
        //remove = true;
        //}
        //});
        //return remove;
    }
    removeYellowDoors() {
        //let doorLayer = this.layers["door"];
        //let remove = false;
        //for (let index in doorLayer) {
        //if (doorLayer[index].isYellow()) {
        //this.removeElement(index, "door");
        //remove = true;
        //}
        //}
        //return remove;
    }
    centrosymmetricFly() {
        //let tile = this.hero.HeroData.Position;
        //let newTile = cc.v2(this.mapData.column - tile.x - 1, this.mapData.row - tile.y - 1);
        //if (this.getElement(this.tileToIndex(newTile)) == null) {
        //this.hero.location(newTile);
        //return true;
        //}
        //return false;
    }

    // getSwitchLevel(stair: Stair) {
    //     let symbol = stair.stairType == "up" ? 1 : -1;
    //     return this.level + symbol * stair.levelDiff;
    // }
    // switchLevelHero(stairType: string) {
    //     if (this.showMap()) {
    //         let standIndex = currentMap.getStair(stairType).standIndex;
    //         this.showHero(currentMap.indexToTile(standIndex));
    //     }
    // }
    // private switchLevel(stair: Stair) {
    //     this.level = this.getSwitchLevel(stair);
    //     //上了楼，勇士站在下楼梯的旁边
    //     this.switchLevelHero(stair.stairType == "up" ? "down" : "up");
    // }
    // private sceneAppear(level: number, tile: Vec2) {
    //     this.node.opacity = 255;
    //     this.level = level;
    //     this.showMap();
    //     this.showHero(tile);
    // }
    // switchLevelTip(swtichType: string) {
    //     let tip = null;
    //     if (swtichType == "down" && this.level == 1) {
    //         tip = "你已经到最下面一层了";
    //     } else if (swtichType == "up" && this.level == 50) {
    //         tip = "你已经到最上面一层了";
    //     }
    //     if (tip) {
    //         GameManager.UI.showToast(tip);
    //         return true;
    //     }
    //     return false;
    // }
    // private useProp(propInfo: any, extraInfo: any) {
    //     if (!currentMap) return;
    //     switch (propInfo.type) {
    //         case 7:
    //             currentMap.showDialog("MonsterHandBook", currentMap.getMonsters());
    //             break;
    //         case 8:
    //             currentMap.showDialog("RecordBook");
    //             break;
    //         case 9:
    //             {
    //                 //飞行魔杖
    //                 if (currentMap.isHeroNextToStair()) {
    //                     if (this.switchLevelTip(extraInfo)) {
    //                         return;
    //                     }
    //                     let stair = currentMap.getStair(extraInfo);
    //                     if (this.maps[this.getSwitchLevel(stair)]) {
    //                         this.switchLevel(stair);
    //                     }
    //                 } else {
    //                     GameManager.UI.showToast("在楼梯旁边才可以使用");
    //                 }
    //             }
    //             break;
    //         case 10:
    //             {
    //                 if (currentMap.removeHeroFaceWall()) {
    //                     this.consumptionProp(propInfo);
    //                 }
    //             }
    //             break;
    //         case 11:
    //             {
    //                 if (currentMap.removeAllWalls()) {
    //                     this.consumptionProp(propInfo);
    //                 }
    //             }
    //             break;
    //         case 12:
    //             {
    //                 currentMap.removeLava();
    //             }
    //             break;
    //         case 13:
    //             {
    //                 if (currentMap.bomb()) {
    //                     this.consumptionProp(propInfo);
    //                 }
    //             }
    //             break;
    //         case 14:
    //             {
    //                 if (currentMap.removeYellowDoors()) {
    //                     this.consumptionProp(propInfo);
    //                 }
    //             }
    //             break;
    //         case 15:
    //             {
    //                 this.hero.HeroData.Hp += this.hero.HeroData.Attack + this.hero.HeroData.Defence;
    //                 NotifyCenter.emit(GameEvent.HERO_ATTR_CHANGED);
    //                 this.consumptionProp(propInfo);
    //             }
    //             break;
    //         case 18:
    //             {
    //                 if (this.switchLevelTip(propInfo.value == 1 ? "up" : "down")) {
    //                     return;
    //                 }
    //                 this.level = this.level + propInfo.value;
    //                 this.switchLevelHero(propInfo.value == 1 ? "down" : "up");
    //                 this.consumptionProp(propInfo);
    //             }
    //             break;
    //         case 19:
    //             {
    //                 //中心对称飞行棋
    //                 if (currentMap.centrosymmetricFly()) {
    //                     this.consumptionProp(propInfo);
    //                 }
    //             }
    //             break;
    //     }
    // }
    // consumptionProp(propInfo) {
    //     if (!propInfo.permanent) {
    //         this.hero.HeroData.addProp(propInfo.id, -1);
    //         NotifyCenter.emit(GameEvent.REFRESH_PROP, propInfo, -1);
    //     }
    // }
    // getMap(level: number): GameMap {
    //     return this.maps[level];
    // }
}
