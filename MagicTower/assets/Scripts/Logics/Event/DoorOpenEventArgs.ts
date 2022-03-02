import { ReferencePool } from "../../../GameFramework/Scripts/Base/ReferencePool/ReferencePool";
import { GameEventArgs } from "../../../GameFramework/Scripts/Event/GameEventArgs";
import { Door } from "../../Model/MapModel/Data/Elements/Door";
import { GameEvent } from "./GameEvent";

export class DoorOpenEventArgs extends GameEventArgs {
    private _doors: Door[] = null!;

    get id(): number {
        return GameEvent.OPEN_DOOR;
    }

    get doors(): Door[] {
        return this._doors;
    }

    static create(doors: Door[]): DoorOpenEventArgs {
        let usePropEventArgs = ReferencePool.acquire(DoorOpenEventArgs);
        usePropEventArgs._doors = doors;
        return usePropEventArgs;
    }

    clear(): void {
        this._doors = null!;
    }
}
