import { Animation, AnimationClip, Component, Node, Sprite, Tween, tween, v2, v3, Vec2, _decorator } from "cc";
import { GameApp } from "../../../../../GameFramework/Scripts/Application/GameApp";
import { IVec2 } from "../../../../../GameFramework/Scripts/Base/GameStruct/IVec2";
import { IFsm } from "../../../../../GameFramework/Scripts/Fsm/IFsm";
import { HeroAttr } from "../../../../Model/HeroModel/HeroAttr";
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
    @property(Node)
    private animation: Animation = null!;

    private _heroModel: HeroModel = null!;
    private heroFSM: IFsm<Hero> = null!;
    private map: IGameMap = null!;
    private isHeroMoving: boolean = false;
    private _heroTile: Vec2 = null!;
    private heroDirection: number = 0;

    constructor() {
        super();
    }

    get heroModel() {
        return this._heroModel;
    }

    set heroMoving(value: boolean) {
        this.isHeroMoving = value;
    }

    get heroMoving() {
        return this.isHeroMoving;
    }

    get heroTile() {
        return this._heroTile;
    }

    onLoad() {
        this.animation.on(Animation.EventType.FINISHED, this.onFinished, this);
        this._heroModel = GameApp.getModel(HeroModel);
        this.heroFSM = GameApp.FsmManager.createFsm("hero fsm", this, [new IdleState(), new MoveState(), new AttackState()]);
        GameApp.NodePoolManager.createNodePool(Lightning);
    }

    onFinished() {
        this.setDirectionTexture();
        this.heroMoving = true;
    }

    start() {
        this.createAnimation();
        this.heroFSM.start(IdleState);
    }

    init(map: IGameMap, tile: IVec2 | null = null) {
        this.setOwnerMap(map);
        this.location(tile);
    }

    setOwnerMap(map: IGameMap) {
        this.map = map;
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
        if (state == MoveState) {
            return this._heroModel.getAnimation()[this.heroDirection];
        }

        return "";
    }

    /**
     * 人物朝向
     * @param info info为vec2，人物朝向的点，info为nubmer直接传入方向
     */
    toward(info: Vec2 | number) {
        if (typeof info == "number") {
            this.heroDirection = info;
        } else {
            let result = new Vec2();
            Vec2.subtract(result, info, this._heroTile);
            this.heroDirection = this.getDirection(result);
        }
        this.setDirectionTexture();
    }

    /** 设置人物方向贴图 */
    setDirectionTexture() {
        this.heroNode.getComponent(Sprite)!.spriteFrame = ElementFactory.getHeroSpriteFrame(`${this._heroModel.getAnimation()[this.heroDirection]}_0`);
    }

    /**
     * 自动行走
     * @param path 路径
     * @param canEndMove 终点是否能行走
     * @param endTile 终点tile
     * @param collisionFunc 与其他元素碰撞交互函数
     */
    autoMove(path: IVec2[], canEndMove: boolean, endTile: Vec2, collisionFunc: Function) {
        let moveComplete = () => {
            if (!canEndMove) {
                this.toward(endTile);
            } else {
                this.toward(this.heroDirection);
            }
            let tile = canEndMove ? endTile : path![path!.length - 1];
            if (tile) {
                this._heroModel.setPosition(tile, this.heroDirection);
            }
            this.isHeroMoving = !collisionFunc(endTile);
            this.stand();
        };
        this.isHeroMoving = true;
        if (path.length == 0) {
            moveComplete();
        } else {
            this.movePath(path, this._heroModel.getHeroSpeed(), (tile: Vec2, end: boolean) => {
                if (end) {
                    moveComplete();
                } else if (!collisionFunc(tile)) {
                    //碰到区块处理事件停止;
                    this.stand();
                    return true;
                }
                return false;
            });
        }
        GameApp.EventManager.fireNow(this, null!);
        //NotifyCenter.emit(GameEvent.MOVE_PATH);
    }

    movePath(path: IVec2[], speed: number, moveCallback: Function) {
        let moveActions: Tween<Node>[] = [];
        let stop = false;
        let moveAction = (tile: IVec2, end: boolean = false) => {
            let position = this.map.getPositionAt(tile) || Vec2.ZERO;
            let currentTile = v2(tile.x, tile.y);
            return tween()
                .call(() => {
                    let result = new Vec2();
                    this.heroDirection = this.getDirection(Vec2.subtract(result, currentTile, this._heroTile));
                    if (!stop) {
                        //动作停止callFunc依然会调用一次;
                        this.heroFSM.currentState?.changeState(this.heroFSM, MoveState);
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
        this.heroFSM.currentState?.changeState(this.heroFSM, IdleState);
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
        let position = this.map.getPositionAt(this._heroTile) || Vec2.ZERO;
        this.node.position = v3(position.x, position.y);
    }

    showAttack(active: boolean) {
        this.attackIcon.active = active;
        this.heroNode.active = !active;
    }

    hurt(damage: number) {
        let hp = this._heroModel.getAttr(HeroAttr.HP) - damage;
        if (hp < 0) {
            hp = 0;
        }
        this._heroModel.setAttrDiff(HeroAttr.HP, hp);
    }

    magicLight(monsterIndexs: number[]) {
        let heroIndex = this.map.getTileIndex(this._heroTile);
        monsterIndexs.forEach(async (index) => {
            let lightning = (await GameApp.NodePoolManager.createNodeWithPath(Lightning, "Prefabs/Element/Lightning")) as Node;
            lightning.parent = this.node;
            lightning.getComponent(Lightning)?.init(index - heroIndex);
        });
    }

    magicDamage(monsterIndexs: number[], damage: number) {
        this.magicLight(monsterIndexs);
        let animationName = this._heroModel.getAnimation()[this._heroModel.getDireciton()];
        this.animation.play(`${animationName}_once`);
        if (damage < 1) {
            this._heroModel.setAttr(HeroAttr.HP, Math.ceil(this._heroModel.getAttr(HeroAttr.HP) * damage));
        } else {
            this._heroModel.setAttrDiff(HeroAttr.HP, -damage);
        }
    }

    weak() {
        this._heroModel.weak();
    }
}
