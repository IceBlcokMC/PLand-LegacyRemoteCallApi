#pragma once
#include "pland/Global.h"
#include "pland/aabb/LandAABB.h"
#include "pland/aabb/LandPos.h"
#include "pland/land/LandContext.h"
#include "pland/utils/JsonUtil.h"


#include "ExportDef.h"

namespace ldapi {


using InternalLandAABB = std::vector<IntPos>; // 0: min, 1: max

// Fuck LegacyRemoteCallAPi
template <typename T>
struct Converter;

// LandAABB <-> InternalLandAABB
template <>
struct Converter<land::LandAABB> {
    static InternalLandAABB toLSE(land::LandAABB const& aabb, land::LandDimid dimid) {
        return {
            IntPos{aabb.getMin().as(), dimid},
            IntPos{aabb.getMax().as(), dimid}
        };
    }
    static land::LandAABB toCpp(InternalLandAABB const& inner) {
        return {land::LandPos::make(inner[0].first), land::LandPos::make(inner[1].first)};
    }
};


// LandPos <-> IntPos
template <>
struct Converter<land::LandPos> {
    static IntPos        toLSE(land::LandPos const& pos, land::LandDimid dimid) { return IntPos{pos.as(), dimid}; }
    static land::LandPos toCpp(IntPos const& inner) { return land::LandPos::make(inner.first); }
};


// LandPermTable <-> std::string
template <>
struct Converter<land::LandPermTable> {
    static std::string toLSE(land::LandPermTable const& table) {
        auto j = land::json_util::struct2json(table);
        return j.dump();
    }
    static land::LandPermTable toCpp(std::string const& json) {
        auto                j = nlohmann::json::parse(json);
        land::LandPermTable table{};
        land::json_util::json2structWithDiffPatch(j, table);
        return table;
    }
};


// function
template <typename T, typename... Args>
auto toLSE(Args&&... args) {
    return Converter<T>::toLSE(std::forward<Args>(args)...);
}

template <typename T, typename... Args>
auto toCpp(Args&&... args) {
    return Converter<T>::toCpp(std::forward<Args>(args)...);
}


} // namespace ldapi
