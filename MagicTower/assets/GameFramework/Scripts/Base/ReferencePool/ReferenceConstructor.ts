import { IRerference } from "./IRerference";

export interface ReferenceConstructor<T extends IRerference> {
    new (): T;
}
