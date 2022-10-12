import { GameFrameworkLinkedList, LinkedListNode } from "../../Base/Container/GameFrameworkLinkedList";
import { Constructor } from "../../Base/DataStruct/Constructor";
import { GameFrameworkError } from "../../Base/GameFrameworkError";
import { ISaveManager } from "../../Save/ISaveManager";
import { IModel } from "./IModel";
import { ModelBase } from "./ModelBase";

/**
 * 模型管理器
 */
export class ModelManager {
    private static readonly s_modelConstructors: Map<string, Constructor<ModelBase>> = new Map<string, Constructor<ModelBase>>();
    private static readonly s_nameConstructors: Map<Constructor<ModelBase>, string> = new Map<Constructor<ModelBase>, string>();
    private static readonly s_scheduleConstructors: Map<Constructor<ModelBase>, boolean> = new Map<Constructor<ModelBase>, boolean>();
    private readonly _models: GameFrameworkLinkedList<ModelBase> = null!;
    private readonly _updateModels: GameFrameworkLinkedList<ModelBase> = null!;
    private readonly _cachedModels: Map<Constructor<ModelBase>, ModelBase> = null!;
    private _saveManager: ISaveManager | null = null;

    constructor() {
        this._models = new GameFrameworkLinkedList<ModelBase>();
        this._updateModels = new GameFrameworkLinkedList<ModelBase>();
        this._cachedModels = new Map<Constructor<ModelBase>, ModelBase>();
    }

    /**
     * 模型注册装饰函数
     * @param className 类名
     * @param openSchedule 开启模型定时器
     * @returns
     */
    static registerModel(className: string, openSchedule: boolean = false): (target: Constructor<ModelBase>) => void {
        return (target: Constructor<ModelBase>) => {
            this.s_modelConstructors.set(className, target);
            this.s_nameConstructors.set(target, className);
            this.s_scheduleConstructors.set(target, openSchedule);
        };
    }

    /**
     * 根据model实例获取类名
     * @param target model实例
     */
    static getClassName(target: ModelBase): string {
        let name = this.s_nameConstructors.get(target.constructor as Constructor<ModelBase>);
        if (name === undefined) {
            throw new GameFrameworkError("model has not register");
        }
        return name;
    }

    /**
     * 关闭模型模块
     */
    shutDown() {
        this._models.forEach((modelBase: ModelBase) => {
            modelBase.shutDown();
        });
        this._models.clear();
        this._updateModels.clear();
        this._cachedModels.clear();
        this._saveManager = null;
    }

    /**
     * 设置存储管理器
     * @param saveManager 存储管理器
     */
    setSaveManager(saveManager: ISaveManager): void {
        this._saveManager = saveManager;
    }

    /**
     * 根据模型构造获取模型
     * @param constructor 模型构造器
     * @returns 模型
     */
    getModel<T extends IModel>(constructor: Constructor<T>): T {
        let ctor = constructor as unknown as Constructor<ModelBase>;
        let model = this._cachedModels.get(ctor);
        if (!model) {
            let className = ModelManager.s_nameConstructors.get(ctor);
            if (className) {
                model = this.createModel(ctor);
            } else {
                throw new GameFrameworkError(`${className} model has not register`);
            }
        }
        return model as unknown as T;
    }

    /**
     * 根据模型类名获取模型
     * @param className 类名
     * @returns 模型
     */
    getModelWithName<T extends IModel>(className: string): T {
        let ctor = ModelManager.s_modelConstructors.get(className);
        if (ctor) {
            let model = this._cachedModels.get(ctor);
            if (!model) {
                model = this.createModel(ctor);
            }
            return model as unknown as T;
        } else {
            throw new GameFrameworkError(`${className} model has not register`);
        }
    }

    /**
     * 初始化所有模型
     */
    initModels(): void {
        if (!this._saveManager) {
            throw new GameFrameworkError("you must set save manager first");
        }
        let modelInfos: Array<{
            model: ModelBase;
            value: object | null;
            name: string;
        }> = [];

        ModelManager.s_modelConstructors.forEach((ctor, name) => {
            let model = this.getModel(ctor);
            model.defineSaveProperty();
            model.setSaveManager(this._saveManager!, name);
            modelInfos.push({
                model: model,
                value: this._saveManager?.getObject(name) || null,
                name: name,
            });
        });

        //模块根据优先级排序
        modelInfos.sort((l, r) => {
            return r.model.priority - l.model.priority;
        });

        modelInfos.forEach((modelInfo) => {
            modelInfo.model.LoadExternalData(modelInfo.value);
        });
    }

    /**
     * 创建模型
     * @param constructor 模型构造器
     * @returns 模型
     */
    private createModel<T extends ModelBase>(constructor: Constructor<T>): T {
        let model = new constructor();
        let node: LinkedListNode<ModelBase> | null = null;

        if (this._models.size > 0) {
            for (let current = this._models.first; current != null; current = current.next) {
                if (model.priority >= current.value.priority) {
                    node = current;
                    break;
                }
            }
        }

        if (node) {
            this._models.addBefore(node, model);
        } else {
            this._models.addLast(model);
        }

        this._cachedModels.set(constructor, model);
        if (ModelManager.s_scheduleConstructors.get(constructor)) {
            this._updateModels.addLast(model);
        }

        return model;
    }
}
