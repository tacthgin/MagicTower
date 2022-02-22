import { CommandBase } from "../../../../GameFramework/Scripts/Application/Command/CommandBase";
import { CommandManager } from "../../../../GameFramework/Scripts/Application/Command/CommandManager";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { MoveEventArgs } from "../../Event/MoveEventArgs";

@CommandManager.register("MoveCommand")
export class MoveCommand extends CommandBase {
    execute(layerName: string, src: number, dst: number, speed: number, delay: number, moveCompleteCallback: Function): void {
        GameApp.EventManager.fireNow(this, MoveEventArgs.create(layerName, src, dst, speed, delay, moveCompleteCallback));
        GameApp.CommandManager.destroyCommand(this);
    }

    clear(): void {}
}
