import { js } from "cc";
import JsonParser from "../Base/JsonParser";
import { Fn } from "../Util/Fn";

export class DataManager {
    /** 存储json解析器 */
    private jsonParserMap: any = {};
    /** json对应的解析器 */
    private jsonToParser: any = {};
    /** 解析器对应的json名字 */
    private parserToJson: any = {};
    /** 自定义数据 */
    private customDataMap: any = {};

    private getClassName(typeOrClassName: any) {
        if (typeof typeOrClassName != "string") {
            return js.getClassName(typeOrClassName);
        }
        return typeOrClassName;
    }

    private loadLocalStorage() {
        for (let i = 0; i < localStorage.length; ++i) {
            let key = localStorage.key(i);
            this.loadCustomData(key, localStorage.getItem(key));
        }
    }

    init() {
        this.loadLocalStorage();
        return this;
    }

    /**
     * 设置自定义的解析器
     * @param jsonToParser
     */
    setParserMap(jsonToParser: any) {
        this.jsonToParser = jsonToParser || {};
    }

    /**
     * 导入json资源到解析器
     * @param name json名字
     * @param json json资源
     */
    setJson(name: string, json: object) {
        let parserName = this.jsonToParser[name];
        if (parserName) {
            this.parserToJson[parserName] = name;
        } else {
            parserName = "JsonParser";
        }
        let parserClass = js.getClassByName(parserName);
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
     * @param typeOrClassName json名字或者parser构造
     */
    getJsonParser<T extends JsonParser>(typeOrClassName: Fn.Constructor<T> | string): T | null {
        let name = null;
        if (typeof typeOrClassName != "string") {
            name = this.parserToJson[js.getClassName(typeOrClassName)];
        } else {
            name = typeOrClassName;
        }
        return this.jsonParserMap[name] || null;
    }

    /**
     * 加载自定义数据
     * @param typeOrClassName 数据名字或者构造函数
     * @param info 数据
     */
    loadCustomData<T>(typeOrClassName: Fn.Constructor<T> | string, info: any): T {
        let data: any = this.getCustomData(typeOrClassName);
        if (!data) {
            let className = this.getClassName(typeOrClassName);
            let dataClass = js.getClassByName(className);
            if (dataClass) {
                data = new dataClass();
                this.setCustomData(className, data);
            }
        }
        data && data.load && data.load(info);
        return data;
    }

    /**
     * 缓存自定义数据到列表中
     * @param className 数据名字
     * @param customData 数据
     */
    setCustomData(className: string, customData: any) {
        this.customDataMap[className] = customData;
    }

    /**
     * 获取自定义数据
     * @param typeOrClassName 构造函数或者类名
     */
    getCustomData<T>(typeOrClassName: Fn.Constructor<T> | string): T | null {
        let className = this.getClassName(typeOrClassName);
        return this.customDataMap[className] || null;
    }
}
