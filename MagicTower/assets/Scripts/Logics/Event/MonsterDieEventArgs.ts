import { ReferencePool } from "../../../GameFramework/Scripts/Base/ReferencePool/ReferencePool";
import { GameEventArgs } from "../../../GameFramework/Scripts/Event/GameEventArgs";
import { Monster } from "../../Model/MapModel/Data/Elements/Monster";
import { GameEvent } from "./GameEvent";

export class MonsterDieEventArgs extends GameEventArgs {
    private _monster: Monster | null = null;
    private _fightAfterMagic: boolean = false;

    get id(): number {
        return GameEvent.MONSTER_FIGHT;
    }

    get monster(): Monster {
        return this._monster!;
    }

    get fightAfterMagic(): boolean {
        return this._fightAfterMagic;
    }

    static create(monster: Monster, fightAfterMagic: boolean): MonsterDieEventArgs {
        let monsterDieEventArgs = ReferencePool.acquire(MonsterDieEventArgs);
        monsterDieEventArgs._monster = monster;
        monsterDieEventArgs._fightAfterMagic = fightAfterMagic;
        return monsterDieEventArgs;
    }

    clear(): void {
        this._monster = null;
        this._fightAfterMagic = false;
    }
}
