import { ISoundAgentHelper } from "./ISoundAgentHelper";

export interface ISoundHelper {
    /**
     * 生成声音代理辅助
     */
    acquireSoundAgentHelper(): ISoundAgentHelper;
}
