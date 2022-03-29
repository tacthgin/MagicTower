import { ModelBase } from "./ModelBase";

/**
 * 模型变量保存属性装饰器
 * @param target
 * @param key
 */
export function saveMark(target: ModelBase, key: string) {
    target.addSaveKey(key);
}
