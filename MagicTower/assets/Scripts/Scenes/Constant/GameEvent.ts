export enum GameEvent {
    /** 勇士属性变化 */
    HERO_ATTR_CHANGED,

    /** 道具UI刷新 */
    REFRESH_PROP,

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

    /** 刷新装备 */
    REFRESH_EQUIP,

    /** 人物移动     */
    MOVE_PA,

    /** 使用道具 */
    USE_PPOP,

    /** 怪物死亡 */
    MONSTER_DIE,
}
