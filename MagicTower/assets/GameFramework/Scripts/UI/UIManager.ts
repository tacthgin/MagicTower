import { EventHandle } from "../Base/EventPool/EventHandle";
import { EventPool } from "../Base/EventPool/EventPool";
import { GameFrameworkEntry } from "../Base/GameFrameworkEntry";
import { GameFrameworkError } from "../Base/GameFrameworkError";
import { GameFrameworkModule } from "../Base/GameFrameworkModule";
import { IObejctPoolManager } from "../ObjectPool/IObejctPoolManager";
import { IObjectPool } from "../ObjectPool/IObjectPool";
import { IResourceManager } from "../Resource/IResourceManager";
import { IUIForm } from "./IUIForm";
import { IUIFormHelp } from "./IUIFormHelp";
import { IUIGroup } from "./IUIGroup";
import { IUIGroupHelp } from "./IUIGroupHelp";
import { IUIManager } from "./IUIManager";
import { UIEvent } from "./UIEvent";
import { UIEventArgs } from "./UIEventArgs";
import { UIFormInstanceObject } from "./UIFormInstanceObject";
import { UIGroup } from "./UIGroup";

@GameFrameworkEntry.registerModule("UIManager")
export class UIManager extends GameFrameworkModule implements IUIManager {
    private readonly _uiGroups: Map<string, UIGroup> = null!;
    private readonly _uiFormBeingLoaded: Map<number, string> = null!;
    private readonly _uiFormToReleaseOnLoad: Set<number> = null!;
    private readonly _eventPool: EventPool<UIEventArgs> = null!;
    private _resourceManger: IResourceManager | null = null;
    private _objectPoolManager: IObejctPoolManager | null = null;
    private _instancePool: IObjectPool<UIFormInstanceObject> = null!;
    private _uiFormHelp: IUIFormHelp | null = null;
    private _serialId: number = 0;
    private _shutDown: boolean = false;
    private _recyleQueue: Array<IUIForm> = null!;
    static readonly defaultUIGroupName: string = "default_ui_group";

    constructor() {
        super();
        this._uiGroups = new Map<string, UIGroup>();
        this._uiFormBeingLoaded = new Map<number, string>();
        this._uiFormToReleaseOnLoad = new Set<number>();
        this._eventPool = new EventPool<UIEventArgs>();
        this._recyleQueue = new Array<IUIForm>();
    }

    get uiGroupCount(): number {
        return this._uiGroups.size;
    }

    set instanceAutoRelaseInterval(value: number) {
        this._instancePool.autoReleaseInterval = value;
    }

    get instanceAutoRelaseInterval(): number {
        return this._instancePool.autoReleaseInterval;
    }

    set instanceCapacity(value: number) {
        this._instancePool.capacity = value;
    }

    get instanceCapacity(): number {
        return this._instancePool.capacity;
    }

    set instanceExpireTime(value: number) {
        this._instancePool.expireTime = value;
    }

    get instanceExpireTime(): number {
        return this._instancePool.expireTime;
    }

    set instancePriority(value: number) {
        this._instancePool.priority = value;
    }

    get instancePriority(): number {
        return this._instancePool.priority;
    }

    update(elapseSeconds: number): void {
        while (this._recyleQueue.length > 0) {
            let uiForm = this._recyleQueue.pop()!;
            uiForm.onRecyle();
            this._instancePool.upspawn(uiForm.handle as UIFormInstanceObject);
        }

        for (let pair of this._uiGroups) {
            pair[1].update(elapseSeconds);
        }
    }

    shutDown(): void {
        this._shutDown = true;
        this.closeAllLoadedUIForms();
        this._uiGroups.clear();
        this._uiFormBeingLoaded.clear();
        this._uiFormToReleaseOnLoad.clear();
        this._recyleQueue.length = 0;
    }

    setObjectPoolManager(objectPoolManager: IObejctPoolManager): void {
        this._objectPoolManager = objectPoolManager;
        this._instancePool = this._objectPoolManager.createSingleSpawnObjectPool(UIFormInstanceObject, "UI Instance Pool");
    }

    setResourceManager(resourceManager: IResourceManager): void {
        this._resourceManger = resourceManager;
    }

    setUIFormHelp(uiFormHelp: IUIFormHelp): void {
        this._uiFormHelp = uiFormHelp;
    }

