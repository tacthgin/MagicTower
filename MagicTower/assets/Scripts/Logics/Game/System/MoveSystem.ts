import { CommandManager } from "../../../../GameFramework/Scripts/Application/Command/CommandManager";
import { SystemBase } from "../../../../GameFramework/Scripts/Application/Command/SystemBase";
import { IAstar } from "../../../../GameFramework/Scripts/ToolLibary/Astar/IAstar";

export enum AstarMoveType {
    NONE,
    HERO,
    MONSTER,
}

@CommandManager.register("MoveSystem")
export class MoveSystem extends SystemBase {
    private _astarMoveType: AstarMoveType = AstarMoveType.NONE;
    private _astar: IAstar | null = null;

    initliaze() {

    }

    getPath() {
        
    }

    clear(): void {
        this._astarMoveType = AstarMoveType.NONE;
    }
}
