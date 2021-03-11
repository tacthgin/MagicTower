import { js } from "cc";
import { CustomEventTarget } from "../Managers/NotifyCenter";

export abstract class BaseData extends CustomEventTarget {
    /** 需要缓存到本地的数据 */
    protected data: any = {};

    save() {
        let className = js.getClassName(this);
        localStorage.setItem(className, this.data);
    }
}
