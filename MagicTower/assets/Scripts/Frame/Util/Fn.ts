import { js } from "cc";

/** 功能模块 */
export module Fn {
    export type Constructor<T = unknown> = new (...args: any[]) => T;

    export function registerClass(className: string) {
        return function (target: any) {
            js.setClassName(className, target);
        };
    }

    export function clone(json: object): object {
        if (null == json || "object" != typeof json) return json;

        // Handle Date
        if (json instanceof Date) {
            let copy = new Date();
            copy.setTime(json.getTime());
            return copy;
        }

        // Handle Array
        if (json instanceof Array) {
            let copy = [];
            for (let i = 0, len = json.length; i < len; ++i) {
                copy[i] = Fn.clone(json[i]);
            }
            return copy;
        }

        // Handle Object
        if (json instanceof Object) {
            let copy: any = {};
            for (let attr in json) {
                if (json.hasOwnProperty(attr)) copy[attr] = Fn.clone(json[attr]);
            }

            return copy;
        }

        return null;
    }
}
