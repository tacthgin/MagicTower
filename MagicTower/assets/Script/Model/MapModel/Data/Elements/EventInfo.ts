import { Element } from "./Element";

export class EventInfo extends Element {
    private _monsters: string[] | null = null;

    set monsters(value: string[]) {
        this._monsters = value;
    }

    get mosnters() {
        return this._monsters;
    }
}
