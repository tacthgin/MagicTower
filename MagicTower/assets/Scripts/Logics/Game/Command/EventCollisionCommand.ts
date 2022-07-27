import { GameApp } from "../../../../GameFramework/Application/GameApp";
import { IVec2 } from "../../../../GameFramework/Scripts/Base/GameStruct/IVec2";
import { CommandBase } from "../../../../GameFramework/Scripts/MVC/Command/CommandBase";
import { CommandManager } from "../../../../GameFramework/Scripts/MVC/Command/CommandManager";
import { EventCollisionEventArgs } from "../../Event/EventCollisionEventArgs";

@CommandManager.registerCommand("EventCollisionCommand")
export class EventCollisionCommand extends CommandBase {
    execute(eventIdOrTile: number | string | IVec2): void {
        GameApp.EventManager.fireNow(this, EventCollisionEventArgs.create(eventIdOrTile));
        GameApp.CommandManager.destroyCommand(this);
    }

    clear(): void {}
}
