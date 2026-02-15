import {ImportNamespace, LandID, UUID} from "../ImportDef.js";


type EventParams = {
    LandResizedEvent: [id: LandID, min: IntPos, max: IntPos],
    MemberChangedEvent: [id: LandID, target: UUID, isAdd: boolean],
    OwnerChangedEvent: [id: LandID, oldOwner: UUID, newOwner: UUID]

    LandRefundFailedEvent: [id: LandID, target: UUID, amount: number],

    /**
     * player 操作玩家
     * id 领地ID
     * min, max 新范围
     * type 更改领地大小结算对象 的 结算类型 -----\
     * newTotalPrice 新范围总价           -----|----> LandResizeSettlement
     * amount 差价（始终为正）            -----/
     */
    PlayerApplyLandRangeChangeBeforeEvent: [player: Player, id: LandID, min: IntPos, max: IntPos, type: "NoChange" | "Pay" | "Refund", newTotalPrice: number, amount: number]
    PlayerApplyLandRangeChangeAfterEvent: [player: Player, id: LandID, min: IntPos, max: IntPos, type: "NoChange" | "Pay" | "Refund", newTotalPrice: number, amount: number]

    PlayerBuyLandBeforeEvent: [player: Player, payMoney: number, landType: "Ordinary" | "Parent" | "Mix" | "Sub"]
    PlayerBuyLandAfterEvent: [player: Player, id: LandID, payMoney: number]

    PlayerChangeLandMemberBeforeEvent: [player: Player, id: LandID, target: UUID, isAdd: boolean]
    PlayerChangeLandMemberAfterEvent: [player: Player, id: LandID, target: UUID, isAdd: boolean]

    PlayerChangeLandNameBeforeEvent: [player: Player, id: LandID, newName: string]
    PlayerChangeLandNameAfterEvent: [player: Player, id: LandID, newName: string]

    PlayerDeleteLandBeforeEvent: [player: Player, id: LandID]
    PlayerDeleteLandAfterEvent: [player: Player, id: LandID]

    PlayerEnterLandEvent: [player: Player, id: LandID]
    PlayerLeaveLandEvent: [player: Player, id: LandID]

    PlayerRequestChangeLandRangeBeforeEvent: [player: Player, id: LandID]
    PlayerRequestChangeLandRangeAfterEvent: [player: Player, id: LandID]

    PlayerRequestCreateLandEvent: [player: Player, landType: "Ordinary" | "Parent" | "Mix" | "Sub"]

    PlayerTransferLandBeforeEvent: [player: Player, id: LandID, newOwner: UUID],
    PlayerTransferLandAfterEvent: [player: Player, id: LandID, newOwner: UUID],
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
