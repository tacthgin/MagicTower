import { Component, _decorator } from "cc";
import { GameManager } from "../Frame/Managers/GameManager";

const { ccclass, property } = _decorator;

@ccclass("LoginScene")
export default class LoginScene extends Component {
    onLoad() {
        //NotifyCenter.on(GameEvent.ALL_RESOURCES_LOAD_SUCCESS, this.allResourcesLoadSuccess, this);
        //NotifyCenter.on(GameEvent.ALL_RESOURCES_LOAD_FAILED, this.allResourcesLoadFailed, this);
    }
    start() {
        //this.beginLoadResources();
        GameManager.UI.showDialog("Dialogs/MonsterHandBook").then((control) => {
            console.log(control);
        });

        GameManager.UI.showDialog("Dialogs/MonsterHandBook").then((control) => {
            console.log(control);
        });
    }
    allResourcesLoadSuss() {
        //this.loadLocalInfos();
    }
    allResourcesLoadFailed() {
        //GameManager.getInstance().showToast(ToastString.LOAD_RESOURCES_FAILED);
    }

    beginLoadResources() {
        //ResourceManager.loadResources();
    }

    loadLocalInfos() {
        //let localInfos = {
        //[Constant.ARCHIVE_NAME]: "GameInfo",
        //};
        //GameManager.getInstance()
        //.loadAllGameInfo(localInfos)
        //.then((results) => {
        //this.gotoGameScene();
        //})
        //.catch((reason) => {
        //cc.log(reason);
        //this.gotoGameScene();
        //});
    }

    gotoGameScene() {
        //ElementManager.loadRes((success: boolean) => {
        //cc.director.preloadScene("GameScene", null, (error: Error, asset: cc.SceneAsset) => {
        //if (error) {
        //cc.error(error.message);
        //return;
        //}
        //cc.director.loadScene("GameScene");
        //});
        //});
    }
}

/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// import { GameEvent } from "../Constant/GameEvent";
// import { ToastString } from "../Constant/ToastString";
// import { Constant } from "../Constant/Constant";
// import { NotifyCenter } from "../Managers/NotifyCenter";
// import { GameManager } from "../Managers/GameManager";
// import { ResourceManager } from "../Managers/ResourceManager";
// import { ElementManager } from "./Game/ElementManager";
//
// const { ccclass, property } = cc._decorator;
//
// @ccclass
// export default class LoginScene extends cc.Component {
//     onLoad() {
//         NotifyCenter.on(GameEvent.ALL_RESOURCES_LOAD_SUCCESS, this.allResourcesLoadSuccess, this);
//         NotifyCenter.on(GameEvent.ALL_RESOURCES_LOAD_FAILED, this.allResourcesLoadFailed, this);
//     }
//
//     start() {
//         this.beginLoadResources();
//     }
//
//     allResourcesLoadSuccess() {
//         this.loadLocalInfos();
//     }
//
//     allResourcesLoadFailed() {
//         GameManager.getInstance().showToast(ToastString.LOAD_RESOURCES_FAILED);
//     }
//
//     beginLoadResources() {
//         ResourceManager.loadResources();
//     }
//
//     loadLocalInfos() {
//         let localInfos = {
//             [Constant.ARCHIVE_NAME]: "GameInfo",
//         };
//
//         GameManager.getInstance()
//             .loadAllGameInfo(localInfos)
//             .then((results) => {
//                 this.gotoGameScene();
//             })
//             .catch((reason) => {
//                 cc.log(reason);
//                 this.gotoGameScene();
//             });
//     }
//
//     gotoGameScene() {
//         ElementManager.loadRes((success: boolean) => {
//             cc.director.preloadScene("GameScene", null, (error: Error, asset: cc.SceneAsset) => {
//                 if (error) {
//                     cc.error(error.message);
//                     return;
//                 }
//                 cc.director.loadScene("GameScene");
//             });
//         });
//     }
// }
