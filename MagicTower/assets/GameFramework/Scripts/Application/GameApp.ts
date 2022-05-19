import { assetManager, Component, game, resources, _decorator } from "cc";
import { Constructor } from "../Base/DataStruct/Constructor";
import { GameFrameworkEntry } from "../Base/GameFrameworkEntry";
import { GameFrameworkError } from "../Base/GameFrameworkError";
import { GameFrameworkLog } from "../Base/Log/GameFrameworkLog";
import { WebLogHelper } from "../Base/Log/WebLogHelper";
import { IEventManager } from "../Event/IEventManager";
import { IFsmManager } from "../Fsm/IFsmManager";
import { INodePoolManager } from "../NodePool/INodePoolManager";
import { IObejctPoolManager } from "../ObjectPool/IObejctPoolManager";
import { IResourceManager } from "../Resource/IResourceManager";
import { ISaveManager } from "../Save/ISaveManager";
import { WebSaveHelper } from "../Save/WebSaveHelper";
import { ISceneManager } from "../Scene/ISceneManager";
import { ISoundManager } from "../Sound/ISoundManager";
import { IUIManager } from "../UI/IUIManager";
import { Utility } from "../Utility/Utility";
import { CommandManager } from "./Command/CommandManager";
import { ICommandManager } from "./Command/ICommandManager";
import { IModel } from "./Model/IModel";
import { ModelContainer } from "./Model/ModelContainer";
import { CNodeHelper } from "./NodePool/CNodeHelper";
import { CPlatformHelper } from "./Platform/Helper/CPlatformHelper";
import { IPlatformManager } from "./Platform/IPlatformManager";
import { PlatformManager } from "./Platform/PlatformManager";
import { ResourcePathHelper } from "./Resource/ResourcePathHelper";
import { CSceneHelper } from "./Scene/CSceneHelper";
import { SoundConstant } from "./Sound/SoundConstant";
import { SoundController } from "./Sound/SoundController";
import { SoundFactory } from "./Sound/SoundFactory";
import { CUIFormHelper } from "./UI/Helper/CUIFormHelper";
import { UIConstant } from "./UI/UIConstant";
import { UIFactory } from "./UI/UIFactory";

const { ccclass, executionOrder } = _decorator;

/**
 * 应用游戏入口
 */
@ccclass("GameApp")
@executionOrder(1)
export class GameApp extends Component {
    private static _instance: GameApp | null = null;
    /** 引用计数 */
    private static _referenceCount: number = 0;
    /** 模型容器 */
    private _modelContainer: ModelContainer = null!;
    /** 命令系统管理 */
    private _commandManager: CommandManager = null!;
    /** 平台管理 */
    private _platformManager: PlatformManager = null!;

    static get instance(): GameApp {
        return this._instance!;
    }

    /**
     * 资源管理器
     */
    static get ResourceManager(): IResourceManager {
        return GameFrameworkEntry.getModule<IResourceManager>("ResourceManager");
    }

    /**
     * 事件管理器
     */
    static get EventManager(): IEventManager {
        return GameFrameworkEntry.getModule<IEventManager>("EventManager");
    }

    /**
     * 对象池管理器
     */
    static get ObjectPoolManager(): IObejctPoolManager {
        return GameFrameworkEntry.getModule<IObejctPoolManager>("ObjectPoolManager");
    }

    /**
     * 节点对象池管理器
     */
    static get NodePoolManager(): INodePoolManager {
        return GameFrameworkEntry.getModule<INodePoolManager>("NodePoolManager");
    }

    /**
     * 声音管理器
     */
    static get SoundManager(): ISoundManager {
        return GameFrameworkEntry.getModule<ISoundManager>("SoundManager");
    }

    /**
     * UI管理器
     */
    static get UIManager(): IUIManager {
        return GameFrameworkEntry.getModule<IUIManager>("UIManager");
    }

    /**
     * 本地存储管理器
     */
    static get SaveManager(): ISaveManager {
        return GameFrameworkEntry.getModule<ISaveManager>("SaveManager");
    }

    /**
     * 有限状态机管理器
     */
    static get FsmManager(): IFsmManager {
        return GameFrameworkEntry.getModule<IFsmManager>("FsmManager");
    }

    /**
     * 场景管理器
     */
    static get SceneManager(): ISceneManager {
        return GameFrameworkEntry.getModule<ISceneManager>("SceneManager");
    }

    /**
     * 根据构造获取模型
     * @param constructor
     * @returns
     */
    static getModel<T extends IModel>(constructor: Constructor<T>): T {
        return GameApp.instance._modelContainer.getModel(constructor) as T;
    }

