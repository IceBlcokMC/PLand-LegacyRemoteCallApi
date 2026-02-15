import {
    importAs, INVALID_LAND_ID,
    isIntPos,
    LandID,
    LandPermType,
    UUID,
} from "../ImportDef.js";
import {LandAABB} from "./LandAABB.js";

export interface LandPermTable {
    /**火焰蔓延*/ allowFireSpread: boolean;
    /**点击龙蛋*/ allowAttackDragonEgg: boolean;
    /**耕地退化*/ allowFarmDecay: boolean;
    /**活塞推动*/ allowPistonPushOnBoundary: boolean;
    /**红石更新*/ allowRedstoneUpdate: boolean;
    /**爆炸*/ allowExplode: boolean;
    /**方块掉落*/ allowBlockFall: boolean;
    /**允许破坏*/ allowDestroy: boolean;
    /**允许凋零破坏*/ allowWitherDestroy: boolean;
    /**允许放置 [x]*/ allowPlace: boolean;
    /**允许玩家受伤*/ allowPlayerDamage: boolean;
    /**允许敌对生物受伤*/ allowMonsterDamage: boolean;
    /**允许友好、中立生物受伤*/ allowPassiveDamage: boolean;
    /**允许对特殊实体造成伤害(船、矿车、画等)*/ allowSpecialDamage: boolean;
    /**允许对特殊实体2造成伤害*/ allowCustomSpecialDamage: boolean;
    /**允许打开箱子*/ allowOpenChest: boolean;
    /**允许拾取物品*/ allowPickupItem: boolean;
    /**允许末影人放下方块*/ allowEndermanLeaveBlock: boolean;

    /**允许丢弃物品*/ allowDropItem: boolean;
    /**允许投掷物*/ allowProjectileCreate: boolean;
    /**允许骑乘实体*/ allowRideEntity: boolean;
    /**允许骑乘矿车、船*/ allowRideTrans: boolean;
    /**允许斧头去皮*/ allowAxePeeled: boolean;
    /**允许液体流动*/ allowLiquidFlow: boolean;
    /**允许幽匿尖啸体生长*/ allowSculkBlockGrowth: boolean;
    /**允许怪物生成*/ allowMonsterSpawn: boolean;
    /**允许动物生成*/ allowAnimalSpawn: boolean;
    /**实体交互*/ allowInteractEntity: boolean;
    /**实体破坏*/ allowActorDestroy: boolean;

    /**使用铁砧*/ useAnvil: boolean;
    /**使用木桶*/ useBarrel: boolean;
    /**使用信标*/ useBeacon: boolean;
    /**使用床*/ useBed: boolean;
    /**使用钟*/ useBell: boolean;
    /**使用高炉*/ useBlastFurnace: boolean;
    /**使用酿造台*/ useBrewingStand: boolean;
    /**使用营火*/ useCampfire: boolean;
    /**使用打火石*/ useFlintAndSteel: boolean;
    /**使用制图台*/ useCartographyTable: boolean;
    /**使用堆肥桶*/ useComposter: boolean;
    /**使用工作台*/ useCraftingTable: boolean;
    /**使用阳光探测器*/ useDaylightDetector: boolean;
    /**使用发射器*/ useDispenser: boolean;
    /**使用投掷器*/ useDropper: boolean;
    /**使用附魔台*/ useEnchantingTable: boolean;
    /**使用门*/ useDoor: boolean;
    /**使用栅栏门*/ useFenceGate: boolean;
    /**使用熔炉*/ useFurnace: boolean;
    /**使用砂轮*/ useGrindstone: boolean;
    /**使用漏斗*/ useHopper: boolean;
    /**使用唱片机*/ useJukebox: boolean;
    /**使用织布机*/ useLoom: boolean;
    /**使用切石机*/ useStonecutter: boolean;
    /**使用音符盒*/ useNoteBlock: boolean;
    /**使用合成器*/ useCrafter: boolean;
    /**使用雕纹书架*/ useChiseledBookshelf: boolean;
    /**吃蛋糕*/ useCake: boolean;
    /**使用红石比较器*/ useComparator: boolean;
    /**使用红石中继器*/ useRepeater: boolean;
    /**使用潜影盒*/ useShulkerBox: boolean;
    /**使用锻造台*/ useSmithingTable: boolean;
    /**使用烟熏炉*/ useSmoker: boolean;
    /**使用活板门*/ useTrapdoor: boolean;
    /**使用讲台*/ useLectern: boolean;
    /**使用炼药锅*/ useCauldron: boolean;
    /**使用拉杆*/ useLever: boolean;
    /**使用按钮*/ useButton: boolean;
    /**使用重生锚*/ useRespawnAnchor: boolean;
    /**使用物品展示框*/ useItemFrame: boolean;
    /**使用钓鱼竿*/ useFishingHook: boolean;
    /**使用桶*/ useBucket: boolean;
    /**使用压力板*/ usePressurePlate: boolean;
    /**使用盔甲架*/ useArmorStand: boolean;
    /**使用骨粉*/ useBoneMeal: boolean;
    /**使用锄头*/ useHoe: boolean;
    /**使用锹*/ useShovel: boolean;
    /**使用试炼宝库*/ useVault: boolean;
    /**使用蜂巢蜂箱*/ useBeeNest: boolean;
    /**放置船*/ placeBoat: boolean;
    /**放置矿车*/ placeMinecart: boolean;

