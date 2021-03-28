// /** 地图存档 */
// export class LevelInfo {
//     private levelInfo: any = {};

//     loadInfo(info: any) {
//         this.levelInfo = info;
//     }

//     setAppear(layerName: string, index: number, info: any = null) {
//         if (!this.levelInfo[layerName]) {
//             this.levelInfo[layerName] = {
//                 appear: {},
//             };
//         }
//         this.levelInfo["appear"][index] = info || 1;
//     }

//     setDisappear(layerName: string, index: number, info: any = null) {
//         if (!this.levelInfo[layerName]) {
//             this.levelInfo[layerName] = {
//                 disappear: {},
//             };
//         }
//         this.levelInfo["disappear"][index] = info || 1;
//     }
// }

// export class MapInfo {
//     private currentLevel: number = 1;

//     private maps: any = {};

//     set level(value) {
//         this.currentLevel = value;
//     }

//     get level() {
//         return this.currentLevel;
//     }

//     getLevelInfo(level: number) {
//         if (!this.maps[level]) {
//             this.maps[level] = new LevelInfo();
//         }
//         return this.maps[level];
//     }

//     load(info: any = null) {
//         if (info) {
//             this.currentLevel = info.currentLevel;
//             for (let level in info.maps) {
//                 this.maps[level] = new LevelInfo();
//                 this.maps[level].load(info.maps[level]);
//             }
//         }
//     }
// }
