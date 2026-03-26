import {
    importSymbol, INVALID_LAND_ID,
    isIntPos,
    LandID,
    LandPermType,
    UUID,
    InternalLandAABB
} from "../ImportDef.js";
import {LandAABB} from "./LandAABB.js";


export interface EnvironmentPerms {
    allowFireSpread: boolean;          // 火焰蔓延
    allowMonsterSpawn: boolean;        // 怪物生成
    allowAnimalSpawn: boolean;         // 动物生成
    allowMobGrief: boolean;            // 实体破坏(破坏/拾取/放置方块) v25 allowActorDestroy=false, enderman=false
    allowExplode: boolean;             // 爆炸
    allowFarmDecay: boolean;           // 耕地退化
    allowPistonPushOnBoundary: boolean;// 活塞推动边界方块
    allowRedstoneUpdate: boolean;      // 红石更新
    allowBlockFall: boolean;           // 方块掉落
    allowWitherDestroy: boolean;       // 凋零破坏
    allowMossGrowth: boolean;          // 苔藓生长(蔓延) v27
    allowLiquidFlow: boolean;          // 流动液体
    allowDragonEggTeleport: boolean;   // 龙蛋传送 v25 allowAttackDragonEgg=false
    allowSculkBlockGrowth: boolean;    // 幽匿尖啸体生长
    allowSculkSpread: boolean;         // 幽匿蔓延 v27
    allowLightningBolt: boolean;       // 闪电
}

export interface RoleEntry {
    member: boolean;
    actor: boolean;
}

export interface RolePerms {
    allowDestroy: RoleEntry;        // 允许破坏方块
    allowPlace: RoleEntry;          // 允许放置方块
    useBucket: RoleEntry;           // 允许使用桶(水/岩浆/...)
    useAxe: RoleEntry;              // 允许使用斧头
    useHoe: RoleEntry;              // 允许使用锄头
    useShovel: RoleEntry;           // 允许使用铲子
    placeBoat: RoleEntry;           // 允许放置船
    placeMinecart: RoleEntry;       // 允许放置矿车
    useButton: RoleEntry;           // 允许使用按钮
    useDoor: RoleEntry;             // 允许使用门
    useFenceGate: RoleEntry;        // 允许使用栅栏门
    allowInteractEntity: RoleEntry; // 允许与实体交互
    useTrapdoor: RoleEntry;         // 允许使用活板门
    editSign: RoleEntry;            // 允许编辑告示牌
    useLever: RoleEntry;            // 允许使用拉杆
    useFurnaces: RoleEntry;         // 允许使用所有熔炉类方块（熔炉/高炉/烟熏炉）
    allowPlayerPickupItem: RoleEntry;  // 允许玩家拾取物品
    allowRideTrans: RoleEntry;         // 允许骑乘运输工具（矿车/船）
    allowRideEntity: RoleEntry;        // 允许骑乘实体
    usePressurePlate: RoleEntry;       // 触发压力板
    allowFishingRodAndHook: RoleEntry; // 允许使用钓鱼竿和鱼钩
    allowUseThrowable: RoleEntry;      // 允许使用投掷物(雪球/鸡蛋/三叉戟/...)
    useArmorStand: RoleEntry;          // 允许使用盔甲架
    allowDropItem: RoleEntry;          // 允许丢弃物品
    useItemFrame: RoleEntry;           // 允许操作物品展示框
    useFlintAndSteel: RoleEntry;       // 使用打火石
    useBeacon: RoleEntry;              // 使用信标
    useBed: RoleEntry;                 // 使用床
    allowPvP: RoleEntry;                 // 允许PvP v25 allowPlayerDamage=false
    allowHostileDamage: RoleEntry;        // 敌对生物受到伤害 v25 allowMonsterDamage=true
    allowFriendlyDamage: RoleEntry;      // 友好生物受到伤害
    allowSpecialEntityDamage: RoleEntry; // 特殊生物受到伤害
    useContainer: RoleEntry;   // 允许使用容器(箱子/木桶/潜影盒/发射器/投掷器/漏斗/雕纹书架/试炼宝库/...)
    useWorkstation: RoleEntry; // 工作站类(工作台/铁砧/附魔台/酿造台/锻造台/砂轮/织布机/切石机/制图台/合成器)
    useBell: RoleEntry;        // 使用钟
    useCampfire: RoleEntry;    // 使用营火
    useComposter: RoleEntry;   // 使用堆肥桶
    useDaylightDetector: RoleEntry;  // 使用阳光探测器
    useJukebox: RoleEntry;           // 使用唱片机
    useNoteBlock: RoleEntry;         // 使用音符盒
    useCake: RoleEntry;              // 吃蛋糕
    useComparator: RoleEntry;        // 使用红石比较器
    useRepeater: RoleEntry;          // 使用红石中继器
    useLectern: RoleEntry;           // 使用讲台
    useCauldron: RoleEntry;          // 使用炼药锅
    useRespawnAnchor: RoleEntry;     // 使用重生锚
    useBoneMeal: RoleEntry;          // 使用骨粉
    useBeeNest: RoleEntry;           // 使用蜂巢(蜂箱)
    editFlowerPot: RoleEntry;        // 编辑花盆
    allowUseRangedWeapon: RoleEntry; // 允许使用远程武器(弓/弩)

