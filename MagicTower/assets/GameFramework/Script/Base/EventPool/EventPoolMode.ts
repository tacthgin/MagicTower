export enum EventPoolMode {
    /**
     * 默认事件池模式，必须有一个事件处理函数
     */
    DEFAULT = 0,

    /**
     * 允许存在多个事件处理函数
     */
    ALLOW_MULTI_HANDLER = 1,

    /**
     * 允许存在重复的事件处理函数
     */
    ALLOW_DUPLICATE_HANDLER = 2,
}
