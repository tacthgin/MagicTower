//     /** 预设路径 */
//     /** 元素对象池 */
//     /** 元素预设 */
//     /**
//      * 加载资源
//      * @param callback 加载完成回调
//      */
//     /** 由于就一个场景好像也没必要释放 */
//     /** 预创建元素 */
//     /**
//      * 获取元素
//      * @param name 元素预设名字
//      */

// import { _decorator, SpriteAtlas, NodePool, ss, loader, Prefab, error, Sprite } from 'cc';
// import { ResourceManager } from "../../Managers/ResourceManager";
// import { Util } from "../../Util/Util";
// class _ElementManager {
//     private prefabPath: string = "Prefabs/Elements";
//     private pools: any = {};
//     private elementPrefabs: any = {};
//     private elementSpriteAtlas: SpriteAtlas | null = null;
//     constructor() {
//         let poolsName = ["Common", "Monster", "Prop", "Door", "Npc", "Stair", "Hero", "Shop", "EventTrigger", "MonsterIcon", "Lightning", "MonsterHandBookItem"];
//         poolsName.forEach(name => {
//             this.pools[name] = new NodePool(name);
//         });
//     }
//     loadRes(callback: (suss: boolean) => void = null) {
//         this.elementSpriteAtlas = ResourceManager.getSpriteAtlas("element");
//         cc.loader.loadResDir(this.prefabPath, Prefab, (error: Error, resources: any[], urls: string[]) => {
//             if (error) {
//                 error(error.message);
//                 callback && callback(false);
//                 return;
//             }
//             resources.forEach(asset => {
//                 this.elementPrefabs[asset.name] = asset;
//             });
//             callback && callback(true);
//         });
//     }
//     releaseElementPrefab() {
//         loader.releaseResDir(this.prefabPath);
//     }
//     preloadElement() {}
//     getElement(name: string) {
//         return Util.generatePrefabFromPool(this.pools[name], this.elementPrefabs[name]);
//     }
//     getCommon(name: string) {
//         let common = this.getElement("Common");
//         common.getComponent(Sprite).spriteFrame = this.elementSpriteAtlas.getSpriteFrame(name);
//         return common;
//     }
//     getSpriteFrame(name: string) {
//         return this.elementSpriteAtlas.getSpriteFrame(name);
//     }
// }
// export let ElementManager = new _ElementManager();

// /**
//  * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
//  */
// // import { ResourceManager } from "../../Managers/ResourceManager";
// // import { Util } from "../../Util/Util";
// //
// // class _ElementManager {
// //     /** 预设路径 */
// //     private prefabPath: string = "Prefabs/Elements";
// //
// //     /** 元素对象池 */
// //     private pools: any = {};
// //
// //     /** 元素预设 */
// //     private elementPrefabs: any = {};
// //
// //     private elementSpriteAtlas: cc.SpriteAtlas = null;
// //
// //     constructor() {
// //         let poolsName = ["Common", "Monster", "Prop", "Door", "Npc", "Stair", "Hero", "Shop", "EventTrigger", "MonsterIcon", "Lightning", "MonsterHandBookItem"];
// //         poolsName.forEach(name => {
// //             this.pools[name] = new cc.NodePool(name);
// //         });
// //     }
// //
// //     /**
// //      * 加载资源
// //      * @param callback 加载完成回调
// //      */
// //     loadRes(callback: (success: boolean) => void = null) {
// //         this.elementSpriteAtlas = ResourceManager.getSpriteAtlas("element");
// //
// //         cc.loader.loadResDir(this.prefabPath, cc.Prefab, (error: Error, resources: any[], urls: string[]) => {
// //             if (error) {
// //                 cc.error(error.message);
// //                 callback && callback(false);
// //                 return;
// //             }
// //
// //             resources.forEach(asset => {
// //                 this.elementPrefabs[asset.name] = asset;
// //             });
// //
// //             callback && callback(true);
// //         });
// //     }
// //
// //     /** 由于就一个场景好像也没必要释放 */
// //     releaseElementPrefab() {
// //         cc.loader.releaseResDir(this.prefabPath);
// //     }
// //
// //     /** 预创建元素 */
// //     preloadElement() {}
// //
// //     /**
// //      * 获取元素
// //      * @param name 元素预设名字
// //      */
// //     getElement(name: string) {
// //         return Util.generatePrefabFromPool(this.pools[name], this.elementPrefabs[name]);
// //     }
// //
// //     getCommon(name: string) {
// //         let common = this.getElement("Common");
// //         common.getComponent(cc.Sprite).spriteFrame = this.elementSpriteAtlas.getSpriteFrame(name);
// //         return common;
// //     }
// //
// //     getSpriteFrame(name: string) {
// //         return this.elementSpriteAtlas.getSpriteFrame(name);
// //     }
// // }
// //
// // export let ElementManager = new _ElementManager();
