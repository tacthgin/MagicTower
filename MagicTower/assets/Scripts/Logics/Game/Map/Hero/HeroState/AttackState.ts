import { FsmState } from "../../../../../../GameFramework/Scripts/Fsm/FsmState";
import { IFsm } from "../../../../../../GameFramework/Scripts/Fsm/IFsm";
import { Hero } from "../Hero";

export class AttackState<T extends {}> extends FsmState<T> {
    onEnter(fsm: IFsm<T>): void {
        (fsm.owner as unknown as Hero).setDirectionTexture();
    }
}
