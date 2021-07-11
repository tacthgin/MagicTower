import { Canvas, Component, director, Director, Label, RenderTexture, Sprite, _decorator } from "cc";
import { BaseEvent } from "../../../Framework/Base/BaseContant";
import { GameManager } from "../../../Framework/Managers/GameManager";
import { NotifyCenter } from "../../../Framework/Managers/NotifyCenter";
import { ResourceType } from "../../../Framework/Managers/ResourceManager";
import { JsonParserMap } from "../../Constant/JsonParserMap";
import { Door } from "../../Data/CustomData/Element";

const { ccclass, property } = _decorator;

@ccclass("LoginScene")
export class LoginScene extends Component {
    @property(Label)
    private progressLabel: Label = null!;

    @property(Sprite)
    private sprite1: Sprite = null!;

    @property(Sprite)
    private sprite2: Sprite = null!;

    onLoad() {
        NotifyCenter.on(BaseEvent.ALL_RESOURCES_LOAD_SUCCESS, this.onAllResourcesLoadSuccess, this);
        NotifyCenter.on(BaseEvent.RESOURCE_PROGRESS, this.onResouceProgress, this);
    }

    start() {
        GameManager.DATA.setParserMap(JsonParserMap);
        GameManager.RESOURCE.loadResources();
    }

    onAllResourcesLoadSuccess() {
        GameManager.DATA.loadLocalStorage();
        this.gotoGameScene();
    }

    onResouceProgress(type: ResourceType, progress: number) {
        this.progressLabel.string = `资源加载中，${(progress * 100).toFixed(2)}%...`;
    }

    async gotoGameScene() {
        await GameManager.RESOURCE.loadPrefabDir("Elements");
        let spriteFrame = await GameManager.RESOURCE.loadRemoteImage("https://img.gmz88.com:4433/uploadimg/image/20190614/20190614091735_49858.jpg");
        if (spriteFrame) {
            this.sprite1.spriteFrame = spriteFrame;
            let texture= this.sprite1.spriteFrame.texture
            console.log(texture._nativeAsset, texture)

            
            let canvas = director.getScene()?.getChildByName("Canvas")?.getComponent(Canvas)
            if (canvas) {
                let rt = new RenderTexture()
                canvas.cameraComponent!.targetTexture = rt!;
            }
        }
        //GameManager.getInstance().loadScene("GameScene");
    }
}
