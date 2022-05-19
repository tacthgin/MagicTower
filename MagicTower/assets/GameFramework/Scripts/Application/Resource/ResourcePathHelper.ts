import { SpriteFrame, Texture2D } from "cc";
import { Constructor } from "../../Base/DataStruct/Constructor";
import { IAsset } from "../../Resource/Asset/IAsset";
import { IResourcePathHelper } from "../../Resource/IResourcePathHelper";

export class ResourcePathHelper implements IResourcePathHelper {
    getPath<T extends IAsset>(path: string, assetType?: Constructor<T>): string {
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
