import {
    importAs,
    isIntPos,
    LandID,
    LandPermType,
    Result,
    UUIDs,
} from "../ImportDef.js";
import { LandAABB } from "./LandAABB.js";
import { Land } from "./Land.js";

/**
 * @warning 请不要增加、删除 key，否则会导致反射失败
 */
export type PlayerSettings = {
    /** 是否显示进入领地提示 */ showEnterLandTitle: boolean;
    /** 是否持续显示底部提示 */ showBottomContinuedTip: boolean;
    /** 玩家语言 */ localeCode: string | "system" | "server";
};

interface VersionMeta {
    major: number;
    minor: number;
    patch: number;
    build: number;
    commit: string;
    snapshot: boolean;
    release: boolean;
    version: string;
}

enum StorageLayerErrorCode {
    Unknown = 0, // 未知错误
    STLMapError = 1, // STL Map 操作失败
    DBError = 2, // 数据库操作失败
    DataConsistencyError = 3, // 数据一致性错误

    // addLand
    InvalidLand = 100, // 无效的领地数据
    AssignLandIdFailed = 101, // 分配领地ID失败
    LandRangeIllegal = 102, // 领地范围不合法

    // removeLand
    LandTypeWithRequireTypeNotMatch = 200, // 领地类型与要求类型不匹配
}

export class LandRegistry {
    static IMPORTS = {
        LandRegistry_isOperator: importAs("LandRegistry_isOperator"),
        LandRegistry_addOperator: importAs("LandRegistry_addOperator"),
        LandRegistry_removeOperator: importAs("LandRegistry_removeOperator"),
        LandRegistry_hasPlayerSettings: importAs(
            "LandRegistry_hasPlayerSettings"
        ),
        LandRegistry_getPlayerSettings: importAs(
            "LandRegistry_getPlayerSettings"
        ),
        LandRegistry_setPlayerSettings: importAs(
            "LandRegistry_setPlayerSettings"
        ),
        LandRegistry_getLand: importAs("LandRegistry_getLand"),
        LandRegistry_removeLand: importAs("LandRegistry_removeLand"),
        LandRegistry_hasLand: importAs("LandRegistry_hasLand"),
        LandRegistry_getLands: importAs("LandRegistry_getLands"),
        LandRegistry_getLands1: importAs("LandRegistry_getLands1"),
        LandRegistry_getLands2: importAs("LandRegistry_getLands2"),
        LandRegistry_getLands3: importAs("LandRegistry_getLands3"),
        LandRegistry_getLands4: importAs("LandRegistry_getLands4"),
        LandRegistry_getPermType: importAs("LandRegistry_getPermType"),
        LandRegistry_getLandAt: importAs("LandRegistry_getLandAt"),
        LandRegistry_getLandAt1: importAs("LandRegistry_getLandAt1"),
        LandRegistry_getLandAt2: importAs("LandRegistry_getLandAt2"),
        LandRegistry_refreshLandRange: importAs(
            "LandRegistry_refreshLandRange"
        ),
        PLand_getVersionMeta: importAs("PLand_getVersionMeta"),
        LandRegistry_removeOrdinaryLand: importAs(
            "LandRegistry_removeOrdinaryLand"
        ),
        LandRegistry_removeSubLand: importAs("LandRegistry_removeSubLand"),
        LandRegistry_removeLandAndSubLands: importAs(
            "LandRegistry_removeLandAndSubLands"
        ),
        LandRegistry_removeLandAndPromoteSubLands: importAs(
            "LandRegistry_removeLandAndPromoteSubLands"
        ),
        LandRegistry_removeLandAndTransferSubLands: importAs(
            "LandRegistry_removeLandAndTransferSubLands"
        ),
        LandRegistry_addOrdinaryLand: importAs("LandRegistry_addOrdinaryLand"),
        LandRegistry_addSubLand: importAs("LandRegistry_addSubLand"),
    };

    constructor() {
        throw new Error("PLand is a static class");
    }

    static isOperator(uuid: string): boolean {
        return LandRegistry.IMPORTS.LandRegistry_isOperator(uuid);
    }

    static addOperator(uuid: string): boolean {
        return LandRegistry.IMPORTS.LandRegistry_addOperator(uuid);
    }

    static removeOperator(uuid: string): boolean {
        return LandRegistry.IMPORTS.LandRegistry_removeOperator(uuid);
    }

    static hasPlayerSettings(uuid: string): boolean {
        return LandRegistry.IMPORTS.LandRegistry_hasPlayerSettings(uuid);
    }

    static getPlayerSettings(uuid: string): PlayerSettings | null {
        const jsonStr =
            LandRegistry.IMPORTS.LandRegistry_getPlayerSettings(uuid);
        try {
            return JSON.parse(jsonStr);
        } catch (e) {
            logger.error(`Failed to parse player settings: ${jsonStr}`);
            return null;
        }
    }

    static setPlayerSettings(uuid: string, settings: PlayerSettings): boolean {
        const jsonStr = JSON.stringify(settings);
        return LandRegistry.IMPORTS.LandRegistry_setPlayerSettings(
            uuid,
            jsonStr
        );
    }

