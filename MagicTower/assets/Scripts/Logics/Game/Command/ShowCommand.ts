import { GameApp } from "../../../../GameFramework/Application/GameApp";
import { IVec2 } from "../../../../GameFramework/Scripts/Base/GameStruct/IVec2";
import { CommandBase } from "../../../../GameFramework/Scripts/MVC/Command/CommandBase";
import { CommandManager } from "../../../../GameFramework/Scripts/MVC/Command/CommandManager";
import { ShowEventArgs } from "../../Event/ShowEventArgs";

@CommandManager.registerCommand("ShowCommand")
export class ShowCommand extends CommandBase {
    execute(tileOrIndex: IVec2 | number): void {
        GameApp.EventManager.fireNow(this, ShowEventArgs.create(tileOrIndex));
        GameApp.CommandManager.destroyCommand(this);
    }

    clear(): void {}
}
