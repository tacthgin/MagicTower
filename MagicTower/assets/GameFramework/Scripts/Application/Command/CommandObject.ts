import { IRerference } from "../../Base/ReferencePool/IRerference";
import { ReferencePool } from "../../Base/ReferencePool/ReferencePool";
import { ObjectBase } from "../../ObjectPool/ObjectBase";

/**
 * 命令对象
 */
export class CommandObject extends ObjectBase {
    static create(name: string, instance: IRerference): CommandObject {
        let commandObject = ReferencePool.acquire(CommandObject);
        commandObject.initialize(name, instance);
        return commandObject;
    }

    clear(): void {
        ReferencePool.release(this.target as IRerference);
        super.clear();
    }
}