    static hasLand(id: LandID): boolean {
        return LandRegistry.IMPORTS.LandRegistry_hasLand(id);
    }

    /**
     * 创建并添加一个普通领地
     * @param aabb 领地范围
     * @param is3D 是否是3D领地
     * @param owner 领地拥有者(UUID)
     * @returns Result<Land, StorageLayerErrorCode> 成功返回 Land，失败返回错误码
     */
    static createAndAddOrdinaryLand(
        aabb: LandAABB,
        is3D: boolean,
        owner: UUIDs
    ): Result<Land, StorageLayerErrorCode> {
        if (aabb.min.dimid != aabb.max.dimid) {
            throw new Error("AABB min and max must be in the same dimension");
        }
        const result = LandRegistry.IMPORTS.LandRegistry_addOrdinaryLand(
            [aabb.min, aabb.max],
            is3D,
            owner
        );

        if (result[0] === "success") {
            return new Result<Land, StorageLayerErrorCode>(
                new Land(parseInt(result[1])),
                null
            );
        } else {
            return new Result<Land, StorageLayerErrorCode>(
                null,
                parseInt(result[1])
            );
        }
    }

    /**
     * 创建并添加一个子领地
     * @param subLandRange 子领地范围
     * @returns Result<Land, StorageLayerErrorCode> 成功返回子领地对象，失败返回错误码
     */
    static createAndAddSubLand(
        parent: Land,
        subLandRange: LandAABB
    ): Result<Land, StorageLayerErrorCode> {
        const result = LandRegistry.IMPORTS.LandRegistry_addSubLand(
            parent.mLandId,
            [subLandRange.min, subLandRange.max]
        );

        if (result[0] === "success") {
            return new Result<Land, StorageLayerErrorCode>(
                new Land(parseInt(result[1])),
                null
            );
        } else {
            return new Result<Land, StorageLayerErrorCode>(
                null,
                parseInt(result[1])
            );
        }
    }

    /**
     * @deprecated 此 API 在 PLand 底层中已标记为废弃函数，将在未来版本中移除，请使用 removeOrdinaryLand() 代替
     */
    static removeLand(landID: LandID): boolean {
        return LandRegistry.IMPORTS.LandRegistry_removeLand(landID);
    }

    /**
     * @brief 移除普通领地
     */
    static removeOrdinaryLand(
        land: Land | LandID
    ): Result<void, StorageLayerErrorCode> {
        const id =
            typeof land === "number"
                ? land
                : // @ts-ignore
                  (land as Land).unique_id;
        const res = LandRegistry.IMPORTS.LandRegistry_removeOrdinaryLand(id);
        return new Result<void, StorageLayerErrorCode>(
            res === -1 ? void 0 : null,
            res === -1 ? null : (res as StorageLayerErrorCode)
        );
    }

    /**
     * @brief 移除子领地
     */
    static removeSubLand(
        land: Land | LandID
    ): Result<void, StorageLayerErrorCode> {
        const id =
            typeof land === "number"
                ? land
                : // @ts-ignore
                  (land as Land).unique_id;
        const res = LandRegistry.IMPORTS.LandRegistry_removeSubLand(id);
        return new Result<void, StorageLayerErrorCode>(
            res === -1 ? void 0 : null,
            res === -1 ? null : (res as StorageLayerErrorCode)
        );
    }

    /**
     * @brief 移除领地和其子领地
     */
    static removeLandAndSubLands(
        land: Land | LandID
    ): Result<void, StorageLayerErrorCode> {
        const id =
            typeof land === "number"
                ? land
                : // @ts-ignore
                  (land as Land).unique_id;
        const res = LandRegistry.IMPORTS.LandRegistry_removeLandAndSubLands(id);
        return new Result<void, StorageLayerErrorCode>(
            res === -1 ? void 0 : null,
            res === -1 ? null : (res as StorageLayerErrorCode)
        );
    }

    /**
     * @brief 移除当前领地并提升子领地为普通领地
     */
    static removeLandAndPromoteSubLands(
        land: Land | LandID
    ): Result<void, StorageLayerErrorCode> {
        const id =
            typeof land === "number"
                ? land
                : // @ts-ignore
                  (land as Land).unique_id;
        const res =
            LandRegistry.IMPORTS.LandRegistry_removeLandAndPromoteSubLands(id);
        return new Result<void, StorageLayerErrorCode>(
            res === -1 ? void 0 : null,
            res === -1 ? null : (res as StorageLayerErrorCode)
        );
    }

    /**
     * @brief 移除当前领地并移交子领地给当前领地的父领地
     */
    static removeLandAndTransferSubLands(
        land: Land | LandID
    ): Result<void, StorageLayerErrorCode> {
        const id =
            typeof land === "number"
                ? land
                : // @ts-ignore
                  (land as Land).unique_id;
        const res =
            LandRegistry.IMPORTS.LandRegistry_removeLandAndTransferSubLands(id);
        return new Result<void, StorageLayerErrorCode>(
            res === -1 ? void 0 : null,
            res === -1 ? null : (res as StorageLayerErrorCode)
        );
    }

