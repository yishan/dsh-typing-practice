<p align="center">
  <img src="icon.svg" width="72" height="72" alt="Typing practice icon">
</p>

# dsh-typing-practice

A typing practice page for the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web UI: English, Chinese and Cantonese text, recent local conversation passages, native IME input, Pinyin and Jyutping hints, live speed and accuracy, local best scores, practice history and optional mechanical keyboard sounds.

给 DeepSeek Harness Web GUI 加的「打字练习」插件：英文、中文和粤语文本练习，可选默认语料或近期本地对话，使用自己的输入法上屏，可查看拼音或粤拼提示，实时统计速度与准确率，提供机械键盘音效选择，最佳成绩和练习历史存在本机浏览器。

> 非官方项目，只是一个 DSH 插件 bundle（`dsh.bundle.patch` + `dsh.client`）。

## 功能

| 项 | 说明 |
|---|---|
| 入口 | 左侧栏「打字练习」（键盘图标）→ 主区域练习页 |
| 语料 | 英文生成句子、简体中文短文、繁体粤语短文；与界面语言独立 |
| 本地对话 | 按当前语言，从当前 DSH profile 近 30 天的用户消息和已完成模型回复中选取片段；无结果时回退到默认语料 |
| 来源切换 | 「默认语料／本地对话语料」位于「换一段」旁；记住选项，重新打开页面时恢复；回退不改变选项 |
| 注音 | 中文带声调拼音、粤语数字声调粤拼；默认「当前词」，可选「全部」或「关闭」 |
| 模式 | 默认语料为 15 / 30 / 60 秒限时；本地对话为「完成一段」，不计入限时最佳 |
| 实时反馈 | 英文四行、中文和粤语三行视区；逐字符高亮，组字预览，计时条与剩余时间 |
| 成绩 | 英文用 WPM，中文和粤语用字/分钟（CPM）；另显示准确率、正确字符和错误数 |
| 最佳成绩 | 限时最佳按语言、时长、提示档位和规则版本分别保存；结束后与本轮之前的最佳比较 |
| 练习历史 | 「记录」中查看最近 100 次练习和限时最佳，支持语言筛选、同篇记录及确认清空；统一保存到 `localStorage['dsh.typing-practice.v3']` |
| 键盘音效 | 默认关闭；可选 Cherry MX Blue、Cherry MX Brown、NovelKeys Cream、Holy Panda，提供音量和试听，记住选择 |
| 操作 | 首次有效组字或直接文字输入开始计时；上屏后判分；原生退格、选区替换；始终可见的重开按钮 |
| 键盘导航 | `Tab` / `Shift+Tab` 依次切换记录、音效、来源、换一段、语言、时长、注音选项、输入区与重开按钮；`Enter` / 空格激活按钮；记录与音效窗口可用 `Esc` 关闭并恢复焦点；组字时候选操作交给输入法 |
| 界面 | 中英双语，跟随 DSH locale；只用 `--dsw-alias-*` 主题 token，亮/暗色自适应 |

达到所选时长时即截止，之后的文字确认和退格都不计入本轮成绩，即使浏览器尚未执行下一次计时回调。截止时仍在组字的内容不进入成绩；旧输入框迟到的组合事件不会写入重开后的新一轮。界面优先使用宿主翻译；缺少翻译时，按 `getLocale().active` 选择内置中英文文案。

页面打开时保留宿主焦点。切换语料语言或时长会开始新一轮，焦点留在该按钮；重开按钮将焦点送回输入区。输入区有可见焦点框，输入、退格、重新聚焦和视区尺寸变化时会滚动到当前字符，保留相邻行作为上下文。原生输入元素跟随当前字符定位，为系统候选窗提供锚点。持续输入和退格只滚动文本视区；聚焦或缩放时，如输入区已离开可见范围，页面会滚动以显示整个输入区。重开会回到文本开头。

选文加载与回退提示使用语料栏中的固定位置。输入区未聚焦时，卡片底部显示「点击或用 Tab 聚焦后输入」；聚焦后在同一位置显示计时规则，不覆盖正文。注音下拉框保留原生键盘操作，并单独为文字和箭头留出间距。布局测量见 [UI 微调验证记录](docs/validation/2026-11-06-ui-polish.md)。

英文练习文本由常用词和标点本地生成。中文与粤语分别有六段原创短文，按完整句子循环补足限时语料。粤语内容使用「返屋企」「落緊雨」「傾偈」等粤语表达，使用者可以自行选择拼音、粤拼、仓颉等输入法。当前严格比较原文，不自动转换简繁或中英文标点，也不删除输入法自动补全的成对标点。语料不联网获取。

