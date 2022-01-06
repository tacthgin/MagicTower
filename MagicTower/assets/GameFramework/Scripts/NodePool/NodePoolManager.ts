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

@GameFrameworkEntry.registerModule("NodePoolManager")
export class NodePoolManager extends GameFrameworkModule implements INodePoolManager {
    private readonly _nodePools: Map<Constructor<NodeBase>, ObjectPoolBase> = null!;
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

    update(elapseSeconds: number): void {
        this._nodePools.forEach((objectPool: ObjectPoolBase) => {
            objectPool.update(elapseSeconds);
        });
    }

    shutDown(): void {
        this._nodePools.forEach((objectPool: ObjectPoolBase) => {
            objectPool.shutDown();
        });
    }

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
        if (typeof nodeConstructorOrNodePoolName === "string") {
            if (!nodeConstructorOrNodePoolName) {
                throw new GameFrameworkError("node pool name is invalid");
            }

            for (let pair of this._nodePools) {
                if (pair[1].name === nodeConstructorOrNodePoolName) {
                    return true;
                }
            }
        } else {
            return this._nodePools.has(nodeConstructorOrNodePoolName);
        }

        return false;
    }

    getNodePool<T extends NodeBase>(nodeConstructorOrNodePoolName: string | Constructor<T>): IObjectPool<NodeObject> | null {
        if (typeof nodeConstructorOrNodePoolName === "string") {
            if (!nodeConstructorOrNodePoolName) {
                throw new GameFrameworkError("node pool name is invalid");
            }

            for (let pair of this._nodePools) {
                if (pair[1].name === nodeConstructorOrNodePoolName) {
                    return pair[1] as unknown as IObjectPool<NodeObject>;
                }
            }
        } else {
            let objectPool = this._nodePools.get(nodeConstructorOrNodePoolName);
            if (objectPool) {
                return objectPool as unknown as IObjectPool<NodeObject>;
            }
        }

        return null;
    }

    createNodePool<T extends NodeBase>(nodeConstructor: Constructor<T>, nodePoolName: string): IObjectPool<NodeObject> {
        if (!nodePoolName) {
            throw new GameFrameworkError("node pool name is invalid");
        }

        let objectPool = this._nodePools.get(nodeConstructor);
        if (objectPool) {
            throw new GameFrameworkError(`node pool is exist`);
        }

        if (!this._objectPoolManager) {
            throw new GameFrameworkError("you must set object pool manager first");
        }

        objectPool = this._objectPoolManager.createSingleSpawnObjectPoolBase(NodeObject, nodePoolName);
        this._nodePools.set(nodeConstructor, objectPool);

        return objectPool as unknown as IObjectPool<NodeObject>;
    }

    async createNode<T extends NodeBase>(nodeConstructor: Constructor<T>, assetOrAssetPath: object | string, name?: string, userData?: object): Promise<object> {
        if (!this._resourceManager) {
            throw new GameFrameworkError("you must set resource manager first");
        }

        if (!this._nodeHelp) {
            throw new GameFrameworkError("you must set node help first");
        }

        let objectPool = this._nodePools.get(nodeConstructor) as unknown as IObjectPool<NodeObject>;
        if (!objectPool) {
            throw new GameFrameworkError("object pool is not exist, you must create first");
        }

        name = name || "";

        let nodeObject = objectPool.spawn(name);
        if (!nodeObject) {
            if (typeof assetOrAssetPath === "string") {
                let asset = this._resourceManager.internalResourceLoader.getAsset(assetOrAssetPath);
                if (!asset) {
                    asset = await this._resourceManager.internalResourceLoader.loadAsset(assetOrAssetPath);
                    if (!asset) {
                        throw new GameFrameworkError(`${assetOrAssetPath} asset is invalid`);
                    }
                }
                nodeObject = NodeObject.create(name, this._nodeHelp.instantiateNode(asset), this._nodeHelp);
            } else {
                nodeObject = NodeObject.create(name, this._nodeHelp.instantiateNode(assetOrAssetPath), this._nodeHelp);
            }
            objectPool.register(nodeObject, true);
        }

        return nodeObject.target;
    }
}
