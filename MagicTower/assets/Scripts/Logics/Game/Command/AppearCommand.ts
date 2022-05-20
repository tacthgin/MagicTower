import { CommandBase } from "../../../../GameFramework/Scripts/Application/Command/CommandBase";
import { CommandManager } from "../../../../GameFramework/Scripts/Application/Command/CommandManager";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { IVec2 } from "../../../../GameFramework/Scripts/Base/GameStruct/IVec2";
import { DisappearOrAppearEventArgs, DisappearOrAppearState } from "../../Event/DisappearOrAppearEventArgs";
import { GameEvent } from "../../Event/GameEvent";

@CommandManager.registerCommand("AppearCommand")
export class AppearCommand extends CommandBase {
    execute(layerName: string, tileOrIndex: IVec2 | number, elementId: number, state: DisappearOrAppearState = DisappearOrAppearState.ALL, callback: Function | null = null): void {
        GameApp.EventManager.fireNow(this, DisappearOrAppearEventArgs.create(GameEvent.COMMAND_APPEAR, layerName, tileOrIndex, state, elementId, callback));
        GameApp.CommandManager.destroyCommand(this);
    }

    clear(): void {}
}
