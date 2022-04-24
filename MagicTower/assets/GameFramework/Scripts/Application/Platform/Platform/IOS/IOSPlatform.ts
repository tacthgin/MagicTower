import { PlatformBase } from "../PlatformBase";
import { IIOSPlatform } from "./IIOSPlatform";

export class IOSPlatform extends PlatformBase implements IIOSPlatform {
    get className(): string {
        return "IOSPlatform";
    }

    initalize(): void {}

    shareWX(url: string, title: string, description: string = ""): void {
        jsb.reflection.callStaticMethod(this.className, "shareWX:title:description:", url, title, description);
    }

    shareWXTimeLine(url: string, title: string): void {
        jsb.reflection.callStaticMethod(this.className, "shareWXTimeLine:title:", url, title);
    }

    shareQQ(url: string, title: string, description?: string): void {
        jsb.reflection.callStaticMethod(this.className, "shareQQ:title:description:", url, title, description);
    }
}
