export interface Constructor<T = object> {
    new (...args: any[]): T;
}
