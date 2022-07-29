import { ReferencePool } from "../../../GameFramework/Script/Base/ReferencePool/ReferencePool";
import { GameEventArgs } from "../../../GameFramework/Script/Event/GameEventArgs";
import { GameEvent } from "./GameEvent";

export class MonsterDieEventArgs extends GameEventArgs {
    private _magicGuardIndex: number | null = null;
    private _eventId: number | null = null;

    get id(): number {
        return GameEvent.MONSTER_DIE;
    }

    get magicGuardIndex(): number | null {
        return this._magicGuardIndex;
    }

    get eventId(): number | null {
        return this._eventId;
    }

    static create(magicGuardIndex: number | null, eventId: number | null): MonsterDieEventArgs {
        let monsterDieEventArgs = ReferencePool.acquire(MonsterDieEventArgs);
        monsterDieEventArgs._magicGuardIndex = magicGuardIndex;
        monsterDieEventArgs._eventId = eventId;
        return monsterDieEventArgs;
    }

    clear(): void {
        this._magicGuardIndex = null;
        this._eventId = null;
    }
}
