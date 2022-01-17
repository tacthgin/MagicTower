import { FsmState } from "../../../../../../GameFramework/Scripts/Fsm/FsmState";
import { IFsm } from "../../../../../../GameFramework/Scripts/Fsm/IFsm";
import { Hero } from "../Hero";

export class MoveState<T extends {}> extends FsmState<T> {
    onEnter(fsm: IFsm<T>): void {
        let hero = fsm.owner as unknown as Hero;
    }
}
