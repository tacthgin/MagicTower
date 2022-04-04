import { GameApp } from "../../../GameFramework/Scripts/Application/GameApp";
import { ModelBase } from "../../../GameFramework/Scripts/Application/Model/ModelBase";
import { ModelContainer } from "../../../GameFramework/Scripts/Application/Model/ModelContainer";
import { HeroModel } from "../HeroModel/HeroModel";
import { MapModel } from "../MapModel/MapModel";

type ArchiveInfo = {
    map: object;
    hero: object;
};

@ModelContainer.registerModel("SaveModel")
export class SaveModel extends ModelBase {
    @ModelBase.saveMark
    private _archives: string[] = [];
    @ModelBase.saveMark
    private _currentArchiveIndex: number = 0;

    get currentArchiveIndex(): number {
        return this._currentArchiveIndex;
    }

    protected onLoad(data: object | null): void {
        if (data) {
            this.loadData(data);
        }
    }

    loadArchive(index?: number) {
        if (index !== undefined) {
            this._currentArchiveIndex = index;
        } else {
            index = this._currentArchiveIndex;
        }
        let archiveStr = this._archives[index];
        let archiveInfo = this.parseArchive(archiveStr);
        let map = null;
        let hero = null;
        if (archiveInfo) {
            map = archiveInfo.map;
            hero = archiveInfo.hero;
        }
        GameApp.getModel(MapModel).LoadExternalData(map);
        GameApp.getModel(HeroModel).LoadExternalData(hero);
    }

    saveArchive() {
        let archiveInfo: ArchiveInfo = {
            hero: GameApp.getModel(HeroModel).saveObject,
            map: GameApp.getModel(MapModel).saveObject,
        };
        this._archives[this._currentArchiveIndex] = JSON.stringify(archiveInfo);
        this.save();
    }

    private parseArchive(archiveStr: string): ArchiveInfo | null {
        if (archiveStr) {
            return JSON.parse(archiveStr);
        }
        return null;
    }
}
