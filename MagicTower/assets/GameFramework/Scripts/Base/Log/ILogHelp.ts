import { GameFrameworkLogLevel } from "./GameFrameworkLogLevel";

/** 日志辅助器 */
export interface ILogHelp {
    /**
     * 游戏框架日志辅助器接口
     * @param level 日志级别
     * @param message 日志信息
     */
    log(level: GameFrameworkLogLevel, ...message: any[]): void;
}
