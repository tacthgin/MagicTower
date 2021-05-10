import { _decorator, Vec2, Component, v2, TiledMapAsset, TiledMap } from "cc";
import { AstarMap } from "../AI/Astar";
const { ccclass } = _decorator;

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

@ccclass("GameMap")
export class GameMap extends TiledMap implements AstarMap {
    /** 地图层 */
    private layers = {};
    /** 地图数据 */
    private mapData = null;
    /** 地图一半大小 */
    private mapHalfSize: Vec2 | null = null;
    private propParser: PropParser = null;
    /** 终点可以走的地块 */
    private canEndMoveTiles: string[] = ["prop", "stair", "event"];
    private hero: Hero = null;
    private shopInfo: ShopInfo = null;
    private eventInfo: any = null;
    private maxIndex: number = 0;
    /** 弹窗调整位置*/
    private _dialogPos: cc.Vec2 = v2(0, 50);
    /** a*寻路isEmpty判断类型 */
    private _astarMoveType: string = "hero";
    /* 怪物门 事件们等*/
    private doorInfo: any = {};
    /**
     * @member bigMonster 大boss占有的区域
     * @member monsterEvent 怪物死亡事件
     * @member magicHurt 魔法伤害地块
     */
    private monsterInfo: any = {};
    private gameEventSystem: GameEventSystem = null;
    public set astarMoveType(value) {
        //this._astarMoveType = value;
    }
    public set monsterDoor(value) {
        //this.doorInfo.monsterDoor = value;
    }
    get dialogPos() {
        //return this._dialogPos;
    }
    get level() {
        //return this.mapData.level;
    }
    onLoad() {
        //this.propParser = DataManager.getJsonParser("prop");
        //let gameInfo = DataManager.getCustomData("GameInfo");
        //this.shopInfo = gameInfo.shopInfo;
        //this.eventInfo = gameInfo.eventInfo;
        //this._dialogPos = cc.Canvas.instance.node.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(this._dialogPos));
    }
    onEnable() {
        //NotifyCenter.on(GameEvent.ELEMENT_ACTION_COMPLETE, this.elementActionComplete, this);
        //NotifyCenter.on(GameEvent.MONSTER_DIE, this.monsterDie, this);
    }
    onDisable() {
        //NotifyCenter.targetOff(this);
    }
    show() {
        //跨层事件
        //let eventId = this.eventInfo.get(this.mapData.level);
        //if (eventId) {
        //this.excuteEvent(eventId);
        //this.eventInfo.clear(this.mapData.level);
        //}
    }
    /**
     * tile坐标转换为nodeAR坐标
     * @param tileCoord tile坐标
     * @param pivot 默认指定tile格子的中心
     */
    tileToNodeSpaceAR(tileCoord: Vec2 | null, pivot: Vec2 | null = null) {
        //pivot = pivot || cc.v2(0.5, 0.5);
        //let temp = tileCoord.add(pivot);
        //return cc.v2(temp.x * this.mapData.tileWidth - this.mapHalfSize.x, this.mapHalfSize.y - temp.y * this.mapData.tileHeight);
    }
    /**
     * nodeAR转换为tile坐标
     * @param nodeCoord nodeAR坐标
     */
    nodeSpaceARToTile(nodeCoord: Vec2) {
        //let screenCoord = cc.v2(nodeCoord.x, -nodeCoord.y).addSelf(this.mapHalfSize);
        //return cc.v2(Math.floor(screenCoord.x / this.mapData.tileWidth), Math.floor(screenCoord.y / this.mapData.tileHeight));
    }
    /**
     * tile坐标转索引
     * @param tileCoord tile坐标
     */
    tileToIndex(tileCoord: Vec2) {
        //return tileCoord.y * this.mapData.row + tileCoord.x;
    }
    /**
     * 索引转tile坐标
     * @param index 索引
     */
    indexToTile(index: number) {
        //return cc.v2(index % this.mapData.row, Math.floor(index / this.mapData.row));
    }
    /**
     * 索引转node坐标
     * @param index 索引
     */
    indexToNodeSpaceAR(index: number) {
        //return this.tileToNodeSpaceAR(this.indexToTile(index));
    }
    /** 地图行格子个数 */
    getRow() {
        //return this.mapData.row;
    }
    /** 地图列格子个数 */
    getColumn() {
        //return this.mapData.column;
    }
    /** 在地图上设置英雄 */
    setHero(hero: Hero) {
        //this.hero = hero;
        //this.hero.node.zIndex = 3;
    }
    /**
     * 坐标是否在地图区域内
     * @param tileCoord
     */
    inBoundary(tileCoord: Vec2) {
        //return tileCoord.x >= 0 && tileCoord.x < this.mapData.column && tileCoord.y >= 0 && tileCoord.y < this.mapData.row;
    }
    init(data: any, levelInfo: LevelInfo, tiledMapAsset: TiledMapAsset) {
        //if (!data) return false;
        //this.mapData = data;
        //this.mapHalfSize = cc.v2(this.mapData.mapWidth / 2, this.mapData.mapHeight / 2);
        //this.node.width = this.mapData.mapWidth;
        //this.node.height = this.mapData.mapHeight;
        //this.maxIndex = this.tileToIndex(cc.v2(this.mapData.row - 1, this.mapData.column - 1));
        //解析层数据
        //for (let layerName in data.layer) {
        //this.parseLayer(layerName, data.layer[layerName]);
        //}
        // //test 显示tile坐标
        // for (let i = 0; i < this.mapData.row; i++) {
        //     for (let j = 0; j < this.mapData.column; j++) {
        //         let node = new cc.Node();
        //         node.zIndex = 100;
        //         node.parent = this.node;
        //         let label = node.addComponent(cc.Label);
        //         label.fontSize = 16;
        //         label.string = `${this.tileToIndex(cc.v2(j, i))}`;
        //         let pos = this.tileToNodeSpaceAR(cc.v2(j, i));
        //         node.position = cc.v3(pos.x, pos.y - 16);
        //     }
        // }

        if (!tiledMapAsset.isValid) {
            console.error(`${tiledMapAsset.name}不合法`);
            return;
        }
        this.tmxAsset = tiledMapAsset;
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
    private parseTile(layerName: string, info, className: string) {
        //info.forEach((elementInfo) => {
        //this.addElement(elementInfo[0], layerName, className, elementInfo[1]);
        //});
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
        //let { tileType } = this.getTileInfo(coord);
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
        //let { tileType, element, index } = this.getTileInfo(tile);
        //switch (tileType) {
        //case "floor":
        //return this.hero.HeroData.Hp > this.getWizardMagicDamage(index);
        //case "monster":
        //return CalculateSystem.canHeroAttack(this.hero.HeroData, element.monsterInfo, !element.firstAttack);
        //case "door":
        //return element.hide;
        //}
        //return this.canEndMoveTiles.indexOf(tileType) != -1;
    }
    private heroMoveJudge(tile: Vec2, endTile: Vec2) {
        //let { tileType, index } = this.getTileInfo(tile);
        //if ((this.monsterInfo.bigMonster && this.monsterInfo.bigMonster.indexOf(index) != -1) || this.hero.HeroData.Hp <= this.getWizardMagicDamage(index)) return false;
        //if (tile.equals(endTile)) {
        //假设终点都可以走，然后在门和npc这种类型停在寻路前一格
        //return true;
        //} else {
        //中途过程遇到事件也可以走
        //return tileType == "floor" || tileType == "event" || tileType == "prop";
        //}
    }
    private elementMoveJudge(tile: Vec2) {
        //let { tileType } = this.getTileInfo(tile);
        //return tileType == "floor" || tileType == "monster" || tileType == "event" || tileType == "stair";
    }
    /** astar判断是否可行走 */
    isEmpty(tile: Vec2, endTile: Vec2) {
        //switch (this._astarMoveType) {
        //case "hero":
        //return this.heroMoveJudge(tile, endTile);
        //default:
        //return this.elementMoveJudge(tile);
        //}
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
    /**
     * 得到tile信息
     * @param tile tile坐标
     */
    getTileInfo(tile: Vec2) {
        //let index = this.tileToIndex(tile);
        //let result = {
        //tileType: "floor",
        //element: null,
        //index: index,
        //};
        //for (let layerName in this.layers) {
        //if (this.layers[layerName][index]) {
        //result.tileType = layerName;
        //result.element = this.layers[layerName][index];
        //return result;
        //}
        //}
        //return result;
    }
    /**
     * 获取地图元素
     * @param index tileIndex
     * @param layerName 层名
     */
    getElement(index: number | string, layerName?: string) {
        //if (layerName) {
        //let layer = this.layers[layerName];
        //return layer ? layer[index] : null;
        //} else {
        //for (let layer in this.layers) {
        //if (this.layers[layer][index]) {
        //return this.layers[layer][index];
        //}
        //}
        //}
        //return null;
    }
    /**
     * 地图上添加元素
     * @param index tileIndex
     * @param layerName 层名
     * @param info 数据
     */
    addElement(index: number, layerName: string, className: string, ...info) {
        //let element = null;
        //if (layerName == "wall") {
        //element = ElementManager.getCommon(className);
        //className = "Common";
        //} else {
        //if (layerName == "event") {
        //className = "EventTrigger";
        //}
        //element = ElementManager.getElement(className);
        //}
        //element.position = this.indexToNodeSpaceAR(index);
        //element.parent = this.node;
        //let control = element.getComponent(className);
        //control && control.init(...info);
        //this.layers[layerName][index] = control;
        //return this.layers[layerName][index];
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
     * 删除地图上元素
     * @param index tileIndex
     * @param layerName 层名
     */
    removeElement(index: number | string, layerName: string, remove: boolean = true) {
        //let layer = this.layers[layerName];
        //if (layer) {
        //let element = layer[index];
        //if (element) {
        //if (remove) {
        //element.remove();
        //}
        //delete layer[index];
        //} else {
        //cc.warn(`removeElement index:${index} no element`);
        //}
        //}
    }
    /**
     * 勇士和地块之间的交互，返回为false，表示交互有延迟，是异步的，true表示交互完成
     * @param tile tile坐标
     */
    collision(tile: Vec2) {
        //let { tileType, element, index } = this.getTileInfo(tile);
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
    showDialog(name: string, ...args) {
        //GameManager.getInstance()
        //.showDialog(name, ...args)
        //.then((control: any) => {
        //control.node.position = cc.Vec3.ZERO;
        //});
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
}
