import { Constructor } from "../Base/DataStruct/Constructor";
import { ConstructorNamePair } from "../Base/DataStruct/ConstructorNamePair";
import { GameFrameworkEntry } from "../Base/GameFrameworkEntry";
import { GameFrameworkError } from "../Base/GameFrameworkError";
import { GameFrameworkModule } from "../Base/GameFrameworkModule";
import { Fsm } from "./Fsm";
import { FsmBase } from "./FsmBase";
import { FsmState } from "./FsmState";
import { IFsm } from "./IFsm";
import { IFsmManager } from "./IFsmManager";

@GameFrameworkEntry.registerModule("FsmManager")
export class FsmManager extends GameFrameworkModule implements IFsmManager {
    private _fsms: Map<ConstructorNamePair<object>, FsmBase> = null!;
    private _constructorOrNameToPair: Map<object | string, ConstructorNamePair<object>> = null!;

    constructor() {
        super();
        this._fsms = new Map<ConstructorNamePair<object>, FsmBase>();
        this._constructorOrNameToPair = new Map<object | string, ConstructorNamePair<object>>();
    }

    get count(): number {
        return this._fsms.size;
    }

    update(elapseSeconds: number): void {
        for (let pair of this._fsms) {
            pair[1].update(elapseSeconds);
        }
    }

    shutDown(): void {
        for (let pair of this._fsms) {
            pair[1].shutDown();
        }
        this._fsms.clear();
    }

    hasFsm<T extends {}>(nameOrOwner: string | T): boolean {
        if (typeof nameOrOwner === "string" && !nameOrOwner) {
            throw new GameFrameworkError("name is invalid");
        }
        return this._constructorOrNameToPair.has(nameOrOwner);
    }

    getFsm<T extends {}>(nameOrOwner: string | T): IFsm<T> | null {
        let fsm = this.internalGetFsm(nameOrOwner);
        if (fsm) {
            return fsm as unknown as IFsm<T>;
        }
        return null;
    }

    getFsmBase(name: string): FsmBase | null {
        return this.internalGetFsm(name);
    }

    getAllFsms(): FsmBase[] {
        let fsms: Array<FsmBase> = new Array<FsmBase>(this._fsms.size);
        let index = 0;
        for (let pair of this._fsms) {
            fsms[index++] = pair[1];
        }
        return fsms;
    }

    createFsm<T extends {}>(name: string, owner: T, states: FsmState<T>[]): IFsm<T> {
        if (this.hasFsm(name)) {
            throw new GameFrameworkError(`already exist fsm: ${name}`);
        }
        let constructorNamePair = new ConstructorNamePair<T>(owner.constructor as Constructor<T>, name);
        let fsm = Fsm.create<T>(name, owner, states);
        this._fsms.set(constructorNamePair, fsm);
        this._constructorOrNameToPair.set(name, constructorNamePair);
        this._constructorOrNameToPair.set(owner, constructorNamePair);
        return fsm;
    }

    destroyFsm<T extends {}>(nameOrOwnerOrFsm: string | T | FsmBase | IFsm<T>): boolean {
        let constructorNamePair: ConstructorNamePair<object> | null | undefined = null;
        if (nameOrOwnerOrFsm instanceof FsmBase) {
            constructorNamePair = this._constructorOrNameToPair.get(nameOrOwnerOrFsm.name);
        } else {
            constructorNamePair = this._constructorOrNameToPair.get(nameOrOwnerOrFsm);
        }

        if (constructorNamePair) {
            let fsm = this._fsms.get(constructorNamePair);
            if (fsm) {
                this._constructorOrNameToPair.delete(fsm.name);
                this._constructorOrNameToPair.delete((fsm as unknown as IFsm<T>).owner);
                fsm.shutDown();
                this._fsms.delete(constructorNamePair);
                return true;
            }
        }
        return false;
    }

    private internalGetFsm<T extends {}>(nameOrOwner: string | T): FsmBase | null {
        let pair = this._constructorOrNameToPair.get(nameOrOwner);
        if (pair) {
            let fsm = this._fsms.get(pair);
            if (fsm) {
                return fsm;
            }
        }
        return null;
    }
}
