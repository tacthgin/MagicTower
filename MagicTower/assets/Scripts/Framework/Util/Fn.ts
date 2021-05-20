import { js } from "cc";
import { DEBUG } from "cc/env";
import { BaseData } from "../Base/BaseData";

/** 功能模块 */
export module Fn {
    export type Constructor<T = unknown> = new (...args: any[]) => T;

    /** BaseData数据类集合 */
    export const BASE_DATA_ASSEMBLE: any = {};

    export function registerClass(className: string) {
        return function (target: any) {
            if (Object.getPrototypeOf(target) == BaseData) {
                BASE_DATA_ASSEMBLE[className] = target;
            }

            if (!js.getClassByName(className)) {
                js.setClassName(className, target);
            }
        };
    }

    export function clone(obj: Object | null | undefined): Object | null | undefined {
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            let copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            let copy = [];
            for (let i = 0, len = obj.length; i < len; ++i) {
                copy[i] = Fn.clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            let copy: any = {};
            for (let attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = Fn.clone((obj as any)[attr]);
            }

            return copy;
        }

        return null;
    }

    /** 打印堆栈 */
    export function printCallStack() {
        if (DEBUG) {
            try {
                throw new Error("");
            } catch (e) {
                console.log(e.stack);
            }
        }
    }
}
