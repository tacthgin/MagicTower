import { tween, UIOpacity, Animation, AnimationClip, SpriteFrame } from "cc";
import { BasePoolNode } from "../../../../Framework/Base/BasePoolNode";
import { GameManager } from "../../../../Framework/Managers/GameManager";

export abstract class MapElement extends BasePoolNode {
    protected animation: Animation = null;

    protected createAnimationClip(spriteFrameName: string, count: number, reverse: boolean = false): SpriteFrame[] {
        let spriteFrames = [];
        for (let i = 0; i < count; i++) {
            spriteFrames.push(GameManager.RESOURCE.getSpriteFrame(`${spriteFrameName}_${i}`));
        }
        if (reverse) {
            spriteFrames.reverse();
        }
        return spriteFrames;
    }

    protected createAnimation(
        name: string,
        spriteFrameName: string,
        count: number,
        wrapMode = AnimationClip.WrapMode.Loop,
        reverse: boolean = false,
        sample: number = 8
    ) {
        if (!this.animation) return;
        let index = this.animation.clips.findIndex((clip) => {
            return clip.name == name;
        });
        if (index == -1) {
            let clip = AnimationClip.createWithSpriteFrames(this.createAnimationClip(spriteFrameName, count, reverse), sample);
            clip.name = name;
            clip.wrapMode = wrapMode;
            this.animation.clips.push(clip);
        }
    }

    remove(immediately: boolean = false) {
        if (immediately) {
            super.remove();
        } else {
            tween(this.node.getComponent(UIOpacity))
                .to(0.5, { opacity: 0 })
                .set({ opacity: 255 })
                .call(() => {
                    super.remove();
                })
                .start();
        }
    }

    add() {
        tween(this.node.getComponent(UIOpacity)).set({ opacity: 0 }).to(0.5, { opacity: 255 }).start();
    }
}
