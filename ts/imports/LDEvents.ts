import { ImportNamespace, LandID, UUID } from "../ImportDef.js";

type EventParams = {
    PlayerEnterLandEvent: [player: Player, landID: LandID];
    PlayerLeaveLandEvent: [player: Player, landID: LandID];

    /** @version v0.17.0 Added */
    PlayerRequestCreateLandEvent: [player: Player, type: "Ordinary" | "Sub"];

    PlayerBuyLandBeforeEvent: [
        player: Player,
        price: number,
        posA: IntPos,
        posB: IntPos,
        is3DLand: boolean,
    ];
    PlayerBuyLandAfterEvent: [player: Player, landID: LandID];
    PlayerDeleteLandBeforeEvent: [
        player: Player,
        landID: LandID,
        refundPrice: number,
    ];
    PlayerDeleteLandAfterEvent: [player: Player, landID: LandID];
    LandMemberChangeBeforeEvent: [
        player: Player,
        targetPlayer: UUID, // 目标玩家 (被添加/移除的玩家)
        landID: LandID,
        isAdd: boolean,
    ];
    LandMemberChangeAfterEvent: [
        player: Player,
        targetPlayer: UUID, // 目标玩家 (被添加/移除的玩家)
        landID: LandID,
        isAdd: boolean,
    ];
    LandOwnerChangeBeforeEvent: [playe: Player, newOwner: UUID, landID: LandID];
    LandOwnerChangeAfterEvent: [playe: Player, newOwner: UUID, landID: LandID];
    LandRangeChangeBeforeEvent: [
        player: Player,
        landID: LandID,
        newPosA: IntPos, // 新的范围A点
        newPosB: IntPos, // 新范围B点
        needPay: number, // 需要支付的金额
        refundPrice: number, // 退款的金额
    ];
    LandRangeChangeAfterEvent: [
        player: Player,
        landID: LandID,
        newPosA: IntPos, // 新的范围A点
        newPosB: IntPos, // 新范围B点
        needPay: number, // 需要支付的金额
        refundPrice: number, // 退款的金额
    ];
};

export type EventType = keyof EventParams;

export class LDEvent {
    static IMPORTS = {
        ScriptEventManager_genListenerID: ll.imports(
            ImportNamespace,
            "ScriptEventManager_genListenerID",
        ),
        Event_RegisterListener: ll.imports(
            ImportNamespace,
            "Event_RegisterListener",
        ),
    };

    constructor() {
        throw new Error("LDEvent is a static class");
    }

    /**
     * 监听事件
     * @warnging **无论事件是否可以拦截，都必须返回一个布尔值, 否则RemoteCall会抛出 `bad_variant_access`**
     * @note **`true`: 放行 / `false` 拦截(由事件决定)**
     * @param event 事件类型
     * @param callback 回调函数
     * @returns 是否成功注册
     */
    static listen<T extends EventType>(
        event: T,
        callback: (...args: EventParams[T]) => boolean,
    ): boolean {
        const id = LDEvent.IMPORTS.ScriptEventManager_genListenerID();
        ll.exports(callback, event, id);
        const ok = LDEvent.IMPORTS.Event_RegisterListener(event, id);
        if (!ok) {
            throw new Error("Failed to register listener for event " + event);
        }
        return ok;
    }
}

Object.freeze(LDEvent.IMPORTS);
