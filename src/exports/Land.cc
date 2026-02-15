#include "pland/land/Land.h"
#include "mc/platform/UUID.h"
#include "pland/PLand.h"
#include "pland/aabb/LandAABB.h"
#include "pland/aabb/LandPos.h"
#include "pland/land/repo/LandRegistry.h"
#include "pland/utils/JsonUtil.h"


#include "exports/APIHelper.h"

#include "ExportDef.h"
#include <algorithm>
#include <string>
#include <vector>

namespace ldapi {


void Export_Class_Land() {
    auto& registry = land::PLand::getInstance().getLandRegistry();

    exportAs("Land_getAABB", [&registry](int _landId) -> InternalLandAABB {
        auto land = registry.getLand(_landId);
        if (!land) {
            return {};
        }
        return toLSE<land::LandAABB>(land->getAABB(), land->getDimensionId());
    });

    exportAs("Land_getTeleportPos", [&registry](int _landId) -> IntPos {
        auto land = registry.getLand(_landId);
        if (!land) {
            return {};
        }
        return toLSE<land::LandPos>(land->getTeleportPos(), land->getDimensionId());
    });

    exportAs("Land_setTeleportPos", [&registry](int _landId, IntPos const& pos) -> void {
        auto land = registry.getLand(_landId);
        if (!land) {
            return;
        }
        land->setTeleportPos(toCpp<land::LandPos>(pos));
    });

    exportAs("Land_getId", [&registry](int _landId) -> int {
        auto land = registry.getLand(_landId);
        if (!land) {
            return land::INVALID_LAND_ID;
        }
        return land->getId();
    });

    exportAs("Land_getDimensionId", [&registry](int _landId) -> int {
        auto land = registry.getLand(_landId);
        if (!land) {
            return land::INVALID_LAND_ID;
        }
        return land->getDimensionId();
    });

    exportAs("Land_getPermTable", [&registry](int _landId) -> std::string {
        auto land = registry.getLand(_landId);
        if (!land) {
            return "";
        }
        return toLSE<land::LandPermTable>(land->getPermTable());
    });

    exportAs("Land_setPermTable", [&registry](int _landId, std::string const& permTable) -> void {
        auto land = registry.getLand(_landId);
        if (!land) {
            return;
        }
        land->setPermTable(toCpp<land::LandPermTable>(permTable));
    });

    exportAs("Land_getOwner", [&registry](int _landId) -> std::string {
        auto land = registry.getLand(_landId);
        if (!land) {
            return "";
        }
        return land->getOwner().asString();
    });

    exportAs("Land_setOwner", [&registry](int _landId, std::string const& owner) -> void {
        auto land = registry.getLand(_landId);
        if (!land) {
            return;
        }
        if (!mce::UUID::canParse(owner)) {
            return;
        }
        land->setOwner(mce::UUID{owner});
    });

    exportAs("Land_getRawOwner", [&registry](int _landId) -> std::string {
        auto land = registry.getLand(_landId);
        if (!land) {
            return "";
        }
        return land->getRawOwner();
    });

    exportAs("Land_getMembers", [&registry](int _landId) -> std::vector<std::string> {
        auto land = registry.getLand(_landId);
        if (!land) {
            return {};
        }
        std::vector<std::string> members;

        auto& landMembers = land->getMembers();
        members.reserve(landMembers.size());
        std::transform(
            landMembers.begin(),
            landMembers.end(),
            std::back_inserter(members),
            [](mce::UUID const& member) -> std::string { return member.asString(); }
        );
        return members;
    });

    exportAs("Land_addLandMember", [&registry](int _landId, std::string const& member) -> void {
        auto land = registry.getLand(_landId);
        if (!land) {
            return;
        }
        if (!mce::UUID::canParse(member)) {
            return;
        }
        land->addLandMember(mce::UUID{member});
    });

    exportAs("Land_removeLandMember", [&registry](int _landId, std::string const& member) -> void {
        auto land = registry.getLand(_landId);
        if (!land) {
            return;
        }
        land->removeLandMember(mce::UUID{member});
    });

    exportAs("Land_getName", [&registry](int _landId) -> std::string {
        auto land = registry.getLand(_landId);
        if (!land) {
            return "";
        }
        return land->getName();
    });

    exportAs("Land_setName", [&registry](int _landId, std::string const& name) -> void {
        auto land = registry.getLand(_landId);
        if (!land) {
            return;
        }
        land->setName(name);
    });

    exportAs("Land_getOriginalBuyPrice", [&registry](int _landId) -> int {
        auto land = registry.getLand(_landId);
        if (!land) {
            return 0;
        }
        return land->getOriginalBuyPrice();
    });

    exportAs("Land_setOriginalBuyPrice", [&registry](int _landId, int originalBuyPrice) -> void {
        auto land = registry.getLand(_landId);
        if (!land) {
            return;
        }
        land->setOriginalBuyPrice(originalBuyPrice);
    });

    exportAs("Land_is3D", [&registry](int _landId) -> bool {
        auto land = registry.getLand(_landId);
        if (!land) {
            return false;
        }
        return land->is3D();
    });

    exportAs("Land_isOwner", [&registry](int _landId, std::string const& uuid) -> bool {
        auto land = registry.getLand(_landId);
        if (!land) {
            return false;
        }
        if (!mce::UUID::canParse(uuid)) {
            return false;
        }
        return land->isOwner(mce::UUID{uuid});
    });

    exportAs("Land_isMember", [&registry](int _landId, std::string const& uuid) -> bool {
        auto land = registry.getLand(_landId);
        if (!land) {
            return false;
        }
        if (!mce::UUID::canParse(uuid)) {
            return false;
        }
        return land->isMember(mce::UUID{uuid});
    });

    exportAs("Land_isConvertedLand", [&registry](int _landId) -> bool {
        auto land = registry.getLand(_landId);
        if (!land) {
            return false;
        }
        return land->isConvertedLand();
    });

    exportAs("Land_isOwnerDataIsXUID", [&registry](int _landId) -> bool {
        auto land = registry.getLand(_landId);
        if (!land) {
            return false;
        }
        return land->isOwnerDataIsXUID();
    });

    exportAs("Land_isCollision", [&registry](int _landId, IntPos const& pos, int radius) -> bool {
        auto land = registry.getLand(_landId);
        if (!land) {
            return false;
        }
        return land->isCollision(toCpp<land::LandPos>(pos).as(), radius);
    });

    exportAs("Land_isCollision2", [&registry](int _landId, IntPos const& a, IntPos const& b) -> bool {
        auto land = registry.getLand(_landId);
        if (!land) {
            return false;
        }
        return land->isCollision(toCpp<land::LandPos>(a).as(), toCpp<land::LandPos>(b).as());
    });

    exportAs("Land_isDirty", [&registry](int _landId) -> bool {
        auto land = registry.getLand(_landId);
        if (!land) {
            return false;
        }
        return land->isDirty();
    });

    exportAs("Land_getType", [&registry](int _landId) -> int {
        auto land = registry.getLand(_landId);
        if (!land) {
            return land::INVALID_LAND_ID;
        }
        return static_cast<int>(land->getType());
    });

    exportAs("Land_hasParentLand", [&registry](int _landId) -> bool {
        auto land = registry.getLand(_landId);
        if (!land) {
            return false;
        }
        return land->hasParentLand();
    });

    exportAs("Land_hasSubLand", [&registry](int _landId) -> bool {
        auto land = registry.getLand(_landId);
        if (!land) {
            return false;
        }
        return land->hasSubLand();
    });

    exportAs("Land_isSubLand", [&registry](int _landId) -> bool {
        auto land = registry.getLand(_landId);
        if (!land) {
            return false;
        }
        return land->isSubLand();
    });

    exportAs("Land_isParentLand", [&registry](int _landId) -> bool {
        auto land = registry.getLand(_landId);
        if (!land) {
            return false;
        }
        return land->isParentLand();
    });

    exportAs("Land_isMixLand", [&registry](int _landId) -> bool {
        auto land = registry.getLand(_landId);
        if (!land) {
            return false;
        }
        return land->isMixLand();
    });

    exportAs("Land_isOrdinaryLand", [&registry](int _landId) -> bool {
        auto land = registry.getLand(_landId);
        if (!land) {
            return false;
        }
        return land->isOrdinaryLand();
    });

    exportAs("Land_canCreateSubLand", [&registry](int _landId) -> bool {
        auto land = registry.getLand(_landId);
        if (!land) {
            return false;
        }
        return land->canCreateSubLand();
    });

    exportAs("Land_getParentLandID", [&registry](int _landId) -> int {
        auto land = registry.getLand(_landId);
        if (!land) {
            return land::INVALID_LAND_ID;
        }
        return land->getParentLandID();
    });

    exportAs("Land_getSubLandIDs", [&registry](int _landId) -> std::vector<int> {
        auto land = registry.getLand(_landId);
        if (!land) {
            return {};
        }
        auto             subLands = land->getSubLandIDs();
        std::vector<int> result;
        result.reserve(subLands.size());
        std::transform(subLands.begin(), subLands.end(), std::back_inserter(result), [](auto i) { return i; });
        return result;
    });

    exportAs("Land_getNestedLevel", [&registry](int _landId) -> int {
        auto land = registry.getLand(_landId);
        if (!land) {
            return land::INVALID_LAND_ID;
        }
        return land->getNestedLevel();
    });

    exportAs("Land_getPermType", [&registry](int _landId, std::string const& uuid) -> int {
        auto land = registry.getLand(_landId);
        if (!land) {
            return land::INVALID_LAND_ID;
        }
        if (!mce::UUID::canParse(uuid)) {
            return land::INVALID_LAND_ID;
        }
        return static_cast<int>(land->getPermType(mce::UUID(uuid)));
    });
}


} // namespace ldapi