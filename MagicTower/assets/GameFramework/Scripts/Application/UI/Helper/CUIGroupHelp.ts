import { Component, _decorator } from "cc";
import { IUIGroupHelp } from "../../../UI/IUIGroupHelp";

const { ccclass, property } = _decorator;

@ccclass("CUIGroupHelp")
export class CUIGroupHelp extends Component implements IUIGroupHelp {
    setDepth(depth: number): void {
        this.node.setSiblingIndex(depth);
    }
}
