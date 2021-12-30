import { Constructor } from "../Base/DataStruct/Constructor";
import { Fsm } from "./Fsm";
import { IFsm } from "./IFsm";

export abstract class FsmState<T extends Constructor<T>> {
    onInit(fsm: IFsm<T>): void {}

    onEnter(fsm: IFsm<T>): void {}

    onUpdate(fsm: IFsm<T>, elapseSeconds: number): void {}

    onLeave(fsm: IFsm<T>, isShutDown: boolean): void {}

    onDestroy(fsm: IFsm<T>): void {}

    changeState(fsm: IFsm<T>, stateConstructor: Constructor<FsmState<T>>): void {
        let fsmImplement = fsm as Fsm<T>;
        fsmImplement.changeState(stateConstructor);
    }
}
