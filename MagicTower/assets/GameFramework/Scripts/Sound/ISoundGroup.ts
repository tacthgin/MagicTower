export interface ISoundGroup {
    /**
     * 声音组名字
     */
    readonly name: string;

    /**
     * 获取声音代理个数
     */
    readonly soundAgentCount: number;

    /**
     * 获取或设置静音
     */
    mute: boolean;

    /**
     * 获取或设置音量
     */
    volume: number;

    /**
     * 停止所有已加载的声音
     */
    stopAllLoadedSounds(): void;
}
