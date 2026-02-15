#include "ll/api/event/EventBus.h"
#include "ll/api/event/ListenerBase.h"
#include "ll/api/utils/HashUtils.h"

#include "magic_enum.hpp"
#include "mc/world/actor/player/Player.h"
#include "mc/world/level/BlockPos.h"

#include "fmt/core.h"

#include "mod/MyMod.h"

#include "pland/Global.h"
#include "pland/PLand.h"
#include "pland/aabb/LandAABB.h"
#include "pland/land/Land.h"
#include "pland/utils/JsonUtil.h"

#include "pland/events/domain/LandResizedEvent.h"
#include "pland/events/domain/MemberChangedEvent.h"
#include "pland/events/domain/OwnerChangedEvent.h"
#include "pland/events/economy/LandRefundFailedEvent.h"
#include "pland/events/player/PlayerApplyLandRangeChangeEvent.h"
#include "pland/events/player/PlayerBuyLandEvent.h"
#include "pland/events/player/PlayerChangeLandMemberEvent.h"
#include "pland/events/player/PlayerChangeLandNameEvent.h"
#include "pland/events/player/PlayerDeleteLandEvent.h"
#include "pland/events/player/PlayerMoveEvent.h"
#include "pland/events/player/PlayerRequestChangeLandRangeEvent.h"
#include "pland/events/player/PlayerRequestCreateLandEvent.h"
#include "pland/events/player/PlayerTransferLandEvent.h"

#include "pland/land/LandResizeSettlement.h"

#include <memory>
#include <unordered_map>
#include <utility>
#include <vector>


#include "ExportDef.h"

namespace ldapi {


using namespace ll::hash_utils;
class ScriptEventManager {
private:
    int64                                             mListenerCount{0}; // 监听器计数
    std::unordered_map<int64, ll::event::ListenerPtr> mListeners;        // 监听器列表 (key: ScriptEventID)

public:
    std::string genListenerID() { return fmt::format("{}_Event_{}", ExportNamespace, mListenerCount++); }

