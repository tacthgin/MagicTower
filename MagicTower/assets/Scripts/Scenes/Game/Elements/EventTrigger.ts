import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

import MapElement from "./MapElement";

@ccclass('EventTrigger')
export default class EventTrigger extends MapElement {
    private _eventId: number = 0;
    get id() {
        //return this._eventId;
    }
    init(id: number) {
        //this._eventId = id;
    }
    add() {}
    remove() {
        //super.remove(true);
    }
}

/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// import MapElement from "./MapElement";
// 
// const { ccclass, property } = cc._decorator;
// 
// @ccclass
// export default class EventTrigger extends MapElement {
//     private _eventId: number = 0;
// 
//     get id() {
//         return this._eventId;
//     }
// 
//     init(id: number) {
//         this._eventId = id;
//     }
// 
//     add() {}
// 
//     remove() {
//         super.remove(true);
//     }
// }
