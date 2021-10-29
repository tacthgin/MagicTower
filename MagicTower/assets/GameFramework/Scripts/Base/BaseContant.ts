export enum BaseEvent {
    /** 切到后台 */
    ON_HIDE = "ON_HIDE",
    /** 回到前台 */
    ON_SHOW = "ON_SHOW",
    /** 音频中断 */
    ON_AUDIO_INTERRUPTION_END = "ON_AUDIO_INTERRUPTION_END",
    /** 网络切换 */
    ON_NETWORK_STATUS_CHANGE = "ON_AUDIO_INTERRUPTION_END",
    /** 资源加载成功 */
    ALL_RESOURCES_LOAD_SUCCESS = "ALL_RESOURCES_LOAD_SUCCESS",
    /* 资源加载进度*/
    RESOURCE_PROGRESS = "RESOURCE_PROGRESS",
    /** 资源加载完成 */
    RESOURCE_COMPLETE = "RESOURCE_COMPLETE",
    /** 资源加载失败 */
    ALL_RESOURCES_LOAD_FAILED = "ALL_RESOURCES_LOAD_FAILED",
}
