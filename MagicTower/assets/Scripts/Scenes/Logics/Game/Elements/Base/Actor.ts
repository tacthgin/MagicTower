import { tween, Tween, Vec3, Node } from "cc";
import { GameManager } from "../../../../Framework/Managers/GameManager";
import { MapElement } from "./MapElement";

export class Actor extends MapElement {
    movePath(path: Vec3[], speedScale: number = 1) {
        let npcSpeed = GameManager.DATA.getJsonElement("global", "npcSpeed");
        return new Promise((resolve) => {
            let moveActions: Tween<Node>[] = [];
            path.forEach((position) => {
                moveActions.push(tween().to(npcSpeed * speedScale, { position: new Vec3(position.x, position.y) }));
            });
            tween(this.node)
                .sequence(...moveActions)
                .call(() => {
                    resolve(0);
                })
                .start();
        });
    }
}
