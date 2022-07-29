import { director, Scene } from "cc";
import { GameFrameworkLog } from "../../Script/Base/Log/GameFrameworkLog";
import { ISceneHelper } from "../../Script/Scene/ISceneHelper";

export class CSceneHelper implements ISceneHelper {
    getScene<T extends object>(): T | null {
        return director.getScene() as T;
    }

    loadScene(sceneName: string, onLaunchedCallback?: Function, onUnloadedCallback?: Function): boolean {
        return director.loadScene(
            sceneName,
            (error: Error | null, scene?: Scene) => {
                if (error) {
                    GameFrameworkLog.error(error);
                }
                onLaunchedCallback && onLaunchedCallback();
            },
            () => {
                onUnloadedCallback && onUnloadedCallback();
            }
        );
    }

    preloadScene(sceneName: string, onProgressCallback?: (completedCount: number, totalCount: number, item: any) => void, onLoadedCallback?: (error: Error | null, sceneAsset?: object) => void): void {
        if (onProgressCallback && onLoadedCallback) {
            director.preloadScene(sceneName, onProgressCallback, onLoadedCallback);
        } else {
            director.preloadScene(sceneName, onLoadedCallback);
        }
    }
}
