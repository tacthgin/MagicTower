// import { instantiate, isValid, Node, NodePool, Prefab, _decorator } from "cc";
// import { BaseComponent } from "./BaseComponent";
// const { ccclass } = _decorator;

// /** 对象池节点 */
// @ccclass("BasePoolNode")
// export class BasePoolNode extends BaseComponent {
//     protected pool: NodePool | null = null;

//     /**
//      * 从对象池获得节点
//      * @param pool 池子
//      * @param prefab 节点预设
//      * @param common 是否使用通用脚本
//      */
//     static generateNodeFromPool(pool: NodePool, prefab: Prefab, useCommon: boolean = false) {
//         if (!pool || !prefab) return null;

//         let node: Node | null = null;
//         if (pool.size() == 0) {
//             node = instantiate(prefab);
//             let handler: any = null;
//             if (useCommon) {
//                 handler = node.addComponent(BasePoolNode);
//             } else if (pool.poolHandlerComp) {
//                 handler = node.getComponent(pool.poolHandlerComp as any);
//             }

//             if (handler && handler.reuse) {
//                 handler.reuse(pool);
//             }
//             return node;
//         } else {
//             return pool.get(pool);
//         }
//     }

//     reuse(pool: NodePool) {
//         this.pool = pool;
//     }

//     remove() {
//         if (this.pool) {
//             this.pool.put(this.node);
//         } else if (isValid(this.node)) {
//             this.node.destroy();
//         }
//     }
// }
