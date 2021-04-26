import { BaseData } from "../../../Framework/Base/BaseData";

export class SettingData extends BaseData {
    protected data: any = { music: false, effect: false };
    load(data: any): void {
        throw new Error("Method not implemented.");
    }
}
