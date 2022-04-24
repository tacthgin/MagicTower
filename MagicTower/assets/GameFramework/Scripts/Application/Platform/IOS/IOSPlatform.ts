import { PlatformBase } from "../PlatformBase";
import { IIOSPlatform } from "./IIOSPlatform";

export class IOSPlatform extends PlatformBase implements IIOSPlatform {
    initalize(): void {
        throw new Error("Method not implemented.");
    }
}
