import { Animation, AnimationClip, Component, Node, Sprite, Tween, tween, v3, Vec2, _decorator } from "cc";
import { GameManager } from "../../../../Framework/Managers/GameManager";
import { NotifyCenter } from "../../../../Framework/Managers/NotifyCenter";
import { Util } from "../../../../Framework/Util/Util";
import { GameEvent } from "../../../Constant/GameEvent";
import { HeroAttr, HeroData } from "../../../Data/CustomData/HeroData";
import { Lightning } from "../Elements/Lightning";
import { GameMap } from "./GameMap";
import { HeroState, IdleState, MoveState } from "./HeroState";

const { ccclass, property } = _decorator;

@ccclass("Hero")
export class Hero extends Component {
    @property(Node)
    private attackIcon: Node = null;

    @property(Node)
    private heroNode: Node = null;

    private _heroData: HeroData = null;
    private animation: Animation = null;
    private currentState: HeroState = null;
    private globalInfo: any = null;
    private map: GameMap = null;

    get heroData() {
        return this._heroData;
    }

    onLoad() {
        this.animation = this.heroNode.getComponent(Animation);
        this.animation.on(Animation.EventType.FINISHED, this.onFinished, this);
        this.globalInfo = GameManager.DATA.getJson("global");
        this._heroData = GameManager.DATA.getData(HeroData);
    }

    onFinished() {
        this.setDirectionTexture();
        NotifyCenter.emit(GameEvent.COLLISION_COMPLETE);
    }

    start() {
        this.createAnimation();
        this.changeState(new IdleState());
    }

    init(map: GameMap) {
        this.setOwnerMap(map);
        this.location();
    }

    setOwnerMap(map: GameMap) {
        this.map = map;
    }

    /**
     * 根据偏移来得出方向
     * @param x 如果x是vec2，就使用x
     * @param y
     */
    getDirection(x: Vec2 | number, y: number = null) {
        let xx = 0;
        let yy = 0;
        if (x instanceof Vec2) {
            xx = x.x;
            yy = x.y;
        } else {
            xx = x;
            yy = y;
        }
        if (xx != 0) {
            return xx < 0 ? 3 : 1;
        }
        if (yy != 0) {
            return yy < 0 ? 0 : 2;
        }
    }

    private createAnimation() {
        this._heroData.get("animation").forEach((animationName: any) => {
            let spriteFrames = [];
            for (let i = 1; i < 3; i++) {
                spriteFrames.push(GameManager.RESOURCE.getSpriteFrame(`${animationName}_${i}`));
            }
            let clip = AnimationClip.createWithSpriteFrames(spriteFrames, 4);
            clip.name = animationName;
            clip.wrapMode = AnimationClip.WrapMode.Loop;
            this.animation.clips.push(clip);
            clip = AnimationClip.createWithSpriteFrames(spriteFrames, 8);
            clip.name = `${animationName}_once`;
            clip.wrapMode = AnimationClip.WrapMode.Normal;
            this.animation.clips.push(clip);
        });
    }

    /**
     * 人物朝向
     * @param info info为vec2，人物朝向的点，info为nubmer直接传入方向
     */
    toward(info: Vec2 | number) {
        if (typeof info == "number") {
            this._heroData.set("direction", info);
        } else {
            let result = new Vec2();
            Vec2.subtract(result, info, this._heroData.get("position"));
            this._heroData.set("direction", this.getDirection(result));
        }
        this.setDirectionTexture();
    }

    /** 设置人物方向贴图 */
    setDirectionTexture() {
        this.heroNode.getComponent(Sprite).spriteFrame = GameManager.RESOURCE.getSpriteFrame(`${this._heroData.get("animation")[this._heroData.get("direction")]}_0`);
    }

    /** 根据方向播放行走动画 */
    playMoveAnimation() {
        let animationName = this._heroData.get("animation")[this._heroData.get("direction")];
        if (this.animation.defaultClip) {
            let state = this.animation.getState(this.animation.defaultClip.name);
            if (state.isPlaying && this.animation.defaultClip.name == animationName) {
                return;
            }
        }
        this.animation.play(animationName);
    }

    stopMoveAnimation() {
        if (this.animation.defaultClip.name.indexOf("once") == -1) this.animation.stop();
    }

    /** 默认状态之间无条件限制 */
    changeState(newState: HeroState) {
        if (this.currentState != null && !(newState instanceof MoveState && this.currentState instanceof MoveState)) {
            this.currentState.exit();
        }
        this.currentState = newState;
        this.currentState.enter(this);
    }

    movePath(path: Vec2[], moveCallback: (tile: Vec2, end: boolean) => boolean) {
        let moveActions: Tween<Node>[] = [];
        let stop = false;
        let moveAction = (tile: Vec2, end: boolean = false) => {
            let position = this.map.getPositionAt(tile);
            return tween()
                .call(() => {
                    this._heroData.set("direction", this.getDirection(tile.subtract(this._heroData.get("position"))));
                    if (!stop) {
                        //动作停止callFunc依然会调用一次;
                        this.changeState(new MoveState());
                    }
                })
                .to(this.globalInfo.heroSpeed, { position: v3(position.x, position.y) })
                .call(() => {
                    this._heroData.set("position", position);
                    stop = moveCallback(position, end);
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
        this.changeState(new IdleState());
    }

    location() {
        let position = this.map.getPositionAt(this._heroData.get("position"));
        this.node.position = v3(position.x, position.y);
        this.toward(2);
    }

    showAttack(active: boolean) {
        this.attackIcon.active = active;
        this.heroNode.active = !active;
    }

    hurt(damage: number) {
        this._heroData.setAttrDiff(HeroAttr.HP, Util.clamp(this._heroData.getAttr(HeroAttr.HP) - damage, 0, Number.MAX_VALUE));
    }

    magicLight(monsterIndexs: number[]) {
        let heroIndex = this.map.getTileIndex(this._heroData.get("position"));
        monsterIndexs.forEach((index) => {
            let lightning = GameManager.POOL.createPrefabNode("Lightning");
            lightning.parent = this.node;
            lightning.getComponent(Lightning).init(index - heroIndex);
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
