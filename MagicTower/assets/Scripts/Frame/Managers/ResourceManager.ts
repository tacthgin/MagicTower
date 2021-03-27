import { Asset, assetManager, AudioClip, JsonAsset, resources, SpriteFrame } from "cc";
import { BaseEvent } from "../Constant/BaseEvent";
import { NotifyCenter } from "./NotifyCenter";

export enum ResourceType {
    JSON = "Json",
    SPRITE = "Sprite",
    AUIDO = "Audio",
}

export class ResourceManager {
    /** 所有类型资源 */
    private assets: any = {};
    private resourcePromises: Promise<any>[] = [];
    private resourceAssetConfig: any = {
        [ResourceType.JSON]: JsonAsset,
        [ResourceType.SPRITE]: SpriteFrame,
        [ResourceType.AUIDO]: AudioClip,
    };

    init() {
        for (let type in ResourceType) {
            this.resourcePromises.push(this.createResourcePromise(type));
        }
        return this;
    }

    loadResources() {
        if (this.resourcePromises.length > 0) {
            Promise.all(this.resourcePromises)
                .then((results) => {
                    NotifyCenter.emit(BaseEvent.ALL_RESOURCES_LOAD_SUCCESS);
                })
                .catch((type: ResourceType) => {
                    console.error(`加载资源类型${type}失败`);
                    BaseEvent.ALL_RESOURCES_LOAD_FAILED;
                });
        }
    }

    private createResourcePromise(type: string) {
        let dirName = ResourceType[type];
        return new Promise((resolve, reject) => {
            if (resources.get(dirName)) {
                resolve(type);
            } else {
                resources.loadDir(
                    dirName,
                    this.resourceAssetConfig[type],
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

    private setAsset(type: string, assets: any) {
        this.assets[type] = assets;
    }

    private onProgress(type: string, progress: number) {
        NotifyCenter.emit(BaseEvent.RESOURCE_PROGRESS, type, progress);
    }

    releaseResDir(type: ResourceType) {
        let assets = this.assets[type];
        if (assets) {
            assets.forEach((asset: Asset) => {
                assetManager.releaseAsset(asset);
            });
        }
    }

    getAsset(type: ResourceType) {
        return this.assets[type] || null;
    }
}
