import { GameFrameworkEntry } from "../Base/GameFrameworkEntry";
import { GameFrameworkError } from "../Base/GameFrameworkError";
import { GameFrameworkModule } from "../Base/GameFrameworkModule";
import { ISceneHelper } from "./ISceneHelper";
import { ISceneManager } from "./ISceneManager";

@GameFrameworkEntry.registerModule("SceneManager")
export class SceneManager extends GameFrameworkModule implements ISceneManager {
    private _sceneHelper: ISceneHelper | null = null;

    update(elapseSeconds: number): void {}

    shutDown(): void {
        this._sceneHelper = null;
    }

    setSceneHelper(sceneHelper: ISceneHelper): void {
        this._sceneHelper = sceneHelper;
    }

    getScene<T extends object>(): T | null {
        if (!this._sceneHelper) {
            throw new GameFrameworkError("you must set scene help first");
        }
        return this._sceneHelper.getScene();
    }

    loadScene(sceneName: string, onLaunchedCallback?: Function, onUnloadedCallback?: Function): boolean {
        if (!this._sceneHelper) {
            throw new GameFrameworkError("you must set scene help first");
        }
        return this._sceneHelper.loadScene(sceneName, onLaunchedCallback, onUnloadedCallback);
    }

    preloadScene(sceneName: string, onProgressCallback?: (completedCount: number, totalCount: number, item: any) => void, onLoadedCallback?: (error: Error | null, sceneAsset?: object) => void): void {
        if (!this._sceneHelper) {
            throw new GameFrameworkError("you must set scene help first");
        }
        return this._sceneHelper.preloadScene(sceneName, onProgressCallback, onLoadedCallback);
    }
}
