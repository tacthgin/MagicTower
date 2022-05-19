import { Constructor } from "../Base/DataStruct/Constructor";
import { IAsset } from "./Asset/IAsset";

export interface IResourcePathHelper {
    /**
     * 处理资源类型不同的情况下，路径不一致的问题
     * @param path 路径
     * @param assetType 资源类型
     */
    getPath<T extends IAsset>(path: string, assetType?: Constructor<T>): string;
}
