// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass("EventInfo")
export default class EventInfo {
    private levelEvent: any = {};
    put(level: number, eventId: number | string) {
        //this.levelEvent[level] = eventId;
    }
    get(level: number) {
        //return this.levelEvent[level] || null;
    }
    clear(level: number) {
        //delete this.levelEvent[level];
    }
    // update (dt) {}
}

/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// // Learn TypeScript:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
//
// const { ccclass, property } = cc._decorator;
//
// @ccclass
// export default class EventInfo {
//     private levelEvent: any = {};
//
//     put(level: number, eventId: number | string) {
//         this.levelEvent[level] = eventId;
//     }
//
//     get(level: number) {
//         return this.levelEvent[level] || null;
//     }
//
//     clear(level: number) {
//         delete this.levelEvent[level];
//     }
//
//     // update (dt) {}
// }
