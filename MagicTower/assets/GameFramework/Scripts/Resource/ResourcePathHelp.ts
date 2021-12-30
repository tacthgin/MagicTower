import { Asset, SpriteFrame, Texture2D } from "cc";
import { Constructor } from "../Base/DataStruct/Constructor";
import { IResourcePathHelp } from "./IResourcePathHelp";

export class ResourcePathHelp implements IResourcePathHelp {
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
