const ExportNamespace = "PLand_LDAPI"; // ExportDef.h
export const ImportNamespace = ExportNamespace;

export type LandID = number; // int64_t as number
export type UUID = string; // mce::UUID as string

export const INVALID_LAND_ID: LandID = -1;

/**
 * 领地系统账号
 * @version v0.19.x
 */
export const SYSTEM_ACCOUNT_UUID_STR: UUID = "deadbeef-dead-beef-dead-beefdeadbeef";

export enum LandPermType {
    /**
     * 领地管理员
     * @version v0.19.x
     */
    Admin = 0,

    /**
     * 领地主人
     */
    Owner = 1,

    /**
     * 领地成员
     */
    Member = 2,

    /**
     * 实体
     * Actor includes both non-member players and non-player entities (e.g., Mobs, TNT).
     * @version v0.19.x
     */
    Actor = 3,

    /** @deprecated */ Operator = 0, // 领地操作员（管理）
    /** @deprecated */ Guest = 3, // 访客
}

export function importSymbol(symbol: string): (...args: any[]) => any {
    return ll.imports(ImportNamespace, symbol);
}

export function isPlainObject(obj: any): obj is object {
    return obj !== null && typeof obj === "object" && !Array.isArray(obj);
}

export function isIntPos(obj: any): obj is IntPos {
    return obj instanceof IntPos;
}


export type InternalLandAABB = [min: IntPos, max: IntPos];


// ffi

export type FfiProtocol = string; // JSON

export type FfiSuccess<T> =
    T extends void
        ? { ok: true } // void
        : { ok: true; value: T }; // T

export type FfiFailure = { ok: false; error: string };

export type FfiPayload<T> = FfiSuccess<T> | FfiFailure;

export function asExpected<T>(protocol: FfiProtocol): Expected<T> {
    const payload = JSON.parse(protocol) as FfiPayload<T>;
    return new Expected<T>(payload);
}

export class Expected<T> {
    private payload: FfiPayload<T>;

    constructor(res: FfiPayload<T>) {
        this.payload = res;
    }

    isOk(): boolean {
        return this.payload.ok;
    }

    hasValue(): boolean {
        return "value" in this.payload;
    }

    hasError(): boolean {
        return "error" in this.payload;
    }

    unwrap(): T {
        if (!this.payload.ok) {
            throw new Error(this.payload.error);
        }

        if ("value" in this.payload) {
            return this.payload.value;
        }

        return undefined as T;
    }

    unwrapOr(defaultValue: T): T {
        if (!this.isOk()) {
            return defaultValue;
        }
        return this.unwrap();
    }

    map<U>(this: Expected<Exclude<T, void>>, func: (value: T) => U): Expected<U> {
        if (!this.payload.ok) {
            return new Expected<U>(this.payload as any);
        }

        if (!("value" in this.payload)) {
            // T = void
            return new Expected<U>({
                ok: true,
                value: func(undefined as T)
            } as FfiSuccess<U>);
        }

        try {
            const newValue = func(this.payload.value);
            return new Expected<U>({
                ok: true,
                value: newValue
            } as FfiSuccess<U>);
        } catch (e: any) {
            return new Expected<U>({
                ok: false,
                error: e?.message ?? String(e)
            });
        }
    }
}