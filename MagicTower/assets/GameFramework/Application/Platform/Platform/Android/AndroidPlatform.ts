import { PlatformBase } from "../PlatformBase";
import { IAndroidPlatfrom } from "./IAndroidPlatform";

/**
 * 安卓平台
 */
export class AndroidPlatform extends PlatformBase implements IAndroidPlatfrom {
    get className(): string {
        return "AndroidPlatform";
    }

    initalize(): void {}

    shareWX(url: string, title: string, description: string = ""): void {
        jsb.reflection.callStaticMethod(this.className, "shareWX", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", url, title, description);
    }

    shareWXTimeLine(url: string, title: string): void {
        jsb.reflection.callStaticMethod(this.className, "shareWXTimeLine", "(Ljava/lang/String;Ljava/lang/String;)V", url, title);
    }

    shareQQ(url: string, title: string, description?: string): void {
        jsb.reflection.callStaticMethod(this.className, "shareQQ", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", url, title, description);
    }
}
