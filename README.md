# PLand-LegacyRemoteCallApi

PLand 的 LegacyRemoteCallApi 实现，用于在 LegacyScriptEngine-QuickJs/NodeJs 中调用 PLand 的 API。

> **注意：**  
> 本项目仅对 PLand C++ API 进行封装，不包含 PLand 的任何代码，请确保您已经安装了 PLand。  
> 由于引擎限制，无法做到原生持有 Native 对象，因此采用了一些折衷方案，对于大型项目存在性能问题，建议大型项目使用 C++ API。

## 示例

PLand-LegacyRemoteCallApi 从 0.8.0 开始提供 ESM 和 CJS 两种导出方式，您可以根据自己的需求选择。

> 注意：v0.8.0 之前的版本，只能使用 ESM 模块系统。

> 当前 Js 所在路径为 bds/plugins/<插件名>/<插件名>.js  
> 假设当前插件名为 template.js

- JavaScript - ESM

```js
// 导入 PLand 类型定义(仅参考，路径填写实际路径)
/// <reference path="path/to/PLand-LegacyRemoteCallApi/lib/esm/imports/LandRegistry.d.ts" />
/// <reference path="path/to/PLand-LegacyRemoteCallApi/lib/esm/imports/Land.d.ts" />
// ... 其他类型定义

// 这里导入 LegacyScriptEngine_API 补全库，路径填写你的 LegacyScriptEngine_API 补全库所在路径
/// <reference path="path/to/LegacyScriptEngine_API/platforms/javascript/src/index.d.ts" />

// 这里使用的是 ESM 模块系统，因此需要使用 import 导入
// 由于 LSE 引擎的一些问题，路径必须以 ./plugins/ 开头，结尾必须以 .js 结尾
import {
  LDEvent,
  PLand,
} from "./plugins/PLand-LegacyRemoteCallApi/lib/esm/imports/LandRegistry.js";

// 获取所有领地
PLand.getLands().map((land) => {
  logger.info(land.mLandName); // 打印当前领地名称
});

// 监听玩家进入领地事件
// 如果需要拦截事件，返回 false 即可
// 注意：部分事件不可拦截，具体查看 PLand 文档
LDEvent.listen("PlayerEnterLandEvent", (pl, landID) => {
  logger.info(
    `玩家 '${pl.realName}' 进入领地: ${PLand.getLand(landID).mLandName}`,
  );
});
```

- JavaScript - CJS

```js
// 导入 PLand 类型定义(仅参考，路径填写实际路径)
/// <reference path="path/to/PLand-LegacyRemoteCallApi/lib/esm/imports/LandRegistry.d.ts" />
/// <reference path="path/to/PLand-LegacyRemoteCallApi/lib/esm/imports/Land.d.ts" />
// ... 其他类型定义

// 这里导入 LegacyScriptEngine_API 补全库，路径填写你的 LegacyScriptEngine_API 补全库所在路径
/// <reference path="path/to/LegacyScriptEngine_API/platforms/javascript/src/index.d.ts" />

// 这里使用的是 CJS 模块系统，因此需要使用 require 导入
const { LDEvent, PLand } = require("PLand-LegacyRemoteCallApi/lib/cjs/imports/LandRegistry");

// 获取所有领地
PLand.getLands().map((land) => {
  logger.info(land.mLandName); // 打印当前领地名称
});

// 监听玩家进入领地事件
// 如果需要拦截事件，返回 false 即可
// 注意：部分事件不可拦截，具体查看 PLand 文档
LDEvent.listen("PlayerEnterLandEvent", (pl, landID) => {
  logger.info(
    `玩家 '${pl.realName}' 进入领地: ${PLand.getLand(landID).mLandName}`,
  );
});
```

> **注意：**
> // 注意：由于插件加载顺序问题，需要在当前插件的 manifest.json 中设置依赖项，否则无法正确导入
>
> ```json
> {
>   "entry": "template.js",
>   "name": "template",
>   "type": "lse-quickjs",
>   "dependencies": [
>     {
>       "name": "legacy-script-engine-quickjs" // 或者 legacy-script-engine-nodejs
>     },
>     {
>       "name": "PLand-LegacyRemoteCallApi"
>     }
>   ]
> }
> ```

- TypeScript

TypeScript 和 JavaScript 基本一致，只需要配置好 tsconfig.json 即可。

假设您的工程目录如下：

```file
./
├── src/
│   └── index.ts
├── package.json
└── tsconfig.json
```

```bash
npm install -D @levimc-lse/types
```

tsconfig.json 配置如下：

```json
{
  "include": ["src/**.ts", "path/to/PLand-LegacyRemoteCallApi/lib/esm/**.d.ts"],
  "compilerOptions": {
    "outDir": "./dist", // 编译输出目录
    "target": "ES2022", // 编译目标 ES2022
    "module": "ES6", // ES6 模块化 或者 CommonJS
    "skipLibCheck": true, // 跳过声明文件的类型检查
    "lib": ["ES2022"], // 只包含 ES2022 库，不包含 DOM
    "types": ["@levimc-lse/types"]
  }
}
```
