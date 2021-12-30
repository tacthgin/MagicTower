import { Constructor } from "../Base/DataStruct/Constructor";
import { FsmBase } from "./FsmBase";
import { FsmState } from "./FsmState";
import { IFsm } from "./IFsm";

export interface IFsmManager {
    readonly count: number;
    /**
     * 是否存在有限状态机
     * @param nameOrOwner 有限状态机名称或者拥有者
     * @returns 是否存在有限状态机
     */
    hasFsm<T extends Constructor<T>>(nameOrOwner: string | T): boolean;

    /**
     * 获取有限状态机
     * @param nameOrOwner 有限状态机名称或者拥有者
     * @returns 获取的有限状态机
     */
    getFsm<T extends Constructor<T>>(nameOrOwner: string | T): IFsm<T> | null;

    /**
     * 获取有限状态机
     * @param name 有限状态机名称
     * @returns 获取的有限状态机
     */
    getFsmBase(name: string): FsmBase | null;

    /**
     * 获取所有有限状态机
     * @returns 获取的所有有限状态机
     */
    getAllFsms(): FsmBase[];

    /**
     * 创建有限状态机
     * @param name 有限状态机名称
     * @param owner 有限状态机拥有者
     * @param states 有限状态机状态
     * @returns 要创建的有限状态机
     */
    createFsm<T extends Constructor<T>>(name: string, owner: T, states: FsmState<T>[]): IFsm<T>;

    /**
     * 销毁有限状态机
     * @param nameOrOwnerOrFsm 有限状态机名称或者拥有者或者有限状态机
     * @returns 是否成功销毁有限状态机
     */
    destroyFsm<T extends Constructor<T>>(nameOrOwnerOrFsm: string | T | FsmBase | IFsm<T>): boolean;
}
