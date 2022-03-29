import { ModelContainer } from "./ModelContainer";

/**
 * 模型变量保存属性装饰器
 * @param target
 * @param key
 */
export function saveMark(target: any, key: string) {
    ModelContainer.addModelSaveKey(target.constructor, key);
}
