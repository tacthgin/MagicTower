import { ISoundAgent } from "./ISoundAgent";
import { ISoundAgentHelper } from "./ISoundAgentHelper";
import { ISoundGroup } from "./ISoundGroup";

export class SoundAgent implements ISoundAgent {
    private _soundGroup: ISoundGroup = null!;
    private _soundAgentHelp: ISoundAgentHelper = null!;
    private _serialId: number = 0;
    private _soundAsset: object | null = null;
    private _muteInSoundGroup: boolean = false;
    private _volumeInSoundGroup: number = 1;

    constructor(soundGroup: ISoundGroup, soundAgentHelp: ISoundAgentHelper) {
        this._soundGroup = soundGroup;
        this._soundAgentHelp = soundAgentHelp;
    }

    get soundGroup(): ISoundGroup {
        return this._soundGroup;
    }

    get serialId(): number {
        return this._serialId;
    }

    set serialId(value: number) {
        this._serialId = value;
    }

    get isPlaying(): boolean {
        return this._soundAgentHelp.isPlaying;
    }

    get length(): number {
        return this._soundAgentHelp.length;
    }

    set time(value: number) {
        this._soundAgentHelp.time = value;
    }

    get time(): number {
        return this._soundAgentHelp.time;
    }

    get mute(): boolean {
        return this._soundAgentHelp.mute;
    }

    set muteInSoundGroup(value: boolean) {
        this._muteInSoundGroup = value;
        this.refreshMute();
    }

    get muteInSoundGroup(): boolean {
        return this._muteInSoundGroup;
    }

    set loop(value: boolean) {
        this._soundAgentHelp.loop = value;
    }

    get loop(): boolean {
        return this._soundAgentHelp.loop;
    }

    get volume(): number {
        return this._soundAgentHelp.volume;
    }

    set volumeInSoundGroup(value: number) {
        this._volumeInSoundGroup = value;
        this.refreshVolume();
    }

    get volumeInSoundGroup(): number {
        return this._volumeInSoundGroup;
    }

    play(): void {
        this._soundAgentHelp.play();
    }

    stop(): void {
        this._soundAgentHelp.stop();
    }

    resume(): void {
        this._soundAgentHelp.resume();
    }

    pause(): void {
        this._soundAgentHelp.pause();
    }

    setSoundAsset(soundAsset: object): boolean {
        this._soundAsset = soundAsset;
        return this._soundAgentHelp.setSoundAsset(soundAsset);
    }

    refreshMute(): void {
        this._soundAgentHelp.mute = this._soundGroup.mute || this._muteInSoundGroup;
    }

    refreshVolume(): void {
        this._soundAgentHelp.volume = this._soundGroup.volume * this._volumeInSoundGroup;
    }

    updateState(): void {
        this._soundAgentHelp.updateState();
    }
}
