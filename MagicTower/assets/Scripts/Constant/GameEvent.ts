/** 游戏事件 */
    //系统消息
    /** 切到后台 */
    /** 回到前台 */
    /** 音频中断 */
    /** 网络切换 */
    /** 资源加载成功 */
    /** 资源加载失败 */
    //用户自定义消息
    /** 勇士属性变化 */
    /** 道具UI刷新 */
    /** 元素动作结束 */
    /** 勇士和元素碰撞结束 */
    /** 切换层 */
    /** 刷新level ui */
    /** 刷新存档数据 */
    /** 怪物打架 */
    /** 场景出现 */
    /** 刷新装备 */
    /** 人物移动     */
    /** 使用道具 */
    /** 怪物死亡 */

import { _decorator } from 'cc';
export const GameEvent = {
    ON_HIDE: "ON_HIDE",
    ON_SHOW: "ON_SHOW",
    ON_AUDIO_INTERRUPTION_END: "ON_AUDIO_INTERRUPTION_END",
    ON_NETWORK_STATUS_CHANGE: "ON_NETWORK_STATUS_CHANGE",
    ALL_RESOURCES_LOAD_SUCCESS: "ALL_RESOURCES_LOAD_SUCCESS",
    ALL_RESOURCES_LOAD_FAILED: "ALL_RESOURCES_LOAD_FAILED",
    HERO_ATTR_CHANGED: "HERO_ATTR_CHANGED",
    REFRESH_PROP: "REFRESH_PROP",
    ELEMENT_ACTION_COMPLETE: "ELEMENT_ACTION_COMPLETE",
    COLLISION_COMPLETE: "COLLISION_COMPLETE",
    SWITCH_LEVEl: "SWITCH_LEVEl",
    REFRESH_LEVEL: "REFRESH_LEVEL",
    REFRESH_ARCHIVE: "REFRESH_ARCHIVE",
    MONSTER_FIGHT: "MONSTER_FIGHT",
    SCENE_APPEAR: "SCENE_APPEAR",
    REFRESH_EQUIP: "REFRESH_EQUIP",
    MOVE_PATH: "MOVE_PATH",
    USE_PROP: "USE_PROP",
    MONSTER_DIE: "MONSTER_DIE"
};

/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// /** 游戏事件 */
// export const GameEvent = {
//     //系统消息
//     /** 切到后台 */
//     ON_HIDE: "ON_HIDE",
// 
//     /** 回到前台 */
//     ON_SHOW: "ON_SHOW",
// 
//     /** 音频中断 */
//     ON_AUDIO_INTERRUPTION_END: "ON_AUDIO_INTERRUPTION_END",
// 
//     /** 网络切换 */
//     ON_NETWORK_STATUS_CHANGE: "ON_NETWORK_STATUS_CHANGE",
// 
//     /** 资源加载成功 */
//     ALL_RESOURCES_LOAD_SUCCESS: "ALL_RESOURCES_LOAD_SUCCESS",
// 
//     /** 资源加载失败 */
//     ALL_RESOURCES_LOAD_FAILED: "ALL_RESOURCES_LOAD_FAILED",
// 
//     //用户自定义消息
// 
//     /** 勇士属性变化 */
//     HERO_ATTR_CHANGED: "HERO_ATTR_CHANGED",
// 
//     /** 道具UI刷新 */
//     REFRESH_PROP: "REFRESH_PROP",
// 
//     /** 元素动作结束 */
//     ELEMENT_ACTION_COMPLETE: "ELEMENT_ACTION_COMPLETE",
// 
//     /** 勇士和元素碰撞结束 */
//     COLLISION_COMPLETE: "COLLISION_COMPLETE",
// 
//     /** 切换层 */
//     SWITCH_LEVEl: "SWITCH_LEVEl",
// 
//     /** 刷新level ui */
//     REFRESH_LEVEL: "REFRESH_LEVEL",
// 
//     /** 刷新存档数据 */
//     REFRESH_ARCHIVE: "REFRESH_ARCHIVE",
// 
//     /** 怪物打架 */
//     MONSTER_FIGHT: "MONSTER_FIGHT",
// 
//     /** 场景出现 */
//     SCENE_APPEAR: "SCENE_APPEAR",
// 
//     /** 刷新装备 */
//     REFRESH_EQUIP: "REFRESH_EQUIP",
// 
//     /** 人物移动     */
//     MOVE_PATH: "MOVE_PATH",
// 
//     /** 使用道具 */
//     USE_PROP: "USE_PROP",
// 
//     /** 怪物死亡 */
//     MONSTER_DIE: "MONSTER_DIE"
// };
