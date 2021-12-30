// import { LevelData } from "./LevelData";

// export class LevelTempData {
//     //层
//     private _level: number = 0;
//     private monsters: { [key: number]: number | string } = {};

//     public get level() {
//         return this._level;
//     }

//     constructor(level: number, levelData: LevelData, data: any) {
//         this._level = level;
//         this.saveMonsterTiles(data && data["monster"]);
//         this.parseLevelData(levelData);
//     }

//     private saveMonsterTiles(monsterTilesInfo: any) {
//         if (monsterTilesInfo) {
//             for (let i = 0; i < monsterTilesInfo.length; i++) {
//                 if (monsterTilesInfo[i] == 0) {
//                     continue;
//                 }
//                 this.monsters[i] = monsterTilesInfo[i];
//             }
//         }
//     }

//     private parseLevelData(levelData: LevelData) {}
// }
