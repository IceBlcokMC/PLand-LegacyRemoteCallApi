// 导入定义

const ExportNamespace = "PLand_LDAPI"; // ExportDef.h
export const ImportNamespace = ExportNamespace;

export type LandID = number;
export type UUID = string;

export const INVALID_LAND_ID: LandID = -1;

export enum LandPermType {
    Operator = 0, // 领地操作员（管理）
    Owner = 1, // 领地主人
    Member = 2, // 领地成员
    Guest = 3, // 访客
}

export function importAs(symbol: string): (...args: any[]) => any {
    return ll.imports(ImportNamespace, symbol);
}

export function isPlainObject(obj: any): obj is object {
    return obj !== null && typeof obj === "object" && !Array.isArray(obj);
}

export function isIntPos(obj: any): obj is IntPos {
    return obj instanceof IntPos;
}

export type RPCSuccess<T> =
    T extends void
        ? { ok: true }
        : { ok: true; value: T };

export type RPCFailure = { ok: false; error: string };

export type RPCResult<T> = RPCSuccess<T> | RPCFailure;

export class Expected<T> {
    private result: RPCResult<T>;

    constructor(res: RPCResult<T>) {
        this.result = res;
    }

    isOk(): boolean {
        return this.result.ok;
    }

    hasValue(): boolean {
        return "value" in this.result;
    }

    hasError(): boolean {
        return "error" in this.result;
    }

    unwrap(): T {
        if (!this.result.ok) {
            throw new Error(this.result.error);
        }

        if ("value" in this.result) {
            return this.result.value;
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
        if (!this.result.ok) {
            return new Expected<U>(this.result as any);
        }

        if (!("value" in this.result)) {
            // T = void
            return new Expected<U>({
                ok: true,
                value: func(undefined as T)
            } as RPCSuccess<U>);
        }

        try {
            const newValue = func(this.result.value);
            return new Expected<U>({
                ok: true,
                value: newValue
            } as RPCSuccess<U>);
        } catch (e: any) {
            return new Expected<U>({
                ok: false,
                error: e?.message ?? String(e)
            });
        }
    }
}