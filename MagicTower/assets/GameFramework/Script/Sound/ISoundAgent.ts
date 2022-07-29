import { ISoundGroup } from "./ISoundGroup";

export interface ISoundAgent {
    /**
     * 获取声音代理所在的声音组
     */
    readonly soundGroup: ISoundGroup;

    /**
     * 声音id
     */
    readonly serialId: number;

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
     * 获取声音是否静音
     */
    readonly mute: boolean;

    /**
     * 获取或者设置在声音组内是否静音
     */
    muteInSoundGroup: boolean;

    /**
     * 获取或者设置声音是否循环播放
     */
    loop: boolean;

    /**
     * 获取声音音量
     */
    readonly volume: number;

    /**
     * 获取或者设置在声音组内的音量
     */
    volumeInSoundGroup: number;

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
}
