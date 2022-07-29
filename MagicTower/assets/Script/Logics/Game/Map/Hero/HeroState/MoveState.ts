import { FsmState } from "../../../../../../GameFramework/Script/Fsm/FsmState";
import { IFsm } from "../../../../../../GameFramework/Script/Fsm/IFsm";
import { Hero } from "../Hero";

export class MoveState<T extends {}> extends FsmState<T> {
    onEnter(fsm: IFsm<T>): void {
        let hero = fsm.owner as unknown as Hero;
        hero.playAnimation();
    }
}
