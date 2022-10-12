import { IRerference } from "../../Base/ReferencePool/IRerference";

export interface IScheduleBase extends IRerference {
    /**
     * 轮询定时器
     * @param elapseSeconds 逻辑流逝时间
     */
    update(elapseSeconds: number): void;
}
