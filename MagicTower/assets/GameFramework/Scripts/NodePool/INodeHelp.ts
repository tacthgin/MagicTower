export interface INodeHelp {
    instantiateNode(asset: object): object;
    releaseNode(node: object): void;
}
