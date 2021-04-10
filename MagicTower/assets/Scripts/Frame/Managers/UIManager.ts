import { director, instantiate, js, NodePool, Prefab, resources, UITransform, Vec3, view, Node } from "cc";
import { BaseDialog } from "../Base/BaseDialog";
import { BasePoolNode } from "../Base/BasePoolNode";
import { ColorToast, ToastType } from "../Components/ColorToast";

enum UIPrefabPath {
    TOAST_PATH = "Prefabs/Base/ColorToast",
    DIALOGS_PATH = "Prefabs/Dialogs",
}

type DialogQueueInfo = {
    dialogName: string;
    args: any[];
};

/** UI管理器 */
export class UIManager {
    /** 弹窗起始优先级 */
    private DIALOG_PRIORITY: number = 255;
    /** toast优先级 */
    private TOAST_PRIORITY: number = 512;
    /** toast对象池 */
    private toastPool: NodePool = new NodePool("ColorToast");
    private toastY: number = 0;
    /** 弹窗缓存，避免重复打开弹窗 */
    private dialogCache: any = {};
    /** 弹窗名字对应的路径 */
    private dialogPath: any = {};
    /** 弹窗优先级队列 */
    private dialogQueue: DialogQueueInfo[] = [];

    init() {
        this.toastY = view.getFrameSize().height * 0.75;
        let dirInfo = resources.getDirWithPath(UIPrefabPath.DIALOGS_PATH, Prefab);
        dirInfo.forEach((info) => {
            let name = info.path.substring(info.path.lastIndexOf("/") + 1);
            this.dialogPath[name] = info.path;
        });
        return this;
    }

    private getCanvas(): any {
        return director.getScene().getChildByName("Canvas");
    }

    private createToast(prefab: Prefab) {
        let toast = BasePoolNode.generateNodeFromPool(this.toastPool, prefab);
        toast.position = new Vec3(0, this.toastY, 0);
        toast.parent = this.getCanvas();
        toast.getComponent(UITransform).priority = this.TOAST_PRIORITY;
        return toast;
    }

    private createDialog(prefab: Prefab) {
        let dialog = instantiate(prefab);
        dialog.position = Vec3.ZERO;
        dialog.parent = this.getCanvas();
        dialog.getComponent(UITransform).priority = this.DIALOG_PRIORITY;
        return dialog;
    }

    private loadPrefab(path: string): Promise<Prefab> {
        return new Promise((resolve) => {
            resources.load(path, Prefab, (err, prefab: Prefab) => {
                if (err) {
                    console.error(err);
                    resolve(null);
                }
                resolve(prefab);
            });
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
            prefab = await this.loadPrefab(UIPrefabPath.TOAST_PATH);
            if (!prefab) {
                return;
            }
        }
        let toast = this.createToast(prefab);
        toast.getComponent(ColorToast).init(content, toastType);
    }

    /**
     * 显示弹窗
     * @param dialogName 弹窗名字
     * @param args 弹窗初始化数据
     * @returns 返回Promise弹窗节点
     */
    async showDialog(dialogName: string, ...args: any[]): Promise<Node> {
        if (this.dialogCache[dialogName]) {
            console.error(`${dialogName}弹窗正在打开`);
            return null;
        }
        let dialogNode = this.getCanvas().getChildByName(dialogName);

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
                dialogPrefab = await this.loadPrefab(dialogPath);
                this.dialogCache[dialogName] = false;
                if (!dialogPrefab) {
                    return null;
                }
            }
            dialogNode = this.createDialog(dialogPrefab);
        }
        dialogNode.active = true;
        let control: BaseDialog = dialogNode.getComponent(js.getClassByName(dialogName));
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
}