    /**
     * 命令管理器
     * @returns 命令管理器
     */
    static get CommandManager(): ICommandManager {
        return GameApp.instance._commandManager;
    }

    /**
     * 平台管理器
     * @returns 平台管理器
     */
    static get PlatformManager(): IPlatformManager {
        return GameApp.instance._platformManager;
    }

    onLoad() {
        if (GameApp._instance) {
            this.node.destroy();
            return;
        } else {
            ++GameApp._referenceCount;
            GameApp._instance = this;
            game.addPersistRootNode(this.node);
        }
        this.initialize();
    }

    onDestroy() {
        --GameApp._referenceCount;
        if (GameApp._referenceCount == 0) {
            GameApp._instance = null;
            GameFrameworkEntry.shutDown();
        }
        this._modelContainer.shutDown();
        this._commandManager.shutDown();
    }

    /** 初始化所有模型并加载本地模型数据 */
    initModels() {
        try {
            this._modelContainer.initModels();
        } catch (error) {
            GameFrameworkLog.error("load local model failed:", error);
        }
    }

    private initialize() {
        //初始化框架
        this.initalizeFramework();
        //初始化command
        this.initializeCommand();
        //初始化model
        this.initializeModel();
        //初始化平台
        this.initializePlatform();
    }

    private initalizeFramework() {
        //设置log辅助
        GameFrameworkLog.setLogHelper(new WebLogHelper());
        //初始化resource
        let resourceManager = GameApp.ResourceManager;
        resourceManager.setResourcePathHelper(new ResourcePathHelper());
        resourceManager.setAssetManager(assetManager as any);
        resourceManager.setInternalResourceLoader(resources as any);
        //对象池管理
        let objectPoolManager = GameApp.ObjectPoolManager;
        //初始化ui模块
        let uiManager = GameApp.UIManager;
        uiManager.setResourceManager(resourceManager);
        uiManager.setObjectPoolManager(objectPoolManager);
        let uiFormHelper = this.getComponent(CUIFormHelper);
        if (uiFormHelper) {
            uiManager.setUIFormHelper(uiFormHelper);
            //创建弹窗和toast的ui组
            uiManager.addUIGroup(UIConstant.DIALOG_LAYER_GROUP, 0, uiFormHelper.getDialogUIGroupHelp());
            uiManager.addUIGroup(UIConstant.TOAST_LAYER_GROUP, 1, uiFormHelper.getToastUIGroupHelp());
        } else {
            throw new GameFrameworkError("you must set ui form help first");
        }
        UIFactory.setUIManager(uiManager);
        UIFactory.setToastAssetPath("Prefab/Base/ColorToast");
        //初始化节点对象池
        let nodePoolManager = GameApp.NodePoolManager;
        nodePoolManager.setResourceManager(resourceManager);
        nodePoolManager.setObjectPoolManager(objectPoolManager);
        nodePoolManager.setNodeHelper(new CNodeHelper());
        //初始化声音模块
        let soundManager = GameApp.SoundManager;
        soundManager.setResourceManager(resourceManager);
        let soundController = this.getComponent(SoundController);
        if (soundController) {
            soundManager.setSoundHelper(soundController);
            soundManager.addSoundGroup(SoundConstant.SOUND_BACKGROUND_GROUP);
            soundManager.addSoundGroup(SoundConstant.SOUND_EFFECT_GROUP);
            SoundFactory.setSoundManager(soundManager);
        } else {
            throw new GameFrameworkError("sound controller is invalid");
        }
        //初始化存储模块
        GameApp.SaveManager.setSaveHelper(new WebSaveHelper());
        //初始化场景管理
        let sceneHelper = new CSceneHelper();
        GameApp.SceneManager.setSceneHelper(sceneHelper);
        //初始化JSON工具类
        Utility.Json.setSystemUtility(Utility.System);
    }

    private initializeModel() {
        this._modelContainer = new ModelContainer();
        this._modelContainer.setSaveManager(GameApp.SaveManager);
    }

    private initializeCommand() {
        this._commandManager = new CommandManager();
        this._commandManager.setObjectPoolManager(GameApp.ObjectPoolManager);
    }

    private initializePlatform() {
        this._platformManager = new PlatformManager();
        this._platformManager.initalize(new CPlatformHelper());
    }

    update(elapseSeconds: number) {
        GameFrameworkEntry.update(elapseSeconds);
        this._commandManager.update(elapseSeconds);
        this._modelContainer.update(elapseSeconds);
    }
}
