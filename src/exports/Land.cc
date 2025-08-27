#include "pland/land/Land.h"
#include "pland/PLand.h"
#include "pland/aabb/LandAABB.h"
#include "pland/aabb/LandPos.h"
#include "pland/land/LandContext.h"
#include "pland/land/LandRegistry.h"
#include "pland/utils/JSON.h"


#include "exports/APIHelper.h"

#include "ExportDef.h"

namespace ldapi {


void Export_Class_Land() {
    auto* registry = land::PLand::getInstance().getLandRegistry();

    exportAs("Land_getAABB", [registry](int _landId) -> InternalLandAABB {
        auto land = registry->getLand(_landId);
        if (!land) {
            return {};
        }
        return toLSE<land::LandAABB>(land->getAABB(), land->getDimensionId());
    });

    exportAs("Land_setAABB", [registry](int _landId, InternalLandAABB aabb) -> bool {
        auto land = registry->getLand(_landId);
        if (!land) {
            return false;
        }
        auto val = toCpp<land::LandAABB>(aabb);
        return land->setAABB(val);
    });

    exportAs("Land_getTeleportPos", [registry](int _landId) -> IntPos {
        auto land = registry->getLand(_landId);
        if (!land) {
            return {};
        }
        return toLSE<land::LandPos>(land->getTeleportPos(), land->getDimensionId());
    });

    exportAs("Land_setTeleportPos", [registry](int _landId, IntPos const& pos) -> void {
        auto land = registry->getLand(_landId);
        if (!land) {
            return;
        }
        land->setTeleportPos(toCpp<land::LandPos>(pos));
    });

    exportAs("Land_getId", [registry](int _landId) -> int {
        auto land = registry->getLand(_landId);
        if (!land) {
            return -1;
        }
        return land->getId();
    });

    exportAs("Land_getDimensionId", [registry](int _landId) -> int {
        auto land = registry->getLand(_landId);
        if (!land) {
            return -1;
        }
        return land->getDimensionId();
    });

    exportAs("Land_getPermTable", [registry](int _landId) -> std::string {
        auto land = registry->getLand(_landId);
        if (!land) {
            return "";
        }
        return toLSE<land::LandPermTable>(land->getPermTable());
    });

    exportAs("Land_setPermTable", [registry](int _landId, std::string const& permTable) -> void {
        auto land = registry->getLand(_landId);
        if (!land) {
            return;
        }
        land->setPermTable(toCpp<land::LandPermTable>(permTable));
    });

    exportAs("Land_getOwner", [registry](int _landId) -> std::string {
        auto land = registry->getLand(_landId);
        if (!land) {
            return "";
        }
        return land->getOwner();
    });

    exportAs("Land_setOwner", [registry](int _landId, std::string const& owner) -> void {
        auto land = registry->getLand(_landId);
        if (!land) {
            return;
        }
        land->setOwner(owner);
    });

    exportAs("Land_getMembers", [registry](int _landId) -> std::vector<std::string> {
        auto land = registry->getLand(_landId);
        if (!land) {
            return {};
        }
        return land->getMembers();
    });

    exportAs("Land_addLandMember", [registry](int _landId, std::string const& member) -> void {
        auto land = registry->getLand(_landId);
        if (!land) {
            return;
        }
        land->addLandMember(member);
    });

    exportAs("Land_removeLandMember", [registry](int _landId, std::string const& member) -> void {
        auto land = registry->getLand(_landId);
        if (!land) {
            return;
        }
        land->removeLandMember(member);
    });

    exportAs("Land_getName", [registry](int _landId) -> std::string {
        auto land = registry->getLand(_landId);
        if (!land) {
            return "";
        }
        return land->getName();
    });

    exportAs("Land_setName", [registry](int _landId, std::string const& name) -> void {
        auto land = registry->getLand(_landId);
        if (!land) {
            return;
        }
        land->setName(name);
    });

    exportAs("Land_getDescribe", [registry](int _landId) -> std::string {
        auto land = registry->getLand(_landId);
        if (!land) {
            return "";
        }
        return land->getDescribe();
    });

    exportAs("Land_setDescribe", [registry](int _landId, std::string const& describe) -> void {
        auto land = registry->getLand(_landId);
        if (!land) {
            return;
        }
        land->setDescribe(describe);
    });

    exportAs("Land_getOriginalBuyPrice", [registry](int _landId) -> int {
        auto land = registry->getLand(_landId);
        if (!land) {
            return 0;
        }
        return land->getOriginalBuyPrice();
    });

    exportAs("Land_setOriginalBuyPrice", [registry](int _landId, int originalBuyPrice) -> void {
        auto land = registry->getLand(_landId);
        if (!land) {
            return;
        }
        land->setOriginalBuyPrice(originalBuyPrice);
    });

    exportAs("Land_is3D", [registry](int _landId) -> bool {
        auto land = registry->getLand(_landId);
        if (!land) {
            return false;
        }
        return land->is3D();
    });

    exportAs("Land_isOwner", [registry](int _landId, std::string const& uuid) -> bool {
        auto land = registry->getLand(_landId);
        if (!land) {
            return false;
        }
        return land->isOwner(uuid);
    });

    exportAs("Land_isMember", [registry](int _landId, std::string const& uuid) -> bool {
        auto land = registry->getLand(_landId);
        if (!land) {
            return false;
        }
        return land->isMember(uuid);
    });

    exportAs("Land_isConvertedLand", [registry](int _landId) -> bool {
        auto land = registry->getLand(_landId);
        if (!land) {
            return false;
        }
        return land->isConvertedLand();
    });

    exportAs("Land_isOwnerDataIsXUID", [registry](int _landId) -> bool {
        auto land = registry->getLand(_landId);
        if (!land) {
            return false;
        }
        return land->isOwnerDataIsXUID();
    });

    exportAs("Land_isCollision", [registry](int _landId, IntPos const& pos, int radius) -> bool {
        auto land = registry->getLand(_landId);
        if (!land) {
            return false;
        }
        return land->isCollision(toCpp<land::LandPos>(pos).as(), radius);
    });

    exportAs("Land_isCollision2", [registry](int _landId, IntPos const& a, IntPos const& b) -> bool {
        auto land = registry->getLand(_landId);
        if (!land) {
            return false;
        }
        return land->isCollision(toCpp<land::LandPos>(a).as(), toCpp<land::LandPos>(b).as());
    });

    exportAs("Land_isDirty", [registry](int _landId) -> bool {
        auto land = registry->getLand(_landId);
        if (!land) {
            return false;
        }
        return land->isDirty();
    });

    exportAs("Land_getType", [registry](int _landId) -> int {
        auto land = registry->getLand(_landId);
        if (!land) {
            return -1;
        }
        return static_cast<int>(land->getType());
    });

    exportAs("Land_hasParentLand", [registry](int _landId) -> bool {
        auto land = registry->getLand(_landId);
        if (!land) {
            return false;
        }
        return land->hasParentLand();
    });

    exportAs("Land_hasSubLand", [registry](int _landId) -> bool {
        auto land = registry->getLand(_landId);
        if (!land) {
            return false;
        }
        return land->hasSubLand();
    });

    exportAs("Land_isSubLand", [registry](int _landId) -> bool {
        auto land = registry->getLand(_landId);
        if (!land) {
            return false;
        }
        return land->isSubLand();
    });

    exportAs("Land_isParentLand", [registry](int _landId) -> bool {
        auto land = registry->getLand(_landId);
        if (!land) {
            return false;
        }
        return land->isParentLand();
    });

    exportAs("Land_isMixLand", [registry](int _landId) -> bool {
        auto land = registry->getLand(_landId);
        if (!land) {
            return false;
        }
        return land->isMixLand();
    });

    exportAs("Land_isOrdinaryLand", [registry](int _landId) -> bool {
        auto land = registry->getLand(_landId);
        if (!land) {
            return false;
        }
        return land->isOrdinaryLand();
    });

    exportAs("Land_canCreateSubLand", [registry](int _landId) -> bool {
        auto land = registry->getLand(_landId);
        if (!land) {
            return false;
        }
        return land->canCreateSubLand();
    });

    exportAs("Land_getParentLand", [registry](int _landId) -> int {
        auto land = registry->getLand(_landId);
        if (!land) {
            return -1;
        }
        auto parentLand = land->getParentLand();
        if (!parentLand) {
            return -1;
        }
        return parentLand->getId();
    });

    exportAs("Land_getSubLands", [registry](int _landId) -> std::vector<int> {
        auto land = registry->getLand(_landId);
        if (!land) {
            return {};
        }
        auto             subLands = land->getSubLands();
        std::vector<int> result;
        result.reserve(subLands.size());
        std::transform(subLands.begin(), subLands.end(), std::back_inserter(result), [](auto& subLand) {
            return subLand->getId();
        });
        return result;
    });

    exportAs("Land_getNestedLevel", [registry](int _landId) -> int {
        auto land = registry->getLand(_landId);
        if (!land) {
            return -1;
        }
        return land->getNestedLevel();
    });

    exportAs("Land_getRootLand", [registry](int _landId) -> int {
        auto land = registry->getLand(_landId);
        if (!land) {
            return -1;
        }
        auto rootLand = land->getRootLand();
        if (!rootLand) {
            return -1;
        }
        return rootLand->getId();
    });

    exportAs("Land_getFamilyTree", [registry](int _landId) -> std::vector<int> {
        auto land = registry->getLand(_landId);
        if (!land) {
            return {};
        }
        auto             familyTree = land->getFamilyTree();
        std::vector<int> result;
        result.reserve(familyTree.size());
        std::transform(familyTree.begin(), familyTree.end(), std::back_inserter(result), [](auto& family) {
            return family->getId();
        });
        return result;
    });

    exportAs("Land_getSelfAndAncestors", [registry](int _landId) -> std::vector<int> {
        auto land = registry->getLand(_landId);
        if (!land) {
            return {};
        }
        auto             selfAndAncestors = land->getSelfAndAncestors();
        std::vector<int> result;
        result.reserve(selfAndAncestors.size());
        std::transform(
            selfAndAncestors.begin(),
            selfAndAncestors.end(),
            std::back_inserter(result),
            [](auto& ancestor) { return ancestor->getId(); }
        );
        return result;
    });

    exportAs("Land_getSelfAndDescendants", [registry](int _landId) -> std::vector<int> {
        auto land = registry->getLand(_landId);
        if (!land) {
            return {};
        }
        auto             selfAndDescendants = land->getSelfAndDescendants();
        std::vector<int> result;
        result.reserve(selfAndDescendants.size());
        std::transform(
            selfAndDescendants.begin(),
            selfAndDescendants.end(),
            std::back_inserter(result),
            [](auto& descendant) { return descendant->getId(); }
        );
        return result;
    });

    exportAs("Land_getPermType", [registry](int _landId, std::string const& uuid) -> int {
        auto land = registry->getLand(_landId);
        if (!land) {
            return -1;
        }
        return static_cast<int>(land->getPermType(uuid));
    });
}


} // namespace ldapi