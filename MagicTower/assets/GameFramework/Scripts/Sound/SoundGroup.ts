import { GameFrameworkError } from "../Base/GameFrameworkError";
import { ISoundGroup } from "./ISoundGroup";
import { ISoundHelper } from "./ISoundHelper";
import { PlaySoundParams } from "./PlaySoundParams";
import { SoundAgent } from "./SoundAgent";

export class SoundGroup implements ISoundGroup {
    private _soundHelper: ISoundHelper | null = null;
    private _name: string = "";
    private readonly _soundAgents: Array<SoundAgent> = null!;
    private _mute: boolean = false;
    private _volume: number = 1;
    private _prePlaySoundAgents: Array<SoundAgent> = null!;

    constructor(name: string) {
        if (!name) {
            throw new GameFrameworkError("sound group name is invalid");
        }
        this._name = name;
        this._soundAgents = new Array<SoundAgent>();
        this._prePlaySoundAgents = new Array<SoundAgent>();
    }

    get name(): string {
        return this._name;
    }

    get soundAgentCount(): number {
        return this._soundAgents.length;
    }

    set mute(value: boolean) {
        this._mute = value;
    }

    get mute(): boolean {
        return this._mute;
    }

    set volume(value: number) {
        this._volume = value;
    }

    get volume(): number {
        return this._volume;
    }

    /**
     * 添加声音辅助器
     * @param soundHelper
     */
    addSoundHelper(soundHelper: ISoundHelper): void {
        this._soundHelper = soundHelper;
    }

    /**
     * 播放声音
     * @param serialId 声音id
     * @param soundAsset 声音资源
     * @param playSoundParams 播放声音需要的参数
     * @returns 声音代理
     */
    playSound(serialId: number, soundAsset: object, playSoundParams: PlaySoundParams): void {
        let candidateAgent: SoundAgent | null = null;
        for (let soundAgent of this._soundAgents) {
            if (!soundAgent.isPlaying) {
                candidateAgent = soundAgent;
                break;
            }
        }

        if (!candidateAgent) {
            if (this._soundHelper) {
                let soundAgentHelp = this._soundHelper.acquireSoundAgentHelper();
                candidateAgent = new SoundAgent(this, soundAgentHelp);
                this._soundAgents.push(candidateAgent);
            } else {
                throw new GameFrameworkError("sound help not exist");
            }
        }

        if (candidateAgent && candidateAgent.setSoundAsset(soundAsset)) {
            candidateAgent.serialId = serialId;
            candidateAgent.volumeInSoundGroup = playSoundParams.volumeInSoundGroup;
            candidateAgent.muteInSoundGroup = playSoundParams.muteInSoundGroup;
            candidateAgent.loop = playSoundParams.loop;
            candidateAgent.time = playSoundParams.time;
            candidateAgent.play();
            this._prePlaySoundAgents.push(candidateAgent);
        } else {
            throw new GameFrameworkError("set sound asset failed");
        }
    }

    /**
     * 暂停声音
     * @param serialId 声音id
     */
    pauseSound(serialId: number): boolean {
        for (let soundAgent of this._soundAgents) {
            if (soundAgent.serialId == serialId) {
                soundAgent.pause();
                return true;
            }
        }
        return false;
    }

    /**
     * 恢复声音播放
     * @param serialId 声音id
     */
    resumeSound(serialId: number): boolean {
        for (let soundAgent of this._soundAgents) {
            if (soundAgent.serialId == serialId) {
                soundAgent.resume();
                return true;
            }
        }
        return false;
    }

    /**
     * 停止声音
     * @param serialId 声音id
     */
    stopSound(serialId: number): boolean {
        for (let soundAgent of this._soundAgents) {
            if (soundAgent.serialId == serialId) {
                soundAgent.stop();
                return true;
            }
        }
        return false;
    }

    /**
     * 停止所有播放的声音
     */
    stopAllLoadedSounds(): void {
        for (let soundAgent of this._soundAgents) {
            if (soundAgent.isPlaying) {
                soundAgent.stop();
            }
        }
    }

    /**
     * 轮询声音组
     * @param elapseSeconds
     */
    update(elapseSeconds: number): void {
        //解决同一帧内，播放多个动画，agent被替换问题
        if (this._prePlaySoundAgents.length > 0) {
            this._prePlaySoundAgents.forEach((soundAgent) => {
                soundAgent.updateState();
            });
            this._prePlaySoundAgents.length = 0;
        }
    }
}
