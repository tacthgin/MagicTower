import { NodePool, Prefab, resources, Animation, AnimationClip } from "cc";
import { BasePoolNode } from "../Base/BasePoolNode";

/** 对象池管理，可获取对象池节点，特效节点等 */
export class NodePoolManager {
    private pool: any = {};

    private loadPrefab(path: string): Promise<Prefab> {
        return new Promise((resolve) => {
            resources.load(path, Prefab, (err, prefab: Prefab) => {
                if (err) {
                    console.error(err);
                    resolve(null);
                }
                resolve(prefab);
            });
        });
    }

    /**
     * 创建对象池节点
     * @param path 预设路径
     * @param useCommon 是否使用通用脚本
     */
    async createPoolNode(path: string, useCommon: boolean) {
        let prefab = resources.get<Prefab>(path);
        if (!prefab) {
            prefab = await this.loadPrefab(path);
            if (!prefab) {
                console.error(`找不到${path}预设`);
                return null;
            }
        }

        if (!this.pool[path]) {
            let index = path.lastIndexOf("/");
            let name = index == -1 ? path : path.substring(index + 1);
            this.pool[path] = new NodePool(name);
        }

        return BasePoolNode.generateNodeFromPool(this.pool[path], prefab, useCommon);
    }

    /**
     * 帧动画特效节点
     * @param path 特效路径
     * @param loop 是否循环播放
     * @param completeCallback 播放完成调用回调
     */
    async createEffectNode(path: string, loop: boolean = false, completeCallback: (...any: any[]) => void = null) {
        let effectNode = await this.createPoolNode(path, true);
        if (!effectNode) {
            console.error("找不到特效节点", path);
            return null;
        }

        let animation = effectNode.getComponent(Animation);
        if (!animation) {
            console.error("找不到动画组件", path);
        }
        let clip = animation.defaultClip || animation.clips[0];
        if (clip) {
            clip.wrapMode = loop ? AnimationClip.WrapMode.Loop : AnimationClip.WrapMode.Normal;
            animation.play();
            if (completeCallback) {
                animation.on(Animation.EventType.FINISHED, completeCallback, null, true);
            }
        } else {
            console.error("找不到动画片段", path);
        }

        return effectNode;
    }
}
