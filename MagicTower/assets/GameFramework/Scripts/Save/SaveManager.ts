import { GameFrameworkEntry } from "../Base/GameFrameworkEntry";
import { GameFrameworkError } from "../Base/GameFrameworkError";
import { GameFrameworkModule } from "../Base/GameFrameworkModule";
import { ISaveHelp } from "./ISaveHelp";
import { ISaveManager } from "./ISaveManager";

@GameFrameworkEntry.registerModule("SaveManager")
export class SaveManager extends GameFrameworkModule implements ISaveManager {
    private _saveHelp: ISaveHelp | null = null;

    get count(): number {
        if (!this._saveHelp) {
            throw new GameFrameworkError("you must set save help first");
        }
        return this._saveHelp.count;
    }

    update(elapseSeconds: number): void {}

    shutDown(): void {}

    setSaveHelp(saveHelp: ISaveHelp): void {
        this._saveHelp = saveHelp;
    }

    setNumber(name: string, value: number): void {
        if (!this._saveHelp) {
            throw new GameFrameworkError("you must set save help first");
        }
        this._saveHelp.setNumber(name, value);
    }

    getNumber(name: string, defaultValue?: number): number | null {
        if (!this._saveHelp) {
            throw new GameFrameworkError("you must set save help first");
        }
        return this._saveHelp.getNumber(name, defaultValue);
    }

    setString(name: string, value: string): void {
        if (!this._saveHelp) {
            throw new GameFrameworkError("you must set save help first");
        }
        this._saveHelp.setString(name, value);
    }

    getString(name: string, defaultValue?: string): string | null {
        if (!this._saveHelp) {
            throw new GameFrameworkError("you must set save help first");
        }
        return this._saveHelp.getString(name, defaultValue);
    }

    setObject(name: string, value: object): void {
        if (!this._saveHelp) {
            throw new GameFrameworkError("you must set save help first");
        }
        this._saveHelp.setObject(name, value);
    }

    getObject(name: string, defaultValue?: object): object | null {
        if (!this._saveHelp) {
            throw new GameFrameworkError("you must set save help first");
        }
        return this._saveHelp.getObject(name, defaultValue);
    }

    deleteData(name: string): void {
        if (!this._saveHelp) {
            throw new GameFrameworkError("you must set save help first");
        }
        this._saveHelp.deleteData(name);
    }

    clear(): void {
        if (!this._saveHelp) {
            throw new GameFrameworkError("you must set save help first");
        }
        this._saveHelp.clear();
    }

    forEach(callbackfn: (name: string, value: string) => void, thisArg?: any): void {
        if (!this._saveHelp) {
            throw new GameFrameworkError("you must set save help first");
        }
        this._saveHelp.forEach(callbackfn, thisArg);
    }
}
