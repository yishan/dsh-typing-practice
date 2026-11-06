<p align="center">
  <img src="icon.svg" width="72" height="72" alt="Typing practice icon">
</p>

# dsh-typing-practice

A timed typing practice page for the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web UI: English, Chinese and Cantonese text, native IME input, Pinyin and Jyutping hints, live speed and accuracy, and local best scores.

给 DeepSeek Harness Web GUI 加的「打字练习」插件：英文、中文和粤语文本练习，使用自己的输入法上屏，可查看拼音或粤拼提示，实时统计速度与准确率，最佳成绩存在本机浏览器。

> 非官方项目，只是一个 DSH 插件 bundle（`dsh.bundle.patch` + `dsh.client`）。

## 功能

| 项 | 说明 |
|---|---|
| 入口 | 左侧栏「打字练习」（键盘图标）→ 主区域练习页 |
| 语料 | 英文生成句子、简体中文短文、繁体粤语短文；与界面语言独立 |
| 注音 | 中文带声调拼音、粤语数字声调粤拼；默认「当前词」，可选「全部」或「关闭」 |
| 模式 | 15 / 30 / 60 秒限时，卡片顶部切换 |
| 实时反馈 | 英文四行、中文和粤语三行视区；逐字符高亮，组字预览，计时条与剩余时间 |
| 成绩 | 英文用 WPM，中文和粤语用字/分钟（CPM）；另显示准确率、正确字符和错误数 |
| 最佳成绩 | 按语言、时长、语料类别、提示状态和规则版本分别保存到 `localStorage['dsh.typing-practice.v2']` |
| 操作 | 首次有效组字或直接文字输入开始计时；上屏后判分；原生退格、选区替换；始终可见的重开按钮 |
| 键盘导航 | `Tab` / `Shift+Tab` 依次切换语言、时长、注音选项、输入区与重开按钮；`Enter` / 空格激活按钮；组字时候选操作交给输入法 |
| 界面 | 中英双语，跟随 DSH locale；只用 `--dsw-alias-*` 主题 token，亮/暗色自适应 |

达到所选时长时即截止，之后的文字确认和退格都不计入本轮成绩，即使浏览器尚未执行下一次计时回调。截止时仍在组字的内容不进入成绩；旧输入框迟到的组合事件不会写入重开后的新一轮。界面优先使用宿主翻译；缺少翻译时，按 `getLocale().active` 选择内置中英文文案。

页面打开时保留宿主焦点。切换语料语言或时长会开始新一轮，焦点留在该按钮；重开按钮将焦点送回输入区。输入区有可见焦点框，输入、退格、重新聚焦和视区尺寸变化时会滚动到当前字符，保留相邻行作为上下文。原生输入元素跟随当前字符定位，为系统候选窗提供锚点。持续输入和退格只滚动文本视区；聚焦或缩放时，如输入区已离开可见范围，页面会滚动以显示整个输入区。重开会回到文本开头。

英文练习文本由常用词和标点本地生成。中文与粤语分别有六段原创短文，按完整句子循环补足限时语料。粤语内容使用「返屋企」「落緊雨」「傾偈」等粤语表达，使用者可以自行选择拼音、粤拼、仓颉等输入法。当前严格比较原文，不自动转换简繁或中英文标点，也不删除输入法自动补全的成对标点。语料不联网获取。

拼音由 `pinyin-pro` 生成，粤拼采用与 jyut 项目相同的 `to-jyutping` 引擎，结合词语上下文选音。注音在汉字上方显示；「当前词」会随输入位置移动，并保留隐藏注音的位置，避免每输入一个字就改变换行。自动注音不改写原文，未知读音留空。切换提示档位会保留当前语料并开始新一轮，三个档位的最佳成绩分别保存。

两个词库随插件打包，按所选语言在本地加载并缓存，不调用远程注音服务。首次准备注音期间暂不接收输入、不启动计时；加载失败时可重试，或关闭提示继续练习。

速度按当前正确匹配的可见字符计算：英文每五个字符折合一词；中文与粤语每个可见字符计一字，包含标点及拉丁字符。组字和选词时间计入用时。准确率按累计确认输入计算；取消组字不计错误，修正已上屏错误不抹去累计错误。使用 `Intl.Segmenter` 划分可见字符，避免把非 BMP 汉字或组合字符拆成多个计分单位。提前打完会显示实际用时，不写入完整时长最佳。

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

安装后刷新 DSH Web 页面，左侧栏会出现「打字练习」。仓库包含已构建的注音文件，直接安装无需自行构建。注音分块加载已在 DSH `0.2.2-rc.1` 验证；不具备相同模块加载能力的宿主可关闭提示使用。安装是 profile 级的，该 profile 下所有会话可见；删除时用 `plugin_manager` 卸载即可。

## 数据

当前只写 `dsh.typing-practice.v2`，其值为以下结构的 JSON 字符串：

