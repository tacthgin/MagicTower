import { AudioSource, Component, Node, _decorator } from "cc";
import { GameFrameworkError } from "../../Base/GameFrameworkError";
import { ISoundAgentHelp } from "../../Sound/ISoundAgentHelp";
import { ISoundHelp } from "../../Sound/ISoundHelp";
import { CSoundAgentHelp } from "./CSoundAgentHelp";

const { ccclass, property, executionOrder } = _decorator;

@ccclass("SoundController")
@executionOrder(0)
export class SoundController extends Component implements ISoundHelp {
    @property(Node)
    private audioSourceNode: Node = null!;

    onLoad() {
        if (!this.audioSourceNode) {
            throw new GameFrameworkError("audio source node not exist");
        }
    }

    acquireSoundAgentHelp(): ISoundAgentHelp {
        let audioSource = this.audioSourceNode.addComponent(AudioSource);
        return new CSoundAgentHelp(audioSource);
    }
}
