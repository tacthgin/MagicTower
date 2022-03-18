import { GameFrameworkEntry } from "../Base/GameFrameworkEntry";
import { GameFrameworkError } from "../Base/GameFrameworkError";
import { GameFrameworkModule } from "../Base/GameFrameworkModule";
import { ISceneHelp } from "./ISceneHelp";
import { ISceneManager } from "./ISceneManager";

@GameFrameworkEntry.registerModule("SceneManager")
export class SceneManager extends GameFrameworkModule implements ISceneManager {
    private _sceneHelp: ISceneHelp | null = null;

    update(elapseSeconds: number): void {}

    shutDown(): void {
        this._sceneHelp = null;
    }

    setSceneHelp(sceneHelp: ISceneHelp): void {
        this._sceneHelp = sceneHelp;
    }

    getScene<T extends object>(): T | null {
        if (!this._sceneHelp) {
            throw new GameFrameworkError("you must set scene help first");
        }
        return this._sceneHelp.getScene();
    }

    loadScene(sceneName: string, onLaunchedCallback?: Function, onUnloadedCallback?: Function): boolean {
        if (!this._sceneHelp) {
            throw new GameFrameworkError("you must set scene help first");
        }
        return this._sceneHelp.loadScene(sceneName, onLaunchedCallback, onUnloadedCallback);
    }

    preloadScene(sceneName: string, onProgressCallback?: (completedCount: number, totalCount: number, item: any) => void, onLoadedCallback?: (error: Error | null, sceneAsset?: object) => void): void {
        if (!this._sceneHelp) {
            throw new GameFrameworkError("you must set scene help first");
        }
        return this._sceneHelp.preloadScene(sceneName, onProgressCallback, onLoadedCallback);
    }
}
