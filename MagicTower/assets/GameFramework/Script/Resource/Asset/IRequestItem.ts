/**
 * 请求项数据
 */
export interface IRequestItem {
    /**
     * 请求的id，由 uuid 和 isNative 组合而成
     */
    readonly id: string;

    /**
     * 请求资源的uuid
     */
    uuid: string;

    /**
     * 请求的最终url
     */
    url: string;

    /**
     * 资源的扩展名
     */
    ext: string;

    /**
     * 资源内容
     */
    content: any;

    /**
     * 资源文件
     */
    file: any;
}
