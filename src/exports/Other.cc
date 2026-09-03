#include "pland/PLand.h"

#include "exports/APIHelper.h"

#include <nlohmann/json.hpp>
#include <string>

#include "ExportDef.h"

namespace ldapi {


void ExportOtherAPI() {
    exportAs("PLand_getVersionMeta", []() -> std::string {
        DEPRECATED_WARN("PLand_getVersionMeta is deprecated, use PLand_getBuildInfo instead");
        static std::string res = [] {
            nlohmann::json j;
            SUPPRESS_DEPRECATED_BEGIN
            j["Commit"] = land::BuildInfo::Commit.data();
            j["Branch"] = land::BuildInfo::Branch.data();
            j["Tag"]    = land::BuildInfo::Tag.data();
            SUPPRESS_DEPRECATED_END
            return j.dump();
        }();
        return res;
    });

    exportAs("PLand_getBuildInfo", []() -> std::string {
        static std::string res = [] {
            nlohmann::json j;
            j["kBuildMode"]   = land::BuildInfo::kBuildMode.data();
            j["kBuildCommit"] = land::BuildInfo::kBuildCommit.data();
            j["kBuildBranch"] = land::BuildInfo::kBuildBranch.data();
            j["kBuildTag"]    = land::BuildInfo::kBuildTag.data();
            return j.dump();
        }();
        return res;
    });
}

} // namespace ldapi