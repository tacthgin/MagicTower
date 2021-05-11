export class NpcInteractiveSystem {
    private npc: Npc = null;
    private map: GameMap = null;
    private hero: Hero = null;
    /** npc tile index */
    private index: number = 0;
    init(tileIndex: number, npc: Npc, map: GameMap, hero: Hero) {
        //this.npc = npc;
        //this.hero = hero;
        //this.map = map;
        //this.index = tileIndex;
        //return this;
    }
    execute() {
        //if (this.npc.canTrade()) {
        //物品交易
        //this.map.showDialog("RewardDialog", this.npc, (accept: boolean) => {
        //if (accept) {
        //this.npcTrade();
        //this.interactiveComplete();
        //this.npc.nextTalk();
        //}
        //NotifyCenter.emit(GameEvent.COLLISION_COMPLETE);
        //});
        //} else {
        //let info = this.npc.talk();
        //this.npc.nextTalk();
        //this.hero.HeroData.recordTalk(this.npc.npcInfo.id, info.index);
        //let npcInfo = this.npc.npcInfo;
        //this.map.showDialog("ChatDialog", info.talk, () => {
        //小偷
        //if (npcInfo.type == 1) {
        //如果有事件聊天
        //if (npcInfo.eventTalk) {
        //NotifyCenter.emit(GameEvent.COLLISION_COMPLETE);
        //} else {
        //this.npcMove();
        //}
        //} else {
        //this.interactiveComplete();
        //NotifyCenter.emit(GameEvent.COLLISION_COMPLETE);
        //}
        //});
        //}
    }
    private npcTrade() {
        //let heroData = this.hero.HeroData;
        //let npcPropInfo = this.npc.npcInfo.value;
        //heroData.Gold += npcPropInfo.gold || 0;
        //if (npcPropInfo.attack) {
        //heroData.Attack += npcPropInfo.attack >= 1 ? npcPropInfo.attack : heroData.Attack * npcPropInfo.attack;
        //}
        //if (npcPropInfo.defence) {
        //heroData.Defence += npcPropInfo.defence >= 1 ? npcPropInfo.defence : heroData.Defence * npcPropInfo.defence;
        //}
        //商人交易
        //if (npcPropInfo.propGold) {
        //if (heroData.Gold + npcPropInfo.propGold < 0) {
        //GameManager.getInstance().showToast("你的钱不够");
        //return;
        //}
        //heroData.Hp += npcPropInfo.hp || 0;
        //let tradeSuccess = true;
        //if (npcPropInfo.prop) {
        //for (let i = 0; i < npcPropInfo.prop.length; i += 2) {
        //如果没有物品就不能卖
        //if (npcPropInfo.prop[i + 1] < 0 && heroData.getPropNum(npcPropInfo.prop[i]) <= 0) {
        //tradeSuccess = false;
        //continue;
        //}
        //this.hero.addProp(npcPropInfo.prop[i], npcPropInfo.prop[i + 1]);
        //}
        //}
        //if (tradeSuccess) {
        //heroData.Gold += npcPropInfo.propGold;
        //this.npc.consumeProp();
        //} else {
        //GameManager.getInstance().showToast("物品数量不够");
        //}
        //} else if (npcPropInfo.prop) {
        //for (let i = 0; i < npcPropInfo.prop.length; i += 2) {
        //this.hero.addProp(npcPropInfo.prop[i], npcPropInfo.prop[i + 1]);
        //}
        //}
        //NotifyCenter.emit(GameEvent.HERO_ATTR_CHANGED);
    }
    private npcMove() {
        //let wallIndex = this.npc.getWallIndex();
        //let delay = 0;
        //if (wallIndex) {
        //delay = 0.2;
        //this.map.removeElement(wallIndex, "door");
        //}
        //let moveIndex = this.npc.move();
        //let npcInfo = this.npc.npcInfo;
        //if (moveIndex) {
        //let path = CommonAstar.getPath(this.map, this.map.indexToTile(this.index), this.map.indexToTile(moveIndex));
        //if (path) {
        //cc.tween(this.npc.node)
        //.delay(delay)
        //.call(() => {
        //this.npc.movePath(this.map.changePathCoord(path)).then(resolve => {
        //if (this.npc.moveEnd()) {
        //this.map.removeElement(this.index, "npc");
        //if (npcInfo.event) {
        //this.map.eventCollision(npcInfo.event);
        //}
        //} else {
        //转移小偷位置
        //this.map.changeElementInfo(this.index, moveIndex, "npc", this.npc);
        //}
        //NotifyCenter.emit(GameEvent.COLLISION_COMPLETE);
        //});
        //})
        //.start();
        //}
        //} else if (npcInfo.event) {
        //this.map.eventCollision(npcInfo.event);
        //NotifyCenter.emit(GameEvent.COLLISION_COMPLETE);
        //}
    }
    private interactiveComplete() {
        //if (this.npc.talkEnd()) {
        //this.map.removeElement(this.index, "npc");
        //}
    }
}
