/**
 * 热更新辅助器接口
 */
export interface IHotUpdateHelper {
    /**
     * 开始热更新
     * @param manifestUrl 热更链接
     */
    startHotUpdate(manifestUrl: string): void;

    /**
     * 设置热更回调
     * @param failCallback 更新失败回调
     * @param completeCallback 更新完成回调
     * @param bytesProgressCallback 字节数热更进度回调
     * @param fileProgressCallback 文件热更进度回调
     */
    setHotUpdateCallback(
        failCallback: (errorMessage: string) => void,
        completeCallback: (testart: boolean) => void,
        bytesProgressCallback?: ((progress: number, current: number, total: number) => void) | null,
        fileProgressCallback?: ((progress: number, current: number, total: number) => void) | null
    ): void;

    /**
     * 重新下载热更资源
     */
    retry(): void;
}
