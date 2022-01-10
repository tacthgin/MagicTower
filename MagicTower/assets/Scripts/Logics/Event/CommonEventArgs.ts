import { ReferencePool } from "../../../GameFramework/Scripts/Base/ReferencePool/ReferencePool";
import { GameEventArgs } from "../../../GameFramework/Scripts/Event/GameEventArgs";

export class CommonEventArgs extends GameEventArgs {
    private _id: number = -1;

    get id(): number {
        return this._id;
    }

    static create(id: number): CommonEventArgs {
        let commonEventArgs = ReferencePool.acquire(CommonEventArgs);
        commonEventArgs._id = id;
        return commonEventArgs;
    }

    clear(): void {
        this._id = -1;
    }
}
