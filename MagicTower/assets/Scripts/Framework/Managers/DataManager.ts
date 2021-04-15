import { js } from "cc";
import { JsonParser } from "../Base/JsonParser";
import { Fn } from "../Util/Fn";

export class DataManager {
    /** 存储json解析器 */
    private jsonParserMap: any = {};
    /** json对应的解析器 */
    private jsonToParser: any = null;
    /** 解析器对应的json名字 */
    private parserToJson: any = {};
    /** 自定义数据 */
    private customDataMap: any = {};
    /** json资源 */
    private jsonAssets: any = null;

    private getClassName(typeOrClassName: any) {
        if (typeof typeOrClassName != "string") {
            return js.getClassName(typeOrClassName);
        }
        return typeOrClassName;
    }

    /** 加载本地缓存 */
    loadLocalStorage() {
        if (localStorage.length > 0) {
            for (let i = 0; i < localStorage.length; ++i) {
                let key = localStorage.key(i);
                this.loadData(key, localStorage.getItem(key));
            }
        } else {
            for (let key in Fn.BASE_DATA_ASSEMBLE) {
                this.loadData(key, null);
            }
        }
    }

    loadJsonAssets(assets: any) {
        for (let name in this.jsonToParser) {
            this.setJson(name, assets[name]);
        }
        this.jsonAssets = assets;
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
    private setJson(name: string, json: object) {
        let parserName = this.jsonToParser[name];
        let parserClass = null;
        if (parserName) {
            this.parserToJson[parserName] = name;
            parserClass = js.getClassByName(parserName);
        } else {
            parserClass = JsonParser;
        }

        if (parserClass) {
            let parser: any = new parserClass();
            parser.parseJson(json);
            this.jsonParserMap[name] = parser;
        }
    }

    /**
     * 获取json资源
     * @param jsonName json名字
     * @param clone 默认为false，如果你需要操作json元素，clone一份
     */
    getJson(jsonName: string, clone: boolean = false) {
        let jsonParser = this.jsonParserMap[jsonName];
        if (jsonParser) {
            return jsonParser.getJson(clone);
        } else {
            return (clone ? Fn.clone(this.jsonAssets[jsonName]) : this.jsonAssets[jsonName]) || null;
        }
    }

    /**
     * 获取json元素
     * @param jsonName json名字
     * @param id 元素id或名字
     * @param clone 返回一个副本，不会直接操作json原本,默认不克隆
     */
    getJsonElement(jsonName: string, id: string | number, clone: boolean = false) {
        let jsonParser: JsonParser = this.jsonParserMap[jsonName];
        if (jsonParser) {
            return jsonParser.getJsonElement(id, clone);
        } else {
            let jsonData = this.jsonAssets[jsonName];
            if (jsonData) {
                return (clone ? Fn.clone(jsonData[id]) : jsonData[id]) || null;
            }
        }
        return null;
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
    loadData<T>(typeOrClassName: Fn.Constructor<T> | string, info: any): T {
        let data: any = this.getData(typeOrClassName);
        if (!data) {
            let className = this.getClassName(typeOrClassName);
            let dataClass = js.getClassByName(className);
            if (dataClass) {
                data = new dataClass();
                this.setData(className, data);
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
    setData(className: string, customData: any) {
        this.customDataMap[className] = customData;
    }

    /**
     * 获取自定义数据
     * @param typeOrClassName 构造函数或者类名
     */
    getData<T>(typeOrClassName: Fn.Constructor<T> | string): T | null {
        let className = this.getClassName(typeOrClassName);
        return this.customDataMap[className] || null;
    }
}
