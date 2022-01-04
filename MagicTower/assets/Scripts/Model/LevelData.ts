// import { Vec2 } from "cc";
// import { BaseLoadData } from "../../../Framework/Base/BaseData";
// import { GameManager } from "../../../Framework/Managers/GameManager";
// import { Door, DoorState, DoorType, EventInfo, Stair, StairType } from "./Element";
// import { MapData, MapEvent } from "./MapData";

// const CLASS_MAP: any = {
//     door: Door,
//     stair: Stair,
//     event: EventInfo,
// };

// export class LevelData extends BaseLoadData {
//     //层
//     private _level: number = 0;
//     /** 出现的tile */
//     private _appearTile: any = {};
//     /** 消失的tile */
//     private _disappearTile: any = {};
//     /** 层元素信息 */
//     private layerInfo: any = {};

//     public get level() {
//         return this._level;
//     }

//     public get appearTile() {
//         return this._appearTile;
//     }

//     public get disappearTile() {
//         return this._disappearTile;
//     }

//     constructor(level: number) {
//         super();
//         this._level = level;
//     }

//     saveMapData() {
//         // GameManager.DATA.getData(MapData)?.save();
//     }

//     private emitEvent(layerName: string, index: number, info: any = null) {
//         let mapData = GameManager.DATA.getData(MapData);
//         mapData?.emit(MapEvent.ADD_ELEMENT, this._level, layerName, index, info);
//     }

//     load(info: any) {
//         this.loadData(info);
//         for (let layerName in this.layerInfo) {
//             let layerInfo = this.layerInfo[layerName];
//             for (let key in layerInfo) {
//                 let constructor = CLASS_MAP[key];
//                 if (constructor) {
//                     for (let key in layerInfo) {
//                         let element = new constructor();
//                         layerInfo[key] = element.load(layerInfo[key]);
//                     }
//                 }
//             }
//         }
//         return this;
//     }

//     loadProperties(properties: any, data: any = null) {
//         let propertiesInfo = null;

//         let parsers: { [key: string]: Function } = {
//             door: this.parseDoor,
//             stair: this.parseStair,
//             event: this.parseEvent,
//         };
//         for (let layerName in properties) {
//             let func = parsers[layerName];
//             if (func) {
//                 propertiesInfo = properties[layerName];
//                 let tilesData = data ? data[layerName] : null;
//                 func.call(this, propertiesInfo, tilesData);
//             }
//         }
//     }

//     private parseDoor(propertiesInfo: any, data: any = null) {
//         let doorInfos: any = {};
//         let propertiesValue: string = null!;
//         let condition: number[] = [];
//         if (data) {
//             let tiles: number[] = data.tiles;
//             let parseGid = data.parseGid;
//             for (let i = 0; i < tiles.length; i++) {
//                 if (tiles[i] == 0) {
//                     continue;
//                 }
//                 condition.push(i);
//                 let name = parseGid(tiles[i]);
//                 if (name) {
//                     name = name.split("_")[0];
//                     let doorJson = GameManager.DATA.getJsonParser("door")?.getJsonElementByKey("spriteId", name);
//                     if (doorJson && (doorJson.id <= DoorType.RED || doorJson.id == DoorType.WALL)) {
//                         let door = new Door();
//                         door.id = doorJson.id;
//                         doorInfos[i] = door;
//                     }
//                 }
//             }
//         }
//         for (let key in propertiesInfo) {
//             propertiesValue = propertiesInfo[key];
//             switch (key) {
//                 case "monsterCondtion":
//                     {
//                         let indexes: string[] = (propertiesValue as string).split(":");
//                         let door = new Door();
//                         door.doorState = DoorState.CONDITION;
//                         door.value = parseInt(indexes[1]);
//                         doorInfos[indexes[0]] = door;
//                     }
//                     break;
//                 case "appearEvent":
//                     {
//                         let door = new Door();
//                         door.doorState = DoorState.APPEAR_EVENT;
//                         //事件id
//                         door.value = parseInt(propertiesValue);
//                         door.condition = condition;
//                         doorInfos["event"] = door;
//                     }
//                     break;
//                 case "disappearEvent":
//                     {
//                         let infos = propertiesValue.split(":");
//                         let condition = [
//                             infos[0].split(",").map((tile) => {
//                                 return parseInt(tile);
//                             }),
//                             infos[2].split(",").map((tile) => {
//                                 return parseInt(tile);
//                             }),
//                         ];
//                         let door = new Door();
//                         door.doorState = DoorState.DISAPPEAR_EVENT;
//                         door.condition = condition;
//                         door.value = parseInt(infos[1]);
//                         doorInfos["event"] = door;
//                     }
//                     break;
//                 default:
//                     {
//                         let door = new Door();
//                         switch (key) {
//                             case "passive":
//                                 door.doorState = DoorState.PASSIVE;
//                                 break;
//                             case "appear":
//                             case "hide":
//                                 door.doorState = key == "appear" ? DoorState.APPEAR : DoorState.HIDE;
//                                 let index = parseInt(propertiesValue);
//                                 door.gid = data.tiles[index];
//                                 this.setDisappear("door", index);
//                                 break;
//                         }
//                         doorInfos[propertiesValue] = door;
//                     }
//                     break;
//             }
//         }
//         return doorInfos;
//     }

