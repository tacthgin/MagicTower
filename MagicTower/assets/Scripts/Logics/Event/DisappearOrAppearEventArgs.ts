import { IVec2 } from "../../../GameFramework/Scripts/Base/GameStruct/IVec2";
import { ReferencePool } from "../../../GameFramework/Scripts/Base/ReferencePool/ReferencePool";
import { GameEventArgs } from "../../../GameFramework/Scripts/Event/GameEventArgs";
import { GameEvent } from "./GameEvent";

export enum DisappearOrAppearState {
    /** 同时数据和界面消失或出现 */
    ALL,
    /** 只消失界面 */
    VIEW,
    /** 只消失数据 */
    MODEL,
}

export class DisappearOrAppearEventArgs extends GameEventArgs {
    private _eventId: GameEvent = -1;
    private _layerName: string = "";
    private _tileOrIndex: IVec2 | number = null!;
    private _elementId: number = 0;
    private _callback: Function | null = null;
    private _state: DisappearOrAppearState = DisappearOrAppearState.ALL;

    get id(): number {
        return this._eventId;
    }

    get layerName(): string {
        return this._layerName;
    }

    get tileOrIndex(): IVec2 | number {
        return this._tileOrIndex;
    }

    get state(): DisappearOrAppearState {
        return this._state;
    }

    get elementId(): number {
        return this._elementId;
    }

    get callback(): Function | null {
        return this._callback;
    }

    static create(
        eventId: GameEvent,
        layerName: string,
        tileOrIndex: IVec2 | number,
        state: DisappearOrAppearState = DisappearOrAppearState.ALL,
        elementId: number = 0,
        callback: Function | null = null
    ): DisappearOrAppearEventArgs {
        let disappearOrAppearEventArgs = ReferencePool.acquire(DisappearOrAppearEventArgs);
        disappearOrAppearEventArgs._eventId = eventId;
        disappearOrAppearEventArgs._layerName = layerName;
        disappearOrAppearEventArgs._tileOrIndex = tileOrIndex;
        disappearOrAppearEventArgs._elementId = elementId;
        disappearOrAppearEventArgs._callback = callback;
        disappearOrAppearEventArgs._state = state;
        return disappearOrAppearEventArgs;
    }

    clear(): void {
        this._eventId = -1;
        this._layerName = "";
        this._tileOrIndex = null!;
        this._elementId = 0;
        this._callback = null;
        this._state = DisappearOrAppearState.ALL;
    }
}
