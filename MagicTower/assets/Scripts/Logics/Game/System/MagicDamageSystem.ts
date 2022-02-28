import { CommandManager } from "../../../../GameFramework/Scripts/Application/Command/CommandManager";
import { SystemBase } from "../../../../GameFramework/Scripts/Application/Command/SystemBase";
import { LevelData } from "../../../Model/MapModel/Data/LevelData";

@CommandManager.register("MagicDamageSystem")
export class MagicDamageSystem extends SystemBase {
    private levelData: LevelData = null!;

    clear(): void {
        this.levelData = null!;
    }

    initliaze(levelData: LevelData) {
        this.levelData = levelData;
    }
}
