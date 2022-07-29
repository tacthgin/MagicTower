import { IRerference } from "../../Base/ReferencePool/IRerference";

export abstract class CommandBase implements IRerference {
    abstract execute(...args: any[]): void;
    abstract clear(): void;
}
