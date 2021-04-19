import { _decorator, Node, Animation, Vec2, tween, Sprite, UITransform, SpriteFrame, AnimationClip, Vec3, Tween } from "cc";
import { GameManager } from "../../../Framework/Managers/GameManager";
import { Util } from "../../../Framework/Util/Util";
import { MapElement } from "./MapElement";

const { ccclass, property } = _decorator;

@ccclass("Monster")
export class Monster extends MapElement {
    @property(Node)
    lightning: Node = null;

    private _monsterInfo: any = null;
    private globalInfo: any = null;
    private _firstAttack: boolean = false;
    private _monsterMove: boolean = false;

    get monsterInfo() {
        return this._monsterInfo;
    }

    set firstAttack(value) {
        this._firstAttack = value;
    }

    get firstAttack() {
        return this._firstAttack;
    }

    set monsterMove(value) {
        this._monsterMove = value;
    }

    get monsterMove() {
        return this._monsterMove;
    }

    onLoad() {
        this.animation = this.getComponent(Animation);
        this.globalInfo = GameManager.DATA.getJson("global");
    }

    init(id: number) {
        this._monsterInfo = GameManager.DATA.getJsonElement("monster", id, true);
        this._firstAttack = this._monsterInfo.firstAttack;
        this.node.getComponent(UITransform).anchorY = this._monsterInfo.big ? 0.15 : 0.5;
        this.getComponent(Sprite).spriteFrame = GameManager.RESOURCE.getSpriteFrame(`${this._monsterInfo.spriteId}_0`);
        this.createAnimation(this._monsterInfo.spriteId, this._monsterInfo.spriteId, 2);
        this.animation.play(this._monsterInfo.spriteId);
    }

    hurt(damage: number) {
        this._monsterInfo.hp = Util.clamp(this._monsterInfo.hp - damage, 0, Number.MAX_VALUE);
        return this._monsterInfo.hp == 0;
    }

    movePath(path: Vec2[], speed: number = 1) {
        return new Promise((resolve) => {
            let moveActions: Tween<Node>[] = [];
            path.forEach((position) => {
                moveActions.push(tween(this.node).to(this.globalInfo.npcSpeed * speed, { position: new Vec3(position.x, position.y) }));
            });
            moveActions.push(
                tween(this.node).call(() => {
                    resolve(0);
                })
            );
            tween(this.node)
                .sequence(moveActions)
                .call(() => {
                    resolve(0);
                })
                .start();
        });
    }

    beAttack() {
        let icon = GameManager.POOL.createPrefabNode("Attack");
        icon.parent = this.node;
        icon.position = Vec3.ZERO;
        tween(icon).delay(this.globalInfo.fadeInterval).removeSelf().start();
    }

    move(vec: Vec2, callback: any) {
        tween(this.node)
            .by(this.globalInfo.npcSpeed, { position: new Vec3(vec.x, vec.y) })
            .call(callback)
            .start();
    }

    weak(ratio: number) {
        this._monsterInfo.attack *= ratio;
        this._monsterInfo.defence *= ratio;
        this._monsterInfo.hp *= ratio;
    }

    isBoss() {
        return this._monsterInfo.boss;
    }
}
