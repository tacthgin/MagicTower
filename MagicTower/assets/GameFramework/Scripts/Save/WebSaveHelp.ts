import { GameFrameworkError } from "../Base/GameFrameworkError";
import { ISaveHelp } from "./ISaveHelp";

/**
 * 使用web标准的localStorage作为存储辅助器
 */
export class WebSaveHelp implements ISaveHelp {
    get count(): number {
        return localStorage.length;
    }

    setNumber(name: string, value: number): void {
        localStorage.setItem(name, value.toString());
    }

    getNumber(name: string, defaultValue?: number): number | null {
        let value = localStorage.getItem(name);
        if (value !== null) {
            return Number(value);
        } else if (defaultValue !== undefined) {
            return defaultValue;
        }
        return null;
    }

    setString(name: string, value: string): void {
        localStorage.setItem(name, value);
    }

    getString(name: string, defaultValue?: string): string | null {
        let value = localStorage.getItem(name);
        if (value !== null) {
            return value;
        } else if (defaultValue !== undefined) {
            return defaultValue;
        }
        return null;
    }

    setObject(name: string, value: object): void {
        let newValue: string = "";
        try {
            newValue = JSON.stringify(value);
        } catch (error) {
            throw new GameFrameworkError("json stringify failed, value is invalid");
        }
        localStorage.setItem(name, newValue);
    }

    getObject(name: string, defaultValue?: object): object | null {
        let value = localStorage.getItem(name);
        if (value !== null) {
            let newValue = null;
            try {
                newValue = JSON.parse(value);
            } catch (error) {
                throw new GameFrameworkError("json parse failed, value is invalid");
            }
            return newValue;
        } else if (defaultValue !== undefined) {
            return defaultValue;
        }
        return null;
    }

    deleteData(name: string): void {
        localStorage.removeItem(name);
    }

    clear(): void {
        localStorage.clear();
    }

    forEach(callbackfn: (name: string, value: string) => void, thisArg?: any): void {
        let key: string | null = null;
        for (let i = 0; i < localStorage.length; ++i) {
            key = localStorage.key(0)!;
            callbackfn.call(thisArg, key, localStorage[key]);
        }
    }
}