    /**@version v0.19.x*/ allowTriggerDripleaf: RoleEntry; // 允许触发垂滴叶
}

export interface LandPermTable {
    environment: EnvironmentPerms;
    role: RolePerms;
}

export enum LandType {
    Ordinary = 0, // 普通领地(无父、无子)
    Parent = 1, // 父领地(无父、有子)
    Mix = 2, // 混合领地(有父、有子)
    Sub = 3, // 子领地(有父、无子)
}

/**
 * 领地持有类型
 * @version v0.19.x
 */
export enum LandHoldType {
    Bought = 0, // 购买模式
    Leased = 1, // 租赁模式
}

/**
 * 领地租赁状态
 * @version v0.19.x
 */
export enum LeaseState {
    None = 0, // 非租赁领地 / 无状态
    Active = 1, // 正常期
    Frozen = 2, // 冻结期
    Expired = 3, // 已到期(已回收)
}

export class Land {
    static SYMBOLS = {
        Land_getAABB: importSymbol("Land_getAABB") as (
            id: LandID
        ) => InternalLandAABB,

        Land_getTeleportPos: importSymbol("Land_getTeleportPos") as (
            id: LandID
        ) => IntPos,

        Land_setTeleportPos: importSymbol("Land_setTeleportPos") as (
            id: LandID,
            pos: IntPos
        ) => void,

        Land_getId: importSymbol("Land_getId") as (id: LandID) => LandID,

        Land_getDimensionId: importSymbol("Land_getDimensionId") as (
            id: LandID
        ) => number,

        Land_getPermTable: importSymbol("Land_getPermTable") as (
            id: LandID
        ) => string,

        Land_setPermTable: importSymbol("Land_setPermTable") as (
            id: LandID,
            table: string
        ) => void,

        Land_getOwner: importSymbol("Land_getOwner") as (id: LandID) => UUID,

        Land_setOwner: importSymbol("Land_setOwner") as (
            id: LandID,
            owner: UUID
        ) => boolean,

        Land_getRawOwner: importSymbol("Land_getRawOwner") as (id: LandID) => string,

        Land_getMembers: importSymbol("Land_getMembers") as (id: LandID) => UUID[],

        Land_addLandMember: importSymbol("Land_addLandMember") as (
            id: LandID,
            uuid: UUID
        ) => boolean,

        Land_removeLandMember: importSymbol("Land_removeLandMember") as (
            id: LandID,
            uuid: UUID
        ) => boolean,

        Land_getName: importSymbol("Land_getName") as (id: LandID) => string,

        Land_setName: importSymbol("Land_setName") as (
            id: LandID,
            name: string
        ) => void,

        Land_getOriginalBuyPrice: importSymbol("Land_getOriginalBuyPrice") as (
            id: LandID
        ) => number,

        Land_setOriginalBuyPrice: importSymbol("Land_setOriginalBuyPrice") as (
            id: LandID,
            price: number
        ) => void,

        Land_is3D: importSymbol("Land_is3D") as (id: LandID) => boolean,
        Land_isOwner: importSymbol("Land_isOwner") as (
            id: LandID,
            uuid: UUID
        ) => boolean,
        Land_isMember: importSymbol("Land_isMember") as (
            id: LandID,
            uuid: UUID
        ) => boolean,

        Land_isConvertedLand: importSymbol("Land_isConvertedLand") as (
            id: LandID
        ) => boolean,

        Land_isOwnerDataIsXUID: importSymbol("Land_isOwnerDataIsXUID") as (
            id: LandID
        ) => boolean,

        Land_isCollision: importSymbol("Land_isCollision") as (
            id: LandID,
            pos: IntPos,
            radius: number
        ) => boolean,

        Land_isCollision2: importSymbol("Land_isCollision2") as (
            id: LandID,
            pos1: IntPos,
            pos2: IntPos
        ) => boolean,

        Land_isDirty: importSymbol("Land_isDirty") as (id: LandID) => boolean,
        Land_getType: importSymbol("Land_getType") as (id: LandID) => number,

        Land_hasParentLand: importSymbol("Land_hasParentLand") as (
            id: LandID
        ) => boolean,
        Land_hasSubLand: importSymbol("Land_hasSubLand") as (id: LandID) => boolean,
        Land_isSubLand: importSymbol("Land_isSubLand") as (id: LandID) => boolean,
        Land_isParentLand: importSymbol("Land_isParentLand") as (
            id: LandID
        ) => boolean,
        Land_isMixLand: importSymbol("Land_isMixLand") as (id: LandID) => boolean,
        Land_isOrdinaryLand: importSymbol("Land_isOrdinaryLand") as (
            id: LandID
        ) => boolean,
        Land_canCreateSubLand: importSymbol("Land_canCreateSubLand") as (
            id: LandID
        ) => boolean,

        Land_getParentLandID: importSymbol("Land_getParentLandID") as (
            id: LandID
        ) => LandID,
        Land_getSubLandIDs: importSymbol("Land_getSubLandIDs") as (
            id: LandID
        ) => LandID[],
        Land_getNestedLevel: importSymbol("Land_getNestedLevel") as (
            id: LandID
        ) => number,

        Land_getPermType: importSymbol("Land_getPermType") as (
            id: LandID,
            uuid: UUID
        ) => number,

        Land_isSystemOwned: importSymbol("Land_isSystemOwned") as (
            id: LandID
        ) => boolean,
        Land_isBought: importSymbol("Land_isBought") as (
            id: LandID
        ) => boolean,
        Land_isLeased: importSymbol("Land_isLeased") as (
            id: LandID
        ) => boolean,
        Land_isLeaseActive: importSymbol("Land_isLeaseActive") as (
            id: LandID
        ) => boolean,
        Land_isLeaseFrozen: importSymbol("Land_isLeaseFrozen") as (
            id: LandID
        ) => boolean,
        Land_isLeaseExpired: importSymbol("Land_isLeaseExpired") as (
            id: LandID
        ) => boolean,
        Land_getHoldType: importSymbol("Land_getHoldType") as (id: LandID) => LandHoldType,
        Land_getLeaseState: importSymbol("Land_getLeaseState") as (id: LandID) => LeaseState,
        Land_getLeaseStartAt: importSymbol("Land_getLeaseStartAt") as (id: LandID) => string,
        Land_getLeaseEndAt: importSymbol("Land_getLeaseEndAt") as (id: LandID) => string,
    };

