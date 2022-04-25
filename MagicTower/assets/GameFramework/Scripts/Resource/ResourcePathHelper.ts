import { Asset, SpriteFrame, Texture2D } from "cc";
import { Constructor } from "../Base/DataStruct/Constructor";
import { IResourcePathHelper } from "./IResourcePathHelper";

export class ResourcePathHelper implements IResourcePathHelper {
    getPath<T extends Asset>(path: string, assetType?: Constructor<T>): string {
        if (assetType) {
            if ((assetType as unknown) == SpriteFrame) {
                return `${path}/spriteFrame`;
            } else if ((assetType as unknown) == Texture2D) {
                return `${path}/texture`;
            }
        }
        return path;
    }
}
