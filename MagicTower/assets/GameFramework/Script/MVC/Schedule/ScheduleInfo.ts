import { IRerference } from "../../Base/ReferencePool/IRerference";
import { ReferencePool } from "../../Base/ReferencePool/ReferencePool";

/**
 * 定时器数据
 */
export class ScheduleInfo implements IRerference {
    private _handler: Function = null!;
    private _thisArg: any = undefined;
    private _interval: number = 0;
    private _scheduleCount: number = 0;
    private _totalSeconds: number = 0;
    private _priority: number = 0;
    private _forever: boolean = false;

    get priority(): number {
        return this._priority;
    }

    get handler(): Function {
        return this._handler;
    }

    static create(handler: Function, thisArg: any, interval: number, scheduleCount: number, priority: number): ScheduleInfo {
        let scheduleInfo = ReferencePool.acquire(ScheduleInfo);
        scheduleInfo._handler = handler;
        scheduleInfo._thisArg = thisArg;
        scheduleInfo._interval = interval;
        scheduleInfo._scheduleCount = scheduleCount;
        scheduleInfo._priority = priority;
        scheduleInfo._forever = scheduleCount === Number.MAX_SAFE_INTEGER;
        return scheduleInfo;
    }

    isStoped(): boolean {
        return this._scheduleCount <= 0;
    }

    update(elapseSeconds: number): void {
        if (this._forever) {
            this._handler.call(this._thisArg);
        } else if (this._scheduleCount > 0) {
            this._totalSeconds += elapseSeconds;
            if (this._totalSeconds >= this._interval) {
                this._totalSeconds -= this._interval;
                this._handler.call(this._thisArg);
                --this._scheduleCount;
            }
        }
    }

    clear(): void {
        this._handler = null!;
        this._thisArg = undefined;
        this._interval = 0;
        this._scheduleCount = 0;
        this._totalSeconds = 0;
        this._priority = 0;
        this._forever = false;
    }
}
