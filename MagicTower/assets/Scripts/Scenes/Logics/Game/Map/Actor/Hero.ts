import { Animation, AnimationClip, Node, Sprite, Tween, tween, v3, Vec2, _decorator } from "cc";
import { Astar } from "../../../../../Framework/Lib/Custom/Astar";
import { GameManager } from "../../../../../Framework/Managers/GameManager";
import { NotifyCenter } from "../../../../../Framework/Managers/NotifyCenter";
import { GameEvent } from "../../../../Constant/GameEvent";
import { HeroAttr, HeroData } from "../../../../Data/CustomData/HeroData";
import { Lightning } from "../../Elements/Lightning";
import { MapCollisionSystem } from "../../System/MapCollisionSystem";
import { AstarMoveType, GameMap } from "../GameMap";
import { Actor } from "./Actor";
import { ActorState, StateMachine } from "./ActorState";

const { ccclass, property } = _decorator;

@ccclass("Hero")
export class Hero extends Actor {
    @property(Node)
    private attackIcon: Node = null!;
    @property(Node)
    private heroNode: Node = null!;

    private _heroData: HeroData = null!;
    private heroFSM: StateMachine = new StateMachine(this);
    private globalInfo: any = null;
    private map: GameMap = null!;
    private astar: Astar = new Astar();
    private isHeroMoving: boolean = false;
    private collisionSystem: MapCollisionSystem = new MapCollisionSystem();
    private heroTile: Vec2 = null!;
    private heroDirection: number = 0;

    get heroData() {
        return this._heroData;
    }

    set heroMoving(value: boolean) {
        this.isHeroMoving = value;
    }

    get heroMoving() {
        return this.isHeroMoving;
    }

    onLoad() {
        this.animation.on(Animation.EventType.FINISHED, this.onFinished, this);
        this.globalInfo = GameManager.DATA.getJson("global");
        this._heroData = GameManager.DATA.getData(HeroData)!;
    }

    onFinished() {
        this.setDirectionTexture();
        this.heroMoving = true;
    }

    start() {
        this.createAnimation();
        this.heroFSM.changeState(ActorState.IDLE);
    }

    init(map: GameMap, tile: Vec2 | null = null) {
        this.setOwnerMap(map);
        this.location(tile);
    }

    setOwnerMap(map: GameMap) {
        this.map = map;
        this.collisionSystem.init(map, this);
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
            return xx < 0 ? 3 : 1;
        }
        if (yy != 0) {
            return yy < 0 ? 0 : 2;
        }

        return 0;
    }

    private createAnimation() {
        let clips: (AnimationClip | null)[] = [];
        this._heroData.get("animation").forEach((animationName: any) => {
            let spriteFrames = [];
            for (let i = 1; i < 3; i++) {
                spriteFrames.push(GameManager.RESOURCE.getSpriteFrame(`${animationName}_${i}`)!);
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

    protected getAnimationName(state: ActorState): string {
        if (state == ActorState.MOVE) {
            return this._heroData.get("animation")[this.heroDirection];
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
            Vec2.subtract(result, info, this.heroTile);
            this.heroDirection = this.getDirection(result);
        }
        this.setDirectionTexture();
    }

    /** 设置人物方向贴图 */
    setDirectionTexture() {
        this.heroNode.getComponent(Sprite)!.spriteFrame = GameManager.RESOURCE.getSpriteFrame(`${this._heroData.get("animation")[this.heroDirection]}_0`);
    }

    autoMove(endTile: Vec2) {
        this.map.astarMoveType = AstarMoveType.HERO;
        console.log(this.heroTile, endTile);
        let path = this.astar.getPath(this.map, this.heroTile, endTile);
        if (path) {
            let canEndMove = this.collisionSystem.canEndTileMove(endTile);
            if (!canEndMove) {
                path.pop();
            }
            let moveComplete = () => {
                if (!canEndMove) {
                    this.toward(endTile);
                } else {
                    this.toward(this.heroDirection);
                }
                let tile = canEndMove ? endTile : path![path!.length - 1];
                if (tile) {
                    this._heroData.setPosition(tile, this.heroDirection);
                }
                this.isHeroMoving = !this.collisionSystem.collision(endTile);
                this.stand();
            };
            this.isHeroMoving = true;
            if (path.length == 0) {
                moveComplete();
            } else {
                this.movePath(path, (tile: Vec2, end: boolean) => {
                    if (end) {
                        moveComplete();
                    } else if (!this.collisionSystem.collision(tile)) {
                        //碰到区块处理事件停止;
                        this.stand();
                        return true;
                    }
                    return false;
                });
            }
            NotifyCenter.emit(GameEvent.MOVE_PATH);
        } else {
            GameManager.UI.showToast("无效路径");
        }
    }

    movePath(path: Vec2[], moveCallback: (tile: Vec2, end: boolean) => boolean) {
        let moveActions: Tween<Node>[] = [];
        let stop = false;
        let moveAction = (tile: Vec2, end: boolean = false) => {
            let position = this.map.getPositionAt(tile) || Vec2.ZERO;
            return tween()
                .call(() => {
                    let result = new Vec2();
                    this.heroDirection = this.getDirection(Vec2.subtract(result, tile, this.heroTile));
                    if (!stop) {
                        //动作停止callFunc依然会调用一次;
                        this.heroFSM.changeState(ActorState.MOVE);
                    }
                })
                .to(this.globalInfo.heroSpeed, { position: v3(position.x, position.y) })
                .call(() => {
                    this.heroTile = tile;
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
        this.heroFSM.changeState(ActorState.IDLE);
    }

    location(tile: Vec2 | null) {
        if (tile) {
            this._heroData.setPosition(tile);
        }
        this.heroTile = this._heroData.getPosition();
        let position = this.map.getPositionAt(this.heroTile) || Vec2.ZERO;
        this.node.position = v3(position.x, position.y);
        this.toward(this._heroData.get("direction"));
    }

    showAttack(active: boolean) {
        this.attackIcon.active = active;
        this.heroNode.active = !active;
    }

    hurt(damage: number) {
        let hp = this._heroData.getAttr(HeroAttr.HP) - damage;
        if (hp < 0) {
            hp = 0;
        }
        this._heroData.setAttrDiff(HeroAttr.HP, hp);
    }

    magicLight(monsterIndexs: number[]) {
        let heroIndex = this.map.getTileIndex(this.heroTile);
        monsterIndexs.forEach((index) => {
            let lightning = GameManager.POOL.createPrefabNode("Lightning")!;
            lightning.parent = this.node;
            lightning.getComponent(Lightning)?.init(index - heroIndex);
        });
    }

    magicDamage(monsterIndexs: number[], damage: number) {
        this.magicLight(monsterIndexs);
        let animationName = this._heroData.get("animation")[this._heroData.get("direction")];
        this.animation.play(`${animationName}_once`);
        if (damage < 1) {
            this._heroData.setAttr(HeroAttr.HP, Math.ceil(this._heroData.getAttr(HeroAttr.HP) * damage));
        } else {
            this._heroData.setAttrDiff(HeroAttr.HP, -damage);
        }
    }

    weak() {
        this._heroData.weak();
    }
}
