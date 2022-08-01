import { EventHandler } from "../Base/EventPool/EventHandler";
import { IObejctPoolManager } from "../ObjectPool/IObejctPoolManager";
import { IResourceManager } from "../Resource/IResourceManager";
import { IUIForm } from "./IUIForm";
import { IUIFormHelper } from "./IUIFormHelper";
import { IUIGroup } from "./IUIGroup";
import { IUIGroupHelper } from "./IUIGroupHelper";
import { UIEventArgs } from "./UIEventArgs";

export interface IUIManager {
    /**
     * 获取界面组的数量
     */
    readonly uiGroupCount: number;

    /**
     * 获取或设置界面实例对象池自动释放可释放对象的间隔秒数
     */
    instanceAutoRelaseInterval: number;

    /**
     * 获取或设置界面实例对象池的容量。
     */
    instanceCapacity: number;

    /**
     * 获取或设置界面实例对象池对象过期秒数
     */
    instanceExpireTime: number;

    /**
     * 获取或设置界面实例对象池的优先级
     */
    instancePriority: number;

    /**
     * 设置对象池管理器
     * @param objectPoolManager 对象池管理器
     */
    setObjectPoolManager(objectPoolManager: IObejctPoolManager): void;

    /**
     * 设置资源管理器
     * @param resourceManager 资源管理器
     */
    setResourceManager(resourceManager: IResourceManager): void;

    /**
     * 设置界面辅助器
     * @param uiFormHelper 界面辅助器
     */
    setUIFormHelper(uiFormHelper: IUIFormHelper): void;

    /**
     * 事件是否已经注册
     * @param id 事件id
     * @param eventHandler 事件句柄
     * @param thisArg 函数this指针
     * @returns 事件是否已经注册
     */
    check(id: number, eventHandler: EventHandler<UIEventArgs>, thisArg?: any): boolean;

    /**
     * 订阅UI事件
     * @param id 事件id
     * @param eventHandler 事件句柄
     * @param thisArg 函数this指针
     */
    subscribe(id: number, eventHandler: EventHandler<UIEventArgs>, thisArg?: any): void;

    /**
     * 取消订阅UI事件
     * @param id 事件id
     * @param eventHandler 事件句柄
     * @param thisArg 函数this指针
     */
    unsubscribe(id: number, eventHandler: EventHandler<UIEventArgs>, thisArg?: any): void;

    /**
     * 取消订阅者的所有订阅
     * @param target 订阅者
     */
    unsubscribeTarget(target: object): void;

    /**
     * 是否存在界面组
     * @param uiGroupName 界面组名称
     * @returns 是否存在界面组
     */
    hasUIGroup(uiGroupName: string): boolean;

    /**
     * 获取界面组
     * @param uiGroupName 界面组名称
     * @returns 获取到的界面组
     */
    getUIGroup(uiGroupName: string): IUIGroup | null;

    /**
     * 获取所有界面组
     * @returns 获取到的界面组
     */
    getAllUIGroups(): IUIGroup[];

    /**
     * 添加界面组
     * @param uiGroupName 界面组名称
     * @param uiGroupHelp 界面组辅助器
     * @returns 是否成功添加
     */
    addUIGroup(uiGroupName: string, uiGroupDepth: number, uiGroupHelp: IUIGroupHelper): boolean;

    /**
     * 界面组中是否存在界面
     * @param serialIdOrUIFormAssetName 界面序列编号或者界面资源名称
     * @returns 是否存在界面
     */
    hasUIForm(serialIdOrUIFormAssetName: number | string): boolean;

    /**
     * 从界面组获取界面
     * @param serialIdOrUIFormAssetName 界面序列编号或者界面资源名称
     * @returns 获取到的界面
     */
    getUIForm(serialIdOrUIFormAssetName: number | string): IUIForm | null;

    /**
     * 从界面组获取界面
     * @param uiFormAssetName 界面资源名称
     * @returns 获取到的界面
     */
    getUIForms(uiFormAssetName: string): IUIForm[];

    /**
     * 获取所有已加载的界面
     * @returns 获取到的界面
     */
    getAllLoadedUIForms(): IUIForm[];

    /**
     * 获取所有正在加载的界面序列编号
     * @returns 获取到的界面序列编号
     */
    getAllLoadingUIFormSerialIds(): number[];

    /**
     * 是否正在加载界面
     * @param serialIdOrUIFormAssetName 界面序列编号或者界面资源名称
     * @returns 是否正在加载界面
     */
    isLoadingUIForm(serialIdOrUIFormAssetName: number | string): boolean;

    /**
     * 打开界面
     * @param uiFormAssetName 界面资源名称
     * @param uiGroupName 界面所属的界面组名称
     * @param userData 用户数据
     * @param pauseCoveredUIForm 是否暂停被覆盖的界面
     * @returns 界面序列编号
     */
    openUIForm(uiFormAssetName: string, uiGroupName: string, userData?: Object, pauseCoveredUIForm?: boolean): Promise<number>;

    /**
     * 关闭界面
     * @param serialIdOrUIForm  要关闭的界面序列编号或者界面
     * @param userData 用户数据
     */
    closeUIForm(serialIdOrUIForm: number | IUIForm, userData?: object): void;

    /**
     * 关闭所有已加载的界面
     * @param userData 用户数据
     */
    closeAllLoadedUIForms(userData?: object): void;

    /**
     * 关闭所有正在加载的界面
     */
    closeAllLoadingUIForms(): void;

    /**
     * 激活界面
     * @param uiForm 要激活的界面
     * @param userData 用户数据
     */
    refocusUIForm(uiForm: IUIForm, userData?: object): void;

    /**
     * 设置界面实例是否被加锁
     * @param uiFormInstance 界面实例
     * @param locked 界面实例是否被加锁
     */
    setUIFormInstanceLocked(uiFormInstance: object, locked: boolean): void;

    /**
     * 设置界面实例的优先级
     * @param uiFormInstance 界面实例
     * @param priority 界面实例的优先级
     */
    setUIFormInstancePriority(uiFormInstance: object, priority: number): void;
}
