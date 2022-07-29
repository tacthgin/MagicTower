import { IRerference } from "./IRerference";
import { ReferenceCollection } from "./ReferenceCollection";
import { ReferenceConstructor } from "./ReferenceConstructor";
import { ReferencePoolInfo } from "./ReferencePoolInfo";

export class ReferencePool {
    private static readonly s_referenceCollections = new Map<ReferenceConstructor<IRerference>, ReferenceCollection>();

    static get count() {
        return this.s_referenceCollections.size;
    }

    static getAllReferencePoolInfos(): ReferencePoolInfo[] {
        let referencePoolInfos: ReferencePoolInfo[] = [];
        this.s_referenceCollections.forEach((refererenceCollection: ReferenceCollection, referenceConstructor: ReferenceConstructor<IRerference>) => {
            referencePoolInfos.push(
                new ReferencePoolInfo(
                    referenceConstructor,
                    refererenceCollection.addReferenceCount,
                    refererenceCollection.removeReferenceCount,
                    refererenceCollection.acquireReferenceCount,
                    refererenceCollection.usingRerferenceCount,
                    refererenceCollection.releaseRerferenceCount
                )
            );
        });

        return referencePoolInfos;
    }

    static acquire<T extends IRerference>(referenceConstructor: ReferenceConstructor<T>): T {
        let referenceCollection = this.getReferenceCollection(referenceConstructor);
        return referenceCollection.acquire(referenceConstructor);
    }

    static release(reference: IRerference): void {
        this.getReferenceCollection(reference.constructor as ReferenceConstructor<IRerference>).release(reference);
    }

    static add(referenceConstructor: ReferenceConstructor<IRerference>, count: number): void {
        this.getReferenceCollection(referenceConstructor).add(count);
    }

    static remove(referenceConstructor: ReferenceConstructor<IRerference>, count: number): void {
        this.getReferenceCollection(referenceConstructor).remove(count);
    }

    static removeAll(referenceConstructor: ReferenceConstructor<IRerference>) {
        this.getReferenceCollection(referenceConstructor).removeAll();
    }

    static clearAll() {
        this.s_referenceCollections.forEach((refererenceCollection: ReferenceCollection) => {
            refererenceCollection.removeAll();
        });
        this.s_referenceCollections.clear();
    }

    private static getReferenceCollection(referenceConstructor: ReferenceConstructor<IRerference>): ReferenceCollection {
        let referenceCollection: ReferenceCollection | undefined = this.s_referenceCollections.get(referenceConstructor);
        if (!referenceCollection) {
            referenceCollection = new ReferenceCollection(referenceConstructor);
            this.s_referenceCollections.set(referenceConstructor, referenceCollection);
        }
        return referenceCollection;
    }
}
