add_rules("mode.debug", "mode.release")

add_repositories("liteldev-repo https://github.com/LiteLDev/xmake-repo.git")
add_repositories("iceblcokmc https://github.com/IceBlcokMC/xmake-repo.git")

-- add_requires("levilamina x.x.x") for a specific version
-- add_requires("levilamina develop") to use develop version
-- please note that you should add bdslibrary yourself if using dev version
add_requires("levilamina 26.20.0", {configs = {target_type = "server"}})
add_requires("levibuildscript")
add_requires("legacyremotecall 0.19.0")

add_requires("pland 0.21.0")

if not has_config("vs_runtime") then
    set_runtimes("MD")
end

if is_plat("windows") then
    set_toolchains("clang-cl") -- windows allways use clang-cl
end

target("PLand-LegacyRemoteCallApi") -- Change this to your mod name.
    add_rules("@levibuildscript/linkrule")
    add_rules("@levibuildscript/modpacker")
    if is_plat("windows") then
        add_defines("NOMINMAX", "UNICODE")
        set_exceptions("cxx")
        add_cxflags("/utf-8", "/W4", "/w44265", "/w44289", "/w44296", "/w45263", "/w44738", "/w45204", "/Zc:__cplusplus")
        add_cxflags(
            "/EHs",
            "-Wno-microsoft-cast",
            "-Wno-invalid-offsetof",
            "-Wno-c++2b-extensions",
            "-Wno-microsoft-include",
            "-Wno-overloaded-virtual",
            "-Wno-ignored-qualifiers",
            "-Wno-missing-field-initializers",
            "-Wno-potentially-evaluated-expression",
            "-Wno-pragma-system-header-outside-header",
            {tools = {"clang_cl"}}
        )
    end
    add_files("src/**.cpp", "src/**.cc")
    add_includedirs("src")
    add_packages("levilamina", "pland", "legacyremotecall")
    set_kind("shared")
    set_languages("c++20")
    set_symbols("debug")
    add_defines("LL_PLAT_S")

    if is_mode("debug") then
        add_defines("LDAPI_COLLECT_EXPORT_SYMBOLS")
    end