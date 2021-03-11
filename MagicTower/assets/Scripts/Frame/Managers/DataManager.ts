import { js } from "cc";

export class DataManager {
    /** 存储json解析器 */
    private jsonParserMap: any = {};

    /** json对应的解析器 */
    private parserMap: any = {};

    /** 自定义数据 */
    private customDataMap: any = {};

    constructor() {}

    loadLocalStorage() {
        localStorage.length;
    }

    /**
     * 设置自定义的解析器
     * @param parserMap
     */
    setParserMap(parserMap: any) {
        this.parserMap = parserMap || {};
    }

    /**
     * 导入json资源到解析器
     * @param name json名字
     * @param json json资源
     */
    setJson(name: string, json: object) {
        let parserClass = js.getClassByName(this.parserMap[name] || "JsonParser");
        if (parserClass) {
            let parser: any = new parserClass();
            parser.parseJson(json);
            this.jsonParserMap[name] = parser;
        }
    }

    /**
     * 获取json资源
     * @param name json名字
     * @param clone 默认为false，如果你需要操作json元素，clone一份
     */
    getJson(name: string, clone: boolean = false) {
        let jsonParser = this.jsonParserMap[name];
        return jsonParser ? jsonParser.getJson(clone) : null;
    }

    /**
     * 获取json元素
     * @param name json名字
     * @param id 元素id或名字
     * @param clone 返回一个副本，不会直接操作json原本,默认不克隆
     */
    getJsonElement(name: string, id: string | number, clone: boolean = false) {
        let jsonParser = this.jsonParserMap[name];
        return jsonParser ? jsonParser.getJsonElement(id, clone) : null;
    }

    /**
     * 如果解析器定制，直接操作解析器
     * @param name json解析器名字
     */
    getJsonParser(name: string) {
        return this.jsonParserMap[name] || null;
    }

    /**
     * 加载自定义数据
     * @param dataName 数据名字
     * @param info 数据
     */
    loadCustomData(dataName: string, info: any) {
        let data = this.getCustomData(dataName);
        if (!data) {
            let dataClass = js.getClassByName(dataName);
            if (dataClass) {
                data = new dataClass();
                this.setCustomData(dataName, data);
            }
        }
        data && data.load && data.load(info);
        return data;
    }

    /**
     * 缓存自定义数据到列表中
     * @param dataName 数据名字
     * @param customData 数据
     */
    setCustomData(dataName: string, customData: any) {
        this.customDataMap[dataName] = customData;
    }

    /**
     * 获取自定义数据
     * @param dataName 数据名字
     */
    getCustomData(dataName: string) {
        return this.customDataMap[dataName] || null;
    }
}
