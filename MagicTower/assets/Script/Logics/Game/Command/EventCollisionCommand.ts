import { GameApp } from "../../../../GameFramework/Application/GameApp";
import { IVec2 } from "../../../../GameFramework/Script/Base/GameStruct/IVec2";
import { CommandBase } from "../../../../GameFramework/Script/MVC/Command/CommandBase";
import { CommandManager } from "../../../../GameFramework/Script/MVC/Command/CommandManager";
import { EventCollisionEventArgs } from "../../Event/EventCollisionEventArgs";

@CommandManager.registerCommand("EventCollisionCommand")
export class EventCollisionCommand extends CommandBase {
    execute(eventIdOrTile: number | string | IVec2): void {
        GameApp.EventManager.fireNow(this, EventCollisionEventArgs.create(eventIdOrTile));
        GameApp.CommandManager.destroyCommand(this);
    }

    clear(): void {}
}
