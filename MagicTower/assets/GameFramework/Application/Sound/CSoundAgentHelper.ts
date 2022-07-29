import { AudioClip, AudioSource } from "cc";
import { ISoundAgentHelper } from "../../Script/Sound/ISoundAgentHelper";

const PLAYING_STATES = [AudioSource.AudioState.PLAYING, AudioSource.AudioState.PAUSED];

/**
 * 声音代理辅助器(封装cocos的AudioSource)
 */
export class CSoundAgentHelper implements ISoundAgentHelper {
    private _audioSource: AudioSource = null!;
    private _mute: boolean = false;
    private _volume: number = 1;
    private _isReadyPlay: boolean = false;

    constructor(audioSource: AudioSource) {
        this._audioSource = audioSource;
    }

    get isPlaying(): boolean {
        if (this._isReadyPlay) {
            return true;
        }
        return PLAYING_STATES.includes(this._audioSource.state);
    }

    get length(): number {
        return this._audioSource.duration;
    }

    set time(value: number) {
        this._audioSource.currentTime = value;
    }

    set mute(value: boolean) {
        this._mute = value;
        this.refreshMute();
    }

    get mute(): boolean {
        return this._mute;
    }

    set loop(value: boolean) {
        this._audioSource.loop = value;
    }

    get loop(): boolean {
        return this._audioSource.loop;
    }

    set volume(value: number) {
        this._volume = value;
        this.refreshMute();
    }

    get volume(): number {
        return this._volume;
    }

    play(): void {
        this._isReadyPlay = true;
        this._audioSource.play();
    }

    stop(): void {
        this._isReadyPlay = false;
        this._audioSource.stop();
    }

    resume(): void {
        this._audioSource.play();
    }

    pause(): void {
        this._audioSource.pause();
    }

    setSoundAsset(asset: object): boolean {
        if (asset && asset instanceof AudioClip) {
            this._audioSource.clip = asset as AudioClip;
            return true;
        } else {
            return false;
        }
    }

    updateState(): void {
        if (this._isReadyPlay) {
            this._isReadyPlay = false;
        }
    }

    private refreshMute(): void {
        if (this._mute) {
            this._audioSource.volume = 0;
        } else {
            this._audioSource.volume = this._volume;
        }
    }
}
