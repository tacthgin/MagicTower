import { Component, _decorator } from "cc";
import { IUIGroupHelper } from "../../../UI/IUIGroupHelper";

const { ccclass, property } = _decorator;

@ccclass("CUIGroupHelper")
export class CUIGroupHelper extends Component implements IUIGroupHelper {
    setDepth(depth: number): void {
        this.node.setSiblingIndex(depth);
    }
}
