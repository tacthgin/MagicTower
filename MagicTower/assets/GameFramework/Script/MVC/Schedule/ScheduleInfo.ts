import { IRerference } from "../../Base/ReferencePool/IRerference";
import { ReferencePool } from "../../Base/ReferencePool/ReferencePool";
import { IScheduleBase } from "./IScheduleBase";

/**
 * 定时器数据
 */
export class ScheduleInfo implements IRerference {
    private _handler: Function = null!;
    private _target: IScheduleBase = null!;
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

    get target(): IScheduleBase {
        return this._target;
    }

    static create(handler: Function, thisArg: IScheduleBase, interval: number, scheduleCount: number, priority: number): ScheduleInfo {
        let scheduleInfo = ReferencePool.acquire(ScheduleInfo);
        scheduleInfo._handler = handler;
        scheduleInfo._target = thisArg;
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
            this._handler.call(this._target);
        } else if (this._scheduleCount > 0) {
            this._totalSeconds += elapseSeconds;
            if (this._totalSeconds >= this._interval) {
                this._totalSeconds -= this._interval;
                this._handler.call(this._target);
                --this._scheduleCount;
            }
        }
    }

    clear(): void {
        this._handler = null!;
        this._target = null!;
        this._interval = 0;
        this._scheduleCount = 0;
        this._totalSeconds = 0;
        this._priority = 0;
        this._forever = false;
    }
}
