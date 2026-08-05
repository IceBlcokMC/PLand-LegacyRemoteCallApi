# PLand-LegacyRemoteCallApi

> [!IMPORTANT]
> 由于维护成本以及API便利性上考虑，此项目将停止维护  
> 对于使用 PLand v0.21.0 以上的开发者，请使用 [PLand-NAPI](https://github.com/IceBlcokMC/PLand-NAPI) 进行附属开发  
> [PLand-NAPI](https://github.com/IceBlcokMC/PLand-NAPI) 提供更强大的绑定和更多的交互接口以及更好的性能，让您的脚本可以更方便的与领地进行跨语言交互

PLand 的 LegacyRemoteCallApi 实现，用于在 LegacyScriptEngine-QuickJs/NodeJs 中调用 PLand 的 API。

> **注意：**  
> 本项目仅对 PLand C++ API 进行封装，不包含 PLand 的任何代码，请确保您已经安装了 PLand。  
> 由于引擎限制，无法做到原生持有 Native 对象，因此采用了一些折衷方案，对于大型项目存在性能问题，建议大型项目使用 C++ API。

## 示例

PLand-LegacyRemoteCallApi 从 0.8.0 开始提供 ESM 和 CJS 两种导出方式，您可以根据自己的需求选择。

参考 test 文件夹下的测试代码
