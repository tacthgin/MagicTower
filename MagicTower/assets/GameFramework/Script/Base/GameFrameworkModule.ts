/**
 * 游戏框架模块
 */
export abstract class GameFrameworkModule {
    /**
     * 游戏框架模块优先级，优先级较高的模块会优先轮询，并且关闭操作会后进行。
     */
    get priority() {
        return 0;
    }

    /**
     * 游戏模块轮询。
     * @param elapseSeconds 逻辑流逝时间
     */
    abstract update(elapseSeconds: number): void;

    /**
     * 关闭并清理游戏框架模块。
     */
    abstract shutDown(): void;
}