    readonly mLandId: LandID = -1;

    constructor(id: LandID) {
        this.mLandId = id;
    }

    /**
     * @brief 判断当前领地是否为系统所有
     * @return true/false
     * @version v0.19.x
     */
    isSystemOwned() {
        return Land.SYMBOLS.Land_isSystemOwned(this.mLandId);
    }

    /**
     * 领地是否为买断制领地
     * @enum LandHoldType::Bought
     * @version v0.19.x
     */
    isBought(): boolean {
        return Land.SYMBOLS.Land_isBought(this.mLandId);
    };

    /**
     * 检查是否已被租赁
     * @enum LandHoldType::Leased
     * @version v0.19.x
     */
    isLeased(): boolean {
        return Land.SYMBOLS.Land_isLeased(this.mLandId);
    };

    /**
     * 检查租赁是否有效
     * @enum LeaseState::Active
     * @version v0.19.x
     */
    isLeaseActive(): boolean {
        return Land.SYMBOLS.Land_isLeaseActive(this.mLandId);
    };

    /**
     * 检查租赁是否被冻结
     * @enum LeaseState::Frozen
     * @version v0.19.x
     */
    isLeaseFrozen(): boolean {
        return Land.SYMBOLS.Land_isLeaseFrozen(this.mLandId);
    };

