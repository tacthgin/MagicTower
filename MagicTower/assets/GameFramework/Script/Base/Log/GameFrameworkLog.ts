import { GameFrameworkLogLevel } from "./GameFrameworkLogLevel";
import { ILogHelper } from "./ILogHelper";

/**
 * 游戏框架日志
 */
export class GameFrameworkLog {
    private static s_logHelper: ILogHelper | null = null;

    /**
     * 设置日志辅助器
     * @param logHelper 日志辅助器
     */
    static setLogHelper(logHelper: ILogHelper) {
        this.s_logHelper = logHelper;
    }

    /**
     * 打印调试级别的日志，用于记录调试类日志信息
     * @param message 参数列表
     */
    static debug(...message: any[]): void {
        if (!this.s_logHelper) {
            return;
        }
        this.s_logHelper.log(GameFrameworkLogLevel.DEBUG, ...message);
    }

    /**
     * 打印信息级别的日志，用于记录常规日志信息
     * @param message 参数列表
     */
    static log(...message: any[]): void {
        if (!this.s_logHelper) {
            return;
        }
        this.s_logHelper.log(GameFrameworkLogLevel.INFO, ...message);
    }

    /**
     * 打印信息级别的日志，用于记录常规日志信息
     * @param message 参数列表
     */
    static info(...message: any[]): void {
        if (!this.s_logHelper) {
            return;
        }
        this.s_logHelper.log(GameFrameworkLogLevel.INFO, ...message);
    }

    /**
     * 打印警告级别的日志，建议在发生局部功能逻辑错误，但尚不会导致游戏崩溃或异常时使用
     * @param message 参数列表
     */
    static warn(...message: any[]): void {
        if (!this.s_logHelper) {
            return;
        }
        this.s_logHelper.log(GameFrameworkLogLevel.WARN, ...message);
    }

    /**
     * 打印错误级别的日志，建议在发生局部功能逻辑错误，但尚不会导致游戏崩溃或异常时使用
     * @param message 参数列表
     */
    static error(...message: any[]): void {
        if (!this.s_logHelper) {
            return;
        }
        this.s_logHelper.log(GameFrameworkLogLevel.ERROR, ...message);
    }

    /**
     * 打印堆栈日志，用于调试查看堆栈的时候使用
     * @param message
     */
    static trace(...message: any[]): void {
        if (!this.s_logHelper) {
            return;
        }
        this.s_logHelper.log(GameFrameworkLogLevel.TRACE, ...message);
    }
}
