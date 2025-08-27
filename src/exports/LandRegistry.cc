#include "pland/land/LandRegistry.h"
#include "Pland/PLand.h"
#include "exports/APIHelper.h"
#include "pland/Version.h"
#include "pland/aabb/LandAABB.h"
#include "pland/land/Land.h"
#include "pland/utils/JSON.h"
#include <algorithm>
#include <vector>


#include "ExportDef.h"


namespace ldapi {


void Export_Class_LandRegistry() {
    exportAs("LandRegistry_isOperator", [](std::string const& uuid) -> bool {
        return land::PLand::getInstance().getLandRegistry()->isOperator(uuid);
    });

    exportAs("LandRegistry_addOperator", [](std::string const& uuid) -> bool {
        return land::PLand::getInstance().getLandRegistry()->addOperator(uuid);
    });

    exportAs("LandRegistry_removeOperator", [](std::string const& uuid) -> bool {
        return land::PLand::getInstance().getLandRegistry()->removeOperator(uuid);
    });

    exportAs("LandRegistry_hasPlayerSettings", [](std::string const& uuid) -> bool {
        return land::PLand::getInstance().getLandRegistry()->hasPlayerSettings(uuid);
    });

    exportAs("LandRegistry_getPlayerSettings", [](std::string const& uuid) -> std::string {
        try {
            // struct -> json -> std::string
            auto settings = land::PLand::getInstance().getLandRegistry()->getPlayerSettings(uuid);
            auto j        = land::JSON::structTojson(*settings);
            return j.dump();
        } catch (...) {
            return {};
        }
    });

    exportAs("LandRegistry_setPlayerSettings", [](std::string const& uuid, std::string const& jsonStr) -> bool {
        try {
            // jsonStr -> json -> struct
            auto json = nlohmann::json::parse(jsonStr);
            auto set  = land::PlayerSettings{};
            land::JSON::jsonToStructNoMerge(json, set);
            return land::PLand::getInstance().getLandRegistry()->setPlayerSettings(uuid, std::move(set));
        } catch (...) {
            return false;
        }
    });


    exportAs("LandRegistry_hasLand", [](int id) -> bool {
        return land::PLand::getInstance().getLandRegistry()->hasLand(id);
    });

    exportAs(
        "LandRegistry_addOrdinaryLand",
        [](InternalLandAABB iaabb, bool is3D, std::string const& owner) -> std::vector<std::string> {
            if (iaabb[0].second != iaabb[1].second) {
                throw std::runtime_error("LandRegistry_addOrdinaryLand: Invalid AABB");
            }
            auto dimId = iaabb[0].second;
            auto aabb  = toCpp<land::LandAABB>(iaabb);
            aabb.fix();

            auto land   = land::Land::make(aabb, dimId, is3D, owner);
            auto result = land::PLand::getInstance().getLandRegistry()->addOrdinaryLand(land);

            std::vector<std::string> ret;
            ret.reserve(2);

            if (result.has_value()) {
                ret.push_back("success");
                ret.push_back(std::to_string(land->getId()));
            } else {
                ret.push_back("error");
                ret.push_back(std::to_string(static_cast<int>(result.error())));
            }

            return ret;
        }
    );

    exportAs("LandRegistry_addSubLand", [](int parentLandId, InternalLandAABB iaabb) -> std::vector<std::string> {
        auto registry  = land::PLand::getInstance().getLandRegistry();
        auto parentPtr = registry->getLand(parentLandId);
        if (!parentPtr) {
            throw std::runtime_error("LandRegistry_addSubLand: Invalid parent land id");
        }
        auto aabb = toCpp<land::LandAABB>(iaabb);
        aabb.fix();

        auto subLand = land::Land::make(aabb, parentPtr->getDimensionId(), true, parentPtr->getOwner());
        auto result  = registry->addSubLand(parentPtr, subLand);

        std::vector<std::string> ret;
        ret.reserve(2);

        if (result.has_value()) {
            ret.push_back("success");
            ret.push_back(std::to_string(subLand->getId()));
        } else {
            ret.push_back("error");
            ret.push_back(std::to_string(static_cast<int>(result.error())));
        }

        return ret;
    });

    exportAs("LandRegistry_getLand", [](int id) -> int {
        auto land = land::PLand::getInstance().getLandRegistry()->getLand(id);
        if (!land) return -1;
        return land->getId();
    });

    exportAs("LandRegistry_removeLand", [](int id) -> bool {
        return land::PLand::getInstance().getLandRegistry()->removeLand(id);
    });
    exportAs("LandRegistry_removeOrdinaryLand", [](int id) -> int {
        auto ptr    = land::PLand::getInstance().getLandRegistry()->getLand(id);
        auto result = land::PLand::getInstance().getLandRegistry()->removeOrdinaryLand(ptr);
        return result.has_value() ? -1 : static_cast<int>(result.error());
    });
    exportAs("LandRegistry_removeSubLand", [](int id) -> int {
        auto ptr    = land::PLand::getInstance().getLandRegistry()->getLand(id);
        auto result = land::PLand::getInstance().getLandRegistry()->removeSubLand(ptr);
        return result.has_value() ? -1 : static_cast<int>(result.error());
    });
    exportAs("LandRegistry_removeLandAndSubLands", [](int id) -> int {
        auto ptr    = land::PLand::getInstance().getLandRegistry()->getLand(id);
        auto result = land::PLand::getInstance().getLandRegistry()->removeLandAndSubLands(ptr);
        return result.has_value() ? -1 : static_cast<int>(result.error());
    });
    exportAs("LandRegistry_removeLandAndPromoteSubLands", [](int id) -> int {
        auto ptr    = land::PLand::getInstance().getLandRegistry()->getLand(id);
        auto result = land::PLand::getInstance().getLandRegistry()->removeLandAndPromoteSubLands(ptr);
        return result.has_value() ? -1 : static_cast<int>(result.error());
    });
    exportAs("LandRegistry_removeLandAndTransferSubLands", [](int id) -> int {
        auto ptr    = land::PLand::getInstance().getLandRegistry()->getLand(id);
        auto result = land::PLand::getInstance().getLandRegistry()->removeLandAndTransferSubLands(ptr);
        return result.has_value() ? -1 : static_cast<int>(result.error());
    });


    using LandList = std::vector<land::LandID>;
    exportAs("LandRegistry_getLands", []() -> LandList {
        auto     lands = land::PLand::getInstance().getLandRegistry()->getLands();
        LandList result;
        result.reserve(lands.size());
        std::transform(lands.begin(), lands.end(), std::back_inserter(result), [](auto& land) {
            return land->getId();
        });
        return result;
    });

    exportAs("LandRegistry_getLands1", [](int dimid) -> LandList {
        auto     lands = land::PLand::getInstance().getLandRegistry()->getLands(dimid);
        LandList result;
        result.reserve(lands.size());
        std::transform(lands.begin(), lands.end(), std::back_inserter(result), [](auto& land) {
            return land->getId();
        });
        return result;
    });

    exportAs("LandRegistry_getLands2", [](std::string const& uuid, bool includeShared) -> LandList {
        auto     lands = land::PLand::getInstance().getLandRegistry()->getLands(uuid, includeShared);
        LandList result;
        result.reserve(lands.size());
        std::transform(lands.begin(), lands.end(), std::back_inserter(result), [](auto& land) {
            return land->getId();
        });
        return result;
    });

    exportAs("LandRegistry_getLands3", [](std::string const& uuid, int dimid) -> LandList {
        auto     lands = land::PLand::getInstance().getLandRegistry()->getLands(uuid, dimid);
        LandList result;
        result.reserve(lands.size());
        std::transform(lands.begin(), lands.end(), std::back_inserter(result), [](auto& land) {
            return land->getId();
        });
        return result;
    });

    exportAs("LandRegistry_getLands4", [](std::vector<int> lds) -> LandList {
        LandList int64List;
        int64List.reserve(lds.size());
        std::transform(lds.begin(), lds.end(), std::back_inserter(int64List), [](int i) {
            return static_cast<land::LandID>(i);
        });

        auto lands = land::PLand::getInstance().getLandRegistry()->getLands(int64List);

        LandList result;
        result.reserve(lands.size());
        std::transform(lands.begin(), lands.end(), std::back_inserter(result), [](auto& land) {
            return land->getId();
        });

        return result;
    });

    exportAs("LandRegistry_getPermType", [](std::string const& uuid, int landID, bool includeOperator) {
        return static_cast<int>(land::PLand::getInstance()
                                    .getLandRegistry()
                                    ->getPermType(uuid, static_cast<land::LandID>(landID), includeOperator));
    });

    exportAs("LandRegistry_getLandAt", [](IntPos const& pos) -> int {
        auto land = land::PLand::getInstance().getLandRegistry()->getLandAt(pos.first, pos.second);
        if (!land) return -1;
        return land->getId();
    });

    exportAs("LandRegistry_getLandAt1", [](IntPos const& pos, int radius) -> LandList {
        auto     lands = land::PLand::getInstance().getLandRegistry()->getLandAt(pos.first, radius, pos.second);
        LandList result;
        result.reserve(lands.size());
        std::transform(lands.begin(), lands.end(), std::back_inserter(result), [](auto& land) {
            return land->getId();
        });
        return result;
    });

    exportAs("LandRegistry_getLandAt2", [](IntPos const& a, IntPos const& b) -> LandList {
        auto     lands = land::PLand::getInstance().getLandRegistry()->getLandAt(a.first, b.first, a.second);
        LandList result;
        result.reserve(lands.size());
        std::transform(lands.begin(), lands.end(), std::back_inserter(result), [](auto& land) {
            return land->getId();
        });
        return result;
    });

    exportAs("LandRegistry_refreshLandRange", [](int id) -> void {
        auto inst = land::PLand::getInstance().getLandRegistry();
        auto land = inst->getLand(id);
        if (land) inst->refreshLandRange(land);
    });

    exportAs("PLand_getVersionMeta", []() -> std::string {
        static struct {
            int         major    = PLAND_VERSION_MAJOR;
            int         minor    = PLAND_VERSION_MINOR;
            int         patch    = PLAND_VERSION_PATCH;
            int         build    = PLAND_VERSION_BUILD;
            std::string commit   = PLAND_COMMIT_HASH;
            bool        snapshot = PLAND_VERSION_SNAPSHOT;
            bool        release  = PLAND_VERSION_RELEASE;
            std::string version  = PLAND_VERSION_STRING;
        } meta;
        static auto res = land::JSON::structTojson(meta).dump();
        return res;
    });
}


} // namespace ldapi