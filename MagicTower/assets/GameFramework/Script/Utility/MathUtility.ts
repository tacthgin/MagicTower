export class MathUtility {
    /**
     * 数值截断
     * @param val 数值
     * @param min 最小值
     * @param max 最大值
     * @returns 截断后的数值
     */
    clamp(val: number, min: number, max: number) {
        if (min > max) {
            const temp = min;
            min = max;
            max = temp;
        }

        return val < min ? min : val > max ? max : val;
    }
}
