import { GameApp } from "../../../GameFramework/Scripts/Application/GameApp";
import { ModelBase } from "../../../GameFramework/Scripts/Application/Model/ModelBase";
import { ModelContainer } from "../../../GameFramework/Scripts/Application/Model/ModelContainer";
import { HeroAttr } from "../HeroModel/HeroAttr";
import { HeroModel } from "../HeroModel/HeroModel";
import { MapModel } from "../MapModel/MapModel";
import { LoadArchiveEventArgs } from "./SaveModelEventArgs";

type ArchiveInfo = {
    map: object;
    hero: object;
};

@ModelContainer.registerModel("SaveModel")
export class SaveModel extends ModelBase {
    @ModelBase.saveMark
    private _archives: string[] = [];
    @ModelBase.saveMark
    private _titles: string[] = [];
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

    getTitle(index: number) {
        return this._titles[index] || "";
    }

    loadArchive(index?: number) {
        if (index === this._currentArchiveIndex) return false;
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
        this.fireNow(LoadArchiveEventArgs.create());
        return true;
    }

    saveArchive() {
        let heroModel = GameApp.getModel(HeroModel);
        let mapModel = GameApp.getModel(MapModel);
        let archiveInfo: ArchiveInfo = {
            hero: heroModel.saveObject,
            map: mapModel.saveObject,
        };
        this._archives[this._currentArchiveIndex] = JSON.stringify(archiveInfo);
        this._titles[this._currentArchiveIndex] = `层数:${mapModel.level},血量:${heroModel.getAttr(HeroAttr.HP)},攻击${heroModel.getAttr(HeroAttr.ATTACK)},防御${heroModel.getAttr(HeroAttr.DEFENCE)}`;
        this.save();
    }

    deleteArchive() {
        let index = this._currentArchiveIndex;
        this._archives[index] = "";
        this._titles[index] = "";
        this.save();
    }

    private parseArchive(archiveStr: string): ArchiveInfo | null {
        if (archiveStr) {
            return JSON.parse(archiveStr);
        }
        return null;
    }
}
