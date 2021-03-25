import { js } from "cc";

export module Fn {
    export function registerClass(className: string) {
        return function (target: any) {
            js.setClassName(className, target);
        };
    }

    export type Constructor<T = unknown> = new (...args: any[]) => T;
}
