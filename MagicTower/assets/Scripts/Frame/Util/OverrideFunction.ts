import { js } from "cc";

export module OverrideFunction {
    export function registerClass(className: string) {
        return function (target: any) {
            js.setClassName(className, target);
        };
    }
}
