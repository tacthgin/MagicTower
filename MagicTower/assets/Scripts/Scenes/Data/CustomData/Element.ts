import { BaseLoadData } from "../../../Framework/Base/BaseData";

export class Door extends BaseLoadData {
    public gid: number = 0;
    /** 被动的墙 */
    public passive: boolean = false;
    /** 点击出现的墙 */
    public appear: boolean = false;
    /** 隐藏的墙 */
    public hide: boolean = false;
}

export class Stair extends BaseLoadData {
    public gid: number = 0;
    /** 楼梯旁站立的坐标索引 */
    public standLocation: number = 0;
    /** 跳转的等级差 */
    public levelDiff: number = 1;
    /** 隐藏的楼梯 */
    public hide: boolean = false;
}