    subscribe(id: number, eventHandle: EventHandle<UIEventArgs>, thisArg?: any): void {
        this._eventPool.subscribe(id, eventHandle, thisArg);
    }

    unsubscribe(id: number, eventHandle: EventHandle<UIEventArgs>, thisArg?: any): void {
        this._eventPool.unsubscribe(id, eventHandle, thisArg);
    }

    unsubscribeTarget(target: object): void {
        this._eventPool.unsubscribeTarget(target);
    }

    hasUIGroup(uiGroupName: string): boolean {
        if (!uiGroupName) {
            throw new GameFrameworkError("ui group name is invalid");
        }

        return this._uiGroups.has(uiGroupName);
    }

    getUIGroup(uiGroupName: string): IUIGroup | null {
        if (!uiGroupName) {
            throw new GameFrameworkError("ui group name is invalid");
        }
        let group = this._uiGroups.get(uiGroupName);
        if (group) {
            return group as IUIGroup;
        }
        return null;
    }

    getAllUIGroups(): IUIGroup[] {
        let uiGroups: Array<IUIGroup> = new Array<IUIGroup>(this._uiGroups.size);
        let index = 0;
        for (let pair of this._uiGroups) {
            uiGroups[index++] = pair[1];
        }
        return uiGroups;
    }

    addUIGroup(uiGroupName: string, uiGroupDepth: number, uiGroupHelp: IUIGroupHelp): boolean {
        if (!uiGroupName) {
            throw new GameFrameworkError("ui group name is invalid");
        }

        if (this.hasUIGroup(uiGroupName)) {
            return false;
        }

        this._uiGroups.set(uiGroupName, new UIGroup(uiGroupName, uiGroupDepth, uiGroupHelp));

        return true;
    }

    hasUIForm(serialIdOrUIFormAssetName: string | number): boolean {
        for (let pair of this._uiGroups) {
            if (pair[1].hasUIForm(serialIdOrUIFormAssetName)) {
                return true;
            }
        }
        return false;
    }

    getUIForm(serialIdOrUIFormAssetName: string | number): IUIForm | null {
        for (let pair of this._uiGroups) {
            let uiForm = pair[1].getUIForm(serialIdOrUIFormAssetName);
            if (uiForm) {
                return uiForm;
            }
        }
        return null;
    }

    getUIForms(uiFormAssetName: string): IUIForm[] {
        let results: IUIForm[] = [];
        for (let pair of this._uiGroups) {
            results = results.concat(pair[1].getUIForms(uiFormAssetName));
        }
        return results;
    }

    getAllLoadedUIForms(): IUIForm[] {
        let results: IUIForm[] = [];
        for (let pair of this._uiGroups) {
            results = results.concat(pair[1].getAllUIForms());
        }
        return results;
    }

    getAllLoadingUIFormSerialIds(): number[] {
        let serialIds: Array<number> = new Array<number>(this._uiFormBeingLoaded.size);
        let index = 0;
        for (let pair of this._uiFormBeingLoaded) {
            serialIds[index++] = pair[0];
        }
        return serialIds;
    }

    isLoadingUIForm(serialIdOrUIFormAssetName: string | number): boolean {
        if (typeof serialIdOrUIFormAssetName === "number") {
            return this._uiFormBeingLoaded.has(serialIdOrUIFormAssetName);
        } else if (serialIdOrUIFormAssetName) {
            for (let pair of this._uiFormBeingLoaded) {
                if (pair[1] === serialIdOrUIFormAssetName) {
                    return true;
                }
            }
        }
        return false;
    }

