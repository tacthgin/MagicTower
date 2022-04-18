import { ModelEventArgs } from "../../../GameFramework/Scripts/Application/Model/ModelEventArgs";
import { ReferencePool } from "../../../GameFramework/Scripts/Base/ReferencePool/ReferencePool";
import { SaveEvent } from "./SaveEvent";

/**
 * 加载存档事件
 */
export class LoadArchiveEventArgs extends ModelEventArgs {
    get id(): number {
        return SaveEvent.LOAD_ARCHIVE;
    }

    static create(): LoadArchiveEventArgs {
        let loadArchiveEventArgs = ReferencePool.acquire(LoadArchiveEventArgs);
        return loadArchiveEventArgs;
    }

    clear(): void {}
}
