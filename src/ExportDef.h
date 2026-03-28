#pragma once
#include "fmt/core.h"
#include <string>

#pragma warning(push, 0) // 禁用所有警告
#include "RemoteCallAPI.h"
#pragma warning(pop) // 恢复警告状态


namespace ldapi {

using IntPos   = std::pair<BlockPos, int>; // pos, dimid
using FloatPos = std::pair<Vec3, int>;     // pos, dimid

constexpr auto ExportNamespace = "PLand_LDAPI";

template <typename CB>
inline bool exportAs(std::string const& sym, CB&& callback) {
#ifdef LDAPI_COLLECT_EXPORT_SYMBOLS
    fmt::print("Exporting func: {} | {}\n", ExportNamespace, sym);
#endif
    return RemoteCall::exportAs(ExportNamespace, sym, std::move(callback));
}


} // namespace ldapi