import { PlatformType } from "../PlatformType";
import { IPlatform } from "./IPlatform";

export abstract class PlatformBase implements IPlatform {
    private _platformType: PlatformType = null!;

    constructor(platformType: PlatformType) {
        this._platformType = platformType;
    }

    abstract initalize(): void;

    isPlatform(platformType: PlatformType): boolean {
        return this._platformType == platformType;
    }
}
