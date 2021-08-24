import { _decorator, Component, Node, Graphics, view, rect, Rect } from "cc";
import { QuadTree } from "../Scripts/Framework/Lib/Custom/QuadTree";
const { ccclass, property } = _decorator;

@ccclass("Test")
export class Test extends Component {
    @property(Graphics)
    private graph: Graphics = null!;

    start() {
        let size = view.getVisibleSize();
        let rect = new Rect(-size.width * 0.5, -size.height * 0.5, size.width, size.height);
        // this.graph.rect(rect.x, rect.y, rect.width, rect.height);
        // this.graph.stroke();
        console.log("4叉树创建", Date.now());
        let tree = new QuadTree(rect, 3);
        tree.draw(this.graph);
        console.log("4叉树创建完毕", Date.now());
    }
}
