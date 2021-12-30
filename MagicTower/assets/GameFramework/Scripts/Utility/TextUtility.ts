export class TextUtility {
    readonly EPSILON: number = 0.000001;
    /** 数字单位配置表 */
    private readonly unitConfig = { system: 1000, units: ["K", "M", "B"] };

    /**
     * 设置单位配置
     * @param system 进制
     * @param units 单位数组
     */
    setUnitConfig(system: number, units: string[]): void {
        this.unitConfig.system = system;
        this.unitConfig.units = units;
    }

    /**
     * 同Math.toFixed，只不过没有四舍五入，只有截断
     * @param num 数字
     * @param precision 小数点后保留几位
     * @returns
     */
    toFixed(num: number, precision: number): string {
        let value = Math.pow(10, precision);
        let result: number = Math.floor(value * num) / value;
        return result.toString();
    }

    /**
     * 格式化数字，宽度2为05、22，宽度3为005，021，100，默认宽度2
     * @param num 数字
     * @param width 宽度
     * @returns
     */
    formatNumberWidth(num: number, width: number = 2): string {
        let zeroArray = new Array(width).fill(0);
        let format = `${zeroArray.join("")}${num}`;
        return format.substring(num.toString().length);
    }

    /**
     * 格式化数字，加上单位
     * @param num 数字
     * @param precision 小数点后保留几位
     * @returns 格式化后的“数字+单位”
     */
    formatNumberUnit(num: number, precision: number = 2): string {
        //进制
        let system = this.unitConfig.system;
        if (system <= 0) {
            return "";
        }

        let symbol = num < 0 ? "-" : "";

        num = Math.abs(num);
        let value = Math.log(num) / Math.log(system);
        let index = Math.round(value);
        if (Math.abs(value - index) > this.EPSILON) {
            index = Math.floor(value);
        }

        if (index == 0) {
            return symbol + this.toFixed(num, precision);
        } else {
            let units = this.unitConfig.units;
            let unit = index > units.length ? units[units.length - 1] : units[index - 1];
            return `${symbol}${this.toFixed(num / Math.pow(1000, index), precision)}${unit}`;
        }
    }
}
