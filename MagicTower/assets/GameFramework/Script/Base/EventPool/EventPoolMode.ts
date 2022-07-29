export enum EventPoolMode {
    /**
     * 默认事件池模式，必须有事件处理函数
     */
    DEFAULT = 0,

    /**
     * 允许不存在事件处理函数
     */
    ALLOW_NO_HANDLER,
}
