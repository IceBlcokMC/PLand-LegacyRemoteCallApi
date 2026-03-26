import {
    FfiPayload,
    Expected,
    importSymbol,
    isIntPos,
    LandID,
    LandPermType,
    UUID, InternalLandAABB, FfiProtocol, asExpected,
} from "../ImportDef.js";
import {LandAABB} from "./LandAABB.js";
import {Land} from "./Land.js";

/**
 * @warning 请不要增加、删除 key，否则会导致反射失败
 */
export type PlayerSettings = {
    /** 是否显示进入领地提示 */ showEnterLandTitle: boolean;
    /** 是否持续显示底部提示 */ showBottomContinuedTip: boolean;
};

export class LandRegistry {
    static IMPORTS = {
        LandRegistry_isOperator: importSymbol("LandRegistry_isOperator"),
        LandRegistry_addOperator: importSymbol("LandRegistry_addOperator"),
        LandRegistry_removeOperator: importSymbol("LandRegistry_removeOperator"),
        LandRegistry_getOperators: importSymbol("LandRegistry_getOperators") as () => UUID[],
        LandRegistry_getOrCreatePlayerSettings: importSymbol(
            "LandRegistry_getOrCreatePlayerSettings",
        ),
        LandRegistry_getLand: importSymbol("LandRegistry_getLand"),
        LandRegistry_hasLand: importSymbol("LandRegistry_hasLand"),
        LandRegistry_getLands: importSymbol("LandRegistry_getLands"),
        LandRegistry_getLands1: importSymbol("LandRegistry_getLands1"),
        LandRegistry_getLands2: importSymbol("LandRegistry_getLands2"),
        LandRegistry_getLands3: importSymbol("LandRegistry_getLands3"),
        LandRegistry_getLands4: importSymbol("LandRegistry_getLands4"),
        LandRegistry_getPermType: importSymbol("LandRegistry_getPermType"),
        LandRegistry_getLandAt: importSymbol("LandRegistry_getLandAt"),
        LandRegistry_getLandAt1: importSymbol("LandRegistry_getLandAt1"),
        LandRegistry_getLandAt2: importSymbol("LandRegistry_getLandAt2"),
        LandRegistry_refreshLandRange: importSymbol(
            "LandRegistry_refreshLandRange",
        ),
        PLand_getVersionMeta: importSymbol("PLand_getVersionMeta"),
        LandRegistry_removeOrdinaryLand: importSymbol(
            "LandRegistry_removeOrdinaryLand",
        ) as (id: LandID) => FfiProtocol,
        LandRegistry_addOrdinaryLand: importSymbol("LandRegistry_addOrdinaryLand") as (aabb: InternalLandAABB, is3D: boolean, owner: UUID) => FfiProtocol,

        LandRegistry_createSnapshot: importSymbol("LandRegistry_createSnapshot") as (dirName?: string) => void,
    };

    constructor() {
        throw new Error("LandRegistry is a static class");
    }

