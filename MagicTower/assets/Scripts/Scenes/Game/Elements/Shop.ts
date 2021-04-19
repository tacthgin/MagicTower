import { Animation, _decorator } from "cc";
import { MapElement } from "./MapElement";
const { ccclass, property } = _decorator;

@ccclass("Shop")
export class Shop extends MapElement {
    onLoad() {
        this.animation = this.getComponent(Animation);
        this.createAnimation("shop", "pb_m", 2);
        this.animation.play("shop");
    }
}
