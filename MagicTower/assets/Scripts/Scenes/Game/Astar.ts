// /** A*节点 */
//     /** 当前结点离起始点的路程 */
//     /** 该结点的总路程，f = g + h */
//     /**
//      *
//      * @param position 当前节点位置
//      * @param hValue 预估值
//      * @param parentNode 父结点
//      */

// import { _decorator, Vec2 } from 'cc';
// class AstarNode {
//     private _parent: AstarNode = null;
//     private _position: Vec2 | null = null;
//     private _gValue: number = null;
//     private _fValue: number = null;
//     constructor(position: Vec2, hValue: number, parentNode: AstarNode = null) {
//         this._parent = parentNode;
//         this._position = position;
//         this._gValue = parentNode ? parentNode.gValue + 1 : 0;
//         this._fValue = this._gValue + hValue;
//     }
//     get parent() {
//         return this._parent;
//     }
//     get position() {
//         return this._position;
//     }
//     get gValue() {
//         return this._gValue;
//     }
//     get fValue() {
//         return this._fValue;
//     }
//     equals(position: Vec2) {
//         return this._position.equals(position);
//     }
//     add(position: Vec2) {
//         return this._position.add(position);
//     }
// }
// const SquarePositions = [Vec2.UP, Vec2.UP.neg(), Vec2.RIGHT.neg(), Vec2.RIGHT];
// export interface AstarMap {
//     getRow();
//     getColumn();
//     isEmpty(tile: Vec2, endTile: Vec2);
// }
// export let CommonAstar = new Astar();

// export class Astar {
//     /** 关闭列表某个位置的节点是否可用 */
//     private closeList: any = {};
//     private openList: AstarNode[] = [];
//     private map: AstarMap = null;
//     constructor(map: AstarMap = null) {
//         //this.setMap(map);
//     }
//     setMap(map: AstarMap) {
//         //this.map = map;
//     }
//     /**
//      * 估值函数
//      * @param beginPos 当前节点位置
//      * @param endPos 终点位置
//      */
//     estimateHValue(beginPos: Vec2, endPos: Vec2) {
//         //return Math.abs(beginPos.x - endPos.x) + Math.abs(beginPos.y - endPos.y);
//     }
//     contain(list: AstarNode[], position: Vec2) {
//         //for (let i = 0; i < list.length; i++) {
//         //if (list[i].equals(position)) {
//         //return true;
//         //}
//         //}
//         //return false;
//     }
//     /** 获取地块唯一id **/
//     getUniqeIndex(position: Vec2) {
//         //return position.y * this.map.getColumn() + position.x;
//     }
//     /** 边界判断 */
//     inBoundary(position: Vec2) {
//         //return position.x >= 0 && position.x < this.map.getColumn() && position.y >= 0 && position.y < this.map.getRow();
//     }
//     /** 添加进关闭列表 */
//     addToCLose(position: Vec2) {
//         //this.closeList[this.getUniqeIndex(position)] = true;
//     }
//     isInCloseList(position: Vec2) {
//         //return this.closeList[this.getUniqeIndex(position)];
//     }
//     addSquareNode(currentNode: AstarNode, endPos: Vec2) {
//         //if (currentNode) {
//             //走过的节点放入关闭列表
//         //this.addToCLose(currentNode.position);

//         //SquarePositions.forEach(position => {
//         //let newPos = currentNode.add(position);
//         //if (this.inBoundary(newPos) && !this.isInCloseList(newPos)) {
//                     //如果关闭列表和开放列表不包含新的节点，并且该位置可以走，加入开放列表，否则加入关闭列表
//         //if (this.map.isEmpty(newPos, endPos) && !this.contain(this.openList, newPos)) {
//         //this.openList.push(new AstarNode(newPos, this.estimateHValue(newPos, endPos), currentNode));
//         //} else {
//         //this.addToCLose(newPos);
//         //}
//         //}
//         //});
//         //}
//     }
//     makePath(beginPos: Vec2, endPos: Vec2) {
//         //let hValue = this.estimateHValue(beginPos, endPos);
//         //if (hValue == 0) return;

//         //this.openList = [];
//         //this.closeList = {};

//         //起点
//         //let node = new AstarNode(beginPos, hValue, null);
//         //this.openList.push(node);

//         //let last = null;
//         //while (this.openList.length > 0) {
//         //node = this.openList.shift();
//         //if (node.equals(endPos)) {
//         //last = node;
//         //break;
//         //}
//         //this.addSquareNode(node, endPos);
//             //根据f值排序，f值越小路线越短
//         //this.openList.sort((l, r) => {
//         //return l.fValue - r.fValue;
//         //});
//         //}

//         //if (!last) return null;

//         //let path = [];

//         // 判断父亲是不包含起点
//         //while (last && last.parent) {
//         //path.push(last.position);
//         //last = last.parent;
//         //}

//         //path.reverse();

//         //return path;
//     }
//     getPath(map: AstarMap, beginPos: Vec2, endPos: Vec2) {
//         //this.setMap(map);
//         //return this.makePath(beginPos, endPos);
//     }
// }