    /**
     * 检查租赁是否已过期
     * @enum LeaseState::Expired
     * @version v0.19.x
     */
    isLeaseExpired(): boolean {
        return Land.SYMBOLS.Land_isLeaseExpired(this.mLandId);
    };

    /**
     * 获取领地持有类型
     * @version v0.19.x
     */
    getHoldType() {
        return Land.SYMBOLS.Land_getHoldType(this.mLandId);
    }

    /**
     * 获取租赁状态
     * @version v0.19.x
     */
    getLeaseState() {
        return Land.SYMBOLS.Land_getLeaseState(this.mLandId);
    }

    /**
     * 获取租赁开始时间
     * @version v0.19.x
     */
    getLeaseStartAt(): Date | null {
        const timestampStr = Land.SYMBOLS.Land_getLeaseStartAt(this.mLandId);
        if (timestampStr.length == 0) {
            return null; // 领地不存在
        }
        return new Date(Number(timestampStr) * 1000); // time_t 单位为秒, Date 单位为毫秒, 故乘以1000
    }

    /**
     * 获取租赁结束时间
     * @version v0.19.x
     */
    getLeaseEndAt(): Date | null {
        const timestampStr = Land.SYMBOLS.Land_getLeaseEndAt(this.mLandId);
        if (timestampStr.length == 0) {
            return null; // 领地不存在
        }
        return new Date(Number(timestampStr) * 1000);
    }


    /**
     * 获取领地AABB范围
     * @returns
     */
    getAABB(): LandAABB | null {
        const result = Land.SYMBOLS.Land_getAABB(this.mLandId);
        if (result.length > 0) {
            return new LandAABB(result[0], result[1]);
        }
        return null;
    }

    getTeleportPos(): IntPos {
        return Land.SYMBOLS.Land_getTeleportPos(this.mLandId);
    }

    setTeleportPos(pos: IntPos): void {
        Land.SYMBOLS.Land_setTeleportPos(this.mLandId, pos);
    }

    getId(): LandID {
        return Land.SYMBOLS.Land_getId(this.mLandId);
    }

    getDimensionId(): number {
        return Land.SYMBOLS.Land_getDimensionId(this.mLandId);
    }

    getPermTable(): LandPermTable | null {
        const result = Land.SYMBOLS.Land_getPermTable(this.mLandId);
        if (result === "") {
            return null;
        }
        return JSON.parse(result);
    }

    setPermTable(table: LandPermTable): void {
        Land.SYMBOLS.Land_setPermTable(this.mLandId, JSON.stringify(table));
    }

    getOwner(): UUID {
        return Land.SYMBOLS.Land_getOwner(this.mLandId);
    }

    /**
     * 修改领地主人
     * @param owner 新的领地主人 UUID
     * @note 如果UUID无效，此 API 返回 false
     */
    setOwner(owner: UUID): boolean {
        return Land.SYMBOLS.Land_setOwner(this.mLandId, owner);
    }

    /**
     * @deprecated Use getOwner() instead, this returns raw storage string (may be XUID or UUID).
     */
    getRawOwner(): string | null {
        const id = Land.SYMBOLS.Land_getRawOwner(this.mLandId);
        if (id === "") {
            return null;
        }
        return id;
    }

    getMembers(): UUID[] {
        return Land.SYMBOLS.Land_getMembers(this.mLandId);
    }

    /**
     * 添加领地成员
     * @param uuid 要添加的领地成员 UUID
     * @return 是否添加成功
     * @note 此函数拒绝添加 Owner 为 Member
     */
    addLandMember(uuid: UUID): boolean {
        return Land.SYMBOLS.Land_addLandMember(this.mLandId, uuid);
    }

    removeLandMember(uuid: UUID): boolean {
        return Land.SYMBOLS.Land_removeLandMember(this.mLandId, uuid);
    }

    getName(): string {
        return Land.SYMBOLS.Land_getName(this.mLandId);
    }

    setName(name: string): void {
        Land.SYMBOLS.Land_setName(this.mLandId, name);
    }

    getOriginalBuyPrice(): number {
        return Land.SYMBOLS.Land_getOriginalBuyPrice(this.mLandId);
    }

