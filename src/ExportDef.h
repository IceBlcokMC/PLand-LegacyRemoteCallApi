#pragma once
#include "fmt/color.h"
#include "fmt/core.h"
#include <source_location>
#include <string>
#include <unordered_set>


#pragma warning(push, 0) // 禁用所有警告
#include "RemoteCallAPI.h"
#pragma warning(pop) // 恢复警告状态


namespace ldapi {

using IntPos   = std::pair<BlockPos, int>; // pos, dimid
using FloatPos = std::pair<Vec3, int>;     // pos, dimid

constexpr auto ExportNamespace = "PLand_LDAPI";

namespace detail {
#ifdef LDAPI_DEBUG
inline static std::unordered_set<std::string> kExported = {};
#endif
} // namespace detail

template <typename CB>
inline bool
exportAs(std::string const& sym, CB&& callback, std::source_location loc = std::source_location::current()) {
#ifdef LDAPI_COLLECT_EXPORT_SYMBOLS
    fmt::print(
        "[PLand-LRCA] export: '{}' => '{}' [{}({},{})]\n",
        ExportNamespace,
        sym,
        loc.file_name(),
        loc.line(),
        loc.column()
    );
#endif
#ifdef LDAPI_DEBUG
    if (!detail::kExported.insert(sym).second) {
        fmt::print(
            fmt::fg(fmt::color::yellow),
            "[PLand-LRCA] Warning: Duplicate export: '{}' => '{}' [{}({},{})]\n",
            ExportNamespace,
            sym,
            loc.file_name(),
            loc.line(),
            loc.column()
        );
    }
#endif
    return RemoteCall::exportAs(ExportNamespace, sym, std::move(callback));
}


} // namespace ldapi