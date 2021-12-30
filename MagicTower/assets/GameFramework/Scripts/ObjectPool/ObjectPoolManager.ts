import { Constructor } from "../Base/DataStruct/Constructor";
import { ConstructorNamePair } from "../Base/DataStruct/ConstructorNamePair";
import { GameFrameworkEntry } from "../Base/GameFrameworkEntry";
import { GameFrameworkError } from "../Base/GameFrameworkError";
import { GameFrameworkMap } from "../Base/GameFrameworkMap";
import { GameFrameworkModule } from "../Base/GameFrameworkModule";
import { IObejctPoolManager } from "./IObejctPoolManager";
import { IObjectPool } from "./IObjectPool";
import { ObjectBase } from "./ObjectBase";
import { ObjectPool } from "./ObjectPool";
import { ObjectPoolBase } from "./ObjectPoolBase";

@GameFrameworkEntry.registerModule("ObjectPoolManager")
export class ObjectPoolManager extends GameFrameworkModule implements IObejctPoolManager {
    private readonly _defaultCapacity: number = Number.MAX_SAFE_INTEGER;
    private readonly _defaultExpireTime: number = Number.MAX_VALUE;
    private readonly _defaultPriority: number = 0;

    private readonly _objectPools: Map<ConstructorNamePair<ObjectBase>, ObjectPoolBase> = null!;
    private readonly _cachedAllObjectPools: Array<ObjectPoolBase> = null!;
    private readonly _constructorToPair: GameFrameworkMap<Constructor<ObjectBase>, ConstructorNamePair<ObjectBase>> = null!;

    constructor() {
        super();
        this._objectPools = new Map<ConstructorNamePair<ObjectBase>, ObjectPoolBase>();
        this._cachedAllObjectPools = new Array<ObjectPoolBase>();
        this._constructorToPair = new GameFrameworkMap<Constructor<ObjectBase>, ConstructorNamePair<ObjectBase>>();
    }

    get priority(): number {
        return 3;
    }

    get count(): number {
        return this._objectPools.size;
    }

    update(elapseSeconds: number): void {
        this._objectPools.forEach((objectPool: ObjectPoolBase) => {
            objectPool.update(elapseSeconds);
        });
    }

    shutDown(): void {
        this._objectPools.forEach((objectPool: ObjectPoolBase) => {
            objectPool.shutDown();
        });
        this._objectPools.clear();
        this._cachedAllObjectPools.length = 0;
        this._constructorToPair.clear();
    }

    hasObjectPool<T extends ObjectBase>(constructor: Constructor<T>, name?: string): boolean {
        return this.internalGetObjectPoolPair(constructor, name) != null;
    }

    getObjectPool<T extends ObjectBase>(constructor: Constructor<T>, name?: string): IObjectPool<T> | null {
        let pair = this.internalGetObjectPoolPair(constructor, name);
        if (pair) {
            return (this._objectPools.get(pair) as unknown as IObjectPool<T>) || null;
        }
        return null;
    }

    getObjectPoolBase(constructor: Constructor<ObjectBase>, name?: string): ObjectPoolBase | null {
        let objectPool = this.getObjectPool(constructor, name);
        if (objectPool) {
            return objectPool as unknown as ObjectPoolBase;
        }
        return null;
    }

    getAllObjectPools(sort: boolean, results: ObjectPoolBase[]): void {
        results.length = 0;

        this._objectPools.forEach((objectPool: ObjectPoolBase) => {
            results.push(objectPool);
        });

        if (sort) {
            results.sort(ObjectPoolManager.ObjectPoolComparer);
        }
    }

    createSingleSpawnObjectPool<T extends ObjectBase>(
        constructor: Constructor<T>,
        name: string,
        autoReleaseInterval: number = this._defaultExpireTime,
        capacity: number = this._defaultCapacity,
        expireTime: number = this._defaultExpireTime,
        priority: number = this._defaultPriority
    ): IObjectPool<T> {
        return this.internalCreateObjectPool(constructor, name, false, autoReleaseInterval, capacity, expireTime, priority);
    }

