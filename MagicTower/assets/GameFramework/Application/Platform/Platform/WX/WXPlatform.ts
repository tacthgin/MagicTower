import { GameFrameworkError } from "../../../../Script/Base/GameFrameworkError";
import { PlatformBase } from "../PlatformBase";
import { IWXPlatform } from "./IWXPlatform";

declare const wx: any;

/**
 * 微信平台
 */
export class WXPlatform extends PlatformBase implements IWXPlatform {
    /** 广告名字对应的video数据 */
    private readonly _adInfo: { [name: string]: any } = {};
    /** 广告配置数据 */
    private readonly _adSettingInfo: Readonly<{ [name: string]: string }> = {};

    initalize(): void {
        //展示菜单中的转发选项
        wx.showShareMenu();

        //更新分享菜单信息
        wx.updateShareMenu({
            withShareTicket: true,
        });
    }

    /**
     * 注册微信小游戏事件回调
     * @param eventName
     * @param callback
     */
    registerEvent(eventName: string, callback?: Function): void {
        // // 监听小游戏回到前台的事件
        // wx.onShow((res: any) => {});
        // //隐藏到后台事件
        // wx.onHide((res: any) => {});
        // // 内存警告
        // wx.onMemoryWarning(() => {
        //     console.log("onMemoryWarningReceive");
        // });
        // //音频中断结束事件
        // wx.onAudioInterruptionEnd(() => {});
        // //网络状态切换事件
        // wx.onNetworkStatusChange((res: any) => {});
        let func = wx[eventName];
        if (func && func instanceof Function) {
            func((res: any) => {
                this.executeCallback(res, callback);
            });
        } else {
            throw new GameFrameworkError("wx register function is invalid");
        }
    }

    /**
     * 短震动(15ms)
     */
    vibrateShort(): void {
        wx.vibrateShort();
    }

    /**
     * 长震动(400ms)
     */
    vibrate(): void {
        wx.vibrateLong();
    }

    /**
     * 授权
     * @param name 授权的名字
     * @param callback 授权后的回调函数
     */
    authorize(name: string, callback?: Function): void {
        wx.getSetting({
            success(res: any): void {
                if (!res.authSetting[name]) {
                    wx.authorize({
                        scope: name,
                        success(): void {
                            callback && callback();
                        },
                    });
                }
            },
        });
    }

    /**
     * 播放广告
     * @param name 广告名字
     * @param callback 播放广告回调函数
     */
    showAd(name: string, callback?: Function): void {
        let video = this.createAd(name);
        if (!video) {
            this.executeCallback({ success: false }, callback);
        }
        video.offError();
        video.onError((err: any) => {
            this.executeCallback({ success: false }, callback);
        });

        video.offClose();
        video.onClose((res: any) => {
            this.executeCallback(
                {
                    success: true,
                    isEnded: (res && res.isEnded) || res === undefined,
                },
                callback
            );
        });

        video
            .load()
            .then(() => {
                video.show();
            })
            .catch((res: any) => {
                this.executeCallback(
                    {
                        success: false,
                        noVideoCount: res.errMsg === "no advertisement",
                    },
                    callback
                );
            });
    }

    /**
     * 加载广告
     * @param name 广告名字
     * @param callback 加载成功或者失败回调函数
     */
    loadAd(name: string, callback?: Function): void {
        let video = this.createAd(name);
        if (video) {
            video.onError((err: any) => {
                this.executeCallback({ success: false }, callback);
            });

            video
                .load()
                .then(() => {
                    this.executeCallback({ success: true }, callback);
                })
                .catch(() => {
                    this.executeCallback({ success: false }, callback);
                });
        } else {
            this.executeCallback({ success: false }, callback);
        }
    }

    /**
     * 分享
     * @param title 分享标题
     * @param imageUrl 图片链接
     */
    shareAppMessage(title: string, imageUrl: string): void {
        wx.shareAppMessage({
            title: title,
            imageUrl: imageUrl,
        });
    }

    /**
     * 展示菊花加载
     * @param content 加载的内容
     * @param mask 是否添加遮罩
     */
    showLoading(content: string = "加载中", mask: boolean = true): void {
        wx.showLoading({
            title: content,
            mask: mask,
        });
    }

    /**
     * 隐藏菊花加载
     */
    hideLoading(): void {
        wx.hideLoading();
    }

    /**
     * 存储数据到云存档
     * @param saveName 存档名字
     * @param info 数据
     * @param failCallback 存档失败回调函数
     */
    setCloudInfo(saveName: string, info: any, failCallback?: Function): void {
        const db = wx.cloud.database();
        const c = db.collection(saveName);
        c.where({ _openid: "user-open-id" }).get({
            success(res: any) {
                if (res.data.length == 0) {
                    c.add({ data: { gameInfo: info } }).catch((res: any) => {
                        failCallback && failCallback();
                    });
                } else {
                    c.doc(res.data[0]._id)
                        .set({ data: { gameInfo: info } })
                        .catch((res: any) => {
                            failCallback && failCallback();
                        });
                }
            },
        });
    }

    /**
     * 获取云存档
     * @param saveName 存档名字
     * @param callback 加载存档回调函数
     */
    getCloudInfo(saveName: string, callback?: Function): void {
        const db = wx.cloud.database();
        const c = db.collection(saveName);
        c.where({ _openid: "user-open-id" }).get({
            success(res: any) {
                if (res.data.length > 0) {
                    c.doc(res.data[0]._id)
                        .get()
                        .then((res: any) => {
                            console.log("getinfo", res);
                            callback && callback(res.data.gameInfo);
                        })
                        .catch((res: any) => {
                            callback && callback(null);
                        });
                } else {
                    callback && callback(null);
                }
            },
        });
    }

    /**
     * 设置数据域数据
     * @param kvData 数据
     */
    setUserCloudStorage(kvData: any): void {
        //kvData: [{key: 'level', value: 5}] or {key: 'level', value: 5}
        wx.setUserCloudStorage({
            KVDataList: kvData instanceof Array ? kvData : [kvData],
        });
    }

    /**
     * 数据域发送数据
     * @param content 数据
     */
    postMessage(content: string): void {
        wx.getOpenDataContext().postMessage({
            message: content,
        });
    }

    /**
     * 预加载所有广告
     */
    private preloadAd(): void {
        for (let adName in this._adInfo) {
            this.loadAd(adName);
        }
    }

    /**
     * 创建广告
     * @param name 广告名字
     * @returns 广告
     */
    private createAd(name: string): any {
        let video = null;
        if (!this._adInfo[name]) {
            video = wx.createRewardedVideoAd({ adUnitId: this._adSettingInfo[name] });
            if (video) {
                this._adInfo[name] = video;
            }
        } else {
            video = this._adInfo[name];
        }
        return video;
    }

    /**
     * 执行回调函数
     * @param data 数据
     * @param callback 回调函数
     */
    private executeCallback(data: any, callback?: Function): void {
        callback && callback(data);
    }
}
