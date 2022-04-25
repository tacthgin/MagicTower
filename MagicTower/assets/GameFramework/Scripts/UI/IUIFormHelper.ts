import { IUIForm } from "./IUIForm";
import { IUIGroup } from "./IUIGroup";

/**
 * 界面辅助器接口
 */
export interface IUIFormHelper {
    /**
     * 实例化界面
     * @param uiFormAsset 需要实例化的界面资源
     */
    instantiateUIForm(uiFormAsset: object): object;

    /**
     * 创建界面
     * @param uiFormInstance 界面实例
     * @param uiGroup 界面所属的界面组
     * @param userData 用户数据
     * @returns 界面
     */
    createUIForm(uiFormInstance: object, uiGroup: IUIGroup, userData?: Object): IUIForm | null;

    /**
     * 释放界面
     * @param uiFormAsset 要释放的界面资源
     * @param uiFormInstance 要释放的界面实例
     */
    releaseUIForm(uiFormAsset: object, uiFormInstance: object): void;
}