//     private parseStair(propertiesInfo: any, data: any) {
//         let tileIndexes: number[] = [];
//         if (data) {
//             let tiles: number[] = data.tiles;
//             let parseGid = data.parseGid;
//             for (let i = 0; i < tiles.length; i++) {
//                 if (tiles[i] == 0) {
//                     continue;
//                 }

//                 let name = parseGid(tiles[i]);
//                 if (name) {
//                     name = name.split("_")[1];
//                     tileIndexes[name == "up" ? StairType.UP : StairType.Down] = i;
//                 }
//             }
//         }
//         let stairs: Stair[] = [];
//         let location = propertiesInfo["location"].split(",");
//         for (let i = 0; i < 2; i++) {
//             if (location[i] != "0") {
//                 let stair = new Stair();
//                 if (location[i + 2]) {
//                     stair.levelDiff = parseInt(location[i + 2]);
//                 }
//                 stair.standLocation = parseInt(location[i]);
//                 stair.index = tileIndexes[i];
//                 stairs[i] = stair;
//             }
//         }
//         if (propertiesInfo["hide"]) {
//             stairs[0].hide = true;
//         }
//         if (stairs[1]) {
//             stairs[1].levelDiff *= -1;
//         }

//         return stairs;
//     }

//     private parseEvent(propertiesInfo: any) {
//         let eventInfo: { [key: string]: EventInfo } = {};
//         for (let index in propertiesInfo) {
//             let element = new EventInfo();
//             element.id = parseInt(propertiesInfo[index]);
//             eventInfo[index] = element;
//         }
//         return eventInfo;
//     }

//     setAppear(layerName: string, index: number, gid: number) {
//         if (!this._appearTile[layerName]) {
//             this._appearTile[layerName] = {};
//         }
//         this._appearTile[layerName][index] = gid;
//         this.saveMapData();
//     }

//     setDisappear(layerName: string, index: number) {
//         if (!this._disappearTile[layerName]) {
//             this._disappearTile[layerName] = [];
//         }
//         this._disappearTile[layerName].push(index);
//         this.saveMapData();
//     }

//     move(layerName: string, src: number, dst: number, gid: number) {
//         if (!this._appearTile[layerName]) {
//             this._appearTile[layerName] = {};
//         }
//         let tiles = this._appearTile[layerName];
//         if (tiles[src]) {
//             delete tiles[src];
//         }
//         tiles[dst] = gid;
//         this.saveMapData();
//     }

//     canHeroMove(tile: Vec2) {
//         //if ((this.monsterInfo.bigMonster && this.monsterInfo.bigMonster.indexOf(index) != -1) || this.hero.HeroModel.Hp <= this.getWizardMagicDamage(index)) return false;
//         return true;
//     }

//     getStair(type: StairType): Stair | null {
//         return this.layerInfo["stair"][type] || null;
//     }

//     getLayerInfo(layerName: string) {
//         return this.layerInfo[layerName] || null;
//     }

//     getLayerElement(layerName: string, index: number | string) {
//         let layerInfo = this.getLayerInfo(layerName);
//         return layerInfo ? layerInfo[index] : null;
//     }

//     deleteLayerElement(layerName: string, index: number) {
//         let layerInfo = this.getLayerInfo(layerName);
//         if (layerInfo && layerInfo[index]) {
//             delete layerInfo[index];
//             this.setDisappear(layerName, index);
//         }
//     }
// }