    /**
     * 创建数据库快照
     * @param dirName 快照文件夹名称，如果为空，则使用当前时间戳
     * @note 创建的快照会被写入磁盘, snapshots/<dirName ?? timestamp>
     * @note 此任务为异步任务，如果任务未完成，文件夹下会存在 .incomplete 文件
     * @version v0.19.x
     */
    static createSnapshot(dirName?: string): void {
        // LegacyRemoteCall 不支持 optional，这里采用空字符串 = null、undefined
        return LandRegistry.IMPORTS.LandRegistry_createSnapshot(dirName ?? "");
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

    static getOperators() {
        return LandRegistry.IMPORTS.LandRegistry_getOperators();
    }

    static getOrCreatePlayerSettings(uuid: string): PlayerSettings | null {
        const jsonStr =
            LandRegistry.IMPORTS.LandRegistry_getOrCreatePlayerSettings(uuid);
        try {
            return JSON.parse(jsonStr);
        } catch (e) {
            logger.error(`Failed to parse player settings: ${jsonStr}`);
            return null;
        }
    }

    static hasLand(id: LandID): boolean {
        return LandRegistry.IMPORTS.LandRegistry_hasLand(id);
    }

    /**
     * 创建并添加一个普通领地
     * @param aabb 领地范围
     * @param is3D 是否是3D领地
     * @param owner 领地拥有者(UUID)
     * @returns Expected<Land>
     */
    static createAndAddOrdinaryLand(
        aabb: LandAABB,
        is3D: boolean,
        owner: UUID,
    ): Expected<Land> {
        if (aabb.min.dimid != aabb.max.dimid) {
            throw new Error("AABB min and max must be in the same dimension");
        }
        const protocol = LandRegistry.IMPORTS.LandRegistry_addOrdinaryLand(
            [aabb.min, aabb.max],
            is3D,
            owner,
        );
        return asExpected<LandID>(protocol).map(id => new Land(id));
    }

    /**
     * @brief 移除普通领地
     */
    static removeOrdinaryLand(
        land: Land | LandID,
    ): Expected<void> {
        const id =
            typeof land === "number"
                ? land
                :
                (land as Land).mLandId;
        const protocol = LandRegistry.IMPORTS.LandRegistry_removeOrdinaryLand(id);
        return asExpected<void>(protocol);
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
    static getLands(uuid: UUID, includeShared: boolean): Land[];
    /**
     * 获取玩家在指定维度所有的领地
     * @param uuid 玩家 uuid
     * @param dimid 维度 id
     */
    static getLands(uuid: UUID, dimid: number): Land[];

    static getLands(...args: any[]): Land[] {
        switch (args.length) {
            case 0: {
                // getLands() const;
                return LandRegistry.IMPORTS.LandRegistry_getLands().map(
                    (id: LandID) => new Land(id),
                );
            }
            case 1: {
                if (Array.isArray(args[0])) {
                    // getLands(std::vector<LandID> const& ids) const;
                    return LandRegistry.IMPORTS.LandRegistry_getLands4(
                        args[0],
                    ).map((id: LandID) => new Land(id));
                } else if (typeof args[0] === "number") {
                    // getLands(LandDimid dimid) const;
                    return LandRegistry.IMPORTS.LandRegistry_getLands1(
                        args[0],
                    ).map((id: LandID) => new Land(id));
                }
            }
            case 2: {
                const arg0 = args[0];
                if (typeof arg0 === "string") {
                    if (typeof args[1] === "boolean" || args[1] === undefined) {
                        // getLands(UUID const& uuid, bool includeShared = false) const;
                        const includeShared = args[1] ?? false;
                        return LandRegistry.IMPORTS.LandRegistry_getLands2(
                            arg0,
                            includeShared,
                        ).map((id: LandID) => new Land(id));
                    } else {
                        // getLands(UUID const& uuid, LandDimid dimid) const;
                        return LandRegistry.IMPORTS.LandRegistry_getLands3(
                            arg0,
                            args[1],
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
        radius_or_pos2?: number | IntPos,
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
                radius_or_pos2,
            ).map((id: LandID) => new Land(id));
        } else if (isIntPos(radius_or_pos2)) {
            // getLandAt(BlockPos const& pos1, BlockPos const& pos2, LandDimid dimid) const;
            if (pos1.dimid != (radius_or_pos2 as IntPos).dimid) {
                throw new Error("Invalid arguments");
            }
            return LandRegistry.IMPORTS.LandRegistry_getLandAt2(
                pos1,
                radius_or_pos2,
            ).map((id: LandID) => new Land(id));
        } else {
            throw new Error("Invalid arguments");
        }
    }

    static getPermType(
        uuid: UUID,
        landID = 0,
        includeOperator = true,
    ): LandPermType {
        return LandRegistry.IMPORTS.LandRegistry_getPermType(
            uuid,
            landID,
            includeOperator,
        );
    }

    static refreshLandRange(land: Land): void {
        // @ts-ignore
        LandRegistry.IMPORTS.LandRegistry_refreshLandRange(land.unique_id);
    }

    static getVersionMeta(): {
        Commit: string;
        Branch: string;
        Tag: string;
    } {
        return JSON.parse(LandRegistry.IMPORTS.PLand_getVersionMeta());
    }
}

Object.freeze(LandRegistry.IMPORTS);
