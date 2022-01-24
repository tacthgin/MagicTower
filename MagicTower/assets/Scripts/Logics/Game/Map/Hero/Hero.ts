import { Animation, AnimationClip, Component, Node, Sprite, Tween, tween, v2, v3, Vec2, _decorator } from "cc";
import { GameApp } from "../../../../../GameFramework/Scripts/Application/GameApp";
import { IVec2 } from "../../../../../GameFramework/Scripts/Base/GameStruct/IVec2";
import { GameFrameworkLog } from "../../../../../GameFramework/Scripts/Base/Log/GameFrameworkLog";
import { IFsm } from "../../../../../GameFramework/Scripts/Fsm/IFsm";
import { HeroModel } from "../../../../Model/HeroModel/HeroModel";
import { Lightning } from "../../Elements/Lightning";
import { ElementFactory } from "../ElementFactory";
import { IGameMap } from "../GameMap/IGameMap";
import { HeroDirection } from "./HeroDirection";
import { AttackState } from "./HeroState/AttackState";
import { IdleState } from "./HeroState/IdleState";
import { MoveState } from "./HeroState/MoveState";

const { ccclass, property } = _decorator;

@ccclass("Hero")
export class Hero extends Component {
    @property(Node)
    private attackIcon: Node = null!;
    @property(Node)
    private heroNode: Node = null!;
    @property(Animation)
    private animation: Animation = null!;

    private _heroModel: HeroModel = null!;
    private _heroFSM: IFsm<Hero> = null!;
    private _map: IGameMap = null!;
    private _heroTile: Vec2 = null!;
    private _heroDirection: number = 0;
    private _currentAnimationName: string = "";

    constructor() {
        super();
    }

    get heroTile() {
        return this._heroTile;
    }

    set heroDirection(value: number) {
        this._heroDirection = value;
    }

    get heroDirection() {
        return this._heroDirection;
    }

    onLoad() {
        this._heroModel = GameApp.getModel(HeroModel);
        this._heroFSM = GameApp.FsmManager.createFsm("hero fsm", this, [new IdleState(), new MoveState(), new AttackState()]);
        GameApp.NodePoolManager.createNodePool(Lightning);
    }

    onDestroy() {
        GameApp.FsmManager.destroyFsm("hero fsm");
        GameApp.NodePoolManager.destroyNodePool(Lightning);
    }

    start() {
        this.createAnimation();
        this._heroFSM.start(IdleState);
    }

    init(map: IGameMap, tile: IVec2 | null = null) {
        this.setOwnerMap(map);
        this.location(tile);
    }

    setOwnerMap(map: IGameMap) {
        this._map = map;
    }

    /**
     * 根据偏移来得出方向
     * @param x 如果x是vec2，就使用x
     * @param y
     */
    getDirection(x: Vec2 | number, y: number | null = null) {
        let xx = 0;
        let yy = 0;
        if (x instanceof Vec2) {
            xx = x.x;
            yy = x.y;
        } else {
            xx = x;
            yy = y ?? 0;
        }
        if (xx != 0) {
            return xx < 0 ? HeroDirection.LEFT : HeroDirection.RIGHT;
        }
        if (yy != 0) {
            return yy < 0 ? HeroDirection.UP : HeroDirection.DOWN;
        }

        return HeroDirection.DOWN;
    }

    /**
     * 人物朝向
     * @param info info为vec2，人物朝向的点，info为nubmer直接传入方向
     */
    toward(info: IVec2 | number | null = null) {
        if (info) {
            if (typeof info == "number") {
                this._heroDirection = info;
            } else {
                let result = new Vec2();
                Vec2.subtract(result, info, this._heroTile);
                this._heroDirection = this.getDirection(result);
            }
        }

        this.setDirectionTexture();
    }

    /** 设置人物方向贴图 */
    setDirectionTexture() {
        this.animation.stop();
        this._currentAnimationName = "";
        this.heroNode.getComponent(Sprite)!.spriteFrame = ElementFactory.getHeroSpriteFrame(`${this._heroModel.getAnimation()[this._heroDirection]}_0`);
    }

