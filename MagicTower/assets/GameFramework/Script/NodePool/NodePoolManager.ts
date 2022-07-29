import { Constructor } from "../Base/DataStruct/Constructor";
import { GameFrameworkEntry } from "../Base/GameFrameworkEntry";
import { GameFrameworkError } from "../Base/GameFrameworkError";
import { GameFrameworkModule } from "../Base/GameFrameworkModule";
import { IObejctPoolManager } from "../ObjectPool/IObejctPoolManager";
import { IObjectPool } from "../ObjectPool/IObjectPool";
import { ObjectPoolBase } from "../ObjectPool/ObjectPoolBase";
import { IResourceManager } from "../Resource/IResourceManager";
import { INodeHelper } from "./INodeHelper";
import { INodePoolManager } from "./INodePoolManager";
import { NodeBase } from "./NodeBase";
import { NodeObject } from "./NodeObject";

/**
 * 节点池管理器
 */
@GameFrameworkEntry.registerModule("NodePoolManager")
export class NodePoolManager extends GameFrameworkModule implements INodePoolManager {
    private readonly _nodePools: Map<string, ObjectPoolBase> = null!;
    private readonly _constructorToNameMap: Map<Constructor<NodeBase>, string> = null!;
    private _resourceManager: IResourceManager | null = null;
    private _objectPoolManager: IObejctPoolManager | null = null;
    private _nodeHelper: INodeHelper | null = null;

    constructor() {
        super();
        this._nodePools = new Map<string, ObjectPoolBase>();
        this._constructorToNameMap = new Map<Constructor<NodeBase>, string>();
    }

    get priority(): number {
        return 2;
    }

    update(elapseSeconds: number): void {}

    shutDown(): void {}

    setResourceManager(resourceManager: IResourceManager): void {
        this._resourceManager = resourceManager;
    }

    setObjectPoolManager(objectPoolManager: IObejctPoolManager): void {
        this._objectPoolManager = objectPoolManager;
    }

    setNodeHelper(nodeHelper: INodeHelper): void {
        this._nodeHelper = nodeHelper;
    }

    hasNodePool<T extends NodeBase>(nodeConstructorOrNodePoolName: string | Constructor<T>): boolean {
        let nodePoolName = this.internalGetPoolName(nodeConstructorOrNodePoolName);
        return this._nodePools.has(nodePoolName);
    }

    getNodePool<T extends NodeBase>(nodeConstructorOrNodePoolName: string | Constructor<T>): IObjectPool<NodeObject> | null {
        let nodePoolName = this.internalGetPoolName(nodeConstructorOrNodePoolName);
        let objectPool = this._nodePools.get(nodePoolName);
        if (objectPool) {
            return objectPool as unknown as IObjectPool<NodeObject>;
        }

        return null;
    }

    createNodePool<T extends NodeBase>(nodePoolName: string, nodeConstructor?: Constructor<T>): IObjectPool<NodeObject> {
        if (!nodePoolName) {
            throw new GameFrameworkError("nodePoolName is invalid");
        }

        let objectPool = this._nodePools.get(nodePoolName);
        if (objectPool) {
            throw new GameFrameworkError(`node pool ${nodePoolName} is exist`);
        }

        if (!this._objectPoolManager) {
            throw new GameFrameworkError("you must set object pool manager first");
        }

        objectPool = this._objectPoolManager.createSingleSpawnObjectPoolBase(NodeObject, nodePoolName);
        this._nodePools.set(nodePoolName, objectPool);
        if (nodeConstructor) {
            if (this._constructorToNameMap.has(nodeConstructor)) {
                throw new GameFrameworkError(`${nodePoolName} already exist node constructor`);
            } else {
                this._constructorToNameMap.set(nodeConstructor, nodePoolName);
            }
        }

        return objectPool as unknown as IObjectPool<NodeObject>;
    }

    destroyNodePool<T extends NodeBase>(nodeConstructorOrNodePoolName: string | Constructor<T>): boolean {
        if (typeof nodeConstructorOrNodePoolName === "string" && !nodeConstructorOrNodePoolName) {
            throw new GameFrameworkError("node pool name is invalid");
        }

        if (!this._objectPoolManager) {
            throw new GameFrameworkError("you must set object pool manager first");
        }

        let nodePoolName = this.internalGetPoolName(nodeConstructorOrNodePoolName);
        let objectPool = this._nodePools.get(nodePoolName);
        if (objectPool) {
            return this._objectPoolManager.destroyObjectPool(NodeObject, nodePoolName);
        }

        return false;
    }

    createNode<T extends NodeBase>(nodeConstructorOrNodePoolName: Constructor<T> | string, asset: object, name?: string): object {
        if (!this._nodeHelper) {
            throw new GameFrameworkError("you must set node help first");
        }

        let objectPool = this.getNodePool(nodeConstructorOrNodePoolName);
        if (!objectPool) {
            throw new GameFrameworkError("object pool is not exist, you must create first");
        }

        name = name || "";

        let nodeObject = objectPool.spawn(name);
        if (!nodeObject) {
            nodeObject = NodeObject.create(name, this._nodeHelper.instantiateNode(asset), this._nodeHelper);
            objectPool.register(nodeObject, true);
        }

        return nodeObject.target as T;
    }

    async createNodeWithPath<T extends NodeBase>(nodeConstructorOrNodePoolName: Constructor<T> | string, assetPath: string, name?: string): Promise<object> {
        if (!this._resourceManager) {
            throw new GameFrameworkError("you must set resource manager first");
        }

        let asset = this._resourceManager.getAsset(assetPath);
        if (!asset) {
            asset = await this._resourceManager.loadAsset(assetPath);
            if (!asset) {
                throw new GameFrameworkError(`${assetPath} asset is invalid`);
            }
        }

        return this.createNode(nodeConstructorOrNodePoolName, asset, name);
    }

    releaseNode<T extends NodeBase>(nodeConstructorOrNodePoolName: Constructor<T> | string, node: object): boolean {
        let objectPool = this.getNodePool(nodeConstructorOrNodePoolName);
        if (objectPool) {
            objectPool.upspawn(node);
            return true;
        }
        return false;
    }

    /**
     * 获取节点池名字
     * @param nodeConstructorOrNodePoolName 节点池名字或者节点构造器
     * @returns 节点池名字
     */
    private internalGetPoolName<T extends NodeBase>(nodeConstructorOrNodePoolName: Constructor<T> | string): string {
        return typeof nodeConstructorOrNodePoolName === "string" ? nodeConstructorOrNodePoolName : this._constructorToNameMap.get(nodeConstructorOrNodePoolName) || "";
    }
}
