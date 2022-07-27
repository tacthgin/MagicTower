import { PlatformType } from "../PlatformType";

/**
 * 平台接口
 */
export interface IPlatform {
    initalize(): void;

    /**
     * 是否当前平台
     * @param platformType 平台类型
     * @returns 平台类型符合当前平台
     */
    isPlatform(platformType: PlatformType): boolean;
}

/**
 * 原生平台接口
 */
export interface INativePlatform extends IPlatform {
    /** 原生接口所在的类名 */
    readonly className: string;

    /**
     * 分享到微信
     * @param url 图片链接
     * @param title 标题
     * @param description 描述
     */
    shareWX(url: string, title: string, description?: string): void;

    /**
     * 分享到微信朋友圈
     * @param url 图片链接
     * @param title 标题
     */
    shareWXTimeLine(url: string, title: string): void;

    /**
     * 分享到QQ
     * @param url 图片链接
     * @param title 标题
     * @param description 描述
     */
    shareQQ(url: string, title: string, description?: string): void;
}

/**
 * 小游戏平台接口
 */
export interface IWebPlatform extends IPlatform {
    /**
     * 注册小游戏事件回调
     * @param eventName
     * @param callback
     */
    registerEvent(eventName: string, callback?: Function): void;

    /**
     * 短震动(15ms)
     */
    vibrateShort(): void;

    /**
     * 长震动(400ms)
     */
    vibrate(): void;

    /**
     * 授权
     * @param name 授权的名字
     * @param callback 授权后的回调函数
     */
    authorize(name: string, callback?: Function): void;

    /**
     * 播放广告
     * @param name 广告名字
     * @param callback 播放广告回调函数
     */
    showAd(name: string, callback?: Function): void;

    /**
     * 加载广告
     * @param name 广告名字
     * @param callback 加载成功或者失败回调函数
     */
    loadAd(name: string, callback?: Function): void;

    /**
     * 分享
     * @param title 分享标题
     * @param imageUrl 图片链接
     */
    shareAppMessage(title: string, imageUrl: string): void;

    /**
     * 展示菊花加载
     * @param content 加载的内容
     * @param mask 是否添加遮罩
     */
    showLoading(content?: string, mask?: boolean): void;

    /**
     * 隐藏菊花加载
     */
    hideLoading(): void;

    /**
     * 存储数据到云存档
     * @param saveName 存档名字
     * @param info 数据
     * @param failCallback 存档失败回调函数
     */
    setCloudInfo(saveName: string, info: any, failCallback?: Function): void;

    /**
     * 获取云存档
     * @param saveName 存档名字
     * @param callback 加载存档回调函数
     */
    getCloudInfo(saveName: string, callback?: Function): void;

    /**
     * 设置数据域数据
     * @param kvData 数据
     */
    setUserCloudStorage(kvData: any): void;

    /**
     * 数据域发送数据
     * @param content 数据
     */
    postMessage(content: string): void;
}
