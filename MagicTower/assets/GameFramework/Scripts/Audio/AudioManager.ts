import { _decorator, Component, AudioSource, AudioClip, resources, path } from "cc";
const { ccclass, type } = _decorator;

const AUDIO_PATH = "Audio";

export enum AudioType {
    MUSIC,
    EFFECT,
}

@ccclass("AudioManager")
export class AudioManager extends Component {
    @type(AudioSource)
    private audioSource: AudioSource[] = [];

    private audioEnabled: boolean[] = [true, true];

    public set musicEnabled(value: boolean) {
        this.audioEnabled[AudioType.MUSIC] = value;
        if (value) {
            this.audioSource[AudioType.MUSIC].play();
        } else {
            this.stopMusic();
        }
    }

    public get musicEnabled() {
        return this.audioEnabled[AudioType.MUSIC];
    }

    public set effectEnabled(value: boolean) {
        this.audioEnabled[AudioType.EFFECT] = value;
        if (!value) {
            this.stopEffect();
        }
    }

    public get effectEnabled() {
        return this.audioEnabled[AudioType.EFFECT];
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
            audioSource.clip = audioClip;
            audioSource.loop = loop;
            audioSource.volume = volume;
            audioSource.play();
        });
    }

    private stop(type: AudioType) {
        this.audioSource[type].stop();
    }

    private stopMusic() {
        this.stop(AudioType.MUSIC);
    }

    private stopEffect() {
        //音效只能停止当前的，感觉要做停止所有音效，必须建造多个audiosource
        this.stop(AudioType.EFFECT);
    }

    stopAll() {
        this.stopEffect();
        this.stopMusic();
    }

    playMusic(audioPath: string, loop: boolean = true, volume: number = 1) {
        this.play(AudioType.MUSIC, audioPath, loop, volume);
    }

    playEffect(audioPath: string, loop: boolean = false, volume: number = 1) {
        this.play(AudioType.EFFECT, audioPath, loop, volume);
    }

    /** 对音效进行一次播放 */
    playOneShot(audioPath: string, volumeScale: number = 1) {
        if (!this.effectEnabled) return;
        this.getAudioClip(audioPath).then((audioClip: any) => {
            this.audioSource[AudioType.EFFECT].playOneShot(audioClip, volumeScale);
        });
    }
}
