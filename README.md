# PLand-LegacyRemoteCallApi

PLand 的 LegacyRemoteCallApi 实现，用于在 LegacyScriptEngine-QuickJs/NodeJs 中调用 PLand 的 API。

> **注意：**  
> 本项目仅对 PLand C++ API 进行封装，不包含 PLand 的任何代码，请确保您已经安装了 PLand。  
> 由于引擎限制，无法做到原生持有 Native 对象，因此采用了一些折衷方案，对于大型项目存在性能问题，建议大型项目使用 C++ API。

## 示例

PLand-LegacyRemoteCallApi 从 0.8.0 开始提供 ESM 和 CJS 两种导出方式，您可以根据自己的需求选择。

参考 test 文件夹下的测试代码
