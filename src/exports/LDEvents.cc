#include "fmt/core.h"
#include "ll/api/event/EventBus.h"
#include "ll/api/event/ListenerBase.h"
#include "ll/api/utils/HashUtils.h"
#include "mc/world/actor/player/Player.h"
#include "mc/world/level/BlockPos.h"
#include "mod/MyMod.h"
#include "pland/Global.h"
#include "pland/PLand.h"
#include "pland/aabb/LandAABB.h"
#include "pland/land/Land.h"
#include "pland/land/LandEvent.h"
#include "pland/utils/JSON.h"
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

            case doHash("PlayerAskCreateLandBeforeEvent"): {
                REGISTER_LISTENER(land::PlayerAskCreateLandBeforeEvent, (Player*), (&ev.getPlayer()), ev.cancel());
            }
            case doHash("PlayerAskCreateLandAfterEvent"): {
                REGISTER_LISTENER(
                    land::PlayerAskCreateLandAfterEvent,
                    (Player*, bool),
                    (&ev.getPlayer(), ev.is3DLand()),
                )
            }

            case doHash("PlayerBuyLandBeforeEvent"): {
                REGISTER_LISTENER(
                    land::PlayerBuyLandBeforeEvent,
                    (Player*, int, IntPos, IntPos, bool),
                    (&ev.getPlayer(),
                     ev.getPrice(),
                     IntPos{ev.getSelector()->getPointA().value(), ev.getSelector()->getDimensionId()},
                     IntPos{ev.getSelector()->getPointB().value(), ev.getSelector()->getDimensionId()},
                     ev.getSelector()->is3D()),
                    ev.cancel()
                )
            }
            case doHash("PlayerBuyLandAfterEvent"): {
                REGISTER_LISTENER(
                    land::PlayerBuyLandAfterEvent,
                    (Player*, int),
                    (&ev.getPlayer(), ev.getLand()->getId()),
                )
            }

            case doHash("PlayerEnterLandEvent"): {
                REGISTER_LISTENER(land::PlayerEnterLandEvent, (Player*, int), (&ev.getPlayer(), ev.getLandID()), )
            }
            case doHash("PlayerLeaveLandEvent"): {
                REGISTER_LISTENER(land::PlayerLeaveLandEvent, (Player*, int), (&ev.getPlayer(), ev.getLandID()), )
            }

            case doHash("PlayerDeleteLandBeforeEvent"): {
                REGISTER_LISTENER(
                    land::PlayerDeleteLandBeforeEvent,
                    (Player*, int, int),
                    (&ev.getPlayer(), ev.getLandID(), ev.getRefundPrice()),
                    ev.cancel()
                )
            }
            case doHash("PlayerDeleteLandAfterEvent"): {
                REGISTER_LISTENER(land::PlayerDeleteLandAfterEvent, (Player*, int), (&ev.getPlayer(), ev.getLandID()), )
            }

            case doHash("LandMemberChangeBeforeEvent"): {
                REGISTER_LISTENER(
                    land::LandMemberChangeBeforeEvent,
                    (Player*, std::string, int, bool),
                    (&ev.getPlayer(), ev.getTargetPlayer().asString(), ev.getLandID(), ev.isAdd()),
                    ev.cancel()
                )
            }
            case doHash("LandMemberChangeAfterEvent"): {
                REGISTER_LISTENER(
                    land::LandMemberChangeAfterEvent,
                    (Player*, std::string, int, bool),
                    (&ev.getPlayer(), ev.getTargetPlayer().asString(), ev.getLandID(), ev.isAdd()),
                )
            }

            case doHash("LandOwnerChangeBeforeEvent"): {
                REGISTER_LISTENER(
                    land::LandOwnerChangeBeforeEvent,
                    (Player*, std::string, int),
                    (&ev.getPlayer(), ev.getNewOwner().asString(), ev.getLandID()),
                    ev.cancel()
                )
            }
            case doHash("LandOwnerChangeAfterEvent"): {
                REGISTER_LISTENER(
                    land::LandOwnerChangeAfterEvent,
                    (Player*, std::string, int),
                    (&ev.getPlayer(), ev.getNewOwner().asString(), ev.getLandID()),
                )
            }

            case doHash("LandRangeChangeBeforeEvent"): {
                REGISTER_LISTENER(
                    land::LandRangeChangeBeforeEvent,
                    (Player*, int, IntPos, IntPos, int, int),
                    (&ev.getPlayer(),
                     ev.getLand()->getId(),
                     IntPos{ev.getNewRange().min.as(), ev.getLand()->getDimensionId()},
                     IntPos{ev.getNewRange().max.as(), ev.getLand()->getDimensionId()},
                     ev.getNeedPay(),
                     ev.getRefundPrice()),
                    ev.cancel()
                )
            }
            case doHash("LandRangeChangeAfterEvent"): {
                REGISTER_LISTENER(
                    land::LandRangeChangeAfterEvent,
                    (Player*, int, IntPos, IntPos, int, int),
                    (&ev.getPlayer(),
                     ev.getLand()->getId(),
                     IntPos{ev.getNewRange().min.as(), ev.getLand()->getDimensionId()},
                     IntPos{ev.getNewRange().max.as(), ev.getLand()->getDimensionId()},
                     ev.getNeedPay(),
                     ev.getRefundPrice()),
                )
            }

            default:
                return false;
            }
        }
    );
}


} // namespace ldapi