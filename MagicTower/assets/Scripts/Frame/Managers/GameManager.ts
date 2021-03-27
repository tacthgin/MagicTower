import { _decorator, Component, game } from "cc";
import { AudioController } from "./AudioController";
import { DataManager } from "./DataManager";
import { ResourceManager } from "./ResourceManager";
import { UIManager } from "./UIManager";

const { ccclass, type } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
    @type(AudioController)
    private audioController: AudioController = null;

    private uiManager: UIManager = null;

    private dataManager: DataManager = null;

    private resourceManager: ResourceManager = null;

    private static instance: GameManager;

    /** GameManager 实例 */
    public static getInstance() {
        return GameManager.instance;
    }

    /** ui管理 */
    public static get UI() {
        return GameManager.instance.uiManager;
    }

    /** 数据管理 */
    public static get DATA() {
        return GameManager.instance.dataManager;
    }

    /** 资源管理 */
    public static get RESOURCE() {
        return GameManager.instance.resourceManager;
    }

    /** 声音管理 */
    public static get AUDIO() {
        return GameManager.instance.audioController;
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
        this.uiManager = new UIManager().init();
        this.dataManager = new DataManager();
        this.resourceManager = new ResourceManager().init();
        this.resourceManager.loadResources();
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
}
