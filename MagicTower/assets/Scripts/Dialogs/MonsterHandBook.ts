import { Node, v3, _decorator } from "cc";
import { GameApp } from "../../GameFramework/Scripts/Application/GameApp";
import { DialogBase } from "../../GameFramework/Scripts/Application/UI/Dialog/DialogBase";
import { Monster } from "../Model/MapModel/Data/Elements/Monster";
import { MonsterHandBookItem } from "./MonsterHandBookItem";

const { ccclass, property } = _decorator;

@ccclass("MonsterHandBook")
export class MonsterHandBook extends DialogBase {
    @property(Node)
    private content: Node = null!;

    onRecyle() {
        for (let i = this.content.children.length - 1; i >= 0; i--) {
            GameApp.NodePoolManager.releaseNode(MonsterHandBookItem, this.content.children[i]);
        }
    }

    async onOpen(useData: { monsters: Monster[] }) {
        let monsters = useData.monsters;
        for (let i = 0; i < monsters.length; i++) {
            let item = (await GameApp.NodePoolManager.createNodeWithPath(MonsterHandBookItem, "Prefab/Dialogs/MonsterHandBookItem")) as Node;
            item.position = v3(0, i * -42);
            item.parent = this.content;
            item.getComponent(MonsterHandBookItem)?.init(monsters[i]);
        }
    }
}
