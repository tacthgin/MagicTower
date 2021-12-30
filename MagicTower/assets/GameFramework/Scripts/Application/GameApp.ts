import { Component, game, _decorator } from "cc";
import { Constructor } from "../Base/DataStruct/Constructor";
import { GameFrameworkEntry } from "../Base/GameFrameworkEntry";
import { GameFrameworkError } from "../Base/GameFrameworkError";
import { GameFrameworkLog } from "../Base/Log/GameFrameworkLog";
import { WebLogHelp } from "../Base/Log/WebLogHelp";
import { IEventManager } from "../Event/IEventManager";
import { IFsmManager } from "../Fsm/IFsmManager";
import { IObejctPoolManager } from "../ObjectPool/IObejctPoolManager";
import { IResourceManager } from "../Resource/IResourceManager";
import { ISaveManager } from "../Save/ISaveManager";
import { WebSaveHelp } from "../Save/WebSaveHelp";
import { ISoundManager } from "../Sound/ISoundManager";
import { IUIManager } from "../UI/IUIManager";
import { Utility } from "../Utility/Utility";
import { IModel } from "./Model/IModel";
import { ModelContainer } from "./Model/ModelContainer";
import { SoundController } from "./Sound/SoundController";

const { ccclass, executionOrder } = _decorator;

/**
 * 应用游戏入口
 */
@ccclass("GameApp")
@executionOrder(1)
export class GameApp extends Component {
    private static _instance: GameApp | null = null;
    private _modelContainer: ModelContainer = null!;

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
     * 根据构造获取模型
     * @param constructor
     * @returns
     */
    static getModel<T extends IModel>(constructor: Constructor<IModel>): T {
        return GameApp.instance._modelContainer.getModel(constructor) as T;
    }

    onLoad() {
        if (GameApp._instance) {
            this.destroy();
            return;
        } else {
            GameApp._instance = this;
            game.addPersistRootNode(this.node);
        }
        this.initialize();
    }

    onDestroy() {
        GameApp._instance = null;
    }

    private initialize() {
        //初始化框架
        this.initalizeFramework();
        //初始化model
        this.initializeModel();
    }

    private initalizeFramework() {
        //设置log辅助
        GameFrameworkLog.setLogHelp(new WebLogHelp());
        let resourceManager = GameApp.ResourceManager;
        //初始化ui模块
        let uiManager = GameApp.UIManager;
        uiManager.setResourceManager(resourceManager);
        uiManager.setObjectPoolManager(GameApp.ObjectPoolManager);
        //初始化声音模块
        let soundManager = GameApp.SoundManager;
        soundManager.setResourceManager(resourceManager);
        let soundController = this.getComponent(SoundController);
        if (soundController) {
            soundManager.setSoundHelp(soundController);
        } else {
            throw new GameFrameworkError("sound controller is invalid");
        }
        //初始化存储模块
        GameApp.SaveManager.setSaveHelp(new WebSaveHelp());
        //初始化JSON工具类
        Utility.Json.setResourceManager(resourceManager);
        Utility.Json.setSystemUtility(Utility.System);
    }

    private initializeModel() {
        this._modelContainer = new ModelContainer();
        this._modelContainer.setSaveManager(GameApp.SaveManager);
    }

    update(elapseSeconds: number) {
        GameFrameworkEntry.update(elapseSeconds);
        this._modelContainer.update(elapseSeconds);
    }
}
