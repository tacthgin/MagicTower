import { IRerference } from "../../Base/ReferencePool/IRerference";

export abstract class CommandBase implements IRerference {
    abstract clear(): void;
}
