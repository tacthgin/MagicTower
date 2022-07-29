import { GameFrameworkEntry } from "../Base/GameFrameworkEntry";
import { GameFrameworkError } from "../Base/GameFrameworkError";
import { GameFrameworkModule } from "../Base/GameFrameworkModule";
import { ISaveHelper } from "./ISaveHelper";
import { ISaveManager } from "./ISaveManager";

@GameFrameworkEntry.registerModule("SaveManager")
export class SaveManager extends GameFrameworkModule implements ISaveManager {
    private _saveHelper: ISaveHelper | null = null;

    get count(): number {
        if (!this._saveHelper) {
            throw new GameFrameworkError("you must set save help first");
        }
        return this._saveHelper.count;
    }

    update(elapseSeconds: number): void {}

    shutDown(): void {
        this._saveHelper = null;
    }

    setSaveHelper(saveHelper: ISaveHelper): void {
        this._saveHelper = saveHelper;
    }

    setNumber(name: string, value: number): void {
        if (!this._saveHelper) {
            throw new GameFrameworkError("you must set save help first");
        }
        this._saveHelper.setNumber(name, value);
    }

    getNumber(name: string, defaultValue?: number): number | null {
        if (!this._saveHelper) {
            throw new GameFrameworkError("you must set save help first");
        }
        return this._saveHelper.getNumber(name, defaultValue);
    }

    setString(name: string, value: string): void {
        if (!this._saveHelper) {
            throw new GameFrameworkError("you must set save help first");
        }
        this._saveHelper.setString(name, value);
    }

    getString(name: string, defaultValue?: string): string | null {
        if (!this._saveHelper) {
            throw new GameFrameworkError("you must set save help first");
        }
        return this._saveHelper.getString(name, defaultValue);
    }

    setObject(name: string, value: object): void {
        if (!this._saveHelper) {
            throw new GameFrameworkError("you must set save help first");
        }
        this._saveHelper.setObject(name, value);
    }

    getObject(name: string, defaultValue?: object): object | null {
        if (!this._saveHelper) {
            throw new GameFrameworkError("you must set save help first");
        }
        return this._saveHelper.getObject(name, defaultValue);
    }

    deleteData(name: string): void {
        if (!this._saveHelper) {
            throw new GameFrameworkError("you must set save help first");
        }
        this._saveHelper.deleteData(name);
    }

    clear(): void {
        if (!this._saveHelper) {
            throw new GameFrameworkError("you must set save help first");
        }
        this._saveHelper.clear();
    }

    forEach(callbackfn: (name: string, value: string) => void, thisArg?: any): void {
        if (!this._saveHelper) {
            throw new GameFrameworkError("you must set save help first");
        }
        this._saveHelper.forEach(callbackfn, thisArg);
    }
}