    movePath(path: IVec2[], moveCallback: (tile: IVec2, end: boolean) => boolean) {
        let moveActions: Tween<Node>[] = [];
        let stop = false;
        let speed = this._heroModel.getHeroSpeed();
        let moveAction = (tile: IVec2, end: boolean = false) => {
            let position = this._map.getPositionAt(tile) || Vec2.ZERO;
            let currentTile = v2(tile.x, tile.y);
            return tween()
                .call(() => {
                    let result = new Vec2();
                    this._heroDirection = this.getDirection(Vec2.subtract(result, currentTile, this._heroTile));
                    if (!stop) {
                        //动作停止callFunc依然会调用一次;
                        this._heroFSM.currentState?.changeState(this._heroFSM, MoveState);
                    }
                })
                .to(speed, { position: v3(position.x, position.y) })
                .call(() => {
                    this._heroTile = currentTile;
                    stop = moveCallback(tile, end);
                });
        };
        for (let i = 0; i < path.length - 1; i++) {
            moveActions.push(moveAction(path[i]));
        }
        moveActions.push(moveAction(path[path.length - 1], true));
        moveActions.push(tween().call(this.stand.bind(this)));
        tween(this.node)
            .sequence(...moveActions)
            .start();
    }

    stand() {
        Tween.stopAllByTarget(this.node);
        this._heroFSM.currentState?.changeState(this._heroFSM, IdleState);
    }

    location(tile: IVec2 | null) {
        if (tile) {
            this._heroModel.setPosition(tile);
            this.toward(HeroDirection.DOWN);
        } else {
            this.toward(this._heroModel.getDireciton());
        }
        let heroPosition = this._heroModel.getPosition();
        this._heroTile = new Vec2(heroPosition.x, heroPosition.y);
        let position = this._map.getPositionAt(this._heroTile) || Vec2.ZERO;
        this.node.position = v3(position.x, position.y);
    }

    showAttack(active: boolean) {
        this.attackIcon.active = active;
        this.heroNode.active = !active;
    }

    magicLight(monsterIndexs: number[]) {
        let heroIndex = this._map.getTileIndex(this._heroTile);
        monsterIndexs.forEach(async (index) => {
            let lightning = (await GameApp.NodePoolManager.createNodeWithPath(Lightning, "Prefabs/Element/Lightning")) as Node;
            lightning.parent = this.node;
            lightning.getComponent(Lightning)?.init(index - heroIndex);
        });
    }

    magicDamage(monsterIndexs: number[]) {
        this.magicLight(monsterIndexs);
        let animationName = this._heroModel.getAnimation()[this._heroModel.getDireciton()];
        this.animation.play(`${animationName}_once`);
        this._currentAnimationName = "";
    }

    playAnimation() {
        let animationName = this.getAnimationName(this._heroFSM.currentState);
        if (animationName && this._currentAnimationName != animationName) {
            this._currentAnimationName = animationName;
            this.animation.play(animationName);
        }
    }

    private createAnimation() {
        let clips: (AnimationClip | null)[] = [];
        this._heroModel.getAnimation().forEach((animationName: any) => {
            let spriteFrames = [];
            for (let i = 1; i < 3; i++) {
                spriteFrames.push(ElementFactory.getHeroSpriteFrame(`${animationName}_${i}`)!);
            }
            let clip = AnimationClip.createWithSpriteFrames(spriteFrames, 4);
            if (clip) {
                clip.name = animationName;
                clip.wrapMode = AnimationClip.WrapMode.Loop;
                clips.push(clip);
            }

            clip = AnimationClip.createWithSpriteFrames(spriteFrames, 8);
            if (clip) {
                clip.name = `${animationName}_once`;
                clip.wrapMode = AnimationClip.WrapMode.Normal;
                clips.push(clip);
            }
        });

        this.animation.clips = clips;
    }

    protected getAnimationName(state: any): string {
        if (state instanceof MoveState) {
            return this._heroModel.getAnimation()[this._heroDirection];
        }

        return "";
    }
}
