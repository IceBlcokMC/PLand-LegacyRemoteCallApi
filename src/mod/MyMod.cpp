#include "mod/MyMod.h"

#include <memory>

#include "ll/api/mod/RegisterHelper.h"

namespace ldapi {

extern void Export_Class_LandRegistry();
extern void Export_Class_LandAABB();
extern void Export_Class_Land();
extern void Export_LDEvents();


} // namespace ldapi


namespace my_mod {

MyMod& MyMod::getInstance() {
    static MyMod instance;
    return instance;
}
bool MyMod::load() {

    ldapi::Export_Class_LandRegistry();
    ldapi::Export_Class_LandAABB();
    ldapi::Export_Class_Land();
    ldapi::Export_LDEvents();

    return true;
}

bool MyMod::enable() {
    getSelf().getLogger().debug("Enabling...");
    // Code for enabling the mod goes here.
    return true;
}

bool MyMod::disable() {
    getSelf().getLogger().debug("Disabling...");
    // Code for disabling the mod goes here.
    return true;
}

} // namespace my_mod

LL_REGISTER_MOD(my_mod::MyMod, my_mod::MyMod::getInstance());