// /**
//  * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
//  */
// // /** A*节点 */
// // class AstarNode {
// //     private _parent: AstarNode = null;
// //
// //     private _position: cc.Vec2 = null;
// //
// //     /** 当前结点离起始点的路程 */
// //     private _gValue: number = null;
// //
// //     /** 该结点的总路程，f = g + h */
// //     private _fValue: number = null;
// //
// //     /**
// //      *
// //      * @param position 当前节点位置
// //      * @param hValue 预估值
// //      * @param parentNode 父结点
// //      */
// //     constructor(position: cc.Vec2, hValue: number, parentNode: AstarNode = null) {
// //         this._parent = parentNode;
// //         this._position = position;
// //         this._gValue = parentNode ? parentNode.gValue + 1 : 0;
// //         this._fValue = this._gValue + hValue;
// //     }
// //
// //     get parent() {
// //         return this._parent;
// //     }
// //
// //     get position() {
// //         return this._position;
// //     }
// //
// //     get gValue() {
// //         return this._gValue;
// //     }
// //
// //     get fValue() {
// //         return this._fValue;
// //     }
// //
// //     equals(position: cc.Vec2) {
// //         return this._position.equals(position);
// //     }
// //
// //     add(position: cc.Vec2) {
// //         return this._position.add(position);
// //     }
// // }
// //
// // const SquarePositions = [cc.Vec2.UP, cc.Vec2.UP.neg(), cc.Vec2.RIGHT.neg(), cc.Vec2.RIGHT];
// //
// // export interface AstarMap {
// //     getRow();
// //     getColumn();
// //     isEmpty(tile: cc.Vec2, endTile: cc.Vec2);
// // }
// //
// // export class Astar {
// //     /** 关闭列表某个位置的节点是否可用 */
// //     private closeList: any = {};
// //
// //     private openList: AstarNode[] = [];
// //
// //     private map: AstarMap = null;
// //
// //     constructor(map: AstarMap = null) {
// //         this.setMap(map);
// //     }
// //
// //     setMap(map: AstarMap) {
// //         this.map = map;
// //     }
// //     /**
// //      * 估值函数
// //      * @param beginPos 当前节点位置
// //      * @param endPos 终点位置
// //      */
// //     estimateHValue(beginPos: cc.Vec2, endPos: cc.Vec2) {
// //         return Math.abs(beginPos.x - endPos.x) + Math.abs(beginPos.y - endPos.y);
// //     }
// //
// //     contain(list: AstarNode[], position: cc.Vec2) {
// //         for (let i = 0; i < list.length; i++) {
// //             if (list[i].equals(position)) {
// //                 return true;
// //             }
// //         }
// //         return false;
// //     }
// //
// //     /** 获取地块唯一id **/
// //     getUniqeIndex(position: cc.Vec2) {
// //         return position.y * this.map.getColumn() + position.x;
// //     }
// //
// //     /** 边界判断 */
// //     inBoundary(position: cc.Vec2) {
// //         return position.x >= 0 && position.x < this.map.getColumn() && position.y >= 0 && position.y < this.map.getRow();
// //     }
// //
// //     /** 添加进关闭列表 */
// //     addToCLose(position: cc.Vec2) {
// //         this.closeList[this.getUniqeIndex(position)] = true;
// //     }
// //
// //     isInCloseList(position: cc.Vec2) {
// //         return this.closeList[this.getUniqeIndex(position)];
// //     }
// //
// //     addSquareNode(currentNode: AstarNode, endPos: cc.Vec2) {
// //         if (currentNode) {
// //             //走过的节点放入关闭列表
// //             this.addToCLose(currentNode.position);
// //
// //             SquarePositions.forEach(position => {
// //                 let newPos = currentNode.add(position);
// //                 if (this.inBoundary(newPos) && !this.isInCloseList(newPos)) {
// //                     //如果关闭列表和开放列表不包含新的节点，并且该位置可以走，加入开放列表，否则加入关闭列表
// //                     if (this.map.isEmpty(newPos, endPos) && !this.contain(this.openList, newPos)) {
// //                         this.openList.push(new AstarNode(newPos, this.estimateHValue(newPos, endPos), currentNode));
// //                     } else {
// //                         this.addToCLose(newPos);
// //                     }
// //                 }
// //             });
// //         }
// //     }
// //
// //     makePath(beginPos: cc.Vec2, endPos: cc.Vec2) {
// //         let hValue = this.estimateHValue(beginPos, endPos);
// //         if (hValue == 0) return;
// //
// //         this.openList = [];
// //         this.closeList = {};
// //
// //         //起点
// //         let node = new AstarNode(beginPos, hValue, null);
// //         this.openList.push(node);
// //
// //         let last = null;
// //         while (this.openList.length > 0) {
// //             node = this.openList.shift();
// //             if (node.equals(endPos)) {
// //                 last = node;
// //                 break;
// //             }
// //             this.addSquareNode(node, endPos);
// //             //根据f值排序，f值越小路线越短
// //             this.openList.sort((l, r) => {
// //                 return l.fValue - r.fValue;
// //             });
// //         }
// //
// //         if (!last) return null;
// //
// //         let path = [];
// //
// //         // 判断父亲是不包含起点
// //         while (last && last.parent) {
// //             path.push(last.position);
// //             last = last.parent;
// //         }
// //
// //         path.reverse();
// //
// //         return path;
// //     }
// //
// //     getPath(map: AstarMap, beginPos: cc.Vec2, endPos: cc.Vec2) {
// //         this.setMap(map);
// //         return this.makePath(beginPos, endPos);
// //     }
// // }
// //
// // export let CommonAstar = new Astar();
