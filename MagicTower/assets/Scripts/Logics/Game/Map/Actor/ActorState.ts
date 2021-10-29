import { Actor } from "./Actor";

abstract class StateBase {
    protected actor: Actor = null!;
    protected state: ActorState = ActorState.NONE;

    constructor(actor: Actor) {
        this.actor = actor;
    }

    enter(data: any = null) {
        this.actor.enter(this.state, data);
    }

    exit(newState: ActorState) {
        this.actor.exit(this.state, newState);
    }
}

class IdleState extends StateBase {
    protected state: ActorState = ActorState.IDLE;
}

class MoveState extends StateBase {
    protected state: ActorState = ActorState.MOVE;
}

class AttackState extends StateBase {
    protected state: ActorState = ActorState.ATTACK;
}

export enum ActorState {
    NONE,
    IDLE,
    MOVE,
    ATTACK,
}

export class StateMachine {
    private state: ActorState = ActorState.NONE;
    private currentState: StateBase | null = null;
    private states: { [key: number]: StateBase } = {};
    private actor: Actor = null!;
    private condition: { [key: number]: string | ActorState | Array<ActorState> } | null = null;

    constructor(actor: Actor) {
        this.actor = actor;
    }

    static createState(state: ActorState, actor: Actor) {
        switch (state) {
            case ActorState.IDLE:
                return new IdleState(actor);
            case ActorState.MOVE:
                return new MoveState(actor);
            case ActorState.ATTACK:
                return new AttackState(actor);
            default:
                return null;
        }
    }

    /**
     * 转换状态
     * @param state 状态
     * @param data 附带数据
     * @returns void
     */
    changeState(state: ActorState, data: any = null) {
        if (!this.isConditionPass(state)) {
            console.log(`${ActorState[this.state]}转换到${ActorState[state]}失败`);
            return;
        }
        let newState: any = this.states[state];
        if (!newState) {
            newState = StateMachine.createState(state, this.actor);
        }
        if (this.currentState != null) {
            this.currentState.exit(state);
        }
        this.currentState = newState;
        this.state = state;
        this.currentState?.enter(data);
    }

    private isConditionPass(state: ActorState) {
        if (!this.condition) {
            //不设置条件，默认都通过
            return true;
        }
        let condition = this.condition[state];
        if (condition) {
            if (condition == "*") {
                return true;
            } else if (condition instanceof Array) {
                return condition.indexOf(this.state) != -1;
            } else if (typeof condition == "number") {
                return condition == this.state;
            }
        } else {
            console.error(`请先设置${ActorState[state]}的条件`);
        }
        return false;
    }

    /**
     *  设置状态切换条件,key为要切换的状态，value为可以原状态 { [ActorState.IDLE]: "*" }
     */
    setCondition(condition: { [key: number]: string | ActorState | Array<ActorState> }) {
        this.condition = condition;
    }
}
