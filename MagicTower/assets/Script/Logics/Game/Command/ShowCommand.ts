import { GameApp } from "../../../../GameFramework/Application/GameApp";
import { IVec2 } from "../../../../GameFramework/Script/Base/GameStruct/IVec2";
import { CommandBase } from "../../../../GameFramework/Script/MVC/Command/CommandBase";
import { CommandManager } from "../../../../GameFramework/Script/MVC/Command/CommandManager";
import { ShowEventArgs } from "../../Event/ShowEventArgs";

@CommandManager.registerCommand("ShowCommand")
export class ShowCommand extends CommandBase {
    execute(tileOrIndex: IVec2 | number): void {
        GameApp.EventManager.fireNow(this, ShowEventArgs.create(tileOrIndex));
        GameApp.CommandManager.destroyCommand(this);
    }

    clear(): void {}
}
