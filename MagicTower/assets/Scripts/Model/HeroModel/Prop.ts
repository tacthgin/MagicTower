export enum PropType {
    NONE,
    /** 钥匙 */
    KEY,
    HEALING_SALVE,
    ATTACK_GEM,
    DEFENCE_GEM,
    SWARD,
    SHIELD,
    MONSTER_HAND_BOOK,
    RECORD_BOOK,
    /** 飞行魔杖 */
    FLYING_WAND,
    /** 镐 */
    PICKAXE,
    /** 地震卷轴 */
    EARTHQUAKE_SCROLL,
    /** 冰冻魔法 */
    ICE_MAGIC,
    BOMB,
    MAGIC_KEY,
    HOLY_WATER,
    LUCKY_GOLD,
    CROSS,
    DRAGON_SLAYING_KNIFE,
    /** 上下飞行 */
    FEATHER,
    /** 中心飞行 */
    CENTER_FEATHER,
}

export enum PropId {
    DIVINE_SHIELD = 17,
}

export interface PropInfo {
    id: string;
    type: number;
    spriteId: string;
    name: string;
    value: number;
    desc: string;
    consumption: boolean;
    permanent: boolean;
    initNum: number;
}
