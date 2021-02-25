import { _decorator, Component, NodePool } from 'cc';
import { DataManager } from "../../../Managers/DataManager";

export default class MapElement extends Component {
    protected pool: NodePool | null = null;
    reuse(pool) {
        //this.pool = pool;
    }
    remove(immediately: boolean = false) {
        //if (immediately) {
        //this.pool.put(this.node);
        //} else {
        //cc.tween(this.node)
        //.to(DataManager.getJsonElement("global", "fadeInterval"), { opacity: 0 })
        //.set({ opacity: 255 })
        //.call(() => {
        //this.pool.put(this.node);
        //})
        //.start();
        //}
    }
    add() {
        //cc.tween(this.node)
        //.set({ opacity: 0 })
        //.to(DataManager.getJsonElement("global", "fadeInterval"), { opacity: 255 })
        //.start();
    }
}

/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// import { DataManager } from "../../../Managers/DataManager";
// 
// export default class MapElement extends cc.Component {
//     protected pool: cc.NodePool = null;
// 
//     reuse(pool) {
//         this.pool = pool;
//     }
// 
//     remove(immediately: boolean = false) {
//         if (immediately) {
//             this.pool.put(this.node);
//         } else {
//             cc.tween(this.node)
//                 .to(DataManager.getJsonElement("global", "fadeInterval"), { opacity: 0 })
//                 .set({ opacity: 255 })
//                 .call(() => {
//                     this.pool.put(this.node);
//                 })
//                 .start();
//         }
//     }
// 
//     add() {
//         cc.tween(this.node)
//             .set({ opacity: 0 })
//             .to(DataManager.getJsonElement("global", "fadeInterval"), { opacity: 255 })
//             .start();
//     }
// }
