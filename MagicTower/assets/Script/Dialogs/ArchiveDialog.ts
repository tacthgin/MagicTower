import { _decorator, Node, Button, UIOpacity, find, Label } from "cc";
import { GameApp } from "../../GameFramework/Application/GameApp";
import { DialogBase } from "../../GameFramework/Application/UI/Dialog/DialogBase";
import { SaveModel } from "../Model/SaveModel/SaveModel";

const { ccclass, property } = _decorator;

@ccclass("ArchiveDialog")
export class ArchiveDialog extends DialogBase {
    @property(Node)
    private saveNodes: Node[] = null!;
    @property(Label)
    private saveLabel: Label = null!;
    private saveModel: SaveModel = null!;

    onOpen() {
        this.saveModel = GameApp.getModel(SaveModel);
        this.loadArchive();
    }

    private loadArchive() {
        for (let i = 0; i < this.saveNodes.length; i++) {
            this.setTitle(i);
        }
        this.selectSaveNode(this.saveModel.currentArchiveIndex);
        this.saveLabel.string = `保存存档${this.saveModel.currentArchiveIndex + 1}`;
    }

    private setTitle(index: number) {
        let title = this.saveModel.getTitle(index);
        find("Label", this.saveNodes[index])!.getComponent(Label)!.string = title || `加载存档${index + 1}`;
    }

    private selectSaveNode(index: number) {
        for (let i = 0; i < this.saveNodes.length; i++) {
            this.saveNodes[i].getComponent(UIOpacity)!.opacity = i == index ? 255 : 150;
        }
    }

    private onSaveButtonClick(button: Button, customEventData: string) {
        switch (customEventData) {
            case "save":
                this.saveModel.saveArchive();
                this.setTitle(this.saveModel.currentArchiveIndex);
                break;
            case "delete":
                this.saveModel.deleteArchive();
                this.loadArchive();
                break;
            default:
                let index = customEventData[customEventData.length - 1];
                if (this.saveModel.loadArchive(parseInt(index) - 1)) {
                    this.close();
                }
                break;
        }
    }
}
