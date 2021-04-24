import { _decorator, Component, Node, Animation, Vec2, Sprite } from "cc";
import { GameManager } from "../../../Framework/Managers/GameManager";
import { NotifyCenter } from "../../../Framework/Managers/NotifyCenter";
import { GameEvent } from "../../Constant/GameEvent";
import { HeroData } from "../../Data/CustomData/HeroData";
import { PropParser } from "../../Data/Parser/PropParser";
import { HeroState, IdleState } from "./HeroState";

const { ccclass, property } = _decorator;

@ccclass("Hero")
export class Hero extends Component {
    @property(Node)
    private attackIcon: Node = null;

    @property(Node)
    private heroNode: Node = null;

    private heroData: HeroData = null;
    private animation: Animation = null;
    private currentState: HeroState = null;
    private globalInfo: any = null;
    private map: GameMap = null;
    private propParser: PropParser = null;

    get HeroData() {
        return this.heroData;
    }

    onLoad() {
        this.animation = this.heroNode.getComponent(Animation);
        this.animation.on(Animation.EventType.FINISHED, this.onFinished, this);
        this.globalInfo = GameManager.DATA.getJson("global");
        this.heroData = GameManager.DATA.getData(HeroData);
        this.propParser = GameManager.DATA.getJsonParser(PropParser);
    }

    onFinished() {
        this.setDirectionTexture();
        NotifyCenter.emit(GameEvent.COLLISION_COMPLETE);
    }

    start() {
        this.createAnimation();
        this.changeState(new IdleState());
    }

    init(map: GameMap, tile: Vec2 = null) {
        this.setOwnerMap(map);
        this.location(tile);
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
        this.heroData.Animation.forEach((animationName) => {
            let spriteFrames = [];
            for (let i = 1; i < 3; i++) {
                spriteFrames.push(GameManager.RESOURCE.getSpriteFrame(`${animationName}_${i}`));
            }
            let clip = AnimationClip.createWithSpriteFrames(spriteFrames, 4);
            clip.name = animationName;
            clip.wrapMode = WrapMode.Loop;
            this.animation.addClip(clip);
            clip = AnimationClip.createWithSpriteFrames(spriteFrames, 8);
            clip.name = `${animationName}_once`;
            clip.wrapMode = WrapMode.Normal;
            this.animation.addClip(clip);
        });
    }
    /**
     * 人物朝向
     * @param info info为vec2，人物朝向的点，info为nubmer直接传入方向
     */
    toward(info: Vec2 | number) {
        if (typeof info == "number") {
            this.heroData.Direction = info;
        } else {
            this.heroData.Direction = this.getDirection(info.sub(this.heroData.Position));
        }
        this.setDirectionTexture();
    }

    /** 设置人物方向贴图 */
    setDirectionTexture() {
        this.heroNode.getComponent(Sprite).spriteFrame = GameManager.RESOURCE.getSpriteFrame(`${this.heroData.Animation[this.heroData.Direction]}_0`);
    }

    /** 根据方向播放行走动画 */
    playMoveAnimation() {
        let animationName = this.heroData.Animation[this.heroData.Direction];
        if (this.animation.currentClip) {
            let state = this.animation.getAnimationState(this.animation.currentClip.name);
            if (state.isPlaying && this.animation.currentClip.name == animationName) {
                return;
            }
        }
        this.animation.play(animationName);
    }

    stopMoveAnimation() {
        if (this.animation.currentClip.name.indexOf("once") == -1) this.animation.stop();
    }

    /** 默认状态之间无条件限制 */
    changeState(newState: State) {
        if (this.currentState != null && !(newState instanceof MoveState && this.currentState instanceof MoveState)) {
            this.currentState.exit();
        }
        this.currentState = newState;
        this.currentState.enter(this);
    }

    movePath(path: Vec2[], moveCallback: (tile: Vec2, end: boolean) => boolean) {
        let moveActions = [];
        let stop = false;
        let moveAction = (position: Vec2, end: boolean = false) => {
            return sequence(
                callFunc(() => {
                    this.heroData.Direction = this.getDirection(position.sub(this.heroData.Position));
                    if (!stop) {
                        动作停止callFunc依然会调用一次;
                        this.changeState(new MoveState());
                    }
                }),
                moveTo(this.globalInfo.heroSpeed, this.map.tileToNodeSpaceAR(position)),
                callFunc(() => {
                    this.heroData.Position = position;
                    stop = moveCallback(position, end);
                })
            );
        };
        for (let i = 0; i < path.length - 1; i++) {
            moveActions.push(moveAction(path[i]));
        }
        moveActions.push(moveAction(path[path.length - 1], true));
        moveActions.push(
            callFunc(() => {
                this.stand();
            })
        );
        tween(this.node).sequence(moveActions).start();
    }

    stand() {
        this.changeState(new IdleState());
    }

    location(tile: Vec2 = null) {
        this.heroData.Position = tile || this.heroData.Position;
        let position = this.map.tileToNodeSpaceAR(this.heroData.Position);
        this.node.position = v3(position.x, position.y, 0);
        this.toward(2);
    }

    showAttack(active: boolean) {
        this.attackIcon.active = active;
        this.heroNode.active = !active;
    }

    hurt(damage: number) {
        this.heroData.Hp = Util.clamp(this.heroData.Hp - damage, 0, Number.MAX_VALUE);
    }

    magicLight(monsterIndexs: number[]) {
        let heroIndex = this.map.tileToIndex(this.heroData.Position);
        monsterIndexs.forEach((index) => {
            let lightning = ElementManager.getElement("Lightning");
            lightning.parent = this.node;
            lightning.getComponent("Lightning").init(index - heroIndex);
        });
    }

    magicDamage(monsterIndexs: number[], damage: number) {
        this.magicLight(monsterIndexs);
        let animationName = this.heroData.Animation[this.heroData.Direction];
        this.animation.play(`${animationName}_once`);
        if (damage < 1) {
            this.heroData.Hp = Math.ceil(this.heroData.Hp * damage);
        } else {
            this.heroData.Hp -= damage;
        }
        NotifyCenter.emit(GameEvent.HERO_ATTR_CHANGED);
    }

    weak() {
        let info = GameManager.DATA.getJsonElement("global", "weakenAttr");
        this.heroData.Attack = info.attack;
        this.heroData.Defence = info.defence;
        this.heroData.Hp = info.hp;
        this.heroData.clearEquip();
    }

    addProp(id: string, count: number = 1) {
        let propInfo = this.propParser.getJsonElement(id);
        if (propInfo.consumption) {
            switch (propInfo.type) {
                case 2:
                    //加血量
                    this.heroData.Hp += propInfo.value * Math.floor((this.map.level - 1) / 10 + 1);
                    break;
                case 3:
                    //加攻击
                    this.heroData.Attack += propInfo.value * Math.floor((this.map.level - 1) / 10 + 1);
                    break;
                case 4:
                    //加防御
                    this.heroData.Defence += propInfo.value * Math.floor((this.map.level - 1) / 10 + 1);
                    break;
                case 5:
                    //装备剑
                    this.heroData.Attack += propInfo.value;
                    break;
                case 6:
                    //装备盾
                    this.heroData.Defence += propInfo.value;
                    break;
            }
        }
        this.heroData.addProp(propInfo.id, count);
    }

    removeProp(id: string, count: number = 1) {
        let propInfo = this.propParser.getJsonElement(id);
        if (!propInfo.consumption) {
            this.heroData.addProp(propInfo.id, -count);
        }
    }
}
