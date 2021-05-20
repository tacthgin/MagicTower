import { NodePool, Prefab, resources, Animation, AnimationClip } from "cc";
import { BasePoolNode } from "../Base/BasePoolNode";
import { GameManager } from "./GameManager";

/** 对象池管理，可获取对象池节点，特效节点等 */
export class NodePoolManager {
    private pool: any = {};

    /**
     * 创建对象池节点
     * @param path 预设路径
     * @param extName 扩展名用来区分一种类型不同名字的对象池
     * @param useCommon 是否使用通用脚本
     */
    async createPoolNode(path: string, extName: string | number | null = null, useCommon: boolean = false) {
        let prefab = resources.get<Prefab>(path);
        if (!prefab) {
            prefab = await GameManager.RESOURCE.loadPrefab(path);
            if (!prefab) {
                console.error(`找不到${path}预设`);
                return null;
            }
        }

        let index = path.lastIndexOf("/");
        let name = index == -1 ? path : path.substring(index + 1);
        let poolName = extName ? name + extName : name;

        if (!this.pool[poolName]) {
            this.pool[poolName] = new NodePool(name);
        }

        return BasePoolNode.generateNodeFromPool(this.pool[path], prefab, useCommon);
    }

    /**
     * 创建加载的预设node
     * @param name 加载的预设名字
     * @param extName 扩展名用来区分一种类型不同名字的对象池
     * @param useCommon 是否使用通用脚本
     */
    createPrefabNode(nameOrPrefab: string | Prefab, extName: string | number | null = null, useCommon: boolean = false) {
        let prefab: Prefab = typeof nameOrPrefab == "string" ? GameManager.RESOURCE.getPrefab(nameOrPrefab) : nameOrPrefab;

        if (!prefab) {
            console.error(`${(prefab as Prefab).name}未加载`);
            return null;
        }

        let poolName = extName ? prefab.name + extName : prefab.name;

        if (!this.pool[poolName]) {
            this.pool[poolName] = new NodePool(prefab.name);
        }

        return BasePoolNode.generateNodeFromPool(this.pool[poolName], prefab, useCommon);
    }

    /**
     * 帧动画特效节点,特效节点默认加入对象池
     * @param path 特效路径
     * @param loop 是否循环播放
     * @param completeCallback 播放完成调用回调
     */
    async createEffectNode(path: string, loop: boolean = false, completeCallback: Function | null = null) {
        let effectNode = await this.createPoolNode(path, null, true);
        if (!effectNode) {
            console.error("找不到特效节点", path);
            return null;
        }

        let animation = effectNode.getComponent(Animation);
        if (!animation) {
            console.error("找不到动画组件", path);
            effectNode.getComponent(BasePoolNode)?.remove();
            return null;
        }
        let clip = animation.defaultClip || animation.clips[0];
        if (clip) {
            clip.wrapMode = loop ? AnimationClip.WrapMode.Loop : AnimationClip.WrapMode.Normal;
            animation.play();
            if (completeCallback && !loop) {
                animation.on(
                    Animation.EventType.FINISHED,
                    () => {
                        completeCallback();
                        effectNode!.getComponent(BasePoolNode)?.remove();
                    },
                    null,
                    true
                );
            }
        } else {
            console.error("找不到动画片段", path);
        }

        return effectNode;
    }
}
