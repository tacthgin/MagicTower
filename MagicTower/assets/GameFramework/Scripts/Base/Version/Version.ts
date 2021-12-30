import { IVersionHelp } from "./IVersionHelp";

export class Version {
    private static _gameFrameVersionString: string = "2021.12.21";
    private static _versionHelp: IVersionHelp | null = null;

    /**
     * 游戏框架版本号
     */
    static get gameFrameworkVersion(): string {
        return this._gameFrameVersionString;
    }

    /**
     * 游戏版本号
     */
    static get gameVersion(): string {
        if (this._versionHelp) {
            return this._versionHelp.gameVersion;
        }
        return "";
    }

    /**
     * 游戏内部版本号
     */
    static get internalGameVersion(): number {
        if (this._versionHelp) {
            return this._versionHelp.internalGameVerison;
        }
        return 0;
    }

    /**
     * 设置版本号辅助器
     * @param versionHelp
     */
    static setVersionHelp(versionHelp: IVersionHelp) {
        this._versionHelp = versionHelp;
    }
}
