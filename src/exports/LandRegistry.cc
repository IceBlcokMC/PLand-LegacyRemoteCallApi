#include "pland/PLand.h"

#include "exports/APIHelper.h"

#include "pland/BuildInfo.h"
#include "pland/aabb/LandAABB.h"
#include "pland/land/Land.h"
#include "pland/land/repo/LandRegistry.h"
#include "pland/utils/JsonUtil.h"

#include "mc/platform/UUID.h"

#include <algorithm>
#include <vector>

#include "ExportDef.h"


namespace ldapi {


void Export_Class_LandRegistry() {
    exportAs("LandRegistry_isOperator", [](std::string const& uuid) -> bool {
        if (!mce::UUID::canParse(uuid)) {
            return false;
        }
        return land::PLand::getInstance().getLandRegistry().isOperator(mce::UUID{uuid});
    });

    exportAs("LandRegistry_addOperator", [](std::string const& uuid) -> bool {
        if (!mce::UUID::canParse(uuid)) {
            return false;
        }
        return land::PLand::getInstance().getLandRegistry().addOperator(mce::UUID{uuid});
    });

    exportAs("LandRegistry_removeOperator", [](std::string const& uuid) -> bool {
        if (!mce::UUID::canParse(uuid)) {
            return false;
        }
        return land::PLand::getInstance().getLandRegistry().removeOperator(mce::UUID{uuid});
    });

    exportAs("LandRegistry_getOperators", []() -> std::vector<std::string> {
        auto& ops = land::PLand::getInstance().getLandRegistry().getOperators();
        return std::vector<std::string>{ops.begin(), ops.end()};
    });

    exportAs("LandRegistry_getOrCreatePlayerSettings", [](std::string const& uuid) -> std::string {
        if (!mce::UUID::canParse(uuid)) {
            return {};
        }
        try {
            // struct -> json -> std::string
            auto& settings = land::PLand::getInstance().getLandRegistry().getOrCreatePlayerSettings(mce::UUID{uuid});
            auto  j        = land::json_util::struct2json(settings);
            return j.dump();
        } catch (...) {
            return {};
        }
    });

    exportAs("LandRegistry_hasLand", [](int id) -> bool {
        return land::PLand::getInstance().getLandRegistry().hasLand(id);
    });

    exportAs(
        "LandRegistry_addOrdinaryLand",
        [](InternalLandAABB iaabb, bool is3D, std::string const& owner) -> std::string {
            if (iaabb[0].second != iaabb[1].second) {
                throw std::runtime_error("LandRegistry_addOrdinaryLand: Invalid AABB");
            }
            if (!mce::UUID::canParse(owner)) {
                throw std::runtime_error("LandRegistry_addOrdinaryLand: Invalid owner");
            }
            auto dimId = iaabb[0].second;
            auto aabb  = toCpp<land::LandAABB>(iaabb);
            aabb.fix();

            auto land     = land::Land::make(aabb, dimId, is3D, mce::UUID{owner});
            auto expected = land::PLand::getInstance().getLandRegistry().addOrdinaryLand(land);
            return asRPCResultWithValue(expected, [land]() { return land->getId(); });
        }
    );

    exportAs("LandRegistry_getLand", [](int id) -> int {
        auto land = land::PLand::getInstance().getLandRegistry().getLand(id);
        if (!land) return -1;
        return land->getId();
    });

    exportAs("LandRegistry_removeOrdinaryLand", [](int id) -> int {
        auto ptr    = land::PLand::getInstance().getLandRegistry().getLand(id);
        auto result = land::PLand::getInstance().getLandRegistry().removeOrdinaryLand(ptr);
        return asRPCResultVoid(result);
    });

    using LandList = std::vector<land::LandID>;
    exportAs("LandRegistry_getLands", []() -> LandList {
        auto     lands = land::PLand::getInstance().getLandRegistry().getLands();
        LandList result;
        result.reserve(lands.size());
        std::transform(lands.begin(), lands.end(), std::back_inserter(result), [](auto& land) {
            return land->getId();
        });
        return result;
    });

    exportAs("LandRegistry_getLands1", [](int dimid) -> LandList {
        auto     lands = land::PLand::getInstance().getLandRegistry().getLands(dimid);
        LandList result;
        result.reserve(lands.size());
        std::transform(lands.begin(), lands.end(), std::back_inserter(result), [](auto& land) {
            return land->getId();
        });
        return result;
    });

    exportAs("LandRegistry_getLands2", [](std::string const& uuid, bool includeShared) -> LandList {
        if (!mce::UUID::canParse(uuid)) {
            return {};
        }
        auto     lands = land::PLand::getInstance().getLandRegistry().getLands(mce::UUID{uuid}, includeShared);
        LandList result;
        result.reserve(lands.size());
        std::transform(lands.begin(), lands.end(), std::back_inserter(result), [](auto& land) {
            return land->getId();
        });
        return result;
    });

    exportAs("LandRegistry_getLands3", [](std::string const& uuid, int dimid) -> LandList {
        if (!mce::UUID::canParse(uuid)) {
            return {};
        }
        auto     lands = land::PLand::getInstance().getLandRegistry().getLands(mce::UUID{uuid}, dimid);
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

        auto lands = land::PLand::getInstance().getLandRegistry().getLands(int64List);

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
                                    .getPermType(mce::UUID{uuid}, static_cast<land::LandID>(landID), includeOperator));
    });

    exportAs("LandRegistry_getLandAt", [](IntPos const& pos) -> int {
        auto land = land::PLand::getInstance().getLandRegistry().getLandAt(pos.first, pos.second);
        if (!land) return -1;
        return land->getId();
    });

    exportAs("LandRegistry_getLandAt1", [](IntPos const& pos, int radius) -> LandList {
        auto     lands = land::PLand::getInstance().getLandRegistry().getLandAt(pos.first, radius, pos.second);
        LandList result;
        result.reserve(lands.size());
        std::transform(lands.begin(), lands.end(), std::back_inserter(result), [](auto& land) {
            return land->getId();
        });
        return result;
    });

    exportAs("LandRegistry_getLandAt2", [](IntPos const& a, IntPos const& b) -> LandList {
        auto     lands = land::PLand::getInstance().getLandRegistry().getLandAt(a.first, b.first, a.second);
        LandList result;
        result.reserve(lands.size());
        std::transform(lands.begin(), lands.end(), std::back_inserter(result), [](auto& land) {
            return land->getId();
        });
        return result;
    });

    exportAs("LandRegistry_refreshLandRange", [](int id) -> void {
        auto& inst = land::PLand::getInstance().getLandRegistry();
        auto  land = inst.getLand(id);
        if (land) inst.refreshLandRange(land);
    });

    exportAs("PLand_getVersionMeta", []() -> std::string {
        static struct {
            std::string Commit = land::BuildInfo::Commit.data();
            std::string Branch = land::BuildInfo::Branch.data();
            std::string Tag    = land::BuildInfo::Tag.data();
        } meta;
        static auto res = land::json_util::struct2json(meta).dump();
        return res;
    });
}


} // namespace ldapi