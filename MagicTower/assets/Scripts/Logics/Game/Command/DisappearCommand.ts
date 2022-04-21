import { CommandBase } from "../../../../GameFramework/Scripts/Application/Command/CommandBase";
import { CommandManager } from "../../../../GameFramework/Scripts/Application/Command/CommandManager";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { IVec2 } from "../../../../GameFramework/Scripts/Base/GameStruct/IVec2";
import { DisappearOrAppearEventArgs, DisappearOrAppearState } from "../../Event/DisappearOrAppearEventArgs";
import { GameEvent } from "../../Event/GameEvent";

@CommandManager.register("DisappearCommand")
export class DisappearCommand extends CommandBase {
    execute(layerName: string, tileOrIndex: IVec2 | number, state: DisappearOrAppearState = DisappearOrAppearState.ALL, callback: Function | null = null): void {
        GameApp.EventManager.fireNow(this, DisappearOrAppearEventArgs.create(GameEvent.COMMAND_DISAPPEAR, layerName, tileOrIndex, state, 0, callback));
        GameApp.CommandManager.destroyCommand(this);
    }

    clear(): void {}
}
