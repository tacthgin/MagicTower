import { IObejctPoolManager } from "../ObjectPool/IObejctPoolManager";
import { IResourceManager } from "../Resource/IResourceManager";


/**
 * 节点池管理器
 */
export interface INodePoolManager {
    setResourceManager(resourceManager: IResourceManager): void;

    setObjectPoolManager(objectPoolManager: IObejctPoolManager): void;

    
}
