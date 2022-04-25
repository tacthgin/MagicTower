import { AudioSource, Component, Node, _decorator } from "cc";
import { GameFrameworkError } from "../../Base/GameFrameworkError";
import { ISoundAgentHelper } from "../../Sound/ISoundAgentHelper";
import { ISoundHelper } from "../../Sound/ISoundHelper";
import { CSoundAgentHelper } from "./CSoundAgentHelper";

const { ccclass, property, executionOrder } = _decorator;

@ccclass("SoundController")
@executionOrder(0)
export class SoundController extends Component implements ISoundHelper {
    @property(Node)
    private audioSourceNode: Node = null!;

    onLoad() {
        if (!this.audioSourceNode) {
            throw new GameFrameworkError("audio source node not exist");
        }
    }

    acquireSoundAgentHelper(): ISoundAgentHelper {
        let audioSource = this.audioSourceNode.addComponent(AudioSource);
        return new CSoundAgentHelper(audioSource);
    }
}
