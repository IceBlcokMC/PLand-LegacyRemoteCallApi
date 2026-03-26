#include <pland/PLand.h>
#include <pland/land/repo/LandRegistry.h>
#include <pland/service/LeasingService.h>
#include <pland/service/ServiceLocator.h>
#include <pland/utils/TimeUtils.h>

#include "APIHelper.h"
#include "ExportDef.h"

namespace ldapi {

void export_LeasingService() {
    auto& mod      = land::PLand::getInstance();
    auto  registry = &mod.getLandRegistry();
    auto  service  = &mod.getServiceLocator().getLeasingService();

    exportAs("LeasingService_enabled", [service]() -> bool { return service->enabled(); });

    exportAs("LeasingService_refreshSchedule", [service, registry](int landId) -> void {
        if (auto land = registry->getLand(landId)) {
            service->refreshSchedule(land);
        }
    });

    exportAs("LeasingService_setStartAt", [service, registry](int landId, std::string const& timestamp) -> FfiProtocol {
        if (auto land = registry->getLand(landId)) {
            auto ts = land::time_utils::parseTime(timestamp);
            if (ts == std::chrono::system_clock::time_point{}) {
                return ffi_error("invalid timestamp [{}]", timestamp);
            }
            return as_ffi_protocol(service->setStartAt(land, ts));
        }
        return ffi_error("land [{}] not found", landId);
    });
    exportAs("LeasingService_setStartAt", [service, registry](int landId, std::string const& timestamp) -> FfiProtocol {
        if (auto land = registry->getLand(landId)) {
            auto ts = land::time_utils::parseTime(timestamp);
            if (ts == std::chrono::system_clock::time_point{}) {
                return ffi_error("invalid timestamp [{}]", timestamp);
            }
            return as_ffi_protocol(service->setEndAt(land, ts));
        }
        return ffi_error("land [{}] not found", landId);
    });

    exportAs("LeasingService_forceFreeze", [service, registry](int landId) -> FfiProtocol {
        if (auto land = registry->getLand(landId)) {
            return as_ffi_protocol(service->forceFreeze(land));
        }
        return ffi_error("land [{}] not found", landId);
    });
    exportAs("LeasingService_forceRecycle", [service, registry](int landId) -> FfiProtocol {
        if (auto land = registry->getLand(landId)) {
            return as_ffi_protocol(service->forceRecycle(land));
        }
        return ffi_error("land [{}] not found", landId);
    });

    exportAs("LeasingService_addTime", [service, registry](int landId, int sec) -> FfiProtocol {
        if (auto land = registry->getLand(landId)) {
            return as_ffi_protocol(service->addTime(land, sec));
        }
        return ffi_error("land [{}] not found", landId);
    });

    exportAs("LeasingService_cleanExpiredLands", [service](int daysOverdue) -> FfiProtocol {
        return as_ffi_protocol(service->cleanExpiredLands(daysOverdue));
    });

    exportAs("LeasingService_toBought", [service, registry](int landId) -> FfiProtocol {
        if (auto land = registry->getLand(landId)) {
            return as_ffi_protocol(service->toBought(land));
        }
        return ffi_error("land [{}] not found", landId);
    });
    exportAs("LeasingService_toLeased", [service, registry](int landId, int days) -> FfiProtocol {
        if (auto land = registry->getLand(landId)) {
            return as_ffi_protocol(service->toLeased(land, days));
        }
        return ffi_error("land [{}] not found", landId);
    });
}


} // namespace ldapi
