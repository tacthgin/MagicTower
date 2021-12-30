import { DateUtility } from "./DateUtility";
import { JsonUtility } from "./JsonUtility";
import { MathUtility } from "./MathUtility";
import { Random } from "./Random";
import { SystemUtility } from "./SystemUtility";
import { TextUtility } from "./TextUtility";

/**
 * 工具工厂类
 */
export class Utility {
    /** 系统工具类 */
    static readonly System: SystemUtility = new SystemUtility();
    /** 随机工具类 */
    static readonly Random: Random = new Random();
    /** 日期工具类 */
    static readonly Date: DateUtility = new DateUtility();
    /** 数学工具类 */
    static readonly Math: MathUtility = new MathUtility();
    /** 文本工具类 */
    static readonly Text: TextUtility = new TextUtility();
    /** Json工具类 */
    static readonly Json: JsonUtility = new JsonUtility();
}
