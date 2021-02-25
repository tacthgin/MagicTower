import { director, instantiate, path, Prefab, resources, UITransform, Vec3, NodePool } from "cc";
import { BasePoolNode } from "../Base/BasePoolNode";

export enum ToastType {
    NORAML,
    RICH,
}

class UIManager {
    /** 弹窗起始优先级 */
    private DIALOG_PRIORITY: number = 255;

    private TOAST_PRIORITY: number = 512;

    /** toast预设路径 */
    private TOAST_PATH: string = `Prefabs/ColorToast`;

    private toastPool: NodePool = new NodePool("ColorToast");

    private getCanvas(): any {
        return director.getScene().getChildByName("Canvas");
    }

    private createToast(prefab: Prefab, content: string) {
        let toast = BasePoolNode.generateNodeFromPool(this.toastPool, prefab);
        toast.getComponent(UITransform).priority = this.TOAST_PRIORITY;
        toast.parent = this.getCanvas();
        let toastControl: any = toast.getComponent("ColorToast");
        toastControl.init(content);
    }

    private createDialog(prefab: Prefab, dialogName: string, ...args: any[]) {
        let dialog = instantiate(prefab);
        dialog.position = Vec3.ZERO;
        dialog.getComponent(UITransform).priority = this.DIALOG_PRIORITY;
        dialog.parent = this.getCanvas();

        let control: any = dialog.getComponent(dialogName);
        control && control.init && control.init(...args);
        return control;
    }

    /**
     * 飘字
     * @param content 飘字内容
     * @param toastType normal普通飘字，color富文本飘字
     */
    showToast(content: string = "", toastType: ToastType = ToastType.NORAML) {
        if (!content || content == "") {
            return;
        }

        if (toastType == ToastType.NORAML) {
            content = `<color=#ffffff>${content}</color>`;
        }

        let prefab = resources.get<Prefab>(this.TOAST_PATH);
        if (prefab) {
            this.createToast(prefab, content);
        } else {
            resources.load(this.TOAST_PATH, Prefab, (err, prefab: Prefab) => {
                if (err) {
                    console.error(err);
                    return;
                }
                this.createToast(prefab, content);
            });
        }
    }

    /**
     * 显示弹窗
     * @param path 弹窗路径
     * @param args 弹窗初始化数据
     * @returns 返回Promise 弹窗控制器
     */
    showDialog(dialogPath: string, ...args: any[]) {
        return new Promise((resolve, reject) => {
            let index = dialogPath.lastIndexOf("/");
            let dialogName = index != -1 ? dialogPath.substring(index + 1) : dialogPath;
            let dialogNode = this.getCanvas().getChildByName(dialogName);
            //弹窗做缓存判断
            if (dialogNode && dialogNode.active) return;

            if (!dialogNode) {
                let createFunc = (prefab: Prefab, name: string, ...args: any[]) => {
                    let control = this.createDialog(prefab, name, ...args);
                    if (control) {
                        resolve(control);
                    } else {
                        reject(`${dialogName}弹窗无脚本`);
                    }
                };

                let dialogPrefab = resources.get<Prefab>(dialogPath);
                if (dialogPrefab) {
                    createFunc(dialogPrefab, dialogName, ...args);
                } else {
                    resources.load(dialogPath, Prefab, (err, prefab: Prefab) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        createFunc(prefab, dialogName, ...args);
                    });
                }
            } else if (!dialogNode.active) {
                let control: any = dialogNode.getComponent(dialogName);
                dialogNode.active = true;
                control && control.init(...args);
                resolve(control);
            }
        });
    }
}

/** UI管理器 */
export let UIManger = new UIManager();
