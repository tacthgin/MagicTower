import { GameApp } from "../../../../GameFramework/Application/GameApp";
import { CommandBase } from "../../../../GameFramework/Script/MVC/Command/CommandBase";
import { CommandManager } from "../../../../GameFramework/Script/MVC/Command/CommandManager";
import { SpecialMoveEventArgs } from "../../Event/SpecialMoveEventArgs";

@CommandManager.registerCommand("SpecialMoveCommand")
export class SpecialMoveCommand extends CommandBase {
    execute(specialMoveInfo: any): void {
        GameApp.EventManager.fireNow(this, SpecialMoveEventArgs.create(specialMoveInfo));
        GameApp.CommandManager.destroyCommand(this);
    }

    clear(): void {}
}
