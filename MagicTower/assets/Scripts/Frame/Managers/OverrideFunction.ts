/** 重写一些方法和功能 */

import { _decorator, js } from "cc";

/**
 * 装饰器
 * 自定义类加入cocos类列表，使之可以通过js.getClassByName("Class")获取
 */
export function setClassName(className: string) {
    return function (target: any) {
        js.setClassName(className, target);
    };
}
