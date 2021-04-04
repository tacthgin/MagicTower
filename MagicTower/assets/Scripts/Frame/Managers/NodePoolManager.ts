import { NodePool, Prefab, resources } from "cc";
import { BasePoolNode } from "../Base/BasePoolNode";

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
}
