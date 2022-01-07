import { FsmState } from "../../../../../../GameFramework/Scripts/Fsm/FsmState";
import { IFsm } from "../../../../../../GameFramework/Scripts/Fsm/IFsm";

export class MoveState<T extends {}> extends FsmState<T> {
    onEnter(fsm: IFsm<T>): void {
        
    }
}
