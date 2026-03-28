/// <reference types="../PLand-LegacyRemoteCallApi/lib/esm/imports/LandRegistry.d.ts" />

// "D:\MinecraftServer\1.21.132.3\plugins\PLand-LegacyRemoteCallApi\lib\esm\imports\LandRegistry.js"
import {LandRegistry} from "./plugins/PLand-LegacyRemoteCallApi/lib/esm/imports/LandRegistry.js";
import {Land} from "./plugins/PLand-LegacyRemoteCallApi/lib/esm/imports/Land.js";


/**
 * 由于 PLand 内部资源初始化顺序问题，对脚本的 LRCA 导出会在 PLand 初始化后导出
 * 作为脚本方，不能在全局作用域、立即执行函数内调用领地API，请在服务器启动后调用
 */

mc.listen("onServerStarted", () => {
    logger.info(`typeof LandRegistry: ${typeof LandRegistry}`)
    logger.info(`typeof LandRegistry.getLand: ${typeof LandRegistry.getLand}`)

    logger.info(`getLand(2) => ${LandRegistry.getLand(2)?.mLandId ?? "null"}`)

    logger.info(`getLands() => ${LandRegistry.getLands().map(i => i.mLandId + ', ')}`)

    // 直接构造领地类
    // PLand-LRCA 的 Land 类实际为一个句柄，只要您知道领地的 ID 就可以直接构造，不用查询
    // 当然，脚本尽可能不要长期持有领地对象，因为 LRCA 提供的封装都是句柄
    // 即使您持有了，底层在玩家删除领地时也会释放领地指针。
    logger.info(`new Land(2).getLeaseState() => ${new Land(2).getLeaseState()}`)
    logger.info(`new Land(2).getLeaseEndAt() => ${new Land(2).getLeaseEndAt().toString()}`)
})
