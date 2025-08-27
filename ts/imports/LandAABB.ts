import { ImportNamespace } from "../ImportDef.js";

export class LandAABB {
    // 导入表，请勿修改
    static IMPORTS = {
        LandAABB_fix: ll.imports(ImportNamespace, "LandAABB_fix"),
        LandAABB_getDepth: ll.imports(ImportNamespace, "LandAABB_getDepth"),
        LandAABB_getHeight: ll.imports(ImportNamespace, "LandAABB_getHeight"),
        LandAABB_getWidth: ll.imports(ImportNamespace, "LandAABB_getWidth"),
        LandAABB_getSquare: ll.imports(ImportNamespace, "LandAABB_getSquare"),
        LandAABB_getVolume: ll.imports(ImportNamespace, "LandAABB_getVolume"),
        LandAABB_toString: ll.imports(ImportNamespace, "LandAABB_toString"),
        LandAABB_getBorder: ll.imports(ImportNamespace, "LandAABB_getBorder"),
        LandAABB_getRange: ll.imports(ImportNamespace, "LandAABB_getRange"),
        LandAABB_hasPos: ll.imports(ImportNamespace, "LandAABB_hasPos"),
        LandAABB_isCollision: ll.imports(
            ImportNamespace,
            "LandAABB_isCollision"
        ),
        LandAABB_isComplisWithMinSpacing: ll.imports(
            ImportNamespace,
            "LandAABB_isComplisWithMinSpacing"
        ),
        LandAABB_isContain: ll.imports(ImportNamespace, "LandAABB_isContain"),
    };

    min: IntPos;
    max: IntPos;

    constructor(min: IntPos, max: IntPos) {
        this.min = min;
        this.max = max;
    }

    fix() {
        const res = LandAABB.IMPORTS.LandAABB_fix(this.min, this.max);
        this.min = res[0];
        this.max = res[1];
    }

    getDepth(): number {
        return LandAABB.IMPORTS.LandAABB_getDepth(this.min, this.max);
    }
    getHeight(): number {
        return LandAABB.IMPORTS.LandAABB_getHeight(this.min, this.max);
    }
    getWidth(): number {
        return LandAABB.IMPORTS.LandAABB_getWidth(this.min, this.max);
    }
    getSquare(): number {
        return LandAABB.IMPORTS.LandAABB_getSquare(this.min, this.max);
    }
    getVolume(): number {
        return LandAABB.IMPORTS.LandAABB_getVolume(this.min, this.max);
    }

    toString(): string {
        return LandAABB.IMPORTS.LandAABB_toString(this.min, this.max);
    }

    /**
     * 获取领地边框 (立体矩形)
     * @returns 领地边框点列表
     */
    getBorder(): IntPos[] {
        return LandAABB.IMPORTS.LandAABB_getBorder(this.min, this.max);
    }

    /**
     * 获取领地范围 (平面矩形)
     * @returns 领地范围点列表
     */
    getRange(): IntPos[] {
        return LandAABB.IMPORTS.LandAABB_getRange(this.min, this.max);
    }

    hasPos(pos: IntPos, includeY = true): boolean {
        return LandAABB.IMPORTS.LandAABB_hasPos(
            this.min,
            this.max,
            pos,
            includeY
        );
    }

    /**
     * 两个领地是否碰撞 (重合)
     * @param pos1 领地1
     * @param pos2 领地2
     * @returns 是否碰撞
     */
    static isCollision(pos1: LandAABB, pos2: LandAABB): boolean {
        return LandAABB.IMPORTS.LandAABB_isCollision(
            pos1.min,
            pos1.max,
            pos2.min,
            pos2.max
        );
    }

    /**
     * 两个领地是否满足最小间距
     * @param pos1 范围1
     * @param pos2 范围2
     * @param minSpacing 最小间距
     * @param includeY 是否包含Y轴
     * @returns 是否满足最小间距
     */
    static isComplisWithMinSpacing(
        pos1: LandAABB,
        pos2: LandAABB,
        minSpacing: number,
        includeY = true
    ): boolean {
        return LandAABB.IMPORTS.LandAABB_isComplisWithMinSpacing(
            pos1.min,
            pos1.max,
            pos2.min,
            pos2.max,
            minSpacing,
            includeY
        );
    }

    /**
     * @brief 判断一个 AABB 区域是否完整包含另一个 AABB 区域
     * 如果目标 AABB 在源 AABB 内，则返回 true，否则返回 false
     */
    static isContain(pos1: LandAABB, pos2: LandAABB): boolean {
        return LandAABB.IMPORTS.LandAABB_isContain(
            pos1.min,
            pos1.max,
            pos2.min,
            pos2.max
        );
    }
}

Object.freeze(LandAABB.IMPORTS);
