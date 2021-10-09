import { assert } from "cc";

enum HttpMethodType {
    GET = "GET",
    POST = "POST",
}

export class HttpClient {
    /** 超时时间设置 */
    private readonly timeOut: number = 5000;
    /** 重新尝试次数 */
    private readonly retryCount: number = 2;
    /** url加密 */
    private readonly isUrlEncode: boolean = false;
    /** 重连次数表 */
    private reconnectMap: any = {};

    private method(method: HttpMethodType, url: string, data: any, successCallback: Function, failCallback: Function, headInfo: any = null) {
        if (!url) {
            console.error("url不合法", url);
            return;
        }
        assert(successCallback, "成功返回回调不能为空");
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState != XMLHttpRequest.DONE) return;
            if (xhr.status >= 200 && xhr.status < 300) {
                let res = null;
                try {
                    res = JSON.parse(xhr.response);
                } catch (error) {
                    console.error("json解析错误", xhr.response);
                    return;
                }
                successCallback(res);
            }
        };
        xhr.onerror = () => {
            console.error(Date.now(), "HTTP错误:", url);
            failCallback();
        };
        xhr.ontimeout = () => {
            console.error(Date.now(), "HTTP超时:", url);
            failCallback();
        };

        xhr.open(method, url, true);
        //附带头数据
        if (headInfo) {
            for (let key in headInfo) {
                xhr.setRequestHeader(key, headInfo[key]);
            }
        }
        xhr.timeout = this.timeOut;
        console.log(Date.now(), "HTTP发送:", url);
        xhr.send();
    }

    private packageData(url: string, data: any) {}

    get(url: string, data: any, successCallback: Function, failCallback: Function, headInfo: any = null) {
        let failFunc = () => {
            let connectInfo = this.reconnectMap[url];
            if (connectInfo == undefined) {
                failCallback && failCallback();
                connectInfo = this.reconnectMap[url] = { count: 0, timeID: 0 };
                //重连
                connectInfo.timeID = setTimeout(() => {
                    connectInfo.count += 1;
                }, 1000);
            } else if (this.reconnectMap[url] >= this.retryCount) {
                delete this.reconnectMap[url];
            } else {
            }
        };
        this.method(HttpMethodType.GET, url, data, successCallback, failFunc, headInfo);
    }

    post(url: string, data: any, successCallback: Function, failCallback: Function, headInfo: any = null) {
        this.method(HttpMethodType.POST, url, data, successCallback, failCallback, headInfo);
    }
}