    async openUIForm(uiFormAssetName: string, uiGroupName?: string, pauseCoveredUIForm: boolean = false, userData?: Object): Promise<number> {
        if (!this._resourceManger) {
            throw new GameFrameworkError("you must set resouce manager first");
        }

        if (!this._objectPoolManager) {
            throw new GameFrameworkError("you must set object pool manager first");
        }

        if (!this._uiFormHelp) {
            throw new GameFrameworkError("you must set ui form help first");
        }

        if (!uiFormAssetName) {
            throw new GameFrameworkError("ui form asset name is invalid");
        }

        if (!uiGroupName) {
            uiGroupName = UIManager.defaultUIGroupName;
        }

        let uiGroup = this.getUIGroup(uiGroupName);
        if (!uiGroup) {
            throw new GameFrameworkError(`ui group name: ${uiGroupName} has not exist`);
        }

        let serialId = ++this._serialId;
        let uiFromInstanceObject: UIFormInstanceObject | null = this._instancePool.spawn();

        if (!uiFromInstanceObject) {
            let asset = this._resourceManger.internalResourceLoader.getAsset(uiFormAssetName);
            if (!asset) {
                this._uiFormBeingLoaded.set(serialId, uiFormAssetName);
                asset = await this._resourceManger.internalResourceLoader.loadAsset(uiFormAssetName);
                if (!asset) {
                    throw new GameFrameworkError(`${uiFormAssetName} asset is invalid`);
                }
                this._uiFormBeingLoaded.delete(serialId);
                if (this._uiFormToReleaseOnLoad.has(serialId)) {
                    this._uiFormToReleaseOnLoad.delete(serialId);
                    return -1;
                }
            }
            uiFromInstanceObject = UIFormInstanceObject.create(uiFormAssetName, asset, this._uiFormHelp.instantiateUIForm(asset), this._uiFormHelp);
            this._instancePool.register(uiFromInstanceObject, true);
        }
        this.internalOpenUIForm(serialId, uiFormAssetName, uiGroup as UIGroup, uiFromInstanceObject, pauseCoveredUIForm, false, userData);
        return serialId;
    }

    closeUIForm(serialIdOrUIForm: number | IUIForm, userData?: object): void {
        let uiForm: IUIForm | null = null;
        if (typeof serialIdOrUIForm === "number") {
            uiForm = this.getUIForm(serialIdOrUIForm);

            if (!uiForm) {
                throw new GameFrameworkError("ui form not exist");
            }
        } else {
            uiForm = serialIdOrUIForm;
        }

        let uiGroup = uiForm.uiGroup as UIGroup;
        if (!uiGroup) {
            throw new GameFrameworkError("ui group not exist");
        }

        uiGroup.removeUIForm(uiForm);
        uiForm.onClose(this._shutDown, userData);
        uiGroup.refresh();
        this._eventPool.fireNow(this, UIEventArgs.create(UIEvent.UI_FORM_CLOSE_EVENT));
        this._recyleQueue.splice(0, 0, uiForm);
    }

    closeAllLoadedUIForms(userData?: object): void {
        let uiForms = this.getAllLoadedUIForms();
        uiForms.forEach((uiform) => {
            if (this.hasUIForm(uiform.serialId)) {
                this.closeUIForm(uiform);
            }
        });
    }

    closeAllLoadingUIForms(): void {
        for (let pair of this._uiFormBeingLoaded) {
            this._uiFormToReleaseOnLoad.add(pair[0]);
        }
        this._uiFormBeingLoaded.clear();
    }

    refocusUIForm(uiForm: IUIForm, userData?: object): void {
        let uiGroup = uiForm.uiGroup as UIGroup;
        if (!uiGroup) {
            throw new GameFrameworkError("ui group not exist");
        }

        uiGroup.refocusUIForm(uiForm);
        uiGroup.refresh();
        uiForm.onRefocus(userData);
    }

    setUIFormInstanceLocked(uiFormInstance: object, locked: boolean): void {
        this._instancePool.setLocked(uiFormInstance, locked);
    }

    setUIFormInstancePriority(uiFormInstance: object, priority: number): void {
        this._instancePool.setPriority(uiFormInstance, priority);
    }

    private internalOpenUIForm(serialId: number, uiFormAssetName: string, uiGroup: UIGroup, uiFormInstance: object, pauseCoveredUIForm: boolean, isNewInstance: boolean, userData?: Object) {
        let uiForm = this._uiFormHelp!.createUIForm(uiFormInstance, uiGroup, userData);
        uiForm.onInit(serialId, uiFormAssetName, uiGroup, pauseCoveredUIForm, isNewInstance, userData);
        uiGroup.addUIForm(uiForm);
        uiForm.onOpen(userData);
        uiGroup.refresh();
        this._eventPool.fireNow(this, UIEventArgs.create(UIEvent.UI_FORM_OPEN_EVENT));
    }
}
