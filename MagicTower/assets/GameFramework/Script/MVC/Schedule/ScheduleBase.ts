import { IScheduleBase } from "./IScheduleBase";
import { ScheduleManager } from "./ScheduleManager";

export class ScheduleBase implements IScheduleBase {
    private _isUpdate: boolean = false;

    set isUpdate(value: boolean) {
        this._isUpdate = value;
        if (this._isUpdate) {
            ScheduleManager.addToUpdatePool(this);
        } else {
            ScheduleManager.removeFromUpdatePool(this);
        }
    }

    /** 是否需要每帧更新 */
    get isUpdate(): boolean {
        return this._isUpdate;
    }

    clear(): void {
        this.unscheduleAll();
        this.isUpdate = false;
    }

    /**
     * 开启定时器
     * @param handler 回调函数
     * @param interval 定时器间隔
     * @param count 定时个数,默认为无限大
     * @param priority 定时器优先级
     */
    schedule(handler: Function, interval: number, count: number = Number.MAX_SAFE_INTEGER, priority: number = 0): void {
        ScheduleManager.schedule(handler, this, interval, count, priority);
    }

    /**
     * 开启一次定时器
     * @param handler 回调函数
     * @param interval 定时器间隔
     * @param priority 定时器优先级
     */
    scheduleOnce(handler: Function, interval: number, priority: number = 0): void {
        this.schedule(handler, interval, 1, priority);
    }

    /**
     * 取消定时器
     * @param handler 回调函数
     */
    unschedule(handler: Function): void {
        ScheduleManager.unschedule(handler, this);
    }

    /**
     * 取消所有定时器
     */
    unscheduleAll(): void {
        ScheduleManager.unscheduleAll(this);
    }

    /**
     * 轮询定时器
     * @param elapseSeconds 逻辑流逝时间
     */
    update(elapseSeconds: number): void {}
}