    setOriginalBuyPrice(price: number): void {
        Land.SYMBOLS.Land_setOriginalBuyPrice(this.mLandId, price);
    }

    is3D(): boolean {
        return Land.SYMBOLS.Land_is3D(this.mLandId);
    }

    isOwner(uuid: UUID): boolean {
        return Land.SYMBOLS.Land_isOwner(this.mLandId, uuid);
    }

    isMember(uuid: UUID): boolean {
        return Land.SYMBOLS.Land_isMember(this.mLandId, uuid);
    }

    /**
     * @deprecated
     */
    isConvertedLand(): boolean {
        return Land.SYMBOLS.Land_isConvertedLand(this.mLandId);
    }

    /**
     * @deprecated
     */
    isOwnerDataIsXUID(): boolean {
        return Land.SYMBOLS.Land_isOwnerDataIsXUID(this.mLandId);
    }

    isCollision(pos: IntPos, radius: number): boolean;
    isCollision(pos1: IntPos, pos2: IntPos): boolean;
    isCollision(pos1: IntPos, pos2: any): boolean {
        if (typeof pos2 === "number") {
            return Land.SYMBOLS.Land_isCollision(this.mLandId, pos1, pos2);
        } else if (isIntPos(pos2)) {
            return Land.SYMBOLS.Land_isCollision2(this.mLandId, pos1, pos2);
        }
        throw new TypeError("pos2 must be IntPos or number");
    }

    /**
     * @brief 数据是否被修改
     * @note 当调用任意 set 方法时，数据会被标记为已修改
     * @note 调用 save 方法时，数据会被保存到数据库，并重置为未修改
     */
    isDirty(): boolean {
        return Land.SYMBOLS.Land_isDirty(this.mLandId);
    }

    /**
     * @brief 获取领地类型
     */
    getType(): LandType | null {
        const result = Land.SYMBOLS.Land_getType(this.mLandId);
        if (result === INVALID_LAND_ID) {
            return null;
        }
        return result as LandType;
    }

    /**
     * @brief 是否有父领地
     */
    hasParentLand(): boolean {
        return Land.SYMBOLS.Land_hasParentLand(this.mLandId);
    }

    /**
     * @brief 是否有子领地
     */
    hasSubLand(): boolean {
        return Land.SYMBOLS.Land_hasSubLand(this.mLandId);
    }

    /**
     * @brief 是否为子领地(有父领地、无子领地)
     */
    isSubLand(): boolean {
        return Land.SYMBOLS.Land_isSubLand(this.mLandId);
    }

    /**
     * @brief 是否为父领地(有子领地、无父领地)
     */
    isParentLand(): boolean {
        return Land.SYMBOLS.Land_isParentLand(this.mLandId);
    }

    /**
     * @brief 是否为混合领地(有父领地、有子领地)
     */
    isMixLand(): boolean {
        return Land.SYMBOLS.Land_isMixLand(this.mLandId);
    }

    /**
     * @brief 是否为普通领地(无父领地、无子领地)
     */
    isOrdinaryLand(): boolean {
        return Land.SYMBOLS.Land_isOrdinaryLand(this.mLandId);
    }

    /**
     * @brief 是否可以创建子领地
     * 如果满足嵌套层级限制，则可以创建子领地
     */
    canCreateSubLand(): boolean {
        return Land.SYMBOLS.Land_canCreateSubLand(this.mLandId);
    }

    /**
     * @brief 获取父领地
     */
    getParentLandID(): Land | null {
        const result = Land.SYMBOLS.Land_getParentLandID(this.mLandId);
        if (result === -1) {
            return null;
        }
        return new Land(result);
    }

    /**
     * @brief 获取子领地(当前领地名下的所有子领地)
     */
    getSubLandIDs(): Land[] {
        return Land.SYMBOLS.Land_getSubLandIDs(this.mLandId).map(
            (id) => new Land(id)
        );
    }

    /**
     * @brief 获取嵌套层级(相对于父领地)
     */
    getNestedLevel(): number {
        return Land.SYMBOLS.Land_getNestedLevel(this.mLandId);
    }

    /**
     * @brief 获取一个玩家在当前领地所拥有的权限类别
     */
    getPermType(uuid: UUID): LandPermType {
        return Land.SYMBOLS.Land_getPermType(this.mLandId, uuid);
    }
}

Object.freeze(Land.SYMBOLS);
