import { GameFrameworkLinkedList } from "./GameFrameworkLinkedList";

/**
 * 游戏多重元素map
 */
export class GameFrameworkMap<K, V> {
    private readonly _map: Map<K, GameFrameworkLinkedList<V>> = null!;

    constructor() {
        this._map = new Map<K, GameFrameworkLinkedList<V>>();
    }

    get size(): number {
        return this._map.size;
    }

    clear(): void {
        this._map.clear();
    }

    delete(key: K, value?: V): boolean {
        if (value != undefined) {
            let list = this._map.get(key);
            if (list) {
                return list.remove(value);
            }
        } else {
            return this._map.delete(key);
        }
        return false;
    }

    forEach(callbackfn: (value: GameFrameworkLinkedList<V>, key: K, map: Map<K, GameFrameworkLinkedList<V>>) => void, thisArg?: any): void {
        this._map.forEach(callbackfn, thisArg);
    }

    get(key: K): GameFrameworkLinkedList<V> | undefined {
        return this._map.get(key);
    }

    has(key: K, value?: V): boolean {
        if (value != undefined) {
            let list = this._map.get(key);
            if (list) {
                return list.has(value);
            }
        } else {
            return this._map.has(key);
        }
        return false;
    }

    set(key: K, value: V): this {
        let list = this._map.get(key);
        if (!list) {
            list = new GameFrameworkLinkedList<V>();
            this._map.set(key, list);
        }
        list.addLast(value);
        return this;
    }

    entries(): IterableIterator<[K, GameFrameworkLinkedList<V>]> {
        return this._map.entries();
    }

    keys(): IterableIterator<K> {
        return this._map.keys();
    }

    values(): IterableIterator<GameFrameworkLinkedList<V>> {
        return this._map.values();
    }

    [Symbol.iterator](): IterableIterator<[K, GameFrameworkLinkedList<V>]> {
        return this._map.entries();
    }

    get [Symbol.toStringTag](): string {
        return "GameFrameworkMap";
    }
}
