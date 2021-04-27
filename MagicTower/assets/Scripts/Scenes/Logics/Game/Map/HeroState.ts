import { Hero } from "./Hero";

export interface HeroState {
    hero: Hero;
    enter(hero: Hero): void;
    exit(): void;
    update(): void;
}

export class IdleState implements HeroState {
    hero: Hero;

    enter(hero: Hero) {
        this.hero = hero;
        this.hero.setDirectionTexture();
    }

    exit() {}

    update() {}
}

export class MoveState implements HeroState {
    hero: Hero;

    enter(hero: Hero) {
        this.hero = hero;
        this.hero.playMoveAnimation();
    }

    exit() {
        this.hero.stopMoveAnimation();
    }

    update() {}
}
