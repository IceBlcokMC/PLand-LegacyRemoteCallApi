import {asExpected, Expected, FfiProtocol, importSymbol, LandID} from "../../ImportDef.js";
import {Land} from "../Land.js";

export class LeasingService {
    constructor() {
        throw new Error("Cannot create an instance of LeasingService");
    }

    static SYMBOLS = {
        LeasingService_enabled: importSymbol("LeasingService_enabled") as () => boolean,
        LeasingService_refreshSchedule: importSymbol("LeasingService_refreshSchedule") as (landId: number) => void,
        LeasingService_setStartAt: importSymbol("LeasingService_setStartAt") as (landId: number, timestamp: string) => FfiProtocol,
        LeasingService_setEndAt: importSymbol("LeasingService_setEndAt") as (landId: number, timestamp: string) => FfiProtocol,
        LeasingService_forceFreeze: importSymbol("LeasingService_forceFreeze") as (landId: number) => FfiProtocol,
        LeasingService_forceRecycle: importSymbol("LeasingService_forceRecycle") as (landId: number) => FfiProtocol,
        LeasingService_addTime: importSymbol("LeasingService_addTime") as (landId: number, sec: number) => FfiProtocol,
        LeasingService_cleanExpiredLands: importSymbol("LeasingService_cleanExpiredLands") as (daysOverdue: number) => FfiProtocol,
        LeasingService_toBought: importSymbol("LeasingService_toBought") as (landId: number) => FfiProtocol,
        LeasingService_toLeased: importSymbol("LeasingService_toLeased") as (landId: number, days: number) => FfiProtocol,
    }

    /**
     * @brief 检查功能是否启用
     * @return 返回功能是否启用的状态
     */
    static enabled(): boolean {
        return LeasingService.SYMBOLS.LeasingService_enabled();
    }

    /**
     * @brief 刷新领地的调度状态
     */
    static refreshSchedule(land: Land | LandID): void {
        const id = typeof land === "number" ? land : land.mLandId;
        LeasingService.SYMBOLS.LeasingService_refreshSchedule(id);
    }

    /**
     * @brief 设置领地的开始时间
     * @param land 要设置的领地对象
     * @param date 要设置的开始时间
     */
    static setStartAt(land: Land | LandID, date: Date): Expected<void> {
        const id = typeof land === "number" ? land : land.mLandId;
        const timestamp = date.getTime() / 1000; // 转换为秒
        const protocol = LeasingService.SYMBOLS.LeasingService_setStartAt(id, timestamp.toString());
        return asExpected<void>(protocol);
    }

    /**
     * @brief 设置领地的结束时间
     * @param land 要设置的领地对象
     * @param date 要设置的结束时间
     */
    static setEndAt(land: Land | LandID, date: Date): Expected<void> {
        const id = typeof land === "number" ? land : land.mLandId;
        const timestamp = date.getTime() / 1000; // 转换为秒
        const protocol = LeasingService.SYMBOLS.LeasingService_setEndAt(id, timestamp.toString());
        return asExpected<void>(protocol);
    }

    /**
     * 强制冻结指定领地
     * @param land 要冻结的领地对象
     */
    forceFreeze(land: Land | LandID): Expected<void> {
        const id = typeof land === "number" ? land : land.mLandId;
        const protocol = LeasingService.SYMBOLS.LeasingService_forceFreeze(id);
        return asExpected<void>(protocol);
    }

    /**
     * 强制回收指定领地
     * @param land 要回收的领地对象
     */
    forceRecycle(land: Land | LandID): Expected<void> {
        const id = typeof land === "number" ? land : land.mLandId;
        const protocol = LeasingService.SYMBOLS.LeasingService_forceRecycle(id);
        return asExpected<void>(protocol);
    }

    /**
     * @brief 为指定领地添加时间
     * @param land 要添加时间的领地对象
     * @param seconds 要添加的时间（秒数）
     */
    addTime(land: Land | LandID, seconds: number): Expected<void> {
        const id = typeof land === "number" ? land : land.mLandId;
        const protocol = LeasingService.SYMBOLS.LeasingService_addTime(id, seconds);
        return asExpected<void>(protocol);
    }

    /**
     * @brief 清理过期领地
     * @param daysOverdue 过期天数阈值
     * @return 返回清理的领地数量
     */
    cleanExpiredLands(daysOverdue: number): Expected<number> {
        const protocol = LeasingService.SYMBOLS.LeasingService_cleanExpiredLands(daysOverdue);
        return asExpected<number>(protocol);
    }

    /**
     * @brief 将租赁领地永久转为买断制领地
     * @param land 要转换状态的领地对象
     */
    toBought(land: Land | LandID): Expected<void> {
        const id = typeof land === "number" ? land : land.mLandId;
        const protocol = LeasingService.SYMBOLS.LeasingService_toBought(id);
        return asExpected<void>(protocol);
    }

    /**
     * @brief 将买断制领地转为租赁领地
     * @param land 要转换状态的领地对象
     * @param days 租赁天数
     */
    toLeased(land: Land | LandID, days: number): Expected<void> {
        const id = typeof land === "number" ? land : land.mLandId;
        const protocol = LeasingService.SYMBOLS.LeasingService_toLeased(id, days);
        return asExpected<void>(protocol);
    }
}

Object.freeze(LeasingService.SYMBOLS)
