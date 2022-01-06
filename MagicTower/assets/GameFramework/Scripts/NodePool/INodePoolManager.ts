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

    createNodePool<T extends NodeBase>(nodeConstructorOrNodePoolName: Constructor<T> | string): IObjectPool<NodeObject>;

    createNode<T extends NodeBase>(nodeConstructorOrNodePoolName: Constructor<T> | string, asset: object, name?: string): object;

    createNodeWithPath<T extends NodeBase>(nodeConstructorOrNodePoolName: Constructor<T> | string, assetPath: string, name?: string): Promise<object>;

    releaseNode<T extends NodeBase>(nodeConstructorOrNodePoolName: Constructor<T> | string, node: object): boolean;
}
