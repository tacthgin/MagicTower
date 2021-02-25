import { _decorator, Component, game } from "cc";
import { AudioController } from "./AudioController";
import { DataManager } from "./DataManager";

const { ccclass, type } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
    @type(AudioController)
    private audioController: AudioController = null;

    private static instance: GameManager;

    /** GameManager 实例 */
    public static getInstance() {
        return GameManager.instance;
    }

    onLoad() {
        if (GameManager.instance) {
            this.node.destroy();
            return;
        }
        GameManager.instance = this;
        game.addPersistRootNode(this.node);
        this.init();
    }

    /** 游戏的初始化 */
    init() {
        //this.initPhysics();
        //初始化管理类
        //WXUtil.execute("init");
        //SoundManager.init(DataManager.getMusicEnable(), DataManager.getEffectsEnable());
        //this.registerEvent();
    }

    /** 初始化物理相关 */
    initPhysics() {
        // let physicsManager = cc.director.getPhysicsManager()
        // physicsManager.enabled = true
        // physicsManager.enabledAccumulator = true
        // physicsManager.debugDrawFlags =
        //     cc.PhysicsManager.DrawBits.e_aabbBit |
        //     cc.PhysicsManager.DrawBits.e_pairBit |
        //     cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        //     cc.PhysicsManager.DrawBits.e_jointBit |
        //     cc.PhysicsManager.DrawBits.e_shapeBit
        //cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;
    }

    getAuidoController() {
        return this.audioController;
    }
}
