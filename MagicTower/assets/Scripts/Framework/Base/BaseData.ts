import { js } from "cc";
import { CustomEventTarget } from "../Managers/NotifyCenter";

/** 存储本地数据基类 */
export abstract class BaseData extends CustomEventTarget {
    /** 需要缓存到本地的数据 */
    protected data: any = {};

    /** 加载数据入口 */
    abstract load(data: any): void;

    /** data设置代理，给数据赋值自动保存 */
    protected setProxy<T extends object>() {
        this.data = new Proxy<T>(this.data, {
            set: (obj, prop, newval) => {
                obj[prop] = newval;
                this.save();
                return true;
            },
        });
    }

    /** 按key赋值 */
    protected loadData(data: any) {
        for (let key in data) {
            this.data[key] = data[key];
        }
    }

    save() {
        let className = js.getClassName(this);
        localStorage.setItem(className, JSON.stringify(this.data));
    }

    /** data成员变量赋值 */
    set(key: string, value: any) {
        this.data[key] = value;
    }

    get(key: string) {
        return this.data[key];
    }
}

/** 加载数据基类 */
export abstract class BaseLoadData {
    load(data: any) {
        this.loadData(data);
    }

    /** 按key赋值 */
    protected loadData(data: any) {
        for (let key in data) {
            this[key] = data[key];
        }
    }
}
