import { ModelEventArgs } from "../../../GameFramework/Scripts/Application/Model/ModelEventArgs";
import { ReferencePool } from "../../../GameFramework/Scripts/Base/ReferencePool/ReferencePool";
import { SettingEvent } from "./SettingEvent";

export class SettingEventArgs extends ModelEventArgs {
    private _id: number = -1;

    get id(): number {
        return this._id;
    }

    static create(id: SettingEvent): SettingEventArgs {
        let settingEventArgs = ReferencePool.acquire(SettingEventArgs);
        settingEventArgs._id = id;
        return settingEventArgs;
    }

    clear(): void {
        this._id = -1;
    }
}
