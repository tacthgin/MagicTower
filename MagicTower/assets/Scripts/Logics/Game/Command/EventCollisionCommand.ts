import { CommandBase } from "../../../../GameFramework/Scripts/Application/Command/CommandBase";
import { CommandManager } from "../../../../GameFramework/Scripts/Application/Command/CommandManager";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { IVec2 } from "../../../../GameFramework/Scripts/Base/GameStruct/IVec2";
import { EventCollisionEventArgs } from "../../Event/EventCollisionEventArgs";

@CommandManager.register("EventCollisionCommand")
export class EventCollisionCommand extends CommandBase {
    execute(eventIdOrTile: number | string | IVec2): void {
        GameApp.EventManager.fireNow(this, EventCollisionEventArgs.create(eventIdOrTile));
        GameApp.CommandManager.destroyCommand(this);
    }

    clear(): void {}
}
