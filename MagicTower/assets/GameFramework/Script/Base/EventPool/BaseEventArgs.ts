import { GameFrameworkEventArgs } from "../GameFrameworkEventArgs";

export abstract class BaseEventArgs extends GameFrameworkEventArgs {
    abstract get id(): number;
}
