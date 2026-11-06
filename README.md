<p align="center">
  <img src="icon.svg" width="72" height="72" alt="Typing practice icon">
</p>

# dsh-typing-practice

A timed typing practice page for the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web UI: live WPM and accuracy, three test durations, and local best scores.

给 DeepSeek Harness Web GUI 加的「打字练习」插件：左侧栏入口 + 独立练习页，实时统计 WPM 与准确率，最佳成绩存在本机浏览器。

> 非官方项目，只是一个 DSH 插件 bundle（`dsh.bundle.patch` + `dsh.client`）。

## 功能

| 项 | 说明 |
|---|---|
| 入口 | 左侧栏「打字练习」（键盘图标）→ 主区域练习页 |
| 模式 | 15 / 30 / 60 秒限时，卡片顶部切换 |
| 实时反馈 | 逐字符高亮（正确 / 错误 / 光标），计时条、剩余时间 |
| 成绩 | 结束后显示 WPM、准确率、正确字符、错误数；破纪录标「新纪录」 |
| 最佳成绩 | 按 15/30/60 秒分别保存到 `localStorage['dsh.typing-practice.v1']` |
| 操作 | 首次按键开始计时；`Tab` 重开；`Backspace` 修正 |
| 界面 | 中英双语，跟随 DSH locale；只用 `--dsw-alias-*` 主题 token，亮/暗色自适应 |

练习文本是本地生成的英文句子（常用词 + 首字母大写 + 逗号/句末标点），不联网、不引入第三方文本。

## 安装

本插件是 DSH 的 bundle。克隆后，在 DSH 里让 agent 用 `plugin_manager` 安装**这个目录**：

```bash
git clone https://github.com/yishan/dsh-typing-practice.git
```

```
plugin_manager(action: "install_bundle", target: "/absolute/path/to/dsh-typing-practice")
```

如果你的环境里有 `dsh` CLI，也可以直接：

```bash
dsh plugin --profile <profile> add /absolute/path/to/dsh-typing-practice
```

安装后刷新 DSH Web 页面，左侧栏会出现「打字练习」。安装是 profile 级的，该 profile 下所有会话可见；删除时用 `plugin_manager` 卸载即可。

## 数据

只写一个本地 key，删掉即清空：

```js
localStorage['dsh.typing-practice.v1'] = {
  version: 1,
  best: {
    "15": { wpm: 82, accuracy: 0.96, at: 1793900000000 },
    "30": { wpm: 76, accuracy: 0.94, at: 1793900000000 }
  }
}
```

不收集、不上传任何数据。

## 结构

```
dsh-typing-practice/
├── package.json        # bundle 清单 + dsh.client 声明（platform: web, inject: ["slots"]）
├── cordis.patch.yml    # 只插入一行 Host 插件
├── index.js            # Host 半：空 apply（无服务、无配置）
├── client.js           # ★ Client 半：侧边栏入口 + 练习页（手写，无构建）
├── icon.svg            # 插件图标（原创键帽）
├── locale/{zh,en}.json # 插件管理页的标题 / 描述
├── LICENSE
└── README.md
```

实现要点：

- 挂载点：`sidebar.panellist`（`id: typing-practice`，order 15）+ `main`（`key: typing-practice`）。
- 计时、文本生成、成绩统计全部在浏览器端；Host 半没有数据接口。
- 没有构建步骤：`client.js` 通过 `window.__ModuleLoader__.load` 注册，React 来自页面运行时；不 import 任何 Harness Client 包。
- 页面文案注册到 Client locale 服务，切换语言自动刷新。

## 开发

- 改 `client.js` 后刷新页面即可；改 `index.js`（Host 半）需要重启 DSH。
- 静态检查：

```bash
node --check client.js
node --check index.js
python3 -m json.tool package.json > /dev/null
```

- 引擎（文本生成、WPM / 准确率、最佳成绩读写）是纯函数，可以直接在 Node 里单测。

## 已知限制

- 仅英文单词 / 标点；中文拼音输入（IME）练习不在 v1 范围。
- 切换侧边栏面板会卸载页面，进行中的测试重置；已保存的最佳成绩不受影响。
- 成绩只存在本机浏览器，不跨设备同步。
- 开发环境已验证：安装 `application: applied`、`sidebar.panellist` 与 `main` 两处 slot 注册 active、引擎单测通过；页面视觉与真实打字交互请在 GUI 里确认（本机 GUI 有进程级 token 鉴权，无法用浏览器自动化截图）。

## License

[MIT](LICENSE)

---

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
