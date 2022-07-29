import { GameApp } from "../../../../GameFramework/Application/GameApp";
import { IVec2 } from "../../../../GameFramework/Script/Base/GameStruct/IVec2";
import { CommandBase } from "../../../../GameFramework/Script/MVC/Command/CommandBase";
import { CommandManager } from "../../../../GameFramework/Script/MVC/Command/CommandManager";
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
