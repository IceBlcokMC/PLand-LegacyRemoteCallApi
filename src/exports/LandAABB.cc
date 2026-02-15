#include "pland/aabb/LandAABB.h"

#include "ExportDef.h"


namespace ldapi {


void Export_Class_LandAABB() {
    static auto Make = [](IntPos const& a, IntPos const& b) {
        return land::LandAABB::make(land::LandPos::make(a.first), land::LandPos::make(b.first));
    };

    exportAs("LandAABB_fix", [](IntPos const& a, IntPos const& b) -> std::vector<IntPos> {
        auto p = Make(a, b);
        p.fix();
        std::vector<IntPos> res = {
            IntPos{p.min.as(), a.second},
            IntPos{p.max.as(), b.second}
        };
        return res;
    });

    exportAs("LandAABB_getSpanX", [](IntPos const& a, IntPos const& b) -> int {
        auto p = Make(a, b);
        return p.getSpanX();
    });

    exportAs("LandAABB_getSpanY", [](IntPos const& a, IntPos const& b) -> int {
        auto p = Make(a, b);
        return p.getSpanY();
    });

    exportAs("LandAABB_getSpanZ", [](IntPos const& a, IntPos const& b) -> int {
        auto p = Make(a, b);
        return p.getSpanZ();
    });

    exportAs("LandAABB_getSquare", [](IntPos const& a, IntPos const& b) -> int {
        auto p = Make(a, b);
        return p.getSquare();
    });

    exportAs("LandAABB_getVolume", [](IntPos const& a, IntPos const& b) -> int {
        auto p = Make(a, b);
        return p.getVolume();
    });

    exportAs("LandAABB_toString", [](IntPos const& a, IntPos const& b) -> std::string {
        auto p = Make(a, b);
        return p.toString();
    });

    exportAs("LandAABB_getBorder", [](IntPos const& a, IntPos const& b) -> std::vector<IntPos> {
        auto                p   = Make(a, b);
        auto                res = p.getBorder();
        std::vector<IntPos> li;
        for (auto pos : res) {
            li.push_back(IntPos{pos, a.second});
        }
        return li;
    });

    exportAs("LandAABB_getRange", [](IntPos const& a, IntPos const& b) -> std::vector<IntPos> {
        auto                p   = Make(a, b);
        auto                res = p.getRange();
        std::vector<IntPos> li;
        for (auto pos : res) {
            li.emplace_back(pos, a.second);
        }
        return li;
    });

    exportAs("LandAABB_getVertices", [](IntPos const& a, IntPos const& b) -> std::vector<FloatPos> {
        auto                  ab = Make(a, b);
        std::vector<FloatPos> res;
        for (auto point : ab.getVertices()) {
            res.emplace_back(point, a.second);
        }
        return res;
    });

    exportAs("LandAABB_getCorners", [](IntPos const& a, IntPos const& b) -> std::vector<FloatPos> {
        auto                  ab = Make(a, b);
        std::vector<FloatPos> res;
        for (auto point : ab.getCorners()) {
            res.emplace_back(point, a.second);
        }
        return res;
    });

    exportAs("LandAABB_getEdges", [](IntPos const& a, IntPos const& b) -> std::vector<std::vector<IntPos>> {
        auto                             p = Make(a, b);
        std::vector<std::vector<IntPos>> li;
        for (auto& pos : p.getEdges()) {
            std::vector el = {
                IntPos{pos.first,  a.second},
                IntPos{pos.second, b.second}
            };
            li.push_back(std::move(el));
        }
        return li;
    });

    exportAs("LandAABB_hasPos", [](IntPos const& a, IntPos const& b, IntPos const& pos, bool includeY) -> bool {
        auto p = Make(a, b);
        return p.hasPos(pos.first, includeY);
    });


    exportAs("LandAABB_isCollision", [](IntPos const& a, IntPos const& b, IntPos const& c, IntPos const& d) -> bool {
        auto p1 = Make(a, b);
        auto p2 = Make(c, d);
        return land::LandAABB::isCollision(p1, p2);
    });

    exportAs(
        "LandAABB_isComplisWithMinSpacing",
        [](IntPos const& a, IntPos const& b, IntPos const& c, IntPos const& d, int minSpacing, bool includeY) -> bool {
            auto p1 = Make(a, b);
            auto p2 = Make(c, d);
            return land::LandAABB::isComplisWithMinSpacing(p1, p2, minSpacing, includeY);
        }
    );

    exportAs("LandAABB_isContain", [](IntPos const& a, IntPos const& b, IntPos const& c, IntPos const& d) -> bool {
        auto ab1 = Make(a, b);
        auto ab2 = Make(c, d);
        return land::LandAABB::isContain(ab1, ab2);
    });
}


} // namespace ldapi