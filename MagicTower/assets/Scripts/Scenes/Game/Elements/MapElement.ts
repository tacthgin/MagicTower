import { tween, UIOpacity } from "cc";
import { BasePoolNode } from "../../../Framework/Base/BasePoolNode";

export class MapElement extends BasePoolNode {
    remove(immediately: boolean = false) {
        if (immediately) {
            super.remove();
        } else {
            tween(this.node.getComponent(UIOpacity))
                .to(0.5, { opacity: 0 })
                .set({ opacity: 255 })
                .call(() => {
                    super.remove();
                })
                .start();
        }
    }

    add() {
        tween(this.node.getComponent(UIOpacity)).set({ opacity: 0 }).to(0.5, { opacity: 255 }).start();
    }
}
