import { Constructor } from "../Base/DataStruct/Constructor";
import { GameFrameworkError } from "../Base/GameFrameworkError";
import { ReferencePool } from "../Base/ReferencePool/ReferencePool";
import { Variable } from "../Base/Variable/Variable";
import { FsmBase } from "./FsmBase";
import { FsmState } from "./FsmState";
import { IFsm } from "./IFsm";

export class Fsm<T extends {}> extends FsmBase implements IFsm<T> {
    private _owner: T | null = null;
    private readonly _states: Map<Constructor<FsmState<T>>, FsmState<T>> = null!;
    private _datas: Map<string, Variable<Object>> | null = null;
    private _currentState: FsmState<T> | null = null;
    private _isDestoryed: boolean = false;
    private _currentStateTime: number = 0;

    constructor() {
        super();
        this._states = new Map<Constructor<FsmState<T>>, FsmState<T>>();
    }

    get owner(): T {
        return this._owner!;
    }

    get currentState(): FsmState<T> | null {
        return this._currentState;
    }

    get fsmStateCount(): number {
        return this._states.size;
    }

    get isRunning(): boolean {
        return this._currentState != null;
    }

    get isDestroyed(): boolean {
        return this._isDestoryed;
    }

    get currentStateTime(): number {
        return this._currentStateTime;
    }

    update(elapseSeconds: number): void {
        if (!this._currentState) {
            return;
        }

        this._currentStateTime += elapseSeconds;
        this._currentState.onUpdate(this, elapseSeconds);
    }

    shutDown(): void {
        ReferencePool.release(this);
    }

    /**
     * 创建有限状态机
     * @param name 有限状态机名称
     * @param owner 有限状态机拥有者
     * @param states 有限状态机状态
     * @returns 有限状态机
     */
    static create<T extends {}>(name: string, owner: T, states: FsmState<T>[]): Fsm<T> {
        if (!name) {
            throw new GameFrameworkError("name is invalid");
        }

        if (states.length < 1) {
            throw new GameFrameworkError("fsm states is invalid");
        }

        let fsm: Fsm<T> = ReferencePool.acquire<Fsm<T>>(Fsm);
        fsm._name = name;
        fsm._owner = owner;
        fsm._isDestoryed = false;

        states.forEach((state) => {
            if (fsm._states.has(state.constructor as Constructor<FsmState<T>>)) {
                throw new GameFrameworkError("state already exist");
            }
            fsm._states.set(state.constructor as Constructor<FsmState<T>>, state);
            state.onInit(fsm);
        });

        return fsm;
    }

    /**
     * 清理有限状态机
     */
    clear(): void {
        if (this._currentState) {
            this._currentState.onLeave(this, true);
        }

        this._states.forEach((state) => {
            state.onDestroy(this);
        });

        this._name = "";
        this._owner = null;
        this._states.clear();

        if (this._datas) {
            this._datas.forEach((data: Variable<Object>) => {
                if (data.value !== null) {
                    ReferencePool.release(data);
                }
            });

            this._datas.clear();
        }
        this._currentState = null;
        this._currentStateTime = 0;
        this._isDestoryed = true;
    }

    start<TState extends FsmState<T>>(stateConstructor: Constructor<TState>): void {
        if (this.isRunning) {
            throw new GameFrameworkError("fsm is running, can't start again");
        }

        let state = this.getState(stateConstructor);
        if (!state) {
            throw new GameFrameworkError(`fsm ${this.name} can't not start state which is not exist`);
        }
        this._currentStateTime = 0;
        this._currentState = state;
        this._currentState.onEnter(this);
    }

    hasState<TState extends FsmState<T>>(stateConstructor: Constructor<TState>): boolean {
        return this._states.has(stateConstructor);
    }

    getState<TState extends FsmState<T>>(stateConstructor: Constructor<TState>): FsmState<T> | null {
        return this._states.get(stateConstructor) || null;
    }

    getAllStates(): FsmState<T>[] {
        let states: Array<FsmState<T>> = new Array<FsmState<T>>(this._states.size);
        let index = 0;
        for (let pair of this._states) {
            states[index++] = pair[1];
        }
        return states;
    }

    hasData(name: string): boolean {
        if (!name) {
            throw new GameFrameworkError("name is invalid");
        }

        if (!this._datas) {
            return false;
        }

        return this._datas.has(name);
    }

    getData<TData extends Variable<Object>>(name: string): TData | null {
        if (!name) {
            throw new GameFrameworkError("name is invalid");
        }

        if (this._datas) {
            let data = this._datas.get(name);
            return data ? (data as TData) : null;
        }

        return null;
    }

    setData<TData extends Variable<Object>>(name: string, data: TData): void {
        if (!name) {
            throw new GameFrameworkError("name is invalid");
        }

        if (!this._datas) {
            this._datas = new Map<string, Variable<Object>>();
        }

        let oldData = this.getData(name);
        if (oldData) {
            ReferencePool.release(oldData);
        }
        this._datas.set(name, data);
    }

    removeData(name: string): boolean {
        if (!name) {
            throw new GameFrameworkError("name is invalid");
        }

        if (!this._datas) {
            return false;
        }

        let oldData = this.getData(name);
        if (oldData) {
            ReferencePool.release(oldData);
        }
        this._datas.delete(name);

        return true;
    }

    /**
     * 有限状态切换状态
     * @param stateConstructor 要切换的状态构造器
     */
    changeState(stateConstructor: Constructor<FsmState<T>>): void {
        if (!this._currentState) {
            throw new GameFrameworkError("current state is invalid");
        }

        let state = this.getState(stateConstructor);
        if (!state) {
            throw new GameFrameworkError(`fsm ${this.name} can't not change state which is not exist`);
        }

        this._currentState.onLeave(this, false);
        this._currentStateTime = 0;
        this._currentState = state;
        this._currentState.onEnter(this);
    }
}
