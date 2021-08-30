import { Hero } from "./Hero";

interface HeroStateBase {
    readonly hero: Hero;
    enter(): void;
    exit(): void;
    update(): void;
}

class IdleState implements HeroStateBase {
    hero: Hero = null!;
    constructor(hero: Hero) {
        this.hero = hero;
    }

    enter() {
        this.hero.setDirectionTexture();
    }

    exit() {}

    update() {}
}

class MoveState implements HeroStateBase {
    hero: Hero = null!;
    constructor(hero: Hero) {
        this.hero = hero;
    }

    enter() {
        this.hero.playMoveAnimation();
    }

    exit() {
        this.hero.stopMoveAnimation();
    }

    update() {}
}

export enum HeroState {
    NONE,
    IDLE,
    MOVE,
}

export class HeroStateMachine {
    private state: HeroState = HeroState.NONE;
    private currentState: HeroStateBase | null = null;
    private states: { [key: number]: HeroStateBase } = {};
    private hero: Hero = null!;

    constructor(hero: Hero) {
        this.hero = hero;
    }

    static createState(state: HeroState, hero: Hero) {
        switch (state) {
            case HeroState.IDLE:
                return new IdleState(hero);
            case HeroState.MOVE:
                return new MoveState(hero);
            default:
                return null;
        }
    }

    changeState(state: HeroState) {
        let newState: any = this.states[state];
        if (!newState) {
            newState = HeroStateMachine.createState(state, this.hero);
        }
        if (this.currentState != null && !(state == HeroState.MOVE && this.state == state)) {
            this.currentState.exit();
        }
        this.currentState = newState;
        this.state = state;
        this.currentState?.enter();
    }
}
