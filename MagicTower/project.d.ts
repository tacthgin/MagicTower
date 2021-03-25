type Constructor<T = unknown> = new (...args: any[]) => T;

declare class DataManager {
    /**
     * 获取json资源
     * @param name json名字
     * @param clone 默认为false，如果你需要操作json元素，clone一份
     */
    getJson(name: string, clone: boolean): object;

    /**
     * 获取json元素
     * @param name json名字
     * @param id 元素id或名字
     * @param clone 返回一个副本，不会直接操作json原本,默认不克隆
     */
    getJsonElement(name: string, id: string | number, clone: boolean): object;

    /**
     * 如果解析器定制，直接操作解析器
     * @param name json解析器名字
     */
    getJsonParser(name: string): any;

    /**
     * 如果解析器定制，直接操作解析器
     * @param classConstructor json解析器构造
     */
    getJsonParser<T>(classConstructor: Constructor<T>): T | null;

    /**
     * 加载自定义数据
     * @param classConstructor 构造函数
     * @param info 数据
     */
    loadCustomData<T>(classConstructor: Constructor<T>, info: any): T | null;

    /**
     * 加载自定义数据
     * @param className 类名
     * @param info 数据
     */
    loadCustomData(className: string, info: any): any | null;

    getCustomData<T>(classConstructor: Constructor<T>): T | null;
    getCustomData(className: string): any | null;
}
