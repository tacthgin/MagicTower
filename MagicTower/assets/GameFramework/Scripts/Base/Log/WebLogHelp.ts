import { GameFrameworkLogLevel } from "./GameFrameworkLogLevel";
import { ILogHelp } from "./ILogHelp";

/**
 * web打印日志辅助器
 */
export class WebLogHelp implements ILogHelp {
    /**
     * 游戏框架日志辅助器接口
     * @param level 日志级别
     * @param message 日志信息
     */
    log(level: GameFrameworkLogLevel, ...message: any[]): void {
        switch (level) {
            case GameFrameworkLogLevel.DEBUG:
                console.debug(...message);
                break;
            case GameFrameworkLogLevel.INFO:
                console.info(...message);
                break;
            case GameFrameworkLogLevel.WARN:
                console.warn(...message);
                break;
            case GameFrameworkLogLevel.ERROR:
                console.error(...message);
                break;
        }
    }
}
