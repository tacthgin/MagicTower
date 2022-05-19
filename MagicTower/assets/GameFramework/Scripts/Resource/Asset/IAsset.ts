/**
 * 资源接口
 */
export interface IAsset {
    /**
     * 该资源是否已经成功加载
     */
    loaded: boolean;

    /**
     * 资源uuid
     */
    _uuid: string;

    /**
     * 返回该资源对应的目标平台资源的 URL，如果没有将返回一个空字符串
     */
    readonly nativeUrl: string;
}
