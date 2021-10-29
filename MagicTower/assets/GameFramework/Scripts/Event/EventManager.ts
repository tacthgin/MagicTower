import { _decorator, EventTarget } from "cc";

/** 自定义事件，支持整型和字符创类型事件分发 */
export class CustomEventTarget extends EventTarget {
    hasEventListener(type: number | string, callback?: (...any: any[]) => void, target?: any): boolean {
        return super.hasEventListener(type.toString(), callback, target);
    }

    on<TFunction extends (...any: any[]) => void>(type: number | string, callback: TFunction, thisArg?: any, once?: boolean): typeof callback {
        return super.on(type.toString(), callback, thisArg, once);
    }

    once<TFunction extends (...any: any[]) => void>(type: number | string, callback: TFunction, thisArg?: any): typeof callback {
        return super.on(type.toString(), callback, thisArg);
    }

    off<TFunction extends (...any: any[]) => void>(type: number | string, callback?: TFunction, thisArg?: any): void {
        return super.off(type.toString(), callback, thisArg);
    }

    emit(type: number | string, arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any): void {
        super.emit(type.toString(), arg0, arg1, arg2, arg3, arg4);
    }
}

/** 消息分发中心 */
export let NotifyCenter = new CustomEventTarget();
