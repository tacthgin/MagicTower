import { CommandBase } from "../../../../GameFramework/Scripts/Application/Command/CommandBase";
import { CommandManager } from "../../../../GameFramework/Scripts/Application/Command/CommandManager";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { IVec2 } from "../../../../GameFramework/Scripts/Base/GameStruct/IVec2";
import { ShowEventArgs } from "../../Event/ShowEventArgs";

@CommandManager.registerCommand("ShowCommand")
export class ShowCommand extends CommandBase {
    execute(tileOrIndex: IVec2 | number): void {
        GameApp.EventManager.fireNow(this, ShowEventArgs.create(tileOrIndex));
        GameApp.CommandManager.destroyCommand(this);
    }

    clear(): void {}
}
