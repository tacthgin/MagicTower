export interface ISoundAgentHelp {
    /**
     * 是否正在播放
     */
    readonly isPlaying: boolean;

    /**
     * 声音长度
     */
    readonly length: number;

    /**
     * 获取或者设置声音播放开始位置
     */
    time: number;

    /**
     * 获取或设置声音是否静音
     */
    mute: boolean;

    /**
     * 获取或者设置声音是否循环播放
     */
    loop: boolean;

    /**
     * 获取或者设置声音音量
     */
    volume: number;

    /**
     * 播放声音
     */
    play(): void;

    /**
     * 停止声音
     */
    stop(): void;

    /**
     * 恢复播放声音
     */
    resume(): void;

    /**
     * 暂停声音
     */
    pause(): void;

    /**
     * 设置声音资源
     */
    setSoundAsset(asset: object): boolean;
}
