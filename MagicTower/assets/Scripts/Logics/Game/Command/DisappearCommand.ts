import { CommandBase } from "../../../../GameFramework/Scripts/Application/Command/CommandBase";
import { CommandManager } from "../../../../GameFramework/Scripts/Application/Command/CommandManager";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { IVec2 } from "../../../../GameFramework/Scripts/Base/GameStruct/IVec2";
import { DisappearOrAppearEventArgs } from "../../Event/DisappearOrAppearEventArgs";
import { GameEvent } from "../../Event/GameEvent";

@CommandManager.register("DisappearCommand")
export class DisappearCommand extends CommandBase {
    execute(layerName: string, tileOrIndex: IVec2 | number, record: boolean = true): void {
        GameApp.EventManager.fireNow(this, DisappearOrAppearEventArgs.create(GameEvent.COMMAND_DISAPPEAR, layerName, tileOrIndex, 0, record));
        GameApp.CommandManager.destroyCommand(this);
    }

    clear(): void {}
}
