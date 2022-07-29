import { GameApp } from "../../../../GameFramework/Application/GameApp";
import { IVec2 } from "../../../../GameFramework/Script/Base/GameStruct/IVec2";
import { CommandBase } from "../../../../GameFramework/Script/MVC/Command/CommandBase";
import { CommandManager } from "../../../../GameFramework/Script/MVC/Command/CommandManager";
import { DisappearOrAppearEventArgs, DisappearOrAppearState } from "../../Event/DisappearOrAppearEventArgs";
import { GameEvent } from "../../Event/GameEvent";

@CommandManager.registerCommand("DisappearCommand")
export class DisappearCommand extends CommandBase {
    execute(layerName: string, tileOrIndex: IVec2 | number, state: DisappearOrAppearState = DisappearOrAppearState.ALL, callback: Function | null = null): void {
        GameApp.EventManager.fireNow(this, DisappearOrAppearEventArgs.create(GameEvent.COMMAND_DISAPPEAR, layerName, tileOrIndex, state, 0, callback));
        GameApp.CommandManager.destroyCommand(this);
    }

    clear(): void {}
}