    createSingleSpawnObjectPoolBase(
        constructor: Constructor<ObjectBase>,
        name: string,
        autoReleaseInterval: number = this._defaultExpireTime,
        capacity: number = this._defaultCapacity,
        expireTime: number = this._defaultExpireTime,
        priority: number = this._defaultPriority
    ): ObjectPoolBase {
        return this.internalCreateObjectPool(constructor, name, false, autoReleaseInterval, capacity, expireTime, priority) as unknown as ObjectPoolBase;
    }

    CreateMultiSpawnObjectPool<T extends ObjectBase>(
        constructor: Constructor<T>,
        name: string,
        autoReleaseInterval: number = this._defaultExpireTime,
        capacity: number = this._defaultCapacity,
        expireTime: number = this._defaultExpireTime,
        priority: number = this._defaultPriority
    ): IObjectPool<T> {
        return this.internalCreateObjectPool(constructor, name, true, autoReleaseInterval, capacity, expireTime, priority);
    }

    CreateMultiSpawnObjectPoolBase(
        constructor: Constructor<ObjectBase>,
        name: string,
        autoReleaseInterval: number = this._defaultExpireTime,
        capacity: number = this._defaultCapacity,
        expireTime: number = this._defaultExpireTime,
        priority: number = this._defaultPriority
    ): ObjectPoolBase {
        return this.internalCreateObjectPool(constructor, name, true, autoReleaseInterval, capacity, expireTime, priority) as unknown as ObjectPoolBase;
    }

    destroyObjectPool<T extends ObjectBase>(constructor: Constructor<T>, name?: string): boolean {
        if (!constructor) {
            throw new GameFrameworkError("constructor is invalid");
        }
        let constructorNamePair = this.internalGetObjectPoolPair(constructor, name);
        if (constructorNamePair) {
            let objectPool = this._objectPools.get(constructorNamePair);
            objectPool?.shutDown();
            this._constructorToPair.delete(constructor, constructorNamePair);
            this._objectPools.delete(constructorNamePair);
            return true;
        }
        return false;
    }

    release(): void {
        this.getAllObjectPools(true, this._cachedAllObjectPools);
        this._cachedAllObjectPools.forEach((objectPool: ObjectPoolBase) => {
            objectPool.release();
        });
    }

    releaseAllUnused(): void {
        this.getAllObjectPools(true, this._cachedAllObjectPools);
        this._cachedAllObjectPools.forEach((objectPool: ObjectPoolBase) => {
            objectPool.releaseAllUnused();
        });
    }

    private internalGetObjectPoolPair<T extends ObjectBase>(constructor: Constructor<T>, name?: string): ConstructorNamePair<ObjectBase> | null {
        if (!constructor) {
            throw new GameFrameworkError("constructor is invalid");
        }

        let constructorNamePairs = this._constructorToPair.get(constructor);
        if (constructorNamePairs) {
            name = name || "";
            let node = constructorNamePairs.find((pair: ConstructorNamePair<ObjectBase>) => {
                return pair.name == name;
            });
            return node ? node.value : null;
        }
        return null;
    }

    private internalCreateObjectPool<T extends ObjectBase>(
        constructor: Constructor<T>,
        name: string,
        allowMultiSpawn: boolean,
        autoReleaseInterval: number,
        capacity: number,
        expireTime: number,
        priority: number
    ): IObjectPool<T> {
        if (!constructor) {
            throw new GameFrameworkError("constructor is invalid");
        }

        if (this.hasObjectPool(constructor, name)) {
            throw new GameFrameworkError(`object pool ${name} already exist`);
        }

        let objectPool = new ObjectPool<T>(name, allowMultiSpawn, autoReleaseInterval, capacity, expireTime, priority);
        let constructorNamePair = new ConstructorNamePair(constructor, name);
        this._constructorToPair.set(constructor, constructorNamePair);
        this._objectPools.set(constructorNamePair, objectPool);
        return objectPool;
    }

    private static ObjectPoolComparer(left: ObjectPoolBase, right: ObjectPoolBase): number {
        return right.priority - left.priority;
    }
}
