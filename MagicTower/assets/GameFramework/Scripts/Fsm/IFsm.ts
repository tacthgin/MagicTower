import { Constructor } from "../Base/DataStruct/Constructor";
import { IRerference } from "../Base/ReferencePool/IRerference";
import { Variable } from "../Base/Variable/Variable";
import { FsmState } from "./FsmState";

export interface IFsm<T extends Constructor<T>> extends IRerference {
    /**
     * 获取有限状态机名称
     */
    readonly name: string;

    /**
     * 获取有限状态机拥有者
     */
    readonly owner: T;

    /**
     * 获取有限状态机状态数目
     */
    readonly fsmStateCount: number;

    /**
     * 有限状态机是否正在运行
     */
    readonly isRunning: boolean;

    /**
     * 有限状态机是否已经销毁
     */
    readonly isDestroyed: boolean;

    /**
     * 获取当前有限状态机状态
     */
    readonly currentState: FsmState<T> | null;

    /**
     * 获取当前有限状态机状态持续时间
     */
    readonly currentStateTime: number;

    /**
     * 开始有限状态机
     * @param stateConstructor 开始的有限状态机状态构造器
     */
    start<TState extends FsmState<T>>(stateConstructor: Constructor<TState>): void;

    /**
     * 是否存在有限状态机状态
     * @param stateConstructor 要检查的有限状态机状态构造器
     * @returns 是否存在有限状态机状态
     */
    hasState<TState extends FsmState<T>>(stateConstructor: Constructor<TState>): boolean;

    /**
     * 获取有限状态机状态
     * @param stateConstructor 要获取的有限状态机状态构造器
     * @returns 获取有限状态机状态
     */
    getState<TState extends FsmState<T>>(stateConstructor: Constructor<TState>): FsmState<T> | null;

    /**
     * 获取所有有限状态机状态
     * @returns 获取所有有限状态机状态
     */
    getAllStates(): FsmState<T>[];

    /**
     * 是否存在有限状态机数据
     * @param name 数据名称
     * @returns 是否存在有限状态机数据
     */
    hasData(name: string): boolean;

    /**
     * 获取有限状态机数据
     * @param name 数据名称
     * @returns 获取有限状态机数据
     */
    getData<TData extends Variable<Object>>(name: string): TData | null;

    /**
     * 设置有限状态机数据
     * @param name 数据名称
     * @param data 要设置的数据
     */
    setData<TData extends Variable<Object>>(name: string, data: TData): void;

    /**
     * 移除有限状态机数据
     * @param name 数据名称
     */
    removeData(name: string): boolean;
}
