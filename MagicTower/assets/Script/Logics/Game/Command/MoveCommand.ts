import { GameApp } from "../../../../GameFramework/Application/GameApp";
import { CommandBase } from "../../../../GameFramework/Script/MVC/Command/CommandBase";
import { CommandManager } from "../../../../GameFramework/Script/MVC/Command/CommandManager";
import { MoveEventArgs } from "../../Event/MoveEventArgs";

@CommandManager.registerCommand("MoveCommand")
export class MoveCommand extends CommandBase {
    execute(layerName: string, src: number, dst: number, speed: number, delay: number, moveCompleteCallback: Function | null = null): void {
        GameApp.EventManager.fireNow(this, MoveEventArgs.create(layerName, src, dst, speed, delay, moveCompleteCallback));
        GameApp.CommandManager.destroyCommand(this);
    }

    clear(): void {}
}
