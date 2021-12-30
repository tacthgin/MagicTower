// import { HttpClient } from "../Lib/HttpClient";

// export class NetManager {
//     private httpClient: HttpClient = null!;

//     constructor() {
//         this.httpClient = new HttpClient();
//     }

//     private httpGet(url: string, data: any, successCallback: Function) {
//         this.httpClient.get(url, data, successCallback, () => {
//             GameManager.UI.showToast("网络连接超时，请稍后再试");
//         });
//     }

//     a() {
//         this.httpGet("https://www.a123456.com", null, () => {});
//     }
// }
