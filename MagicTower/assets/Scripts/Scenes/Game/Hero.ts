import { _decorator, Component, Node, Animation, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

import { ElementManager } from "./ElementManager";
import { State, IdleState, MoveState } from "./HeroState";
import HeroInfo from "../../Data/HeroInfo";
import { DataManager } from "../../Managers/DataManager";
import { Util } from "../../Util/Util";
import { GameMap } from "./Map/GameMap";
import PropParser from "../../Data/Parser/PropParser";
import { NotifyCenter } from "../../Managers/NotifyCenter";
import { GameEvent } from "../../Constant/GameEvent";

@ccclass('Hero')
export default class Hero extends Component {
    @property(Node)
    attackIcon: Node | null = null;
    @property(Node)
    heroNode: Node | null = null;
    private heroInfo: HeroInfo = null;
    private animation: Animation | null = null;
    private currentState: State = null;
    private globalInfo: any = null;
    private map: GameMap = null;
    private propParser: PropParser = null;
    get HeroInfo() {
        //return this.heroInfo;
    }
    onLoad() {
        //this.animation = this.heroNode.getComponent(cc.Animation);
        //this.animation.on("finished", this.onFinished, this);
        //this.globalInfo = DataManager.getJson("global");
        //this.heroInfo = DataManager.getCustomData("GameInfo").heroInfo;
        //this.propParser = DataManager.getJsonParser("prop");
    }
    onFinished() {
        //this.setDirectionTexture();
        //NotifyCenter.emit(GameEvent.COLLISION_COMPLETE);
    }
    start() {
        //this.createAnimation();
        //this.changeState(new IdleState());
    }
    init(map: GameMap, tile: Vec2 | null = null) {
        //this.setOwnerMap(map);
        //this.location(tile);
    }
    setOwnerMap(map: GameMap) {
        //this.map = map;
    }
    /**
     * 根据偏移来得出方向
     * @param x 如果x是vec2，就使用x
     * @param y
     */
    getDirection(x: Vec2 | number, y: number = null) {
        //let xx = 0;
        //let yy = 0;
        //if (x instanceof cc.Vec2) {
        //xx = x.x;
        //yy = x.y;
        //} else {
        //xx = x;
        //yy = y;
        //}

        //if (xx != 0) {
        //return xx < 0 ? 3 : 1;
        //}

        //if (yy != 0) {
        //return yy < 0 ? 0 : 2;
        //}
    }
    private createAnimation() {
        //this.heroInfo.Animation.forEach(animationName => {
        //let spriteFrames = [];
        //for (let i = 1; i < 3; i++) {
        //spriteFrames.push(ElementManager.getSpriteFrame(`${animationName}_${i}`));
        //}
        //let clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 4);
        //clip.name = animationName;
        //clip.wrapMode = cc.WrapMode.Loop;
        //this.animation.addClip(clip);

        //clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 8);
        //clip.name = `${animationName}_once`;
        //clip.wrapMode = cc.WrapMode.Normal;
        //this.animation.addClip(clip);
        //});
    }
    /**
     * 人物朝向
     * @param info info为vec2，人物朝向的点，info为nubmer直接传入方向
     */
    toward(info: Vec2 | number) {
        //if (typeof info == "number") {
        //this.heroInfo.Direction = info;
        //} else {
        //this.heroInfo.Direction = this.getDirection(info.sub(this.heroInfo.Position));
        //}
        //this.setDirectionTexture();
    }
    /** 设置人物方向贴图 */
    setDirectionTexture() {
        //this.heroNode.getComponent(cc.Sprite).spriteFrame = ElementManager.getSpriteFrame(`${this.heroInfo.Animation[this.heroInfo.Direction]}_0`);
    }
    /** 根据方向播放行走动画 */
    playMoveAnimation() {
        //let animationName = this.heroInfo.Animation[this.heroInfo.Direction];
        //if (this.animation.currentClip) {
        //let state = this.animation.getAnimationState(this.animation.currentClip.name);
        //if (state.isPlaying && this.animation.currentClip.name == animationName) {
        //return;
        //}
        //}
        //this.animation.play(animationName);
    }
    stopMoveAnimation() {
        //if (this.animation.currentClip.name.indexOf("once") == -1) this.animation.stop();
    }
    /** 默认状态之间无条件限制 */
    changeState(newState: State) {
        //if (this.currentState != null && !(newState instanceof MoveState && this.currentState instanceof MoveState)) {
        //this.currentState.exit();
        //}

        //this.currentState = newState;

        //this.currentState.enter(this);
    }
    movePath(path: Vec2[], moveCallback: (tile: Vec2, end: boolean) => boolean) {
        //let moveActions = [];
        //let stop = false;
        //let moveAction = (position: cc.Vec2, end: boolean = false) => {
        //return cc.sequence(
        //cc.callFunc(() => {
        //this.heroInfo.Direction = this.getDirection(position.sub(this.heroInfo.Position));
        //if (!stop) {
                        //动作停止callFunc依然会调用一次
        //this.changeState(new MoveState());
        //}
        //}),
        //cc.moveTo(this.globalInfo.heroSpeed, this.map.tileToNodeSpaceAR(position)),
        //cc.callFunc(() => {
        //this.heroInfo.Position = position;
        //stop = moveCallback(position, end);
        //})
        //);
        //};

        //for (let i = 0; i < path.length - 1; i++) {
        //moveActions.push(moveAction(path[i]));
        //}
        //moveActions.push(moveAction(path[path.length - 1], true));

        //moveActions.push(
        //cc.callFunc(() => {
        //this.stand();
        //})
        //);

        //cc.tween(this.node)
        //.sequence(moveActions)
        //.start();
    }
    stand() {
        //this.changeState(new IdleState());
    }
    location(tile: Vec2 | null = null) {
        //this.heroInfo.Position = tile || this.heroInfo.Position;
        //let position = this.map.tileToNodeSpaceAR(this.heroInfo.Position);
        //this.node.position = cc.v3(position.x, position.y, 0);
        //this.toward(2);
    }
    showAttack(active: boolean) {
        //this.attackIcon.active = active;
        //this.heroNode.active = !active;
    }
    hurt(damage: number) {
        //this.heroInfo.Hp = Util.clamp(this.heroInfo.Hp - damage, 0, Number.MAX_VALUE);
    }
    magicLight(monsterIndexs: number[]) {
        //let heroIndex = this.map.tileToIndex(this.heroInfo.Position);
        //monsterIndexs.forEach(index => {
        //let lightning = ElementManager.getElement("Lightning");
        //lightning.parent = this.node;
        //lightning.getComponent("Lightning").init(index - heroIndex);
        //});
    }
    magicDamage(monsterIndexs: number[], damage: number) {
        //this.magicLight(monsterIndexs);

        //let animationName = this.heroInfo.Animation[this.heroInfo.Direction];
        //this.animation.play(`${animationName}_once`);

        //if (damage < 1) {
        //this.heroInfo.Hp = Math.ceil(this.heroInfo.Hp * damage);
        //} else {
        //this.heroInfo.Hp -= damage;
        //}

        //NotifyCenter.emit(GameEvent.HERO_ATTR_CHANGED);
    }
    weak() {
        //let info = DataManager.getJsonElement("global", "weakenAttr");
        //this.heroInfo.Attack = info.attack;
        //this.heroInfo.Defence = info.defence;
        //this.heroInfo.Hp = info.hp;
        //this.heroInfo.clearEquip();
    }
    addProp(id: string, count: number = 1) {
        //let propInfo = this.propParser.getJsonElement(id);
        //if (propInfo.consumption) {
        //switch (propInfo.type) {
        //case 2:
                    //加血量
        //this.heroInfo.Hp += propInfo.value * Math.floor((this.map.level - 1) / 10 + 1);
        //break;
        //case 3:
                    //加攻击
        //this.heroInfo.Attack += propInfo.value * Math.floor((this.map.level - 1) / 10 + 1);
        //break;
        //case 4:
                    //加防御
        //this.heroInfo.Defence += propInfo.value * Math.floor((this.map.level - 1) / 10 + 1);
        //break;
        //case 5:
                    //装备剑
        //this.heroInfo.Attack += propInfo.value;
        //break;
        //case 6:
                    //装备盾
        //this.heroInfo.Defence += propInfo.value;
        //break;
        //}
        //NotifyCenter.emit(GameEvent.HERO_ATTR_CHANGED);
        //}
        //this.heroInfo.addProp(propInfo.id, count);
        //NotifyCenter.emit(GameEvent.REFRESH_PROP, propInfo, count);
    }
    removeProp(id: string, count: number = 1) {
        //let propInfo = this.propParser.getJsonElement(id);
        //if (!propInfo.consumption) {
        //this.heroInfo.addProp(propInfo.id, -count);
        //NotifyCenter.emit(GameEvent.REFRESH_PROP, propInfo, -count);
        //}
    }
}

/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// import { ElementManager } from "./ElementManager";
// import { State, IdleState, MoveState } from "./HeroState";
// import HeroInfo from "../../Data/HeroInfo";
// import { DataManager } from "../../Managers/DataManager";
// import { Util } from "../../Util/Util";
// import { GameMap } from "./Map/GameMap";
// import PropParser from "../../Data/Parser/PropParser";
// import { NotifyCenter } from "../../Managers/NotifyCenter";
// import { GameEvent } from "../../Constant/GameEvent";
// 
// const { ccclass, property } = cc._decorator;
// 
// @ccclass
// export default class Hero extends cc.Component {
//     @property(cc.Node)
//     attackIcon: cc.Node = null;
// 
//     @property(cc.Node)
//     heroNode: cc.Node = null;
// 
//     private heroInfo: HeroInfo = null;
// 
//     private animation: cc.Animation = null;
// 
//     private currentState: State = null;
// 
//     private globalInfo: any = null;
// 
//     private map: GameMap = null;
// 
//     private propParser: PropParser = null;
// 
//     get HeroInfo() {
//         return this.heroInfo;
//     }
// 
//     onLoad() {
//         this.animation = this.heroNode.getComponent(cc.Animation);
//         this.animation.on("finished", this.onFinished, this);
//         this.globalInfo = DataManager.getJson("global");
//         this.heroInfo = DataManager.getCustomData("GameInfo").heroInfo;
//         this.propParser = DataManager.getJsonParser("prop");
//     }
// 
//     onFinished() {
//         this.setDirectionTexture();
//         NotifyCenter.emit(GameEvent.COLLISION_COMPLETE);
//     }
// 
//     start() {
//         this.createAnimation();
//         this.changeState(new IdleState());
//     }
// 
//     init(map: GameMap, tile: cc.Vec2 = null) {
//         this.setOwnerMap(map);
//         this.location(tile);
//     }
// 
//     setOwnerMap(map: GameMap) {
//         this.map = map;
//     }
// 
//     /**
//      * 根据偏移来得出方向
//      * @param x 如果x是vec2，就使用x
//      * @param y
//      */
//     getDirection(x: cc.Vec2 | number, y: number = null) {
//         let xx = 0;
//         let yy = 0;
//         if (x instanceof cc.Vec2) {
//             xx = x.x;
//             yy = x.y;
//         } else {
//             xx = x;
//             yy = y;
//         }
// 
//         if (xx != 0) {
//             return xx < 0 ? 3 : 1;
//         }
// 
//         if (yy != 0) {
//             return yy < 0 ? 0 : 2;
//         }
//     }
// 
//     private createAnimation() {
//         this.heroInfo.Animation.forEach(animationName => {
//             let spriteFrames = [];
//             for (let i = 1; i < 3; i++) {
//                 spriteFrames.push(ElementManager.getSpriteFrame(`${animationName}_${i}`));
//             }
//             let clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 4);
//             clip.name = animationName;
//             clip.wrapMode = cc.WrapMode.Loop;
//             this.animation.addClip(clip);
// 
//             clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 8);
//             clip.name = `${animationName}_once`;
//             clip.wrapMode = cc.WrapMode.Normal;
//             this.animation.addClip(clip);
//         });
//     }
// 
//     /**
//      * 人物朝向
//      * @param info info为vec2，人物朝向的点，info为nubmer直接传入方向
//      */
//     toward(info: cc.Vec2 | number) {
//         if (typeof info == "number") {
//             this.heroInfo.Direction = info;
//         } else {
//             this.heroInfo.Direction = this.getDirection(info.sub(this.heroInfo.Position));
//         }
//         this.setDirectionTexture();
//     }
// 
//     /** 设置人物方向贴图 */
//     setDirectionTexture() {
//         this.heroNode.getComponent(cc.Sprite).spriteFrame = ElementManager.getSpriteFrame(`${this.heroInfo.Animation[this.heroInfo.Direction]}_0`);
//     }
// 
//     /** 根据方向播放行走动画 */
//     playMoveAnimation() {
//         let animationName = this.heroInfo.Animation[this.heroInfo.Direction];
//         if (this.animation.currentClip) {
//             let state = this.animation.getAnimationState(this.animation.currentClip.name);
//             if (state.isPlaying && this.animation.currentClip.name == animationName) {
//                 return;
//             }
//         }
//         this.animation.play(animationName);
//     }
// 
//     stopMoveAnimation() {
//         if (this.animation.currentClip.name.indexOf("once") == -1) this.animation.stop();
//     }
// 
//     /** 默认状态之间无条件限制 */
//     changeState(newState: State) {
//         if (this.currentState != null && !(newState instanceof MoveState && this.currentState instanceof MoveState)) {
//             this.currentState.exit();
//         }
// 
//         this.currentState = newState;
// 
//         this.currentState.enter(this);
//     }
// 
//     movePath(path: cc.Vec2[], moveCallback: (tile: cc.Vec2, end: boolean) => boolean) {
//         let moveActions = [];
//         let stop = false;
//         let moveAction = (position: cc.Vec2, end: boolean = false) => {
//             return cc.sequence(
//                 cc.callFunc(() => {
//                     this.heroInfo.Direction = this.getDirection(position.sub(this.heroInfo.Position));
//                     if (!stop) {
//                         //动作停止callFunc依然会调用一次
//                         this.changeState(new MoveState());
//                     }
//                 }),
//                 cc.moveTo(this.globalInfo.heroSpeed, this.map.tileToNodeSpaceAR(position)),
//                 cc.callFunc(() => {
//                     this.heroInfo.Position = position;
//                     stop = moveCallback(position, end);
//                 })
//             );
//         };
// 
//         for (let i = 0; i < path.length - 1; i++) {
//             moveActions.push(moveAction(path[i]));
//         }
//         moveActions.push(moveAction(path[path.length - 1], true));
// 
//         moveActions.push(
//             cc.callFunc(() => {
//                 this.stand();
//             })
//         );
// 
//         cc.tween(this.node)
//             .sequence(moveActions)
//             .start();
//     }
// 
//     stand() {
//         this.changeState(new IdleState());
//     }
// 
//     location(tile: cc.Vec2 = null) {
//         this.heroInfo.Position = tile || this.heroInfo.Position;
//         let position = this.map.tileToNodeSpaceAR(this.heroInfo.Position);
//         this.node.position = cc.v3(position.x, position.y, 0);
//         this.toward(2);
//     }
// 
//     showAttack(active: boolean) {
//         this.attackIcon.active = active;
//         this.heroNode.active = !active;
//     }
// 
//     hurt(damage: number) {
//         this.heroInfo.Hp = Util.clamp(this.heroInfo.Hp - damage, 0, Number.MAX_VALUE);
//     }
// 
//     magicLight(monsterIndexs: number[]) {
//         let heroIndex = this.map.tileToIndex(this.heroInfo.Position);
//         monsterIndexs.forEach(index => {
//             let lightning = ElementManager.getElement("Lightning");
//             lightning.parent = this.node;
//             lightning.getComponent("Lightning").init(index - heroIndex);
//         });
//     }
// 
//     magicDamage(monsterIndexs: number[], damage: number) {
//         this.magicLight(monsterIndexs);
// 
//         let animationName = this.heroInfo.Animation[this.heroInfo.Direction];
//         this.animation.play(`${animationName}_once`);
// 
//         if (damage < 1) {
//             this.heroInfo.Hp = Math.ceil(this.heroInfo.Hp * damage);
//         } else {
//             this.heroInfo.Hp -= damage;
//         }
// 
//         NotifyCenter.emit(GameEvent.HERO_ATTR_CHANGED);
//     }
// 
//     weak() {
//         let info = DataManager.getJsonElement("global", "weakenAttr");
//         this.heroInfo.Attack = info.attack;
//         this.heroInfo.Defence = info.defence;
//         this.heroInfo.Hp = info.hp;
//         this.heroInfo.clearEquip();
//     }
// 
//     addProp(id: string, count: number = 1) {
//         let propInfo = this.propParser.getJsonElement(id);
//         if (propInfo.consumption) {
//             switch (propInfo.type) {
//                 case 2:
//                     //加血量
//                     this.heroInfo.Hp += propInfo.value * Math.floor((this.map.level - 1) / 10 + 1);
//                     break;
//                 case 3:
//                     //加攻击
//                     this.heroInfo.Attack += propInfo.value * Math.floor((this.map.level - 1) / 10 + 1);
//                     break;
//                 case 4:
//                     //加防御
//                     this.heroInfo.Defence += propInfo.value * Math.floor((this.map.level - 1) / 10 + 1);
//                     break;
//                 case 5:
//                     //装备剑
//                     this.heroInfo.Attack += propInfo.value;
//                     break;
//                 case 6:
//                     //装备盾
//                     this.heroInfo.Defence += propInfo.value;
//                     break;
//             }
//             NotifyCenter.emit(GameEvent.HERO_ATTR_CHANGED);
//         }
//         this.heroInfo.addProp(propInfo.id, count);
//         NotifyCenter.emit(GameEvent.REFRESH_PROP, propInfo, count);
//     }
// 
//     removeProp(id: string, count: number = 1) {
//         let propInfo = this.propParser.getJsonElement(id);
//         if (!propInfo.consumption) {
//             this.heroInfo.addProp(propInfo.id, -count);
//             NotifyCenter.emit(GameEvent.REFRESH_PROP, propInfo, -count);
//         }
//     }
// }
