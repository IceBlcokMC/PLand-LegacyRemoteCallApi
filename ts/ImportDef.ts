// 导入定义

const ExportNamespace = "PLand_LDAPI"; // ExportDef.h
export const ImportNamespace = ExportNamespace;

export type LandID = number; // uint64_t
export type ChunkID = number; // uint64_t
export type LandDimid = number; // int
export type UUID = string; // std::string

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

/**
 * Result 类，表示一个可能包含值或错误的类型
 * 对应 PLand C++ 侧的 Result<T, E>
 * @template T 值的类型
 * @template E 错误的类型
 */
export class Result<T, E = string> {
    private readonly _value: T | null;
    private readonly _error: E | null;

    constructor(value: T | null, error: E | null) {
        this._value = value;
        this._error = error;
    }

    hasValue(): boolean {
        return this._value !== null;
    }

    hasError(): boolean {
        return this._error !== null;
    }

    value(): T {
        if (!this.hasValue()) {
            throw new Error("Result has no value");
        }
        return this._value as T;
    }

    error(): E {
        if (!this.hasError()) {
            throw new Error("Result has no error");
        }
        return this._error as E;
    }
}
