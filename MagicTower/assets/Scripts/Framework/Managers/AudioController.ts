import { _decorator, Component, AudioSource, AudioClip, resources, path, Event } from "cc";
const { ccclass, type } = _decorator;

const AUDIO_PATH = "Audio";

@ccclass("AudioController")
export class AudioController extends Component {
    @type(AudioSource)
    private music: AudioSource = null;

    private audioEnabled: boolean[] = [true, true];

    private effectClips: AudioClip[] = [];

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

    public set musicVolume(value: number) {
        if (value >= 0 && value <= 1) {
            this.music.volume = value;
        }
    }

    onLoad() {
        //如果需要停止全部音效
        //this.node.on("ended", this.audioEnded, this);
    }

    // private audioEnded(audioClip: AudioClip) {
    //     let index = this.effectClips.indexOf(audioClip)
    //     index != -1 && this.effectClips.splice(index, 1)
    // }

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

    playMusic(audioPath: string, loop: boolean) {
        if (!this.musicEnabled) return;
        this.getAudioClip(audioPath).then((audioClip: any) => {
            if (this.music.clip != audioClip) {
                this.music.clip = audioClip;
                this.music.loop = loop;
                this.music.play();
            } else {
                console.warn("音效资源相同", audioPath);
            }
        });
    }

    stopMusic() {
        this.music.stop();
    }

    playEffect(audioPath: string, loop: boolean) {
        if (!this.effectEnabled) return;
        this.getAudioClip(audioPath).then((audioClip: any) => {
            if (loop) {
                audioClip.setLoop(loop);
                audioClip.play();
            } else {
                audioClip.playOneShot(1);
            }
        });
    }

    stopEffect(audioPath: string) {
        this.getAudioClip(audioPath).then((audioClip: any) => {
            audioClip.stop();
        });
    }

    stopAllEffects() {
        this.effectClips.forEach((effectClip) => {
            effectClip.stop();
        });
    }
}
