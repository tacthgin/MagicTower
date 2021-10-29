export class WXUtil {}

// import { GameEvent } from "../Constant/GameEvent";

// const AD_INFO = { a: 'adunit-38a5473745748ead' }

// export let WXUtil = {
//     init: function () {
//         this.initSetting()
//         this.listenEvent()
//     },

//     initSetting: function () {
//         //初始化云存储环境
//         wx.cloud.init({env: 'earth-pnljm'})

//         //展示菜单中的转发选项
//         wx.showShareMenu()

//         //更新分享菜单信息
//         wx.updateShareMenu({
//             withShareTicket: true,
//         })

//         //广告info
//         this.adInfo = {}
//     },

//     listenEvent: function () {
//         // 监听小游戏回到前台的事件
//         wx.onShow((res) => {
//             NotifyCenter.emit(GameEvent.ON_SHOW, res)
//         })

//         //隐藏到后台事件
//         wx.onHide((res) => {
//             NotifyCenter.emit(GameEvent.ON_HIDE)
//         })

//         // 内存警告
//         wx.onMemoryWarning(() => {
//             console.log('onMemoryWarningReceive')
//         })

//         //音频中断结束事件
//         wx.onAudioInterruptionEnd(() => {
//             NotifyCenter.emit(GameEvent.ON_AUDIO_INTERRUPTION_END)
//         })

//         //网络状态切换事件
//         wx.onNetworkStatusChange((res) => {
//             NotifyCenter.emit(GameEvent.ON_NETWORK_STATUS_CHANGE, res)
//         })
//     },

//     preloadAd: function () {
//         for (let adName in AD_INFO) {
//             this.loadAd(adName)
//         }
//     },

//     //短震动(15ms)
//     vibrateShort: function () {
//         wx.vibrateShort()
//     },

//     //长震动(400ms)
//     vibrateLong: function () {
//         wx.vibrateLong()
//     },

//     //授权
//     authorize: function (name, callback) {
//         wx.getSetting({
//             success(res) {
//                 if (!res.authSetting[name]) {
//                     wx.authorize({
//                         scope: name,
//                         success() {
//                             callback()
//                         }
//                     })
//                 }
//             }
//         })
//     },

//     //创建广告
//     createAd: function (name) {
//         let video = null
//         if (!this.adInfo[name]) {
//             video = wx.createRewardedVideoAd({ adUnitId: AD_INFO[name] })
//             if (video) {
//                 this.adInfo[name] = video
//             }
//         } else {
//             video = this.adInfo[name]
//         }
//         return video
//     },

//     //播放广告
//     showAd: function (name, callback) {
//         let video = this.createAd(name)
//         if (video) {
//             video.offError()
//             video.onError(err => {
//                 callback && callback({
//                     success: false
//                 })
//             })

//             video.offClose()
//             video.onClose(res => {
//                 callback && callback({
//                     success: true,
//                     isEnded: res && res.isEnded || res === undefined
//                 })
//             })

//             video.load().then(() => {
//                 video.show()
//             }).catch((res) => {
//                 console.log(res)
//                 callback && callback({
//                     success: false,
//                     noVideoCount: res.errMsg === 'no advertisement'
//                 })
//             })
//         } else {
//             callback && callback({
//                 success: false
//             })
//         }
//     },

//     //获取广告次数
//     loadAd: function (name, callback) {
//         let video = this.createAd(name)
//         if (video) {
//             video.onError((err) => {
//                 callback && callback({ success: false })
//             })

//             video.load().then(() => {
//                 callback && callback({ success: true })
//             }).catch(() => {
//                 callback && callback({ success: false })
//             })
//         } else {
//             callback && callback({ success: false })
//         }
//     },

//     //分享
//     shareAppMessage: function () {
//         wx.shareAppMessage({
//             title: '快来玩这游戏啊，好好玩哦',
//             imageUrl: 'share.jpg'
//         })
//     },

//     //菊花
//     showLoading: function (content) {
//         wx.showLoading({
//             title: content || '加载中',
//             mask: true
//         })
//     },

//     hideLoading: function () {
//         wx.hideLoading()
//     },

//     //存档数据
//     setCloudInfo: function (saveName, info, failCallback) {
//         const db = wx.cloud.database()
//         const c = db.collection(saveName)
//         c.where({ _openid: 'user-open-id' }).get({
//             success(res) {
//                 if (res.data.length == 0) {
//                     c.add({ data: { gameInfo: info }}).catch(res => {
//                         failCallback && failCallback()
//                     })
//                 }else {
//                     c.doc(res.data[0]._id).set({ data: { gameInfo: info }}).catch(res => {
//                         failCallback && failCallback()
//                     })
//                 }
//             }
//         })
//     },

//     //获取存档
//     getCloudInfo: function (saveName, callback) {
//         const db = wx.cloud.database()
//         const c = db.collection(saveName)
//         c.where({ _openid: 'user-open-id' }).get({
//             success(res) {
//                 if (res.data.length > 0) {
//                     c.doc(res.data[0]._id).get().then(res => {
//                         console.log('getinfo', res)
//                         callback && callback(res.data.gameInfo)
//                     }).catch(res => {
//                         callback && callback(null)
//                     })
//                 }else {
//                     callback && callback(null)
//                 }
//             }
//         })
//     },

//     //设置数据域数据
//     setUserCloudStorage: function (kvData) {
//         //kvData: [{key: 'level', value: 5}] or {key: 'level', value: 5}
//         wx.setUserCloudStorage({
//             KVDataList: (kvData instanceof Array) ? kvData : [kvData]
//         })
//     },

//     //向数据域发送数据
//     postMessage: function (content) {
//         wx.getOpenDataContext().postMessage({
//             message: content
//         })
//     },

//     //所有函数调用都通过这个接口
//     execute: function (funcName, ...rest) {
//         if (cc.sys.platform === cc.sys.WECHAT_GAME) {
//             let func = WXUtil[funcName]
//             func && func.apply(WXUtil, rest)
//         }
//     }
// }
