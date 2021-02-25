import { _decorator, resources, SpriteAtlas, SpriteFrame, TiledMapAsset, sp, assetManager, JsonAsset } from "cc";
import { BaseEvent } from "../Constant/BaseEvent";

import { DataManager } from "./DataManager";
import { NotifyCenter } from "./NotifyCenter";

const JSON_RES = "Json";
const SPRITE_RES = "Sprites";
const SOUND_RES = "Sounds";
const SPINE_RES = "Spine";
const TILEMAP_RES = "Map";

class _ResourceManager {
    /** 需要加载的资源列表 */
    private resoucesPromises: any = {
        JSON_RES: this.getJsonPromise,
        SPRITE_RES: this.getSpritePromise,
        SOUND_RES: this.getSoundPromise,
    };

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
        let promiseArray = [];
        for (let assetName in this.resoucesPromises) {
            if (!this.loadedResources[assetName]) {
                promiseArray.push(this.resoucesPromises[assetName].call(this));
            }
        }

        if (promiseArray.length > 0) {
            //同时加载所有资源
            Promise.all(promiseArray).then((results) => {
                results.forEach((assetInfo) => {
                    if (assetInfo.loaded) {
                        //如果加载成功，进入加载列表
                        this.loadedResources[assetInfo.assetName] = assetInfo.loaded;
                    } else if (this.loadedResources[assetInfo.assetName]) {
                        //加载不成功移除加载列表
                        delete this.loadedResources[assetInfo.assetName];
                    }
                });

                NotifyCenter.emit(this.isResourcesLoaded() ? BaseEvent.ALL_RESOURCES_LOAD_SUCCESS : BaseEvent.ALL_RESOURCES_LOAD_FAILED);
            });
        }
    }

    getJsonPromise() {
        return new Promise((resolve) => {
            resources.loadDir(JSON_RES, JsonAsset, (err, jsonAssets) => {
                if (err) {
                    console.error(err);
                    resolve({ assetName: JSON_RES, loaded: false });
                    return;
                }

                jsonAssets.forEach((jsonAsset) => {
                    DataManager.setJson(jsonAsset.name, jsonAsset);
                });
                resolve({ assetName: JSON_RES, loaded: true });
            });
        });
    }

    getSpritePromise() {
        return new Promise((resolve, reject) => {
            resources.loadDir(SPRITE_RES, (err, assets) => {
                if (err) {
                    console.error(err);
                    resolve({ assetName: SPRITE_RES, loaded: false });
                    return;
                }

                assets.forEach((asset) => {
                    if (asset instanceof SpriteAtlas) {
                        this.spriteAtlas[asset.name.substring(0, asset.name.indexOf(".plist"))] = asset;
                    } else if (asset instanceof SpriteFrame) {
                        this.spriteFrames[asset.name] = asset;
                    }
                });

                resolve({ assetName: SPRITE_RES, loaded: true });
            });
        });
    }

    getSoundPromise() {
        return new Promise((resolve) => {
            resources.loadDir(SOUND_RES, (err, asset) => {
                if (err) {
                    console.error(err);
                    resolve({ assetName: SOUND_RES, loaded: false });
                    return;
                }

                resolve({ assetName: SOUND_RES, loaded: true });
            });
        });
    }

    getSpinePromise() {
        return new Promise((resolve) => {
            resources.loadDir(SPINE_RES, sp.SkeletonData, (err, assets) => {
                if (err) {
                    console.error(err);
                    resolve({ assetName: SPINE_RES, loaded: false });
                    return;
                }

                assets.forEach((sd) => {
                    this.skeletonDatas[sd.name] = sd;
                });

                resolve({ assetName: SPINE_RES, loaded: true });
            });
        });
    }

    getTileMapPromise() {
        return new Promise((resolve) => {
            resources.loadDir(TILEMAP_RES, TiledMapAsset, (err, assets) => {
                if (err) {
                    console.error(err);
                    resolve({ assetName: TILEMAP_RES, loaded: false });
                    return;
                }

                assets.forEach((map) => {
                    this.tilemaps[map.name] = map;
                });

                resolve({ assetName: TILEMAP_RES, loaded: true });
            });
        });
    }

    loadSubpackage() {
        let subNames = ["ResourceSprite"];
        let promises = [];
        for (let i = 0; i < subNames.length; i++) {
            promises.push(
                new Promise((resolve, reject) => {
                    assetManager.loadBundle(subNames[i], function (err) {
                        if (err) {
                            console.error(err);
                            reject({ assetName: subNames[i], loaded: false });
                            return;
                        }
                        resolve({ assetName: subNames[i], loaded: true });
                    });
                })
            );
        }

        Promise.all(promises)
            .then((results) => {
                this.loadResources();
            })
            .catch((result) => {
                NotifyCenter.emit(BaseEvent.ALL_RESOURCES_LOAD_FAILED);
            });
    }

    isResourcesLoaded() {
        return Object.keys(this.loadedResources).length == Object.keys(this.resoucesPromises).length;
    }

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

export let ResourceManager = new _ResourceManager();
