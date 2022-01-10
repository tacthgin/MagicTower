export abstract class LoadBase {
    /**
     * 按键值赋予模型数据
     * @param data 数据
     */
    protected loadData(data: object): void {
        for (let key in data) {
            let thisInfo = this as any;
            if (thisInfo[key] !== undefined) {
                thisInfo[key] = (data as any)[key];
            }
        }
    }
}
