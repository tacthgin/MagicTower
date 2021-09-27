import { Component, director, game, Node, UITransform, Vec3, view, _decorator } from "cc";
import { BaseEvent } from "../Base/BaseContant";
import { AudioController } from "./AudioController";
import { DataManager } from "./DataManager";
import { NetManager } from "./NetManager";
import { NodePoolManager } from "./NodePoolManager";
import { NotifyCenter } from "./NotifyCenter";
import { ResourceManager, ResourceType } from "./ResourceManager";
import { UIManager } from "./UIManager";

const { ccclass, type } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
    @type(AudioController)
    private audioController: AudioController = null!;
    @type(Node)
    private dialogLayer: Node = null!;
    @type(Node)
    private toastLayer: Node = null!;

    private uiManager: UIManager = null!;
    private dataManager: DataManager = null!;
    private resourceManager: ResourceManager = null!;
    private nodePoolManager: NodePoolManager = null!;
    private netManager: NetManager = null!;
    private static instance: GameManager = null!;

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

    /** 网络管理 */
    public static get NET() {
        return GameManager.instance.netManager;
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

    start() {
        this.setGameSiblingIndex();
    }

    private registerEvents() {
        NotifyCenter.on(BaseEvent.RESOURCE_COMPLETE, this.onResourceComplete, this);
    }

    /** 游戏的初始化 */
    private init() {
        this.initGameSize();
        this.uiManager = new UIManager().init([this.dialogLayer, this.toastLayer]);
        this.dataManager = new DataManager();
        this.resourceManager = new ResourceManager().init();
        this.nodePoolManager = new NodePoolManager();
        //this.netManager = new NetManager();
        this.registerEvents();
    }

    private initGameSize() {
        let transform = this.getComponent(UITransform);
        if (transform) {
            transform.contentSize = view.getVisibleSize();
            this.node.position = new Vec3(transform.contentSize.width * 0.5, transform.contentSize.height * 0.5);
        }
    }

    private onResourceComplete(type: ResourceType) {
        if (type == ResourceType.JSON) {
            this.dataManager.loadJsonAssets(this.resourceManager.getAssets(type));
        }
    }

    private setGameSiblingIndex() {
        this.node.setSiblingIndex(10);
    }

    loadScene(sceneName: string) {
        this.audioController.stopAll();
        this.uiManager.clearLayers();
        director.loadScene(sceneName);
    }
}
