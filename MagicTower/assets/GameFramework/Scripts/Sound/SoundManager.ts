import { GameFrameworkEntry } from "../Base/GameFrameworkEntry";
import { GameFrameworkError } from "../Base/GameFrameworkError";
import { GameFrameworkModule } from "../Base/GameFrameworkModule";
import { ReferencePool } from "../Base/ReferencePool/ReferencePool";
import { IResourceManager } from "../Resource/IResourceManager";
import { ISoundGroup } from "./ISoundGroup";
import { ISoundHelper } from "./ISoundHelper";
import { ISoundManager } from "./ISoundManager";
import { PlaySoundParams } from "./PlaySoundParams";
import { SoundGroup } from "./SoundGroup";

@GameFrameworkEntry.registerModule("SoundManager")
export class SoundManager extends GameFrameworkModule implements ISoundManager {
    private readonly _soundGroups: Map<string, SoundGroup> = null!;
    private _resourceManager: IResourceManager | null = null;
    private _soundHelper: ISoundHelper | null = null;
    private _serialId: number = 0;

    constructor() {
        super();
        this._soundGroups = new Map<string, SoundGroup>();
    }

    update(elapseSeconds: number): void {
        for (let pair of this._soundGroups) {
            pair[1].update(elapseSeconds);
        }
    }

    shutDown(): void {
        this.stopAllLoadedSounds();
        this._soundGroups.clear();
    }

    setResourceManager(resourceManager: IResourceManager) {
        this._resourceManager = resourceManager;
    }

    setSoundHelper(soundHelper: ISoundHelper): void {
        this._soundHelper = soundHelper;
    }

    async playSound(soundAssetPath: string, soundGroupName: string, playSoundParams?: PlaySoundParams): Promise<number> {
        if (!this._resourceManager) {
            throw new GameFrameworkError("resource mamager not exist");
        }

        if (!soundGroupName) {
            throw new GameFrameworkError("you must set sound group name first");
        }

        let audioClip = await this._resourceManager.loadAsset(soundAssetPath);
        if (!audioClip) {
            throw new GameFrameworkError(`audio clip ${soundAssetPath} not exist`);
        }

        if (!this.hasSoundGroup(soundGroupName)) {
            this.addSoundGroup(soundGroupName);
        }

        if (!playSoundParams) {
            playSoundParams = PlaySoundParams.create();
        }

        ++this._serialId;
        let soundGroup: SoundGroup = this.getSoundGroup(soundGroupName) as SoundGroup;
        soundGroup.playSound(this._serialId, audioClip, playSoundParams);
        ReferencePool.release(playSoundParams);
        return this._serialId;
    }

    pauseSound(serialId: number): void {
        for (let soundGroupInfo of this._soundGroups) {
            if (soundGroupInfo[1].pauseSound(serialId)) {
                break;
            }
        }
    }

    resumeSound(serialId: number): void {
        for (let soundGroupInfo of this._soundGroups) {
            if (soundGroupInfo[1].resumeSound(serialId)) {
                break;
            }
        }
    }

    stopSound(serialId: number): void {
        for (let soundGroupInfo of this._soundGroups) {
            if (soundGroupInfo[1].stopSound(serialId)) {
                break;
            }
        }
    }

    stopAllLoadedSounds(): void {
        for (let soundGroupInfo of this._soundGroups) {
            soundGroupInfo[1].stopAllLoadedSounds();
        }
    }

    hasSoundGroup(soundGroupName: string): boolean {
        if (!soundGroupName) {
            throw new GameFrameworkError("soundGroupName is invalid");
        }
        return this._soundGroups.has(soundGroupName);
    }

    getSoundGroup(soundGroupName: string): ISoundGroup | null {
        if (!soundGroupName) {
            throw new GameFrameworkError("soundGroupName is invalid");
        }
        return this._soundGroups.get(soundGroupName) || null;
    }

    addSoundGroup(soundGroupName: string): boolean {
        if (!soundGroupName) {
            throw new GameFrameworkError("soundGroupName is invalid");
        }
        let soundGroup = this._soundGroups.get(soundGroupName);
        if (soundGroup) {
            return false;
        } else {
            soundGroup = new SoundGroup(soundGroupName);
            if (this._soundHelper) {
                soundGroup.addSoundHelper(this._soundHelper);
            }
            this._soundGroups.set(soundGroupName, soundGroup);
            return true;
        }
    }
}
