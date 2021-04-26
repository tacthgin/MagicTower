import { js, ValueType } from "cc";
import { CustomEventTarget } from "../Managers/NotifyCenter";

export abstract class BaseData extends CustomEventTarget {
    /** 需要缓存到本地的数据 */
    protected data: any = {};

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

    /** 加载数据入口 */
    abstract load(data: any): void;

    /** 按key赋值 */
    protected loadData(data: any) {
        for (let key in data) {
            this.data[key] = data[key];
        }
    }

    protected save() {
        let className = js.getClassName(this);
        localStorage.setItem(className, JSON.stringify(this.data));
    }

    set(key: string, value: any) {
        this.data[key] = value;
    }

    get(key: string) {
        return this.data[key];
    }
}
