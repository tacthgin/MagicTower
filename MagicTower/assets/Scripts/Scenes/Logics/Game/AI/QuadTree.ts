import { math } from "cc";

enum QuadDirection {
    LT = 0,
    RT,
    RB,
    LB,
}

export interface QuatEntity {
    getRect(): math.Rect;
    isExist(): boolean;
}

/** 4叉树节点 */
export class QuatTreeNode<T extends QuatEntity> {
    /** 4个子节点 */
    private children: QuatTreeNode<T>[] | null = null;
    private region: math.Rect | null = null;
    private entitys: T[] = [];

    insert(entity: T) {
        this.entitys.push(entity);
    }
}

/** 4叉树 */
export class QuatTree<T extends QuatEntity> {
    private root: QuatTreeNode<T> | null = null;

    constructor(region: math.Rect) {}

    insert(entity: T) {}
}
