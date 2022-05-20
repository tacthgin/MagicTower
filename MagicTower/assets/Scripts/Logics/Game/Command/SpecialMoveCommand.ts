import { CommandBase } from "../../../../GameFramework/Scripts/Application/Command/CommandBase";
import { CommandManager } from "../../../../GameFramework/Scripts/Application/Command/CommandManager";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { SpecialMoveEventArgs } from "../../Event/SpecialMoveEventArgs";

@CommandManager.registerCommand("SpecialMoveCommand")
export class SpecialMoveCommand extends CommandBase {
    execute(specialMoveInfo: any): void {
        GameApp.EventManager.fireNow(this, SpecialMoveEventArgs.create(specialMoveInfo));
        GameApp.CommandManager.destroyCommand(this);
    }

    clear(): void {}
}