    void addListener(std::string const& scriptEventID, ll::event::ListenerPtr listener) {
        mListeners[doHash(scriptEventID)] = std::move(listener);
    }
    void removeListener(std::string const& scriptEventID) {
        ll::event::EventBus::getInstance().removeListener(mListeners[doHash(scriptEventID)]);
        mListeners.erase(doHash(scriptEventID));
    }

public:
    static ScriptEventManager& getInstance() {
        static ScriptEventManager instance;
        return instance;
    }
};

#define REGISTER_LISTENER(className, importFunc, callParams, cancelFunc)                                               \
    eventManager->addListener(                                                                                         \
        scriptEventID,                                                                                                 \
        bus->emplaceListener<className>([eventName, scriptEventID, eventManager](className& ev) {                      \
            if (!RemoteCall::hasFunc(eventName, scriptEventID)) {                                                      \
                eventManager->removeListener(scriptEventID);                                                           \
                return;                                                                                                \
            }                                                                                                          \
            bool result = true;                                                                                        \
            try {                                                                                                      \
                result = RemoteCall::importAs<bool importFunc>(eventName, scriptEventID) callParams;                   \
            } catch (...) {}                                                                                           \
            if (!result) {                                                                                             \
                cancelFunc;                                                                                            \
            }                                                                                                          \
        })                                                                                                             \
    );                                                                                                                 \
    return true;


void Export_LDEvents() {
    auto* bus          = &ll::event::EventBus::getInstance();
    auto* eventManager = &ScriptEventManager::getInstance();

    exportAs("ScriptEventManager_genListenerID", [eventManager]() -> std::string {
        return eventManager->genListenerID();
    });

    exportAs(
        "Event_RegisterListener",
        [bus, eventManager](std::string const& eventName, std::string const& scriptEventID) -> bool {
            if (!RemoteCall::hasFunc(eventName, scriptEventID)) {
                return false;
            }

            switch (doHash(eventName)) {
            case doHash("LandResizedEvent"): {
                REGISTER_LISTENER(
                    land::event::LandResizedEvent,
                    (int, IntPos, IntPos),
                    (ev.land()->getId(),
                     IntPos{ev.newRange().min.as<>(), ev.land()->getDimensionId()},
                     IntPos{ev.newRange().max.as<>(), ev.land()->getParentLandID()}),
                )
            }
            case doHash("MemberChangedEvent"): {
                REGISTER_LISTENER(
                    land::event::MemberChangedEvent,
                    (int, std::string, bool),
                    (ev.land()->getId(), ev.target().asString(), ev.isAdd()),
                )
            }
            case doHash("OwnerChangedEvent"): {
                REGISTER_LISTENER(
                    land::event::OwnerChangedEvent,
                    (int, std::string, std::string),
                    (ev.land()->getId(), ev.oldOwner().asString(), ev.newOwner().asString()),
                )
            }
            case doHash("LandRefundFailedEvent"): {
                REGISTER_LISTENER(
                    land::event::LandRefundFailedEvent,
                    (int, std::string, int),
                    (ev.land()->getId(), ev.targetPlayer().asString(), ev.refundAmount()),
                )
            }

            case doHash("PlayerApplyLandRangeChangeBeforeEvent"): {
                REGISTER_LISTENER(
                    land::event::PlayerApplyLandRangeChangeBeforeEvent,
                    (Player*, int, IntPos, IntPos, std::string, int, int),
                    (&ev.self(),
                     ev.land()->getId(),
                     {ev.newRange().min.as<>(), ev.land()->getDimensionId()},
                     {ev.newRange().max.as<>(), ev.land()->getDimensionId()},
                     magic_enum::enum_name(ev.resizeSettlement().type).data(),
                     ev.resizeSettlement().newTotalPrice,
                     ev.resizeSettlement().amount),
                )
            }
            case doHash("PlayerApplyLandRangeChangeAfterEvent"): {
                REGISTER_LISTENER(
                    land::event::PlayerApplyLandRangeChangeAfterEvent,
                    (Player*, int, IntPos, IntPos, std::string, int, int),
                    (&ev.self(),
                     ev.land()->getId(),
                     {ev.newRange().min.as<>(), ev.land()->getDimensionId()},
                     {ev.newRange().max.as<>(), ev.land()->getDimensionId()},
                     magic_enum::enum_name(ev.resizeSettlement().type).data(),
                     ev.resizeSettlement().newTotalPrice,
                     ev.resizeSettlement().amount),
                )
            }

            case doHash("PlayerBuyLandBeforeEvent"): {
                REGISTER_LISTENER(
                    land::event::PlayerBuyLandBeforeEvent,
                    (Player*, int, std::string),
                    (&ev.self(), ev.payMoney(), magic_enum::enum_name(ev.landType()).data()),
                )
            }
            case doHash("PlayerBuyLandAfterEvent"): {
                REGISTER_LISTENER(
                    land::event::PlayerBuyLandAfterEvent,
                    (Player*, int, int),
                    (&ev.self(), ev.land()->getId(), ev.payMoney()),
                )
            }

            case doHash("PlayerChangeLandMemberBeforeEvent"): {
                REGISTER_LISTENER(
                    land::event::PlayerChangeLandMemberBeforeEvent,
                    (Player*, int, std::string, bool),
                    (&ev.self(), ev.land()->getId(), ev.target().asString(), ev.isAdd()),
                )
            }
            case doHash("PlayerChangeLandMemberAfterEvent"): {
                REGISTER_LISTENER(
                    land::event::PlayerChangeLandMemberAfterEvent,
                    (Player*, int, std::string, bool),
                    (&ev.self(), ev.land()->getId(), ev.target().asString(), ev.isAdd()),
                )
            }

            case doHash("PlayerChangeLandNameBeforeEvent"): {
                REGISTER_LISTENER(
                    land::event::PlayerChangeLandNameBeforeEvent,
                    (Player*, int, std::string),
                    (&ev.self(), ev.land()->getId(), ev.newName()),
                )
            }
            case doHash("PlayerChangeLandNameAfterEvent"): {
                REGISTER_LISTENER(
                    land::event::PlayerChangeLandNameAfterEvent,
                    (Player*, int, std::string),
                    (&ev.self(), ev.land()->getId(), ev.newName()),
                )
            }

            case doHash("PlayerDeleteLandBeforeEvent"): {
                REGISTER_LISTENER(
                    land::event::PlayerDeleteLandBeforeEvent,
                    (Player*, int),
                    (&ev.self(), ev.land()->getId()),
                )
            }
            case doHash("PlayerDeleteLandAfterEvent"): {
                REGISTER_LISTENER(
                    land::event::PlayerDeleteLandAfterEvent,
                    (Player*, int),
                    (&ev.self(), ev.land()->getId()),
                )
            }

            case doHash("PlayerEnterLandEvent"): {
                REGISTER_LISTENER(land::event::PlayerEnterLandEvent, (Player*, int), (&ev.self(), ev.landId()), )
            }
            case doHash("PlayerLeaveLandEvent"): {
                REGISTER_LISTENER(land::event::PlayerLeaveLandEvent, (Player*, int), (&ev.self(), ev.landId()), )
            }

            case doHash("PlayerRequestChangeLandRangeBeforeEvent"): {
                REGISTER_LISTENER(
                    land::event::PlayerRequestChangeLandRangeBeforeEvent,
                    (Player*, int),
                    (&ev.self(), ev.land()->getId()),
                )
            }
            case doHash("PlayerRequestChangeLandRangeAfterEvent"): {
                REGISTER_LISTENER(
                    land::event::PlayerRequestChangeLandRangeAfterEvent,
                    (Player*, int),
                    (&ev.self(), ev.land()->getId()),
                )
            }

            case doHash("PlayerRequestCreateLandEvent"): {
                REGISTER_LISTENER(
                    land::event::PlayerRequestCreateLandEvent,
                    (Player*, std::string),
                    (&ev.self(), magic_enum::enum_name(ev.type()).data()),
                )
            }

            case doHash("PlayerTransferLandBeforeEvent"): {
                REGISTER_LISTENER(
                    land::event::PlayerTransferLandBeforeEvent,
                    (Player*, int, std::string),
                    (&ev.self(), ev.land()->getId(), ev.newOwner().asString()),
                )
            }
            case doHash("PlayerTransferLandAfterEvent"): {
                REGISTER_LISTENER(
                    land::event::PlayerTransferLandAfterEvent,
                    (Player*, int, std::string),
                    (&ev.self(), ev.land()->getId(), ev.newOwner().asString()),
                )
            }

            default:
                return false;
            }
        }
    );
}


} // namespace ldapi