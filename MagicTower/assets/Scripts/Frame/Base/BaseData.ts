import { js, sys } from "cc";
import { CustomEventData } from "../Managers/NotifyCenter";

export abstract class BaseData extends CustomEventData {
    saveData() {}

    static saveAll() {
        sys.localStorage.setItem(js.getClassName(this), this);
    }

    static loadData(itemName: string) {
        return sys.localStorage.getItem(itemName);
    }
}
