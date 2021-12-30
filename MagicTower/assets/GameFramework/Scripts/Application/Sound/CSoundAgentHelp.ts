import { AudioClip, AudioSource } from "cc";
import { ISoundAgentHelp } from "../../Sound/ISoundAgentHelp";

/**
 * 声音代理辅助器(封装cocos的AudioSource)
 */
export class CSoundAgentHelp implements ISoundAgentHelp {
    private _audioSource: AudioSource = null!;
    private _mute: boolean = false;
    private _volume: number = 1;

    constructor(audioSource: AudioSource) {
        this._audioSource = audioSource;
    }

    get isPlaying(): boolean {
        return this._audioSource.state == AudioSource.AudioState.PLAYING || this._audioSource.state == AudioSource.AudioState.PAUSED;
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
        this._audioSource.play();
    }

    stop(): void {
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

    private refreshMute() {
        if (this._mute) {
            this._audioSource.volume = 0;
        } else {
            this._audioSource.volume = this._volume;
        }
    }
}
