import { _decorator, Component, AudioSource, AudioClip, resources, path, Event } from "cc";
const { ccclass, type } = _decorator;

const AUDIO_PATH = "Audio";

export enum AudioType {
    MUSIC,
    EFFECT,
}

@ccclass("AudioController")
export class AudioController extends Component {
    @type(AudioSource)
    private audioSource: AudioSource[] = [];

    private audioEnabled: boolean[] = [true, true];

    public set musicEnabled(value: boolean) {
        this.audioEnabled[0] = value;
    }

    public get musicEnabled() {
        return this.audioEnabled[0];
    }

    public set effectEnabled(value: boolean) {
        this.audioEnabled[1] = value;
    }

    public get effectEnabled() {
        return this.audioEnabled[1];
    }

    private getAudioClip(audioPath: string) {
        audioPath = path.join(AUDIO_PATH, audioPath);

        return new Promise((resolve, reject) => {
            let audioClip = resources.get(audioPath);
            if (!audioClip) {
                resources.load(audioPath, (error, audioClip: AudioClip) => {
                    if (error) {
                        console.error(error);
                        reject();
                    } else {
                        resolve(audioClip);
                    }
                });
            } else {
                resolve(audioClip);
            }
        });
    }

    /**
     * 播放音乐、音效
     * @param type 播放类型
     * @param audioPath 音乐片段路径
     * @param loop 是否循环
     * @param volume 音量
     * @returns
     */
    private play(type: AudioType, audioPath: string, loop: boolean = true, volume: number = 1) {
        if (!this.audioEnabled[type]) return;
        this.getAudioClip(audioPath).then((audioClip: any) => {
            let audioSource = this.audioSource[type];
            if (type == AudioType.MUSIC && audioSource.clip != audioClip) {
                console.warn("音效资源相同", audioPath);
                return;
            }
            audioSource.clip = audioClip;
            audioSource.loop = loop;
            audioSource.volume = volume;
            audioSource.play();
        });
    }

    private stop(type: AudioType) {
        this.audioSource[type].stop();
    }

    stopMusic() {
        this.audioSource[AudioType.MUSIC].stop();
    }

    stopEffect() {
        this.audioSource[AudioType.EFFECT].stop();
    }

    stopAll() {
        this.audioSource.forEach((audioSource) => {
            audioSource.stop();
        });
    }

    playMusic(audioPath: string, loop: boolean = true, volume: number = 1) {
        this.play(AudioType.MUSIC, audioPath, loop, volume);
    }

    playEffect(audioPath: string, loop: boolean = false, volume: number = 1) {
        this.play(AudioType.EFFECT, audioPath, loop, volume);
    }

    /** 对音乐特效进行一次播放 */
    playOneShot(audioPath: string, volume: number = 1) {
        if (!this.effectEnabled[AudioType.EFFECT]) return;
        this.getAudioClip(audioPath).then((audioClip: any) => {
            this.audioSource[AudioType.EFFECT].playOneShot(audioClip, volume);
        });
    }
}
