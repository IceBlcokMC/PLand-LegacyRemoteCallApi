import {
    RPCResult,
    Expected,
    importAs,
    isIntPos,
    LandID,
    LandPermType,
    UUID,
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
        LandRegistry_isOperator: importAs("LandRegistry_isOperator"),
        LandRegistry_addOperator: importAs("LandRegistry_addOperator"),
        LandRegistry_removeOperator: importAs("LandRegistry_removeOperator"),
        LandRegistry_getOperators: importAs("LandRegistry_getOperators") as () => UUID[],
        LandRegistry_getOrCreatePlayerSettings: importAs(
            "LandRegistry_getOrCreatePlayerSettings",
        ),
        LandRegistry_getLand: importAs("LandRegistry_getLand"),
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
            "LandRegistry_refreshLandRange",
        ),
        PLand_getVersionMeta: importAs("PLand_getVersionMeta"),
        LandRegistry_removeOrdinaryLand: importAs(
            "LandRegistry_removeOrdinaryLand",
        ),
        LandRegistry_addOrdinaryLand: importAs("LandRegistry_addOrdinaryLand"),
    };

    constructor() {
        throw new Error("LandRegistry is a static class");
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
        const result = LandRegistry.IMPORTS.LandRegistry_addOrdinaryLand(
            [aabb.min, aabb.max],
            is3D,
            owner,
        ) as RPCResult<LandID>;
        return new Expected(
            result
        ).map(id => new Land(id));
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
        const res = LandRegistry.IMPORTS.LandRegistry_removeOrdinaryLand(id) as RPCResult<void>;
        return new Expected(res);
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
