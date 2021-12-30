/**
 * 日期时间工具类
 */
export class DateUtility {
    /**
     * 根据时间戳，格式化文本 MM:dd hh:mm:ss
     * @param timestamp 时间戳
     * @param format 时间格式
     * @returns
     */
    format(timestamp: number, format: string): string {
        let date = new Date(timestamp);
        let dateFormat: { [key: string]: number } = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S+": date.getMilliseconds(),
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, `${date.getFullYear()}`.substring(4 - RegExp.$1.length));
        }
        for (let k in dateFormat) {
            if (new RegExp(`(${k})`).test(format)) {
                let dateStr = dateFormat[k].toString();
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? dateStr : `00${dateStr}`.substring(dateStr.length));
            }
        }
        return format;
    }

    /**
     * 根据时长，格式化文本 hh:mm:ss
     * @param interval 时长
     * @param format 时间格式
     * @returns
     */
    formatInterval(interval: number, format: string): string {
        let dateFormat: { [key: string]: number } = {
            "h+": Math.floor(interval / 3600),
            "m+": Math.floor((interval % 3600) / 60),
            "s+": interval % 60,
        };

        for (let k in dateFormat) {
            if (new RegExp(`(${k})`).test(format)) {
                let dateStr = dateFormat[k].toString();
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? dateStr : `00${dateStr}`.substring(dateStr.length));
            }
        }

        return format;
    }
}
