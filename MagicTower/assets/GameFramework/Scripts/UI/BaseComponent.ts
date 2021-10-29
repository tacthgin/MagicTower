import { Component, _decorator } from "cc";
const { ccclass } = _decorator;

/** 基类组件 */
@ccclass("BaseComponent")
export class BaseComponent extends Component {
    private sleepHandles: Function[] = [];

    protected sleep(second: number) {
        if (second < 0) {
            console.error("睡眠时间不能为负数");
            return;
        }
        return new Promise((resolve, reject) => {
            let func = () => {
                this.isValid ? resolve(true) : reject(false);
                let index = this.sleepHandles.indexOf(func);
                index != -1 && this.sleepHandles.splice(index, 1);
            };
            this.sleepHandles.push(func);
            this.scheduleOnce(func, second);
        });
    }

    protected clearSleepHandles() {
        this.sleepHandles.forEach((handle) => {
            this.unschedule(handle);
        });
        this.sleepHandles = [];
    }
}
