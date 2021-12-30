import { Constructor } from "../../Base/DataStruct/Constructor";
import { GameFrameworkError } from "../../Base/GameFrameworkError";
import { GameFrameworkLinkedList, LinkedListNode } from "../../Base/GameFrameworkLinkedList";
import { ISaveManager } from "../../Save/ISaveManager";
import { IModel } from "./IModel";
import { ModelBase } from "./ModelBase";

/**
 * model容器
 */
export class ModelContainer {
    private static s_modelConstructors: Map<string, Constructor<ModelBase>> = new Map<string, Constructor<ModelBase>>();
    private static s_nameConstructors: Map<Constructor<ModelBase>, string> = new Map<Constructor<ModelBase>, string>();
    private _models: GameFrameworkLinkedList<ModelBase> = null!;
    private _cachedModels: Map<Constructor<ModelBase>, ModelBase> = null!;
    private _saveManager: ISaveManager | null = null;

    constructor() {
        this._models = new GameFrameworkLinkedList<ModelBase>();
        this._cachedModels = new Map<Constructor<ModelBase>, ModelBase>();
    }

    /**
     * 模型注册装饰函数
     * @param className 类名
     * @returns
     */
    static registerModel(className: string): (target: Constructor<ModelBase>) => void {
        return (target: Constructor<ModelBase>) => {
            this.s_modelConstructors.set(className, target);
            this.s_nameConstructors.set(target, className);
        };
    }

    /**
     * 轮询模型
     * @param elapseSeconds 逻辑流逝时间
     */
    update(elapseSeconds: number) {
        this._models.forEach((modelBase: ModelBase) => {
            modelBase.update(elapseSeconds);
        });
    }

    /**
     * 关闭模型模块
     */
    shutDown() {
        this._models.forEach((modelBase: ModelBase) => {
            modelBase.shutDown();
        });
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
            let className = ModelContainer.s_nameConstructors.get(ctor);
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
        let ctor = ModelContainer.s_modelConstructors.get(className);
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
     * 加载本地模型数据
     */
    loadLocalModel(): void {
        if (!this._saveManager) {
            throw new GameFrameworkError("you must set save manager first");
        }
        let modelInfos: Array<{
            model: ModelBase;
            value: string;
        }> = [];

        this._saveManager.forEach((name: string, value: string) => {
            let ctor = ModelContainer.s_modelConstructors.get(name);
            if (ctor) {
                let model = this.getModel(ctor);
                modelInfos.push({
                    model: model,
                    value: value,
                });
            }
        });

        //模块根据优先级排序
        modelInfos.sort((l, r) => {
            return r.model.priority - l.model.priority;
        });

        modelInfos.forEach((value) => {
            value.model.load(value.value);
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

        return model;
    }
}
