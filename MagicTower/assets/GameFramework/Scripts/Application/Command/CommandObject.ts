import { IRerference } from "../../Base/ReferencePool/IRerference";
import { ReferencePool } from "../../Base/ReferencePool/ReferencePool";
import { ObjectBase } from "../../ObjectPool/ObjectBase";

export class CommandObject extends ObjectBase {
    private _commandInstance: IRerference | null = null;

    static create(instance: IRerference): CommandObject {
        let commandObject = ReferencePool.acquire(CommandObject);
        commandObject._commandInstance = instance;
        return commandObject;
    }

    clear(): void {
        if (this._commandInstance) {
            ReferencePool.release(this._commandInstance);
        }
        this._commandInstance = null;
    }
}
