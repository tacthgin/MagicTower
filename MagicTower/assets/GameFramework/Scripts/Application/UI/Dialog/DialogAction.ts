import { Component, js, Node, tween, Vec3 } from "cc";

export enum DialogAction {
    NoneAction,
    ScaleAction,
}

export class DialogActionFactory {
    static registerAction(dialogAction: DialogAction) {}
}
