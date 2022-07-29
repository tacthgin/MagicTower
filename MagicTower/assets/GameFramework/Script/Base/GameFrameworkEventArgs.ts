import { IRerference } from "./ReferencePool/IRerference";

export abstract class GameFrameworkEventArgs implements IRerference {
    abstract clear(): void;
}