拼音由 `pinyin-pro` 生成，粤拼采用与 jyut 项目相同的 `to-jyutping` 引擎，结合词语上下文选音。注音在汉字上方显示；「当前词」会随输入位置移动，并保留隐藏注音的位置，避免每输入一个字就改变换行。自动注音不改写原文，未知读音留空。切换提示档位会保留当前语料并开始新一轮，三个档位的最佳成绩分别保存。

两个词库随插件打包，按所选语言在本地加载并缓存，不调用远程注音服务。首次准备注音期间暂不接收输入、不启动计时；加载失败时可重试，或关闭提示继续练习。

### 本地对话语料

在「换一段」旁选择「本地对话语料」，插件立即按当前英文／中文／粤语模式选取文本。之后点击「换一段」可重新选取。切换语言、重新打开练习页时，也会按保存的来源选取；首次使用默认为「默认语料」，不读取聊天正文。选择默认语料会取消正在进行的读取。

本地对话只使用近 30 天的用户正文和已完成的模型回复，不区分两种来源。英文片段为 40–100 词，中文和粤语为 80–200 个可见字符，按完整句子选取。保留原文字形，不把普通话改写成粤语。没有合适内容、读取失败或超时时，自动使用默认语料，并保留「本地对话语料」选项，下次「换一段」仍尝试本地对话。读取中可点击「取消选取」。

提取会跳过推理、工具调用及结果、系统上下文、代码、表格、附件和明显的密钥等片段；清理 Markdown 后只显示普通文本，不执行内容。各消息分别提取，不拼接不同消息。完成片段后显示实际用时和成绩，重开保留同一片段；片段正文不持久化，也不进入限时最佳记录。

速度按当前正确匹配的可见字符计算：英文每五个字符折合一词；中文与粤语每个可见字符计一字，包含标点及拉丁字符。组字和选词时间计入用时。准确率按累计确认输入计算；取消组字不计错误，修正已上屏错误不抹去累计错误。使用 `Intl.Segmenter` 划分可见字符，避免把非 BMP 汉字或组合字符拆成多个计分单位。提前打完会显示实际用时，不写入完整时长最佳。

### 键盘音效

点击右上角「音效」，选择声音并点击「试听」，用音量滑块调整大小。默认关闭，初始音量 30%；音色和音量随选择保存。练习进行中暂时禁用设置入口，结束或重新开始后可调整。窗口沿用页面的主题、原生下拉框与焦点样式。

