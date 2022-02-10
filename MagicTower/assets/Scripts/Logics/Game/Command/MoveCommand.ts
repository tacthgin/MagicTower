import { CommandBase } from "../../../../GameFramework/Scripts/Application/Command/CommandBase";
import { CommandManager } from "../../../../GameFramework/Scripts/Application/Command/CommandManager";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { IVec2 } from "../../../../GameFramework/Scripts/Base/GameStruct/IVec2";
import { CollisionEventArgs } from "../../Event/CollisionEventArgs";

@CommandManager.register("MoveCommand")
export class MoveCommand extends CommandBase {
    execute(layerName: string, src: number, dst: number, speed: number, delay: number): void {
        GameApp.EventManager.fireNow(this, CollisionEventArgs.create(tile));
        GameApp.CommandManager.destroyCommand(this);
    }

    clear(): void {}
}
