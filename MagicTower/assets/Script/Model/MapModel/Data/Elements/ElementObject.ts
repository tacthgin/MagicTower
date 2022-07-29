import { ReferencePool } from "../../../../../GameFramework/Script/Base/ReferencePool/ReferencePool";
import { ObjectBase } from "../../../../../GameFramework/Script/ObjectPool/ObjectBase";

export class ElementObject extends ObjectBase {
    static create(name: string, target: object): ElementObject {
        let elementObject = ReferencePool.acquire(ElementObject);
        elementObject.initialize(name, target);
        return elementObject;
    }
}
