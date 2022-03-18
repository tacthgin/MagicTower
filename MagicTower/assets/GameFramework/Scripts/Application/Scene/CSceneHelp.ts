import { director, Node, Scene } from "cc";
import { GameFrameworkLog } from "../../Base/Log/GameFrameworkLog";
import { ISceneHelp } from "../../Scene/ISceneHelp";

export class CSceneHelp implements ISceneHelp {
    /**
     * 永驻节点，切换场景的时候提高层级
     */
    private globalNode: Node | null = null;

    /**
     * 设置永驻节点
     * @param node 永驻节点
     */
    setGlobalNode(node: Node) {
        this.globalNode = node;
    }

    /**
     * 调整永驻节点的层级
     */
    adjustGlobalNodeIndex() {
        if (this.globalNode) {
            let parent = this.globalNode.parent;
            if (parent) {
                this.globalNode.setSiblingIndex(parent.children.length);
            }
        } else {
            GameFrameworkLog.warn("scene help global node not set");
        }
    }

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
                //this.adjustGlobalNodeIndex();
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
