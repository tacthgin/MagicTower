import { ReferencePool } from "../../../GameFramework/Scripts/Base/ReferencePool/ReferencePool";
import { GameEventArgs } from "../../../GameFramework/Scripts/Event/GameEventArgs";
import { GameEvent } from "./GameEvent";

export class MoveEventArgs extends GameEventArgs {
    private _layerName: string = "";
    private _src: number = 0;
    private _dst: number = 0;
    private _speed: number = 0;
    private _delay: number = 0;

    get id(): number {
        return GameEvent.COMMAND_MOVE;
    }

    get layerName(): string {
        return this._layerName;
    }

    get src(): number {
        return this._src;
    }

    get dst(): number {
        return this._dst;
    }

    get speed(): number {
        return this._speed;
    }

    get delay(): number {
        return this._delay;
    }

    static create(layerName: string, src: number, dst: number, speed: number, delay: number): MoveEventArgs {
        let moveEventArgs = ReferencePool.acquire(MoveEventArgs);
        moveEventArgs._layerName = layerName;
        moveEventArgs._src = src;
        moveEventArgs._dst = dst;
        moveEventArgs._speed = speed;
        moveEventArgs._delay = delay;
        return moveEventArgs;
    }

    clear(): void {
        this._layerName = "";
        this._src = 0;
        this._dst = 0;
        this._speed = 0;
        this._delay = 0;
    }
}
