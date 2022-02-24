import { Label, _decorator } from "cc";
import { GameApp } from "../../GameFramework/Scripts/Application/GameApp";
import { DialogBase } from "../../GameFramework/Scripts/Application/UI/Dialog/DialogBase";
import { UIFactory } from "../../GameFramework/Scripts/Application/UI/UIFactory";
import { HeroModel } from "../Model/HeroModel/HeroModel";
import { ShopModel } from "../Model/ShopModel/ShopModel";

const { ccclass, property } = _decorator;

@ccclass("ShopDialog")
export class ShopDialog extends DialogBase {
    @property(Label)
    private content: Label = null!;
    @property(Label)
    private attr: Label[] = [];

    onOpen() {
        let shopModel = GameApp.getModel(ShopModel);
        this.content.string = `你若给我 ${shopModel.needGold} 个金币，\n我就替你提升以下一种能力。`;
        this.attr[0].string = `生命力 + ${shopModel.hp}`;
        this.attr[1].string = `攻击力 + ${shopModel.attack}`;
        this.attr[2].string = `防御力 + ${shopModel.defence}`;
    }

    onBtnClick(event: any, customEventData: string) {
        if (customEventData != "no") {
            this.buy(customEventData);
        }
        this.close();
    }

    private buy(buyType: string) {
        if (buyType != "no") {
            let shopModel = GameApp.getModel(ShopModel);
            let result = GameApp.getModel(HeroModel).buy(buyType, (shopModel as any)[buyType], shopModel.buy());
            if (!result) {
                UIFactory.showToast("穷鬼还想买东西");
            }
        }
    }
}
