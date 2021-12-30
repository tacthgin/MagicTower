export type ReleaseObjectFilterCallback<T> = (candidateObjects: Array<T>, releaseCount: number, expireTime: number) => Array<T>;
