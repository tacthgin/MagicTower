import { ReferencePool } from "../../../../../GameFramework/Scripts/Base/ReferencePool/ReferencePool";
import { ObjectBase } from "../../../../../GameFramework/Scripts/ObjectPool/ObjectBase";

export class ElementObject extends ObjectBase {
    static create(name: string, target: object): ElementObject {
        let elementObject = ReferencePool.acquire(ElementObject);
        elementObject.initialize(name, target);
        return elementObject;
    }
}
