import { IRerference } from "../../Base/ReferencePool/IRerference";
import { ScheduleBase } from "../Base/ScheduleBase";

export abstract class SystemBase extends ScheduleBase implements IRerference {
    /**
     * 系统被分配的时候调用
     */
    awake(): void {}

    clear(): void {}
}
