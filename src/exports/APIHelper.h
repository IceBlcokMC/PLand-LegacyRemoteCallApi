#pragma once
#include "pland/Global.h"
#include "pland/aabb/LandAABB.h"
#include "pland/aabb/LandPos.h"
#include "pland/utils/JsonUtil.h"
#include <pland/land/repo/LandContext.h>

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


using FfiProtocol = std::string;

inline FfiProtocol ffi_error(std::string const& msg) {
    auto payload     = nlohmann::json{};
    payload["ok"]    = false;
    payload["error"] = msg;
    return payload.dump();
}
template <typename... Args>
inline FfiProtocol ffi_error(std::string_view fmt, Args&&... args) {
    return ffi_error(fmt::vformat(fmt, fmt::make_format_args(std::forward<Args>(args)...)));
}

inline FfiProtocol ffi_success() {
    auto payload  = nlohmann::json{};
    payload["ok"] = true;
    return payload.dump();
}
template <typename T>
inline FfiProtocol ffi_success(T const& value) {
    auto payload     = nlohmann::json{};
    payload["ok"]    = true;
    payload["value"] = value;
    return payload.dump();
}
template <typename T, typename As>
inline FfiProtocol ffi_success(T const& value, As&& as) {
    return ffi_success(std::forward<As>(as)(value));
}


template <typename E>
FfiProtocol as_ffi_protocol(E const& expected) {
    if (expected) {
        if constexpr (std::is_void_v<typename E::value_type>) {
            return ffi_success(); // 无返回值 expected
        } else {
            return ffi_success(expected.value());
        }
    } else {
        return ffi_error(expected.error().message());
    }
}
template <typename E, typename As>
FfiProtocol as_ffi_protocol(E const& expected, As&& as) {
    if (expected) {
        if constexpr (std::is_void_v<typename E::value_type>) {
            return ffi_success(); // 无返回值 expected
        } else {
            return ffi_success(std::forward<E>(expected), std::forward<As>(as));
        }
    } else {
        return ffi_error(expected.error().message());
    }
}


} // namespace ldapi
