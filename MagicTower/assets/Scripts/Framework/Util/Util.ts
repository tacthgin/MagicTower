import { Vec2 } from "cc";

export class Util {
    static clamp(number: number, min: number, max: number) {
        return Math.max(min, Math.min(number, max));
    }

    static round10(number: number) {
        return Math.round(number * 10) / 10;
    }

    /** 得到圆上一个点 */
    static getPointOnCycle(rad: number, radius: number, center: Vec2 = Vec2.ZERO) {
        return new Vec2(1, 0).rotate(rad).multiplyScalar(radius).add(center);
    }

    /** 2个向量间的弧度 */
    static getVectorRad(l: Vec2, r: Vec2) {
        return Math.atan2(r.y - l.y, r.x - l.x);
    }

    /** 是不是浮点数 */
    static isFloat(n: number) {
        return n % 1 !== 0;
    }

    /** 得到小数点位数 */
    static getDecimalPointNum(n: number) {
        let array = n.toString().split(".");
        return array.length > 1 ? array[1].length : 0;
    }

    /** 整型的随机 */
    static randomInt(min: number, max: number) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    /** 所有数字类型的随机 */
    static random(min: number, max: number, precision: number = 0) {
        if (this.isFloat(min) || this.isFloat(max)) {
            precision = precision || Math.max(this.getDecimalPointNum(min), this.getDecimalPointNum(max));
            let multiple = Math.pow(10, precision);
            return this.randomInt(min * multiple, max * multiple) / multiple;
        }
        return this.randomInt(min, max);
    }

    /** 从数组中随机count个不重复 */
    static notRepeatRandom(array: number[], randomCount: number) {
        if (array.length < randomCount) return;
        let lastIndex = array.length - 1;
        let randomIndexs = [];
        while (randomIndexs.length < randomCount) {
            let value = this.random(0, lastIndex);
            while (randomIndexs.indexOf(value) != -1) {
                value = this.random(0, lastIndex);
            }
            randomIndexs.push(value);
        }

        for (let i = 0; i < randomIndexs.length; i++) {
            randomIndexs[i] = array[randomIndexs[i]];
        }

        return randomIndexs;
    }

    /** 从数组中随机一个值与传入值不相等 */
    static notRepeatRandomValue(array: number[], notRepeatValue: number) {
        let length = array.length - 1;
        if (length <= 0) return null;
        let value = null;
        do {
            value = array[this.random(0, length)];
        } while (value == notRepeatValue);

        return value;
    }

    /** 格式化数字12000->12K */
    static formatString(num: number, precision: number) {
        precision = precision || 1;
        const units = [
            { number: 1000000000, symbol: "B" },
            { number: 1000000, symbol: "M" },
            { number: 1000, symbol: "K" },
        ];
        for (let i = 0; i < units.length; i++) {
            if (num >= units[i].number) {
                return this.fixFloatPrecision(num / units[i].number, num % units[i].number === 0 ? 0 : precision) + units[i].symbol;
            }
        }

        return Math.floor(num).toString();
    }

    /** 调整精度 */
    static fixFloatPrecision(num: number, precision: number) {
        let multiple = Math.pow(10, precision);
        return Math.floor(num * multiple) / multiple;
    }

    /** precision 4 随机1到10000 */
    static getRandomProbability(probabilitys: number[] = [], defaultValue: number, precision: number) {
        let value = 0;
        if (precision) {
            let multiple = Math.pow(10, precision);
            value = this.randomInt(1, multiple) / multiple;
        } else {
            value = Math.random();
        }

        for (let i = 0; i < probabilitys.length; i++) {
            if (value <= probabilitys[i]) {
                return i;
            } else {
                value -= probabilitys[i];
            }
        }

        return defaultValue != undefined ? defaultValue : null;
    }

    /**
     * 格式化数字，宽度2为05、22，宽度3为005，021，100，默认宽度2
     * @param number 数字
     * @param width 宽度
     */
    static formatInt(number: number, width: number = 2) {
        for (let i = 2; i <= width; i++) {
            if (number < Math.pow(10, i - 1)) {
                let result = "";
                let j = i;
                while (j < width + 1) {
                    result += "0";
                    j++;
                }
                return result + number;
            }
        }

        return number.toString();
    }

    static formatInterval(timeInterval: number, format: string = "hms") {
        let hour = Math.floor(timeInterval / 3600);
        let minute = Math.floor((timeInterval % 3600) / 60);
        let second = Math.floor(timeInterval - hour * 3600 - minute * 60);
        if (format == "hms") {
            return `${this.formatInt(hour)}:${this.formatInt(minute)}:${this.formatInt(second)}`;
        } else if (format == "ms") {
            return `${this.formatInt(minute)}:${this.formatInt(second)}`;
        } else if (format == "hm") {
            return `${this.formatInt(hour)}:${this.formatInt(minute)}`;
        }
    }
}
