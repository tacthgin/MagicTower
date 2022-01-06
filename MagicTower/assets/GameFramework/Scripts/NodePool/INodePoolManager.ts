import { Constructor } from "../Base/DataStruct/Constructor";
import { IObejctPoolManager } from "../ObjectPool/IObejctPoolManager";
import { IObjectPool } from "../ObjectPool/IObjectPool";
import { IResourceManager } from "../Resource/IResourceManager";
import { INodeHelp } from "./INodeHelp";
import { NodeBase } from "./NodeBase";
import { NodeObject } from "./NodeObject";

/**
 * 节点池管理器
 */
export interface INodePoolManager {
    setResourceManager(resourceManager: IResourceManager): void;

    setObjectPoolManager(objectPoolManager: IObejctPoolManager): void;

    setNodeHelp(nodeHelp: INodeHelp): void;

    hasNodePool<T extends NodeBase>(nodeConstructorOrNodePoolName: Constructor<T> | string): boolean;

    getNodePool<T extends NodeBase>(nodeConstructorOrNodePoolName: Constructor<T> | string): IObjectPool<NodeObject> | null;

    createNodePool<T extends NodeBase>(nodeConstructor: Constructor<T>, nodePoolName: string): IObjectPool<NodeObject>;

    createNode<T extends NodeBase>(nodeConstructor: Constructor<T>, assetOrAssetPath: object | string, name?: string, userData?: object): Promise<object>;

    releaseNode(node: object): boolean;
}
