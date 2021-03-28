// import { _decorator } from 'cc';
// import { DataManager } from "../Managers/DataManager";

// export default class ShopInfo {
//     private beginGold: number = 0;
//     private beginHp: number = 0;
//     private beginAttack: number = 0;
//     private beginDefence: number = 0;
//     private count: number = 0;
//     private ratioGold: number = 0;
//     private levelValue: number = 0;
//     get needGold() {
//         //return this.beginGold + this.ratioGold * this.count;
//     }
//     get buyCount() {
//         //return this.count;
//     }
//     set level(value) {
//         //this.levelValue = Math.floor(value / 10);
//     }
//     get hp() {
//         //return (this.count + 1) * this.beginHp;
//     }
//     get attackValue() {
//         //return (this.levelValue + 1) * this.beginAttack;
//     }
//     get defenceValue() {
//         //return (this.levelValue + 1) * this.beginDefence;
//     }
//     buy() {
//         //this.beginGold = this.needGold;
//         //this.count += 1;
//         //return this.beginGold;
//     }
//     load(info: any = null) {
//         //if (info) {
//         //this.beginGold = info.beginGold;
//         //this.count = info.count;
//         //this.ratioGold = info.ratioGold;
//         //this.beginHp = info.beginHp;
//         //this.beginAttack = info.beginAttack;
//         //this.beginDefence = info.beginDefence;
//         //this.levelValue = info.levelValue;
//         //} else {
//         //let shopInfo = DataManager.getJsonElement("global", "shop");
//         //this.beginGold = shopInfo.beginGold;
//         //this.ratioGold = shopInfo.ratio;
//         //this.beginHp = shopInfo.hp;
//         //this.beginAttack = shopInfo.attack;
//         //this.beginDefence = shopInfo.defence;
//         //}
//     }
// }

// /**
//  * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
//  */
// // import { DataManager } from "../Managers/DataManager";
// //
// // export default class ShopInfo {
// //     private beginGold: number = 0;
// //
// //     private beginHp: number = 0;
// //
// //     private beginAttack: number = 0;
// //
// //     private beginDefence: number = 0;
// //
// //     private count: number = 0;
// //
// //     private ratioGold: number = 0;
// //
// //     private levelValue: number = 0;
// //
// //     get needGold() {
// //         return this.beginGold + this.ratioGold * this.count;
// //     }
// //
// //     get buyCount() {
// //         return this.count;
// //     }
// //
// //     set level(value) {
// //         this.levelValue = Math.floor(value / 10);
// //     }
// //
// //     get hp() {
// //         return (this.count + 1) * this.beginHp;
// //     }
// //
// //     get attackValue() {
// //         return (this.levelValue + 1) * this.beginAttack;
// //     }
// //
// //     get defenceValue() {
// //         return (this.levelValue + 1) * this.beginDefence;
// //     }
// //
// //     buy() {
// //         this.beginGold = this.needGold;
// //         this.count += 1;
// //         return this.beginGold;
// //     }
// //
// //     load(info: any = null) {
// //         if (info) {
// //             this.beginGold = info.beginGold;
// //             this.count = info.count;
// //             this.ratioGold = info.ratioGold;
// //             this.beginHp = info.beginHp;
// //             this.beginAttack = info.beginAttack;
// //             this.beginDefence = info.beginDefence;
// //             this.levelValue = info.levelValue;
// //         } else {
// //             let shopInfo = DataManager.getJsonElement("global", "shop");
// //             this.beginGold = shopInfo.beginGold;
// //             this.ratioGold = shopInfo.ratio;
// //             this.beginHp = shopInfo.hp;
// //             this.beginAttack = shopInfo.attack;
// //             this.beginDefence = shopInfo.defence;
// //         }
// //     }
// // }
