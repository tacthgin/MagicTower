import { ScheduleBase } from "../Schedule/ScheduleBase";

export abstract class SystemBase extends ScheduleBase {
    /**
     * 系统被分配的时候调用
     */
    awake(): void {}

    clear(): void {}
}
