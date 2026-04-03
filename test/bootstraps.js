/**
 * Bootstraps.js 引导文件
 * 由于 LSE 引擎的模块解析机制问题，入口文件的模块的 import.met.url 为程序路径 cwd
 * 当入口文件解析后，子模块解析行为回归到正常行为，所以针对这种场景可以使用 bootstraps.js
 * 来加载实际都得入口文件规避这种问题
 * 
 * test: 插件文件夹路径
 * Test.js: 实际入口文件
 */
import * as _ from "./plugins/test/Test.js";
