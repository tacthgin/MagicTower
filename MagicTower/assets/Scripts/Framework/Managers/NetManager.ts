/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// import { DataManager } from "./DataManager";
// import { NotifyCenter } from "./NotifyCenter";
// import { GameEvent } from "../Constant/GameEvent";
// import { GameManager } from "./GameManager";
//
// // export const REQUEST_URL = "http://game.hexagon.test.okecloud.cn";
// export const REQUEST_URL = "https://game.hexagon.okecloud.cn";
//
// class _NetManager {
//     private requestHttp(info) {
//         let xhr = new XMLHttpRequest();
//         xhr.onreadystatechange = () => {
//             if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
//                 //cc.log(xhr.responseText);
//                 info.callback && info.callback(JSON.parse(xhr.responseText));
//             }
//         };
//         let method = info.method || "GET";
//
//         xhr.open(method, info.url, true);
//         if (method == "GET") {
//             xhr.send();
//         } else if (method == "POST") {
//             xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
//             xhr.send(info.data);
//         }
//     }
//
//     //自定义请求
//     requestRank(type: number) {
//         let openid = DataManager.getCustomData("GameInfo").OpenId;
//         this.requestHttp({
//             url: `${REQUEST_URL}/score-record/list?openid=${openid}&type=${type}`,
//             callback: (response) => {
//                 if (response.code == 0) {
//                     let data = response.data;
//                     let name = ["TodayRank", "HistoryRank", "ScoreRank"][parseInt(data.type) - 1];
//                     DataManager.setCustomData(name, data.rows);
//                     let event = {
//                         TodayRank: GameEvent.TODAY_RANK,
//                         HistoryRank: GameEvent.HISTORY_RANK,
//                         ScoreRank: GameEvent.SCORE_RANK,
//                     };
//                     NotifyCenter.emit(event[name]);
//                 } else {
//                     GameManager.getInstance().showToast("暂无数据");
//                 }
//             },
//         });
//     }
//
//     reportUserInfo(userInfo) {
//         let openid = DataManager.getCustomData("GameInfo").OpenId;
//         this.requestHttp({
//             url: `${REQUEST_URL}/user/save`,
//             data: `openid=${openid}&avatar=${userInfo.avatarUrl}&nickname=${userInfo.nickName}`,
//             method: "POST",
//             callback: (response) => {},
//         });
//     }
//
//     reportScore(score: number) {
//         let openid = DataManager.getCustomData("GameInfo").OpenId;
//         this.requestHttp({
//             url: `${REQUEST_URL}/score-record/save`,
//             data: `openid=${openid}&score=${score}`,
//             method: "POST",
//             callback: (response) => {},
//         });
//     }
// }
//
// export let NetManager = new _NetManager();
