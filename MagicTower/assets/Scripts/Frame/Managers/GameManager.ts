import { Component, director, game, _decorator } from "cc";
import { BaseEvent } from "../Constant/BaseContant";
import { AudioController } from "./AudioController";
import { DataManager } from "./DataManager";
import { NodePoolManager } from "./NodePoolManager";
import { NotifyCenter } from "./NotifyCenter";
import { ResourceManager, ResourceType } from "./ResourceManager";
import { UIManager } from "./UIManager";

const { ccclass, type } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
    @type(AudioController)
    private audioController: AudioController = null;

    private uiManager: UIManager = null;

    private dataManager: DataManager = null;

    private resourceManager: ResourceManager = null;

    private nodePoolManager: NodePoolManager = null;

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

    /** 对象池管理 */
    public static get POOL() {
        return GameManager.instance.nodePoolManager;
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

    private registerEvents() {
        NotifyCenter.on(BaseEvent.RESOURCE_COMPLETE, this.onResourceComplete, this);
    }

    /** 游戏的初始化 */
    private init() {
        this.uiManager = new UIManager().init();
        this.dataManager = new DataManager();
        this.resourceManager = new ResourceManager().init();
        this.registerEvents();
    }

    private onResourceComplete(type: ResourceType) {
        if (type == ResourceType.JSON) {
            this.dataManager.loadJsonAssets(this.resourceManager.getAssets(type));
        }
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

    loadScene(sceneName: string) {
        this.audioController.stopMusic();
        director.loadScene(sceneName);
    }
}
