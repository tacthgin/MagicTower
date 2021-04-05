import { js } from "cc";
import { CustomEventTarget } from "../Managers/NotifyCenter";

export abstract class BaseData extends CustomEventTarget {
    /** 需要缓存到本地的数据 */
    protected data: any = {};

    protected createProxy<T extends object>(data: T) {
        return new Proxy<T>(data, {
            set: (obj, prop, newval) => {
                obj[prop] = newval;
                this.save();
                return true;
            },
        });
    }

    abstract load(data: any): void;

    save() {
        let className = js.getClassName(this);
        localStorage.setItem(className, this.data);
    }
}