    /**编辑花盆*/ editFlowerPot: boolean;
    /**编辑告示牌*/ editSign: boolean;
}

export enum LandType {
    Ordinary = 0, // 普通领地(无父、无子)
    Parent = 1, // 父领地(无父、有子)
    Mix = 2, // 混合领地(有父、有子)
    Sub = 3, // 子领地(有父、无子)
}

type InternalLandAABB = [IntPos, IntPos];

export class Land {
    static SYMBOLS = {
        Land_getAABB: importAs("Land_getAABB") as (
            id: LandID
        ) => InternalLandAABB,

        Land_getTeleportPos: importAs("Land_getTeleportPos") as (
            id: LandID
        ) => IntPos,

        Land_setTeleportPos: importAs("Land_setTeleportPos") as (
            id: LandID,
            pos: IntPos
        ) => void,

        Land_getId: importAs("Land_getId") as (id: LandID) => LandID,

        Land_getDimensionId: importAs("Land_getDimensionId") as (
            id: LandID
        ) => number,

        Land_getPermTable: importAs("Land_getPermTable") as (
            id: LandID
        ) => string,

        Land_setPermTable: importAs("Land_setPermTable") as (
            id: LandID,
            table: string
        ) => void,

        Land_getOwner: importAs("Land_getOwner") as (id: LandID) => UUID,

        Land_setOwner: importAs("Land_setOwner") as (
            id: LandID,
            owner: UUID
        ) => void,

        Land_getRawOwner: importAs("Land_getRawOwner") as (id: LandID) => string,

        Land_getMembers: importAs("Land_getMembers") as (id: LandID) => UUID[],

        Land_addLandMember: importAs("Land_addLandMember") as (
            id: LandID,
            uuid: UUID
        ) => void,

        Land_removeLandMember: importAs("Land_removeLandMember") as (
            id: LandID,
            uuid: UUID
        ) => void,

        Land_getName: importAs("Land_getName") as (id: LandID) => string,

        Land_setName: importAs("Land_setName") as (
            id: LandID,
            name: string
        ) => void,

        Land_getOriginalBuyPrice: importAs("Land_getOriginalBuyPrice") as (
            id: LandID
        ) => number,

        Land_setOriginalBuyPrice: importAs("Land_setOriginalBuyPrice") as (
            id: LandID,
            price: number
        ) => void,

        Land_is3D: importAs("Land_is3D") as (id: LandID) => boolean,
        Land_isOwner: importAs("Land_isOwner") as (
            id: LandID,
            uuid: UUID
        ) => boolean,
        Land_isMember: importAs("Land_isMember") as (
            id: LandID,
            uuid: UUID
        ) => boolean,

        Land_isConvertedLand: importAs("Land_isConvertedLand") as (
            id: LandID
        ) => boolean,

        Land_isOwnerDataIsXUID: importAs("Land_isOwnerDataIsXUID") as (
            id: LandID
        ) => boolean,

        Land_isCollision: importAs("Land_isCollision") as (
            id: LandID,
            pos: IntPos,
            radius: number
        ) => boolean,

        Land_isCollision2: importAs("Land_isCollision2") as (
            id: LandID,
            pos1: IntPos,
            pos2: IntPos
        ) => boolean,

        Land_isDirty: importAs("Land_isDirty") as (id: LandID) => boolean,
        Land_getType: importAs("Land_getType") as (id: LandID) => number,

        Land_hasParentLand: importAs("Land_hasParentLand") as (
            id: LandID
        ) => boolean,
        Land_hasSubLand: importAs("Land_hasSubLand") as (id: LandID) => boolean,
        Land_isSubLand: importAs("Land_isSubLand") as (id: LandID) => boolean,
        Land_isParentLand: importAs("Land_isParentLand") as (
            id: LandID
        ) => boolean,
        Land_isMixLand: importAs("Land_isMixLand") as (id: LandID) => boolean,
        Land_isOrdinaryLand: importAs("Land_isOrdinaryLand") as (
            id: LandID
        ) => boolean,
        Land_canCreateSubLand: importAs("Land_canCreateSubLand") as (
            id: LandID
        ) => boolean,

        Land_getParentLandID: importAs("Land_getParentLandID") as (
            id: LandID
        ) => LandID,
        Land_getSubLandIDs: importAs("Land_getSubLandIDs") as (
            id: LandID
        ) => LandID[],
        Land_getNestedLevel: importAs("Land_getNestedLevel") as (
            id: LandID
        ) => number,

        Land_getPermType: importAs("Land_getPermType") as (
            id: LandID,
            uuid: UUID
        ) => number,
    };

    readonly mLandId: LandID = -1;

    constructor(id: LandID) {
        this.mLandId = id;
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

    setOwner(owner: UUID): void {
        Land.SYMBOLS.Land_setOwner(this.mLandId, owner);
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

    addLandMember(uuid: UUID): void {
        Land.SYMBOLS.Land_addLandMember(this.mLandId, uuid);
    }

    removeLandMember(uuid: UUID): void {
        Land.SYMBOLS.Land_removeLandMember(this.mLandId, uuid);
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
