import { _decorator } from "cc";
import { MapElement } from "./MapElement";
const { ccclass, property } = _decorator;

@ccclass("EventTrigger")
export class EventTrigger extends MapElement {
    private _eventId: number = 0;

    get id() {
        return this._eventId;
    }

    init(id: number) {
        this._eventId = id;
    }

    add() {}

    remove() {
        super.remove(true);
    }
}
