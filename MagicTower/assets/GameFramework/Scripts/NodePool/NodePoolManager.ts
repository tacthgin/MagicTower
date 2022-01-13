import { Constructor } from "../Base/DataStruct/Constructor";
import { GameFrameworkEntry } from "../Base/GameFrameworkEntry";
import { GameFrameworkError } from "../Base/GameFrameworkError";
import { GameFrameworkModule } from "../Base/GameFrameworkModule";
import { IObejctPoolManager } from "../ObjectPool/IObejctPoolManager";
import { IObjectPool } from "../ObjectPool/IObjectPool";
import { ObjectPoolBase } from "../ObjectPool/ObjectPoolBase";
import { IResourceManager } from "../Resource/IResourceManager";
import { INodeHelp } from "./INodeHelp";
import { INodePoolManager } from "./INodePoolManager";
import { NodeBase } from "./NodeBase";
import { NodeObject } from "./NodeObject";

/**
 * 节点池管理器
 */
@GameFrameworkEntry.registerModule("NodePoolManager")
export class NodePoolManager extends GameFrameworkModule implements INodePoolManager {
    private readonly _nodePools: Map<Constructor<NodeBase> | string, ObjectPoolBase> = null!;
    private _resourceManager: IResourceManager | null = null;
    private _objectPoolManager: IObejctPoolManager | null = null;
    private _nodeHelp: INodeHelp | null = null;

    constructor() {
        super();
        this._nodePools = new Map<Constructor<NodeBase>, ObjectPoolBase>();
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

    setNodeHelp(nodeHelp: INodeHelp): void {
        this._nodeHelp = nodeHelp;
    }

    hasNodePool<T extends NodeBase>(nodeConstructorOrNodePoolName: string | Constructor<T>): boolean {
        return this._nodePools.has(nodeConstructorOrNodePoolName);
    }

    getNodePool<T extends NodeBase>(nodeConstructorOrNodePoolName: string | Constructor<T>): IObjectPool<NodeObject> | null {
        let objectPool = this._nodePools.get(nodeConstructorOrNodePoolName);
        if (objectPool) {
            return objectPool as unknown as IObjectPool<NodeObject>;
        }

        return null;
    }

    createNodePool<T extends NodeBase>(nodeConstructorOrNodePoolName: Constructor<T> | string): IObjectPool<NodeObject> {
        if (typeof nodeConstructorOrNodePoolName === "string" && !nodeConstructorOrNodePoolName) {
            throw new GameFrameworkError("node pool name is invalid");
        }

        let objectPool = this._nodePools.get(nodeConstructorOrNodePoolName);
        if (objectPool) {
            throw new GameFrameworkError(`node pool is exist`);
        }

        if (!this._objectPoolManager) {
            throw new GameFrameworkError("you must set object pool manager first");
        }

        objectPool = this._objectPoolManager.createSingleSpawnObjectPoolBase(NodeObject, this.internalGetPoolName(nodeConstructorOrNodePoolName));
        this._nodePools.set(nodeConstructorOrNodePoolName, objectPool);

        return objectPool as unknown as IObjectPool<NodeObject>;
    }

    destroyNodePool<T extends NodeBase>(nodeConstructorOrNodePoolName: string | Constructor<T>): boolean {
        if (typeof nodeConstructorOrNodePoolName === "string" && !nodeConstructorOrNodePoolName) {
            throw new GameFrameworkError("node pool name is invalid");
        }

        if (!this._objectPoolManager) {
            throw new GameFrameworkError("you must set object pool manager first");
        }

        let objectPool = this._nodePools.get(nodeConstructorOrNodePoolName);
        if (objectPool) {
            return this._objectPoolManager.destroyObjectPool(NodeObject, this.internalGetPoolName(nodeConstructorOrNodePoolName));
        }

        return false;
    }

    async createNode<T extends NodeBase>(nodeConstructorOrNodePoolName: Constructor<T> | string, asset: object, name?: string): Promise<object> {
        if (!this._nodeHelp) {
            throw new GameFrameworkError("you must set node help first");
        }

        let objectPool = this._nodePools.get(nodeConstructorOrNodePoolName) as unknown as IObjectPool<NodeObject>;
        if (!objectPool) {
            throw new GameFrameworkError("object pool is not exist, you must create first");
        }

        name = name || "";

        let nodeObject = objectPool.spawn(name);
        if (!nodeObject) {
            nodeObject = NodeObject.create(name, this._nodeHelp.instantiateNode(asset), this._nodeHelp);
            objectPool.register(nodeObject, true);
        }

        return nodeObject.target;
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

    private internalGetPoolName<T extends NodeBase>(nodeConstructorOrNodePoolName: Constructor<T> | string) {
        return typeof nodeConstructorOrNodePoolName === "string" ? nodeConstructorOrNodePoolName : nodeConstructorOrNodePoolName.name;
    }
}
