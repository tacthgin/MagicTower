export enum BaseEvent {
    /** 切到后台 */
    ON_HIDE = 50000,

    /** 回到前台 */
    ON_SHOW,

    /** 音频中断 */
    ON_AUDIO_INTERRUPTION_END,

    /** 网络切换 */
    ON_NETWORK_STATUS_CHANGE,

    /** 资源加载成功 */
    ALL_RESOURCES_LOAD_SUCCESS,
    JSON_LOAD_SUCCESS,
    EFFECT_LOAD_SUCCESS,
    RESOURCES_LOAD_PROGRESS,
    /** 资源加载失败 */
    ALL_RESOURCES_LOAD_FAILED,

    /** 弹窗弹窗 */
    SHOW_DIALOG,
    HIDE_DIALOG,
}
