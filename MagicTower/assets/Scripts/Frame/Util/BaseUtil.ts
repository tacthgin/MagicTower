import { js } from "cc";

export class BaseUtil {
    static registerClass(className: string) {
        return function (target: any) {
            js.setClassName(className, target);
        };
    }
}
