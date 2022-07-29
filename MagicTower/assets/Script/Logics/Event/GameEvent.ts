export enum GameEvent {
    /** 勇士和元素碰撞结束 */
    COLLISION_COMPLETE,
    /** 刷新存档数据 */
    REFRESH_ARCHIVE,
    /** 怪物打架 */
    MONSTER_FIGHT,
    MONSTER_DIE,
    /** 场景出现 */
    SCENE_APPEAR,
    SCENE_DISAPPEAR,
    /** 人物移动     */
    MOVE_PATH,
    /** 使用道具 */
    USE_PROP,
    //事件系统命令
    COMMAND_DISAPPEAR,
    COMMAND_APPEAR,
    COMMAND_EVENT,
    COMMAND_COLLISION,
    COMMAND_MOVE,
    COMMAND_SPECIAL_MOVE,
    COMMAND_SHOW,
}