    static getLand(landID: LandID): Land | null {
        const id = LandRegistry.IMPORTS.LandRegistry_getLand(landID);
        if (id === -1) {
            return null;
        }
        return new Land(id);
    }

    /**
     * 获取所有领地
     */
    static getLands(): Land[];
    /**
     * 批量获取领地
     * @param ids id 列表
     */
    static getLands(ids: LandID[]): Land[];
    /**
     * 获取指定维度的所有领地
     * @param dimid 维度 id
     */
    static getLands(dimid: number): Land[];
    /**
     * 获取玩家所有的领地
     * @param uuid 玩家 uuid
     * @param includeShared 是否包含其它玩家共享的领地(默认false)
     */
    static getLands(uuid: UUIDs, includeShared: boolean): Land[];
    /**
     * 获取玩家在指定维度所有的领地
     * @param uuid 玩家 uuid
     * @param dimid 维度 id
     */
    static getLands(uuid: UUIDs, dimid: number): Land[];

    static getLands(...args: any[]): Land[] {
        switch (args.length) {
            case 0: {
                // getLands() const;
                return LandRegistry.IMPORTS.LandRegistry_getLands().map(
                    (id: LandID) => new Land(id)
                );
            }
            case 1: {
                if (Array.isArray(args[0])) {
                    // getLands(std::vector<LandID> const& ids) const;
                    return LandRegistry.IMPORTS.LandRegistry_getLands4(
                        args[0]
                    ).map((id: LandID) => new Land(id));
                } else if (typeof args[0] === "number") {
                    // getLands(LandDimid dimid) const;
                    return LandRegistry.IMPORTS.LandRegistry_getLands1(
                        args[0]
                    ).map((id: LandID) => new Land(id));
                }
            }
            case 2: {
                const arg0 = args[0];
                if (typeof arg0 === "string") {
                    if (typeof args[1] === "boolean" || args[1] === undefined) {
                        // getLands(UUIDs const& uuid, bool includeShared = false) const;
                        const includeShared = args[1] ?? false;
                        return LandRegistry.IMPORTS.LandRegistry_getLands2(
                            arg0,
                            includeShared
                        ).map((id: LandID) => new Land(id));
                    } else {
                        // getLands(UUIDs const& uuid, LandDimid dimid) const;
                        return LandRegistry.IMPORTS.LandRegistry_getLands3(
                            arg0,
                            args[1]
                        ).map((id: LandID) => new Land(id));
                    }
                }
            }
        }
        throw new Error("Invalid arguments");
    }

    /**
     * 查询指定坐标的领地
     * @param pos 坐标
     */
    static getLandAt(pos: IntPos): Land | null;
    /**
     * 查询指定坐标半径内的领地
     * @param pos 坐标
     * @param radius 半径
     */
    static getLandAt(pos: IntPos, radius: number): Land[];
    /**
     * 查询 AABB 区域内的领地
     * @param pos1 min 坐标
     * @param pos2 max 坐标
     */
    static getLandAt(pos1: IntPos, pos2: IntPos): Land[];

    static getLandAt(
        pos1: IntPos,
        radius_or_pos2?: number | IntPos
    ): Land | null | Land[] {
        if (!isIntPos(pos1)) {
            throw new Error("Invalid arguments");
        }

        if (radius_or_pos2 === undefined) {
            // getLandAt(BlockPos const& pos, LandDimid dimid) const;
            const id = LandRegistry.IMPORTS.LandRegistry_getLandAt(pos1);
            if (id === -1) {
                return null;
            }
            return new Land(id);
        } else if (typeof radius_or_pos2 === "number") {
            // getLandAt(BlockPos const& center, int radius, LandDimid dimid) const;
            return LandRegistry.IMPORTS.LandRegistry_getLandAt1(
                pos1,
                radius_or_pos2
            ).map((id: LandID) => new Land(id));
        } else if (isIntPos(radius_or_pos2)) {
            // getLandAt(BlockPos const& pos1, BlockPos const& pos2, LandDimid dimid) const;
            if (pos1.dimid != (radius_or_pos2 as IntPos).dimid) {
                throw new Error("Invalid arguments");
            }
            return LandRegistry.IMPORTS.LandRegistry_getLandAt2(
                pos1,
                radius_or_pos2
            ).map((id: LandID) => new Land(id));
        } else {
            throw new Error("Invalid arguments");
        }
    }

    static getPermType(
        uuid: UUIDs,
        landID = 0,
        includeOperator = true
    ): LandPermType {
        return LandRegistry.IMPORTS.LandRegistry_getPermType(
            uuid,
            landID,
            includeOperator
        );
    }

    static refreshLandRange(land: Land): void {
        // @ts-ignore
        LandRegistry.IMPORTS.LandRegistry_refreshLandRange(land.unique_id);
    }

    static getVersionMeta(): VersionMeta {
        return JSON.parse(LandRegistry.IMPORTS.PLand_getVersionMeta());
    }
}

Object.freeze(LandRegistry.IMPORTS);
