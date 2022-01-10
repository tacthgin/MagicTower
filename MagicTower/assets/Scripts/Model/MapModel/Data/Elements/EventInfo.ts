import { Element } from "./Element";

export class EventInfo extends Element {
    private _monsters: string[] | null = null;

    set monsters(value: string[]) {
        this._monsters = value;
    }

    get mosnters() {
        return this._monsters;
    }

    static parse(propertiesInfo: any) {
        let eventInfo: { [key: string]: EventInfo } = {};
        for (let index in propertiesInfo) {
            let element = new EventInfo();
            element.id = parseInt(propertiesInfo[index]);
            eventInfo[index] = element;
        }
        return eventInfo;
    }
}
