import { EventHandle } from "../Base/EventPool/EventHandle";
import { EventPool } from "../Base/EventPool/EventPool";
import { GameFrameworkEntry } from "../Base/GameFrameworkEntry";
import { GameFrameworkModule } from "../Base/GameFrameworkModule";
import { GameEventArgs } from "./GameEventArgs";
import { IEventManager } from "./IEventManager";

@GameFrameworkEntry.registerModule("EventManager")
export class EventManager extends GameFrameworkModule implements IEventManager {
    private readonly _eventPool: EventPool<GameEventArgs> = null!;

    constructor() {
        super();
        this._eventPool = new EventPool<GameEventArgs>();
    }

    get priority(): number {
        return 4;
    }

    update(elapseSeconds: number): void {
        this._eventPool.update(elapseSeconds);
    }

    shutDown(): void {
        this._eventPool.shutDown();
    }

    clear() {
        this._eventPool.clear();
    }

    subscribe(id: number, eventHandle: EventHandle<GameEventArgs>, thisArg?: any): void {
        this._eventPool.subscribe(id, eventHandle, thisArg);
    }

    unsubscribe(id: number, eventHandle: EventHandle<GameEventArgs>, thisArg?: any): void {
        this._eventPool.unsubscribe(id, eventHandle, thisArg);
    }

    unsubscribeTarget(target: object): void {
        this._eventPool.unsubscribeTarget(target);
    }

    check(id: number, eventHandle: EventHandle<GameEventArgs>, thisArg?: any): boolean {
        return this._eventPool.check(id, eventHandle, thisArg);
    }

    fire(sender: object, e: GameEventArgs): void {
        this._eventPool.fire(sender, e);
    }

    fireNow(sender: object, e: GameEventArgs): void {
        this._eventPool.fireNow(sender, e);
    }
}