```js
{
  version: 2,
  best: {
    "en:30:builtin:plain:2": { speed: 76, accuracy: 0.94, at: 1793900000000 },
    "yue:30:builtin:plain:2": { speed: 102, accuracy: 0.98, at: 1793900000000 },
    "zh:30:builtin:current:2": { speed: 108, accuracy: 0.97, at: 1793900000000 },
    "yue:30:builtin:all:2": { speed: 96, accuracy: 0.99, at: 1793900000000 }
  }
}
```

键依次表示语言、秒数、内置语料、提示档位和评分规则版本。提示档位使用 `plain`（关闭）、`current`（当前词）、`all`（全部）；原有 v2 无注音记录继续使用 `plain`，不迁移到有提示的档位。`speed` 的单位由语言决定。旧 `dsh.typing-practice.v1` 原样保留；当前条件没有新版英文记录时，显示带「旧版最佳」标识的旧成绩，不将旧成绩混入新规则比较。删除 v2 只清空新记录，旧记录仍会保留。保存失败会显示提示，不中断练习。

不收集、不上传任何数据，也不读取聊天历史。

## 结构

```
dsh-typing-practice/
├── package.json        # bundle 清单 + dsh.client 声明（platform: web, inject: ["slots"]）
├── cordis.patch.yml    # 只插入一行 Host 插件
├── index.js            # Host 半：空 apply（无服务、无配置）
├── client.js           # Client 半：侧边栏入口 + 练习页（手写）
├── client.pinyin.js    # 生成文件：拼音引擎与对齐适配
├── client.jyutping.js  # 生成文件：粤拼引擎与对齐适配
├── src/               # 注音、可见字符对齐、词语范围与读音校正
├── scripts/build.mjs  # esbuild 打包为 DSH 异步模块
├── tests/             # 输入、计时、记录、注音与分块测试
├── icon.svg            # 插件图标（原创键帽）
├── locale/{zh,en}.json # 插件管理页的标题 / 描述
├── LICENSE
├── THIRD_PARTY_NOTICES.md
└── README.md
```

实现要点：

- 挂载点：`sidebar.panellist`（`id: typing-practice`，order 15）+ `main`（`key: typing-practice`）。
- 计时、文本生成、成绩统计全部在浏览器端；Host 半没有数据接口。
- `client.js` 通过 `window.__ModuleLoader__.load` 注册，React 来自页面运行时；不 import 任何 Harness Client 包。
- 注音代码构建成两个独立的 DSH chunk，通过 `require.async` 按需加载。构建后更新主入口时间戳，使宿主刷新词库版本。
- 页面文案注册到 Client locale 服务，切换语言自动刷新。

## 开发

- 改 `client.js` 后刷新页面即可；改 `index.js`（Host 半）需要重启 DSH。修改注音源码或依赖后，重新构建并一并提交生成文件与第三方声明。
- 静态检查：

```bash
node --check client.js
node --check index.js
python3 -m json.tool package.json > /dev/null
```

- 安装开发依赖、构建注音分块并运行回归测试（Node 内置测试运行器）：

```bash
npm ci
npm run build
npm test
```

`npm pack` 会在打包前重新构建。运行这些开发命令需要包含 `src/`、`scripts/` 和测试文件的仓库 checkout。

61 项测试覆盖：原有 47 项截止、组字、Unicode、编辑、记录和存储用例；新增多音字、粤语词界、原文对齐、12 段内置语料读音覆盖、真实构建分块执行、按需加载、加载失败重试、旧请求隔离，以及提示档位的记录区分。组件测试使用受控时钟和 React hooks 替身，不包含真实 DOM 或操作系统候选窗。

2026-11-06 已在真实 DSH `0.2.2-rc.1` 中确认三语界面、中文组字与选词上屏，以及两个注音分块实际加载。用户在输入层阶段同步确认候选窗位置正常。模拟宿主页另验了注音随词切换、当前词／全部排版一致、带注音长文本内部滚动、输入锚点、键盘导航和窄屏。详见 [IME 验证记录](docs/validation/2026-11-06-ime.md)与[注音验证记录](docs/validation/2026-11-06-annotations.md)。这些检查不代表所有输入法和设备均已验收。

## 已知限制

- 当前已交付输入层、三语示例语料和拼音／粤拼提示。语料导入与对话提取、历史记录页、音效和自定义外观尚未实现，后续见 [多语言规划](docs/plans/2026-11-06-multilingual-practice-plan.md)。
- 自动注音和分词仍可能有误。内置粤语已为「慢慢行」「返到屋企」增加上下文读音校正；暂未提供用户选音、人工覆盖或读音教学功能。
- 内置语料规模较小，限时练习会循环使用；还需要扩充和人工审校。
- Windows、其他输入法，以及组字中跨行、缩放、截止等组合操作仍需真实环境回归。自动测试通过不代表所有输入法均已验证。
- 切换侧边栏面板会卸载页面，进行中的测试重置；已保存的最佳成绩不受影响。
- 成绩只存在本机浏览器，不跨设备同步。

## License

[MIT](LICENSE)。随包注音依赖的版本、来源和许可见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

---

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
