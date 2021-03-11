import { _decorator, resources, SpriteAtlas, SpriteFrame, TiledMapAsset, sp, assetManager, JsonAsset } from "cc";
import { BaseEvent } from "../Constant/BaseEvent";
import { NotifyCenter } from "./NotifyCenter";

export enum ResourceType {
    JSON = "Json",
    SPRITE = "SPRITE",
    AUIDO = "AUDIO",
}

export class ResourceManager {
    /** 已经加载资源列表 */
    private loadedResources: any = {};

    /** 骨骼动画数据 */
    private skeletonDatas: any = {};

    /** tilemap数据 */
    private tilemaps: any = {};

    /** 精灵图集数据 */
    private spriteAtlas: any = {};

    /** 精灵帧数据 */
    private spriteFrames: any = {};

    /** 调用这个函数可以加载资源，自动判断资源有没有全部加载 */
    loadResources() {
        //加载本地资源
        let promiseArray: any[] = [];

        for (let type in ResourceType) {
            promiseArray.push(this.createResourcePromise(type));
        }

        if (promiseArray.length > 0) {
            //同时加载所有资源
            Promise.all(promiseArray)
                .then((results) => {
                    results.forEach((assetInfo) => {
                        if (assetInfo.loaded) {
                            //如果加载成功，进入加载列表
                            this.loadedResources[assetInfo.assetName] = assetInfo.loaded;
                        } else if (this.loadedResources[assetInfo.assetName]) {
                            //加载不成功移除加载列表
                            delete this.loadedResources[assetInfo.assetName];
                        }
                    });

                    NotifyCenter.emit(BaseEvent.ALL_RESOURCES_LOAD_SUCCESS);
                })
                .catch(() => {
                    BaseEvent.ALL_RESOURCES_LOAD_FAILED;
                });
        }
    }

    private createResourcePromise(type: string) {
        return new Promise((resolve, reject) => {
            if (resources.get(type)) {
                resolve(type);
            } else {
                resources.loadDir(
                    type,
                    JsonAsset,
                    (finished: number, total: number) => {
                        this.onProgress(type, finished / total);
                    },
                    (err, assets) => {
                        if (err) {
                            console.error(err);
                            reject(type);
                            return;
                        }

                        this.setAsset(type, assets);
                        resolve(type);
                    }
                );
            }
        });
    }

    private setAsset(type: string, assets: any) {}

    private onProgress(type: string, progress: number) {}

    releaseResDir(dir: string) {}

    getSpriteAtlas(name: string) {
        return this.spriteAtlas[name] || null;
    }

    getSpriteFrame(name: string) {
        return this.spriteFrames[name] || null;
    }

    getSkeletonData(name: string) {
        return this.skeletonDatas[name] || null;
    }
}
