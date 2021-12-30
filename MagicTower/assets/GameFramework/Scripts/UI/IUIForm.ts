import { IUIGroup } from "./IUIGroup";

/**
 * 界面接口
 */
export interface IUIForm {
    /**
     * 获取界面序列编号
     */
    readonly serialId: number;

    /**
     * 获取界面资源名称
     */
    readonly uiFormAssetName: string;

    /**
     * 获取界面实例
     */
    readonly handle: object;

    /**
     * 获取界面所属的界面组
     */
    readonly uiGroup: IUIGroup;

    /**
     * 获取界面在界面组中的深度
     */
    readonly depthInUIGroup: number;

    /**
     * 获取是否暂停被覆盖的界面。
     */
    readonly pauseCoveredUIForm: boolean;

    /**
     * 初始化界面
     * @param serialId 界面序列编号
     * @param uiFormAssetName 界面资源名称
     * @param uiGroup 界面所属的界面组
     * @param pauseCoveredUIForm 是否暂停被覆盖的界面。
     * @param isNewInstance 是否是新实例
     * @param userData 用户数据
     */
    onInit(serialId: number, uiFormAssetName: string, uiGroup: IUIGroup, pauseCoveredUIForm: boolean, isNewInstance: boolean, userData?: Object): void;

    /**
     * 界面回收
     */
    onRecyle(): void;

    /**
     * 界面打开
     * @param userData 用户数据
     */
    onOpen(userData?: Object): void;

    /**
     * 界面关闭
     * @param isShutDown 是否是关闭界面管理器的时候触发
     * @param userData 用户数据
     */
    onClose(isShutDown: boolean, userData?: Object): void;

    /**
     * 界面暂停
     */
    onPause(): void;

    /**
     * 界面暂停恢复
     */
    onResume(): void;

    /**
     * 界面被遮挡
     */
    onCover(): void;

    /**
     * 界面遮挡恢复
     */
    onReveal(): void;

    /**
     * 界面激活
     * @param userData 用户数据
     */
    onRefocus(userData?: Object): void;

    /**
     * 界面轮询
     * @param elapseSeconds 逻辑流逝时间
     */
    onUpdate(elapseSeconds: number): void;

    /**
     * 界面深度改变
     * @param uiGroupDepth 所属的界面组深度
     * @param depthInUIGroup 在界面组中的深度
     */
    onDepthChanged(uiGroupDepth: number, depthInUIGroup: number): void;
}
