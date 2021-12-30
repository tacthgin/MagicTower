import { IResourceManager } from "../Resource/IResourceManager";
import { ISoundGroup } from "./ISoundGroup";
import { ISoundHelp } from "./ISoundHelp";
import { PlaySoundParams } from "./PlaySoundParams";

export interface ISoundManager {
    readonly backgroundSerialId: number;
    /**
     * 设置资源管理器
     * @param resourceManager 资源管理器
     */
    setResourceManager(resourceManager: IResourceManager): void;

    /**
     * 设置声音辅助器
     * @param soundHelp
     */
    setSoundHelp(soundHelp: ISoundHelp): void;

    /**
     * 播放声音
     * @param soundAssetPath 声音资源路径
     * @param soundGroupName 声音组名字
     * @param playSoundParams 声音播放参数
     */
    playSound(soundAssetPath: string, soundGroupName?: string, playSoundParams?: PlaySoundParams): Promise<number>;

    /**
     * 播放背景声音
     * @param soundAssetPath 声音资源路径
     * @param playSoundParams 声音播放参数
     */
    playBackgroundSound(soundAssetPath: string, playSoundParams?: PlaySoundParams): Promise<number>;

    /**
     * 暂停声音播放
     * @param serialId 声音id
     */
    pauseSound(serialId: number): void;

    /**
     * 恢复声音播放
     * @param serialId 声音id
     */
    resumeSound(serialId: number): void;

    /**
     * 停止声音播放
     * @param serialId 声音id
     */
    stopSound(serialId: number): void;

    /**
     * 停止所有正在播放的
     */
    stopAllLoadedSounds(): void;

    /**
     * 是否有声音组
     * @param soundGroupName 声音组名字
     */
    hasSoundGroup(soundGroupName: string): boolean;

    /**
     * 获取声音组
     * @param soundGroupName 声音组名字
     * @returns 声音组
     */
    getSoundGroup(soundGroupName: string): ISoundGroup | null;

    /**
     * 添加声音组
     * @param soundGroupName 声音组名字
     */
    addSoundGroup(soundGroupName: string): boolean;
}