首批四套声音来自 [kbsim](https://github.com/tplai/kbsim) 的 MIT 许可录音。每套含五个普通键变体，茶轴、奶油轴和 Holy Panda 另有空格、退格和回车录音；青轴的特殊键使用普通键录音。这些是具体键盘配置的录音，不代表所有同名轴体的声音。29 个原始 MP3 共 67,240 字节，保留原文件及校验值，构建后随本地 `client.audio.js` 分块按需加载。来源、版本和许可见 [素材说明](assets/audio/kbsim/README.md)与[第三方声明](THIRD_PARTY_NOTICES.md)。

仅练习输入区聚焦且可输入时响应按键。忽略长按自动重复、导航键和带 Ctrl／Command／Alt 的快捷键；组字期间按浏览器实际收到的按键播放，上屏一整词不会按汉字数量重复响。普通回车不播放，组字回车可使用回车录音。声音与计时、判分独立，不另加错误提示音或抬键声。失焦、切到后台、重开或结束会停止播放。

音频在用户选择、试听或聚焦输入区后初始化，不在页面加载时自动播放。首次加载期间的按键不会排队补播；播放失败不影响练习，可在音效窗口中点击「试听」重试。同类应用参考和本轮验证范围见[音效验证记录](docs/validation/2026-11-06-keyboard-sounds.md)。

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

安装后刷新 DSH Web 页面，左侧栏会出现「打字练习」。仓库包含已构建的注音与音效文件，直接安装无需自行构建；包管理器会安装 Host 所需依赖。注音分块和本地对话接口已在 DSH `0.2.2-rc.1` 验证；缺少对话查询服务时回退到默认语料，不具备相同模块加载能力的宿主可关闭提示使用。已有本地安装更新 Host 代码后，可在插件管理页关闭再开启「打字练习」。安装是 profile 级的，该 profile 下所有会话可见；删除时用 `plugin_manager` 卸载即可。

## 数据

最佳成绩和练习历史统一写入 `dsh.typing-practice.v3`，其值为以下结构的 JSON 字符串：

```js
{
  version: 3,
  best: {
    "en:30:builtin:plain:2": { speed: 76, accuracy: 0.94, at: 1793900000000 },
    "yue:30:builtin:plain:2": { speed: 102, accuracy: 0.98, at: 1793900000000 },
    "zh:30:builtin:current:2": { speed: 108, accuracy: 0.97, at: 1793900000000 },
    "yue:30:builtin:all:2": { speed: 96, accuracy: 0.99, at: 1793900000000 }
  },
  legacy: {}, // 旧版 v1 最佳单独保留，不参与新版比较
  history: [{
    id: "generated-run-id", language: "en", hints: "off", rules: 2,
    mode: "timed", source: "builtin", duration: 30, status: "completed",
    at: 1793900000000, elapsedMs: 30000, speed: 76, accuracy: 0.95,
    correct: 190, wrongKeys: 10, keystrokes: 200, targetLength: 1200,
    fingerprint: null
  }]
}
```

最佳成绩的键依次表示语言、秒数、内置语料、提示档位和评分规则版本。键中的提示档位使用 `plain`（关闭）、`current`（当前词）、`all`（全部）；历史条目的 `hints` 使用 `off`、`current`、`all`。`speed` 的单位由语言决定。比较时先看速度，速度相同时比较显示到整数百分比的准确率。

每轮结束只追加一次历史，按完成顺序保留最近 100 次。限时提前打完的条目标为 `early`，保存实际用时，但不更新限时最佳。中途重开、更换语料或离开页面不生成历史。本地片段条目使用 `mode: "passage"`、`source: "local"`、`duration: null` 和 SHA-256 文本指纹；仅与最近 100 次中相同原文、语言、提示档位和规则的成绩比较，不混比不同片段。限时最佳独立保留，不受 100 条历史上限影响。

首次读取时兼容 v2 最佳与 v1 旧版最佳，不补造过去的练习历史。下一次保存将有效旧成绩一并写入 v3，原始 v1／v2 数据不改写。旧版最佳单独显示，不参与新版比较。通过「记录 → 清空全部记录 → 确认清空」可一次清空历史及新旧最佳，保留语料来源选项；空的 v3 仍为有效数据，刷新不会重新导入旧成绩。手动删除 v3 会重新触发旧数据导入，因此请使用界面的清空入口。保存失败会提示，本页仍可查看尚未保存的成绩；清空失败则保留原记录。

语料来源单独保存在 `dsh.typing-practice.preferences.v1`：`{"version":1,"source":"local"}` 或 `{"version":1,"source":"builtin"}`。该设置与成绩分开；无效设置回退到默认语料。保存失败会提示，下次打开时可能需要重新选择。

音效单独保存在 `dsh.typing-practice.sound.v1`，例如 `{"version":1,"pack":"cream","volume":30}`；`pack` 可为 `off`、`mxblue`、`mxbrown`、`cream`、`holypanda`。清空练习记录不会清空音效选项。无效音色回退为关闭，无效音量回退为 30%。

本地对话模式通过当前 DSH Host 读取当前 profile 的聊天历史，不向外部服务上传正文，不调用远程模型或翻译服务。选中的片段只留在本次页面内存中；浏览器存储仅保留来源选项、成绩统计与片段指纹，不保存对话正文、标题、会话 ID 或消息位置。没有收藏、正文缓存或跨设备同步。

## 结构

```
dsh-typing-practice/
├── package.json        # bundle 清单 + dsh.client 声明（platform: web, inject: ["slots"]）
├── cordis.patch.yml    # 只插入一行 Host 插件
├── index.js            # Host 半：注册受宿主鉴权保护的近期语料接口
├── client.js           # Client 半：侧边栏入口 + 练习页（手写）
├── client.pinyin.js    # 生成文件：拼音引擎与对齐适配
├── client.jyutping.js  # 生成文件：粤拼引擎与对齐适配
├── client.audio.js     # 生成文件：音频播放器与四套按键录音
├── assets/audio/kbsim/ # 原始录音、许可与固定版本的文件校验清单
├── src/               # 注音、字符对齐、语料提取与接口、audio-player.js 音频播放器
├── scripts/build.mjs  # esbuild 打包为 DSH 异步模块
├── tests/             # 输入、计时、记录、注音、语料、音效及偏好记忆测试
├── icon.svg            # 插件图标（原创键帽）
├── locale/{zh,en}.json # 插件管理页的标题 / 描述
├── LICENSE
├── THIRD_PARTY_NOTICES.md
└── README.md
```

实现要点：

- 挂载点：`sidebar.panellist`（`id: typing-practice`，order 15）+ `main`（`key: typing-practice`）。
- 计时、默认文本生成、成绩统计在浏览器端；Host 的 `GET /api/typing-practice/recent?language=en|zh|yue` 返回一个片段或回退原因。
- Host 使用当前 profile 的 `sessionQuery.listSessions` 和可取消的 `observeSession`；每次观察结束均释放。桌面 Client 优先使用宿主 `__DSH_TRANSPORT__.fetch`，Web 使用相对路径请求。
- `mdast-util-from-markdown` 在 Host 解析 Markdown。先过滤事件时间、来源和内容类型，再按句子边界选文；保留来源位置与指纹，接口不返回完整聊天日志。
- `client.js` 通过 `window.__ModuleLoader__.load` 注册，React 来自页面运行时；不 import 任何 Harness Client 包。
- 注音代码构建成两个独立的 DSH chunk，通过 `require.async` 按需加载。构建后更新主入口时间戳，使宿主刷新词库版本。
- 音效是独立的 DSH chunk，内嵌短录音；Web Audio 解码后缓存，最多叠加八个声音。音色切换、迟到加载与卸载均取消旧播放。
- 页面文案注册到 Client locale 服务，切换语言自动刷新。

## 开发

- 改 `client.js` 后刷新页面即可；改 Host 入口或语料模块后，在插件管理页关闭再开启本插件，或重启 DSH。修改注音、音频源码、录音素材或依赖后，重新构建并一并提交生成文件与第三方声明。
- 静态检查：

```bash
node --check client.js
node --check index.js
python3 -m json.tool package.json > /dev/null
```

- 安装开发依赖、构建注音和音效分块并运行回归测试（Node 内置测试运行器）：

```bash
npm ci
npm run build
npm test
```

`npm pack` 会在打包前重新构建。运行这些开发命令需要包含 `src/`、`scripts/`、`assets/` 和测试文件的仓库 checkout。

104 项测试覆盖截止、组字、Unicode、编辑、记录、存储、注音和分块，以及对话角色／内容过滤、30 天时间边界、Markdown 清理、完整句子长度、粤语原文识别、去重、读取预算、取消、有限段落完成、桌面请求通道、来源选择记忆和回退。记录测试覆盖去重、100 条上限、同篇隔离、旧记录迁移、清空失败与重试、正文排除和存储损坏恢复。音效测试覆盖录音完整性、按键映射、组字批量输入、播放取消、异步切换、音量、偏好记忆与加载失败恢复。组件测试使用受控时钟和 React hooks 替身，不包含真实 DOM、真实音频设备或操作系统候选窗。

2026-11-06 已在真实 DSH `0.2.2-rc.1` 中确认三语界面、中文组字与选词上屏，以及两个注音分块实际加载。用户在输入层阶段同步确认候选窗位置正常。模拟宿主页另验了注音随词切换、当前词／全部排版一致、带注音长文本内部滚动、输入锚点、键盘导航和窄屏。详见 [IME 验证记录](docs/validation/2026-11-06-ime.md)与[注音验证记录](docs/validation/2026-11-06-annotations.md)。这些检查不代表所有输入法和设备均已验收。

本地对话已在真实 DSH 选出近期中文片段并进入带拼音练习。三语片段完成、来源切换与记忆、自动回退和 360px 布局的检查见[本地语料验证记录](docs/validation/2026-11-06-local-corpus.md)。

记录窗口、刷新恢复、同篇比较、清空确认和窄屏的验证范围见[记录验证文档](docs/validation/2026-11-06-records.md)。

音效另在浏览器模拟宿主页验证了全部录音解码、四种音色的非零音频信号、逐键播放计数、选项恢复和中英窄屏布局。本轮未完成原生 DSH 的实际听音及真实 IME 期间的音效验收，详见[音效验证记录](docs/validation/2026-11-06-keyboard-sounds.md)。

## 已知限制

- 当前已交付输入层、三语示例语料、拼音／粤拼提示、近期本地对话选文、最佳记录、练习历史和键盘音效。手动导入、收藏和自定义外观尚未实现，后续见 [多语言规划](docs/plans/2026-11-06-multilingual-practice-plan.md)。
- 每次最多检查 30 个会话，Host 使用 8 秒协作取消预算，Client 最长等待 12 秒；下次从后续会话继续。无结果表示本次预算内未找到，不保证遍历全部历史。宿主读取超大会话仍可能加载整份日志，预算不是严格的磁盘字节上限。
- 粤语识别使用用词特征初筛，可能漏选或误选；不保证所有片段的语言与自然度。不同宿主版本的历史格式可能需要适配，失败时回退默认语料。来源仅限当前 DSH profile，不读取其他应用历史。
- 自动注音和分词仍可能有误。内置粤语已为「慢慢行」「返到屋企」增加上下文读音校正；暂未提供用户选音、人工覆盖或读音教学功能。
- 内置语料规模较小，限时练习会循环使用；还需要扩充和人工审校。
- Windows、其他输入法，以及组字中跨行、缩放、截止等组合操作仍需真实环境回归。自动测试通过不代表所有输入法均已验证。
- 切换侧边栏面板会卸载页面，进行中的练习重置；已保存的最佳成绩和历史不受影响。练习进行中暂时禁用记录入口，结束或重开后可查看。
- 成绩只存在本机浏览器，不跨设备同步。

## License

[MIT](LICENSE)。随包注音依赖和键盘录音的版本、来源和许可见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

---

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
