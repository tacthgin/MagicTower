import { Constructor } from "../Base/DataStruct/Constructor";
import { IObejctPoolManager } from "../ObjectPool/IObejctPoolManager";
import { IObjectPool } from "../ObjectPool/IObjectPool";
import { IResourceManager } from "../Resource/IResourceManager";
import { INodeHelper } from "./INodeHelper";
import { NodeBase } from "./NodeBase";
import { NodeObject } from "./NodeObject";

/**
 * 节点池管理器
 */
export interface INodePoolManager {
    /**
     * 设置资源管理器
     * @param resourceManager 资源管理器
     */
    setResourceManager(resourceManager: IResourceManager): void;

    /**
     * 设置对象池管理器
     * @param objectPoolManager 对象池管理器
     */
    setObjectPoolManager(objectPoolManager: IObejctPoolManager): void;

    /**
     * 设置节点辅助器
     * @param nodeHelper 节点辅助器
     */
    setNodeHelper(nodeHelper: INodeHelper): void;

    /**
     * 是否有节点池
     * @param nodeConstructorOrNodePoolName 节点构造器或者节点池名称
     * @returns 是否有节点池
     */
    hasNodePool<T extends NodeBase>(nodeConstructorOrNodePoolName: Constructor<T> | string): boolean;

    /**
     * 获取节点池
     * @param nodeConstructorOrNodePoolName 节点构造器或者节点池名称
     * @returns 获取节点池
     */
    getNodePool<T extends NodeBase>(nodeConstructorOrNodePoolName: Constructor<T> | string): IObjectPool<NodeObject> | null;

    /**
     * 创建节点池
     * @param nodePoolName 节点池名称
     * @param nodeConstructor 第二索引，根据节点构造器获取节点池
     * @returns 获取节点池
     */
    createNodePool<T extends NodeBase>(nodePoolName: string, nodeConstructor?: Constructor<T>): IObjectPool<NodeObject>;

    /**
     * 清理节点池
     * @param nodeConstructorOrNodePoolName 节点构造器或者节点池名称
     * @returns 是否清理成功
     */
    destroyNodePool<T extends NodeBase>(nodeConstructorOrNodePoolName: Constructor<T> | string): boolean;

    /**
     * 创建节点
     * @param nodeConstructorOrNodePoolName 节点构造器或者节点池名称
     * @param asset 节点资源
     * @param name 节点名称,用来区分同一种节点不同类型
     * @returns 创建的节点
     */
    createNode<T extends NodeBase>(nodeConstructorOrNodePoolName: Constructor<T> | string, asset: object, name?: string): object;

    /**
     * 创建节点
     * @param nodeConstructorOrNodePoolName 节点构造器或者节点池名称
     * @param assetPath 节点资源路径
     * @param name 节点名称,用来区分同一种节点不同类型
     * @returns 创建的节点
     */
    createNodeWithPath<T extends NodeBase>(nodeConstructorOrNodePoolName: Constructor<T> | string, assetPath: string, name?: string): Promise<object>;

    /**
     * 释放节点
     * @param nodeConstructorOrNodePoolName 节点构造器或者节点池名称
     * @param node 节点
     * @returns 是否释放成功
     */
    releaseNode<T extends NodeBase>(nodeConstructorOrNodePoolName: Constructor<T> | string, node: object): boolean;
}
