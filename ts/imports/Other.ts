import { importSymbol } from "../ImportDef.js";

/**
 * @deprecated v0.22.1
 */
export function PLand_getVersionMeta() {
    const fn = importSymbol("PLand_getVersionMeta");
    const meta = fn();
    return JSON.parse(meta) as {
        Commit: string;
        Branch: string;
        Tag: string;
    };
}

/**
 * @version v0.22.1+
 */
export function PLand_getBuildInfo() {
    const fn = importSymbol("PLand_getBuildInfo");
    const info = fn();
    return JSON.parse(info) as {
        kBuildMode: string;
        kBuildCommit: string;
        kBuildBranch: string;
        kBuildTag: string;
    };
}
