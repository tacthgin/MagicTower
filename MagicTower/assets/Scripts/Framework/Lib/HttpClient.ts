export class HttpClient {
    /** 超时时间设置 */
    private readonly timeOut: number = 5000;
    /** 重新尝试次数 */
    private readonly retryCount: number = 2;

    get() {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == XMLHttpRequest.DONE) {
            }
        };
        xhr.open("GET", "https://www.baidu.com", true);
        xhr.send();
    }
}
