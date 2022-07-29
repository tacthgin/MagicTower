import { IUIForm } from "./IUIForm";
import { IUIGroupHelper } from "./IUIGroupHelper";

/**
 * 界面组接口
 */
export interface IUIGroup {
    /**
     * 获取组名称
     */
    readonly name: string;

    /**
     * 获取或者设置界面组深度
     */
    depth: number;

    /**
     * 获取或设置界面组是否暂停
     */
    pause: boolean;

    /**
     * 获取界面组中界面数量
     */
    readonly uiFormCount: number;

    /**
     * 获取当前界面
     */
    readonly currentUIForm: IUIForm;

    /**
     * 获取界面组辅助器
     */
    readonly helper: IUIGroupHelper;

    /**
     * 界面组中是否存在界面
     * @param serialIdOrUIFormAssetName 界面序列编号或者界面资源名称
     * @returns 是否存在界面
     */
    hasUIForm(serialIdOrUIFormAssetName: number | string): boolean;

    /**
     * 从界面组获取界面
     * @param serialIdOrUIFormAssetName 界面序列编号或者界面资源名称
     * @returns  获取到的界面
     */
    getUIForm(serialIdOrUIFormAssetName: number | string): IUIForm | null;

    /**
     * 从界面组获取界面
     * @param uiFormAssetName 界面资源名称
     * @returns 获取到的界面
     */
    getUIForms(uiFormAssetName: string): IUIForm[];

    /**
     * 从界面组中获取所有界面
     * @returns 获取到的界面
     */
    getAllUIForms(): IUIForm[];
}
