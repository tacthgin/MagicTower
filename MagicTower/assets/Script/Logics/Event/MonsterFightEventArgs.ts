import { ReferencePool } from "../../../GameFramework/Script/Base/ReferencePool/ReferencePool";
import { GameEventArgs } from "../../../GameFramework/Script/Event/GameEventArgs";
import { MonsterInfo } from "../../Model/MapModel/Data/Elements/Monster";
import { GameEvent } from "./GameEvent";

export class MonsterFightEventArgs extends GameEventArgs {
    private _monsterInfo: MonsterInfo | null = null;

    get id(): number {
        return GameEvent.MONSTER_FIGHT;
    }

    get monsterInfo(): MonsterInfo {
        return this._monsterInfo!;
    }

    static create(monsterInfo: MonsterInfo): MonsterFightEventArgs {
        let monsterFightEventArgs = ReferencePool.acquire(MonsterFightEventArgs);
        monsterFightEventArgs._monsterInfo = monsterInfo;
        return monsterFightEventArgs;
    }

    clear(): void {
        this._monsterInfo = null;
    }
}
