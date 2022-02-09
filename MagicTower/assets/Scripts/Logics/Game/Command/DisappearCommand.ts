import { CommandBase } from "../../../../GameFramework/Scripts/Application/Command/CommandBase";
import { CommandManager } from "../../../../GameFramework/Scripts/Application/Command/CommandManager";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";

@CommandManager.register("DisappearCommand")
export class DisappearCommand extends CommandBase {
    execute(): void {
        
        GameApp.CommandManager.destroyCommand(this);
    }

    clear(): void {}
}
