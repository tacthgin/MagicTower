import { FsmState } from "../../../../../../GameFramework/Script/Fsm/FsmState";
import { IFsm } from "../../../../../../GameFramework/Script/Fsm/IFsm";
import { Hero } from "../Hero";

export class IdleState<T extends {}> extends FsmState<T> {
    onEnter(fsm: IFsm<T>): void {
        (fsm.owner as unknown as Hero).setDirectionTexture();
    }
}
