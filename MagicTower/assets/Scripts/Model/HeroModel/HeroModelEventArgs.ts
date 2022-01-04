import { ModelEventArgs } from "../../../GameFramework/Scripts/Application/Model/ModelEventArgs";
import { ReferencePool } from "../../../GameFramework/Scripts/Base/ReferencePool/ReferencePool";
import { HeroAttr } from "./HeroAttr";
import { HeroEvent } from "./HeroEvent";
import { PropType } from "./PropType";

/**
 * 英雄属性事件参数
 */
export class HeroAttrEventArgs extends ModelEventArgs {
    private _attr: HeroAttr = HeroAttr.NONE;
    private _attrValue: number = 0;

    get id(): number {
        return HeroEvent.HERO_ATTR;
    }

    get attr(): HeroAttr {
        return this._attr;
    }

    get attrValue(): number {
        return this._attrValue;
    }

    static create(attr: HeroAttr, attrValue: number): HeroAttrEventArgs {
        let attrEventArgs = ReferencePool.acquire(HeroAttrEventArgs);
        attrEventArgs._attr = attr;
        attrEventArgs._attrValue = attrValue;
        return attrEventArgs;
    }

    clear(): void {
        this._attr = HeroAttr.NONE;
        this._attrValue = 0;
    }
}

/**
 * 英雄装备道具事件参数
 */
export class HeroPropEventArgs extends ModelEventArgs {
    private _id: number = -1;
    private _propTypeOrId: PropType | number = PropType.NONE;
    private _propValue: number = 0;

    get id(): number {
        return this._id;
    }

    get propTypeOrId(): PropType | number {
        return this._propTypeOrId;
    }

    get propValue(): number {
        return this._propValue;
    }

    static create(id: HeroEvent, propTypeOrId: PropType | number, propValue: number): HeroPropEventArgs {
        let propEventArgs = ReferencePool.acquire(HeroPropEventArgs);
        propEventArgs._id = id;
        propEventArgs._propTypeOrId = propTypeOrId;
        propEventArgs._propValue = propValue;
        return propEventArgs;
    }

    clear(): void {
        this._id = -1;
        this._propTypeOrId = PropType.NONE;
        this._propValue = 0;
    }
}
