import { ISoundAgentHelp } from "./ISoundAgentHelp";

export interface ISoundHelp {
    /**
     * 生成声音代理辅助
     */
    acquireSoundAgentHelp(): ISoundAgentHelp;
}
