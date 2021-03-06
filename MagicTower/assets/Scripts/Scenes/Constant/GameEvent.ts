export enum GameEvent {
    /** 元素动作结束 */
    ELEMENT_ACTION_COMPLETE,

    /** 勇士和元素碰撞结束 */
    COLLISION_COMPLETE,

    /** 切换层 */
    SWITCH_LEVEl,

    /** 刷新level ui */
    REFRESH_LEVEL,

    /** 刷新存档数据 */
    REFRESH_ARCHIVE,

    /** 怪物打架 */
    MONSTER_FIGHT,

    /** 场景出现 */
    SCENE_APPEAR,

    /** 人物移动     */
    MOVE_PATH,

    /** 使用道具 */
    USE_PROP,

    /** 怪物死亡 */
    MONSTER_DIE,
}
