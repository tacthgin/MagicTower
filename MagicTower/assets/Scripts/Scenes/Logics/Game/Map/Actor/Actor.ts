import { Animation, Component, _decorator } from "cc";
import { ActorState } from "./ActorState";
const { ccclass, property } = _decorator;

@ccclass("Actor")
export abstract class Actor extends Component {
    @property(Animation)
    protected animation: Animation = null!;

    /** 状态对应动画名字 */
    protected animationNameMap: { [name: number]: string } = null!;

    protected getAnimationName(state: ActorState) {
        if (this.animationNameMap) {
            return this.animationNameMap[state];
        } else {
            console.error("请自定义animationNameMap");
            return "";
        }
    }

    protected playAnimation(name: string) {
        if (!name) return;
        let state = this.animation.getState(name);
        if (state && state.isPlaying) return;
        this.animation.play(name);
    }

    protected stopAnimaiton() {
        this.animation.stop();
    }

    enter(state: ActorState, data: any = null) {
        this.playAnimation(this.getAnimationName(state));
    }

    exit(state: ActorState, newState: ActorState) {
        if (state != newState) {
            this.stopAnimaiton();
        }
    }
}
