import { Vec2 } from "cc";
import { IAstarMap } from "../../../../../GameFramework/Scripts/ToolLibary/Astar/IAstarMap";

export interface IGameMap extends IAstarMap {
    getPositionAt(tile: Vec2): Vec2 | null;

    getTileIndex(tile: Vec2): number;
}
