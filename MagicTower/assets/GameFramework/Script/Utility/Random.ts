/**
 * 随机工具类
 */
export class Random {
    /** 随机种子,默认为当前时间戳 */
    private _seed: number = Date.now();
    /** 使用系统的随机函数 */
    private _systemFlag: boolean = true;

    /**
     * 设置使用系统随机函数标志
     */
    set systemFlag(value: boolean) {
        this._systemFlag = value;
    }

    /**
     * 获取使用系统随机函数标志
     */
    get systemFlag(): boolean {
        return this._systemFlag;
    }

    /**
     * 创建随机数,如果设置了随机种子，使用自定义随机
     * @param systemFlag 设置使用系统的随机函数
     * @param seed 随机种子
     */
    static create(systemFlag: boolean = true, seed: number | null = null): Random {
        let random = new Random();
        random._systemFlag = systemFlag;
        if (seed !== null) {
            random.setSeed(seed);
        }
        return random;
    }

    /**
     * 设置随机种子
     * @param seed 种子
     */
    setSeed(seed: number): void {
        this._systemFlag = false;
        this._seed = seed;
    }

    /**
     * 获取随机数
     * @returns
     */
    getRandom(): number {
        return this._systemFlag ? Math.random() : this.internalGetSeedRandom();
    }

    /**
     * 任意数范围随机，这个值不小于 min（有可能等于），并且小于（不等于）max
     * @param min 最小值
     * @param max 最大值
     * @returns 随机到的任意数
     */
    random(min: number, max: number): number {
        return this.getRandom() * (max - min) + min;
    }

    /**
     * 整数范围随机，含最大值，含最小值
     * @param min 最小值
     * @param max 最大值
     * @returns 随机到的整数
     */
    randomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(this.getRandom() * (max - min + 1)) + min;
    }

    /**
     * 数组随机取一个值
     * @param array 任意数组
     * @returns 随机到的元素
     */
    randomArray<T>(array: T[]): T | null {
        if (array.length == 0) {
            return null;
        }
        return array[this.randomInt(0, array.length - 1)];
    }

    /**
     * 从数组中随机count个不同的元素
     * @param array 任意数组
     * @param count 随机个数
     * @returns 随机到的元素数组
     */
    randomArrayDifferences<T>(array: T[], count: number): T[] {
        if (array.length <= count) {
            return array;
        }

        let indexes: { [key: string]: number } = {};
        let randomIndexs: number[] = [];

        //交换尾部，随机头部部分
        let length = -1;
        while (randomIndexs.length < count) {
            length = array.length - randomIndexs.length;
            let index = Math.floor(this.getRandom() * length);
            randomIndexs.push(indexes[index] || index);
            indexes[index] = indexes[length - 1] || length - 1;
        }

        let result: T[] = [];
        for (let i = 0; i < randomIndexs.length; i++) {
            result[i] = array[randomIndexs[i]];
        }

        return result;
    }

    /**
     * 从概率数组中，随机一个 [0.1, 0.2, 0.1, 0.3, 0.2, 0.1]
     * @param array 概率数组
     * @returns 随机到的索引值，没有符合的索引返回-1
     */
    randomFromArray(array: number[]): number {
        let pro = this.getRandom();
        for (let i = 0; i < array.length; ++i) {
            if (pro <= array[i]) {
                return i;
            } else {
                pro -= array[i];
            }
        }
        return -1;
    }

    /**
     * 从概率字典中，随机一个 {"a": 0.1, "b": 0.6, "c": 0.3}
     * @param map 概率字典
     * @returns 随机到的key值，没有符合的key值，返回空字符串
     */
    randomFromMap(map: { [key: string]: number }): string {
        let pro = this.getRandom();
        for (let key in map) {
            if (pro <= map[key]) {
                return key;
            } else {
                pro -= map[key];
            }
        }
        return "";
    }

    /**
     * 根据随机种子获取随机数
     * @returns 随机数
     */
    private internalGetSeedRandom(): number {
        this._seed = (this._seed * 9301 + 49297) % 233280;
        return this._seed / 233280;
    }
}
