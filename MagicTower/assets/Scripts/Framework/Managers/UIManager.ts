import { instantiate, Node, NodePool, Prefab, resources, Vec3, view } from "cc";
import { BaseDialog } from "../Base/BaseDialog";
import { BasePoolNode } from "../Base/BasePoolNode";
import { ColorToast, ToastType } from "../Components/ColorToast";
import { GameManager } from "./GameManager";

enum UIPrefabPath {
    TOAST_PATH = "Prefabs/Base/ColorToast",
    DIALOGS_PATH = "Prefabs/Dialogs",
}

enum UILayerIndex {
    DIALOG_LAYER = 0,
    TOSAT_LAYER = 1,
}

type DialogQueueInfo = {
    dialogName: string;
    args: any[];
};

/** UI管理器 */
export class UIManager {
    /** 弹窗层，toast层等 */
    private layers: Node[] = null!;
    /** toast对象池 */
    private toastPool: NodePool = new NodePool("ColorToast");
    private toastY: number = 0;
    /** 弹窗缓存，避免重复打开弹窗 */
    private dialogCache: any = {};
    /** 弹窗名字对应的路径 */
    private dialogPath: any = {};
    /** 弹窗优先级队列 */
    private dialogQueue: DialogQueueInfo[] = [];
    /** 展示的所有弹窗 */
    private dialogs: any = {};

    init(layers: Node[]) {
        this.toastY = view.getVisibleSize().height * 0.75;
        let dirInfo = resources.getDirWithPath(UIPrefabPath.DIALOGS_PATH, Prefab);
        dirInfo.forEach((info) => {
            let name = info.path.substring(info.path.lastIndexOf("/") + 1);
            this.dialogPath[name] = info.path;
        });

        this.layers = layers;
        return this;
    }

    private createToast(prefab: Prefab) {
        let toast = BasePoolNode.generateNodeFromPool(this.toastPool, prefab);
        if (toast) {
            toast.position = new Vec3(0, this.toastY, 0);
            toast.parent = this.layers[UILayerIndex.TOSAT_LAYER];
        }
        return toast;
    }

    private createDialog(prefab: Prefab) {
        let dialog = instantiate(prefab);
        dialog.position = Vec3.ZERO;
        dialog.parent = this.layers[UILayerIndex.DIALOG_LAYER];
        return dialog;
    }

    clearLayers() {
        this.layers[UILayerIndex.DIALOG_LAYER].children.forEach((dialogNode) => {
            dialogNode.getComponent(BaseDialog)?.close(false);
        });

        this.layers[UILayerIndex.TOSAT_LAYER].children.forEach((toast) => {
            toast.getComponent(ColorToast)?.remove();
        });
    }

    /**
     * 飘字
     * @param content 飘字内容
     * @param toastType normal普通飘字，color富文本飘字
     */
    async showToast(content: string = "", toastType: ToastType = ToastType.NORAML) {
        if (!content || content == "") {
            return;
        }

        let prefab = resources.get<Prefab>(UIPrefabPath.TOAST_PATH);
        if (!prefab) {
            prefab = await GameManager.RESOURCE.loadAsset(UIPrefabPath.TOAST_PATH, Prefab);
            if (!prefab) {
                return;
            }
        }
        let toast = this.createToast(prefab);
        toast?.getComponent(ColorToast)?.init(content, toastType);
    }

    /**
     * 显示弹窗
     * @param dialogName 弹窗名字
     * @param args 弹窗初始化数据
     * @returns 返回Promise弹窗节点
     */
    async showDialog(dialogName: string, ...args: any[]): Promise<Node | null> {
        if (this.dialogCache[dialogName]) {
            console.error(`${dialogName}弹窗正在打开`);
            return null;
        }
        let dialogNode = this.layers[UILayerIndex.DIALOG_LAYER].getChildByName(dialogName);

        if (dialogNode && dialogNode.active) return null;

        if (!dialogNode) {
            let dialogPath = this.dialogPath[dialogName];
            if (!dialogPath) {
                console.error(`找不到${dialogName}预设`);
                return null;
            }
            let dialogPrefab = resources.get<Prefab>(dialogPath);
            if (!dialogPrefab) {
                this.dialogCache[dialogName] = true;
                dialogPrefab = await GameManager.RESOURCE.loadAsset(dialogPath, Prefab);
                this.dialogCache[dialogName] = false;
                if (!dialogPrefab) {
                    return null;
                }
            }
            dialogNode = this.createDialog(dialogPrefab);
        }
        dialogNode.active = true;
        let dialogIndex = Object.keys(this.dialogs).length;
        dialogNode.setSiblingIndex(dialogIndex);
        this.dialogs[dialogName] = dialogNode;
        let control: BaseDialog = dialogNode.getComponent(dialogName) as BaseDialog;
        if (control) {
            control.init(...args);
            control.executeStartAction();
        }
        return dialogNode;
    }

    /**
     * 通过队列顺序显示弹窗
     * @param dialogName 弹窗名字
     * @param args 弹窗初始化数据
     */
    showDialogWithQueue(dialogName: string, ...args: any[]): void {
        let index = this.dialogQueue.findIndex((info) => {
            return info.dialogName == dialogName;
        });
        if (index != -1) {
            console.error(`${dialogName}已经在队列中`);
            return;
        }
        this.dialogQueue.push({
            dialogName: dialogName,
            args: args,
        });
        if (this.dialogQueue.length == 1) {
            let queueInfo = this.dialogQueue[0];
            this.showDialog(queueInfo.dialogName, queueInfo.args);
        }
    }

    /** 弹窗关闭回调 */
    closeDialogCallback(dialogName: string) {
        let first = this.dialogQueue[0];
        if (first && first.dialogName === dialogName) {
            this.dialogQueue.shift();
            first = this.dialogQueue[0];
            first && this.showDialog(first.dialogName, first.args);
        }
    }

    closeDialog(dialogName: string, useAction: boolean = true) {
        let dialog = this.layers[UILayerIndex.DIALOG_LAYER].getChildByName(dialogName);
        dialog && dialog.getComponent(BaseDialog)?.close(useAction);
    }

    closeDialogs() {
        for (let dialogName in this.dialogs) {
            this.closeDialog(dialogName);
        }
    }

    isDialogExist(dialogName: string) {
        return !!this.dialogs[dialogName];
    }
}
