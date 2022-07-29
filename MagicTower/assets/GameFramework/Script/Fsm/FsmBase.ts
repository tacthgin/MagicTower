export abstract class FsmBase {
    protected _name: string = "";

    /**
     * 获取有限状态机名称
     */
    get name(): string {
        return this._name;
    }

    /**
     * 获取有限状态机状态数目
     * @returns 状态数目
     */
    abstract get fsmStateCount(): number;

    /**
     * 有限状态机是否正在运行
     * @returns 有限状态机是否正在运行
     */
    abstract get isRunning(): boolean;

    /**
     * 有限状态机是否已经销毁
     * @returns 有限状态机是否已经销毁
     */
    abstract get isDestroyed(): boolean;

    /**
     * 获取当前有限状态机状态持续时间
     * @returns 状态持续时间
     */
    abstract get currentStateTime(): number;

    /**
     * 有限状态机轮询
     * @param elapseSeconds 逻辑流逝时间
     */
    abstract update(elapseSeconds: number): void;

    /**
     * 关闭并清理有限状态机
     */
    abstract shutDown(): void;
}
