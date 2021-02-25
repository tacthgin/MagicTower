// /**
//  * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
//  */
// import HeroInfo from "./HeroInfo";
// import { MapInfo } from "./MapInfo";
// import ShopInfo from "./ShopInfo";
// import EventInfo from "./EventInfo";
// import { setClassName } from "../Frame/Managers/OverrideFunction";
// import { DataManager } from "../Frame/Managers/DataManager";
// import { Vec3 } from "cc";

// @setClassName("GameInfo")
// export default class GameInfo {
//     private heroInfo: HeroInfo = new HeroInfo();

//     private mapInfo: MapInfo = new MapInfo();

//     private shopInfo: ShopInfo = new ShopInfo();

//     private eventInfo: EventInfo = new EventInfo();

//     /** 游戏开始时间戳 */
//     private timestamp: number = 0;

//     public get HeroInfo() {
//         return this.heroInfo;
//     }

//     public get MapInfo() {
//         return this.mapInfo;
//     }

//     public get EventInfo() {
//         return this.eventInfo;
//     }

//     /** info为空，采用默认，不为空加载存档 */
//     load(info: any) {
//         info = info || {};
//         this.timestamp = info.timestamp || new Date().getTime();

//         let heroInfo = null;
//         if (info.heroInfo) {
//             heroInfo = info.heroInfo;
//         } else {
//             heroInfo = DataManager.getJsonElement("hero", 0, true);
//             heroInfo.props = DataManager.getJsonElement("global", "beginProps");
//         }
//         this.heroInfo.load(heroInfo);
//         this.mapInfo.load(info.mapInfo);
//         this.shopInfo.load(info.shopInfo);

//         /** 使用测试存档 */
//         if (DataManager.getJsonElement("global", "useTestLoad")) {
//             let testLoad = DataManager.getJsonElement("global", "testLoad");
//             this.heroInfo.Position = new Vec3(testLoad.heroPos[0], testLoad.heroPos[1]);
//             this.heroInfo.Gold = testLoad.gold;

//             this.heroInfo.Hp = (testLoad.hp && testLoad.hp) || this.heroInfo.Hp;

//             this.heroInfo.Attack = testLoad.attack && testLoad.attack;

//             this.heroInfo.Defence = testLoad.defence && testLoad.defence;

//             if (testLoad.props) {
//                 for (let id in testLoad.props) {
//                     this.heroInfo.addProp(id, testLoad.props[id]);
//                 }
//             }

//             this.mapInfo.load(testLoad);
//         }
//     }

//     /** 存档 */
//     save() {
//         GameManager.getInstance().saveGameInfo(Constant.ARCHIVE_NAME, this);
//     }
// }
