import { IRerference } from "../../Base/ReferencePool/IRerference";

export abstract class SystemBase implements IRerference {
    abstract clear(): void;

    /**
     * 轮询系统
     * @param elapseSeconds 逻辑流逝时间
     */
    update(elapseSeconds: number): void {}
}
