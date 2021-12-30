export class SystemUtility {
    /**
     * 克隆object
     * @param object
     * @returns 克隆过的object
     */
    clone(object: Object | null | undefined): Object | null | undefined {
        if (!object || typeof object != "object") return object;

        // Handle Date
        if (object instanceof Date) {
            let copy = new Date();
            copy.setTime(object.getTime());
            return copy;
        }

        // Handle Array
        if (object instanceof Array) {
            let copy = [];
            for (let i = 0, len = object.length; i < len; ++i) {
                copy[i] = this.clone(object[i]);
            }
            return copy;
        }

        // Handle Object
        if (object instanceof Object) {
            let copy: any = {};
            for (let attr in object) {
                if (object.hasOwnProperty(attr)) {
                    copy[attr] = this.clone((object as any)[attr]);
                }
            }
            return copy;
        }

        return null;
    }
}
