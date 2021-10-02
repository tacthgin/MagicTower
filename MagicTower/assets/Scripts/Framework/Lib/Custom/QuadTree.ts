import { assert, Color, Graphics, math } from "cc";

/* 一个矩形区域的象限划分：: 
LT(2)   |    RT(3) 
--------|----------- 
LB(0)   |    RB(1) 
以下对该象限类型的枚举 
*/
enum QuadDirection {
    LB = 0,
    RB,
    LT,
    RT,
}

export interface QuadEntity {
    getRegion(): math.Rect;
    isExist(): boolean;
}

/** 4叉树节点 */
export class QuadTreeNode<T extends QuadEntity> {
    /** 4个子节点 */
    private leafNodes: QuadTreeNode<T>[] | null = null;
    private region: math.Rect = null!;
    private entitys: T[] = [];

    constructor(region: math.Rect) {
        this.region = region;
    }

    getRegion(): math.Rect {
        return this.region;
    }

    getLeafNodes() {
        return this.leafNodes;
    }

    createBranch(regions: math.Rect[]) {
        this.leafNodes = [];
        for (let i = 0; i < regions.length; i++) {
            this.leafNodes.push(new QuadTreeNode(regions[i]));
        }
    }

    insert(entity: T) {
        this.entitys.push(entity);
    }
}

/** 4叉树 */
export class QuadTree<T extends QuadEntity> {
    private root: QuadTreeNode<T> | null = null;
    private depth: number = 0;

    constructor(region: math.Rect, depth: number) {
        this.createQuadTree(region, depth);
    }

    /** 根据深度创建完全4叉树 */
    private createQuadTree(region: math.Rect, depth: number) {
        this.root = new QuadTreeNode(region);
        this.depth = depth;
        let branches = [this.root];
        while (depth > 0) {
            let tempBranches: QuadTreeNode<T>[] = [];
            branches.forEach((branch) => {
                tempBranches = tempBranches.concat(this.createQuadBranch(branch));
            });
            --depth;
            branches = tempBranches;
        }
    }

    private createQuadBranch(node: QuadTreeNode<T>): QuadTreeNode<T>[] {
        assert(node, "叶节点父节点不能为空");
        let regions = this.splitRegion(node.getRegion());
        node.createBranch(regions);
        return node.getLeafNodes() || [];
    }

    private splitRegion(region: math.Rect): math.Rect[] {
        let width = region.width * 0.5;
        let height = region.height * 0.5;
        let origin = region.origin;
        let regions = [];
        for (let i = 0; i < 4; i++) {
            regions.push(new math.Rect(origin.x + (i % 2) * width, origin.y + (i > 1 ? height : 0), width, height));
        }
        return regions;
    }

    private hasLeafNode(node: QuadTreeNode<T>) {
        if (node) {
            let leafNodes = node.getLeafNodes()!;
            for (let i = 0; i < leafNodes.length; ++i) {
                if (leafNodes[i]) {
                    return true;
                }
            }
        }
        return false;
    }

    insert(entity: T) {
        this.insertToLeaf(entity, this.root!);
    }

    insertToLeaf(entity: T, node: QuadTreeNode<T>) {
        let leafNodes = node?.getLeafNodes();
        let isInsertToLeaf = false;
        if (leafNodes) {
            for (let i = 0; i < leafNodes.length; i++) {
                if (leafNodes[i].getRegion().containsRect(entity.getRegion())) {
                    this.insertToLeaf(entity, leafNodes[i]);
                    isInsertToLeaf = true;
                    break;
                }
            }
        }

        if (!isInsertToLeaf) {
            node?.insert(entity);
        }
    }

    draw(graphics: Graphics) {
        if (this.root) {
            let index = 0;
            let colors = [Color.WHITE, Color.RED, Color.GREEN, Color.YELLOW, Color.BLUE, Color.MAGENTA, Color.CYAN];
            graphics.strokeColor = colors[index++];
            this.drawRect(graphics, this.root.getRegion());
            this.drawCross(graphics, this.root.getRegion());
            let children = this.root.getLeafNodes();
            while (children && children.length > 0) {
                let tempChildren: QuadTreeNode<T>[] = [];
                graphics.strokeColor = colors[index++];
                for (let i = 0; i < children.length; i++) {
                    this.drawCross(graphics, children[i].getRegion());
                    let childs = children[i].getLeafNodes();
                    if (childs) {
                        tempChildren = tempChildren.concat(childs);
                    }
                }

                children = tempChildren;
            }
        }
    }

    private drawRect(graphics: Graphics, rect: math.Rect) {
        graphics.rect(rect.x, rect.y, rect.width, rect.height);
        graphics.stroke();
    }

    private drawCross(graphics: Graphics, rect: math.Rect) {
        let center = rect.center;
        graphics.moveTo(center.x, center.y - rect.height * 0.5);
        graphics.lineTo(center.x, center.y + rect.height * 0.5);
        graphics.moveTo(center.x - rect.width * 0.5, center.y);
        graphics.lineTo(center.x + rect.width * 0.5, center.y);
        graphics.stroke();
    }
}
