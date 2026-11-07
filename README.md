<p align="center">
  <img src="icon.svg" width="72" height="72" alt="Typing practice icon">
</p>

# dsh-typing-practice

A typing practice page for the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web UI: English, Chinese and Cantonese text, recent local conversation passages, native IME input, Pinyin and Jyutping hints, live speed and accuracy, local best scores, practice history and optional mechanical keyboard sounds.

给 DeepSeek Harness Web GUI 加的「打字练习」插件：英文、中文和粤语文本练习，可选默认语料或近期本地对话，使用自己的输入法上屏，可查看拼音或粤拼提示，实时统计速度与准确率，提供机械键盘音效选择，最佳成绩和练习历史存在本机浏览器。

> 非官方 DeepSeek Harness 插件。

## 功能

| 功能 | 说明 |
|---|---|
| 语言 | 英文、简体中文、繁体粤语，与界面语言独立 |
| 语料 | 每种语言 96 篇原创短文，也可使用近 30 天的本地对话 |
| 练习方式 | 15／30／60 秒限时练习，或短篇／中篇／长篇完整文本练习 |
| 输入 | 使用自己的输入法；中文和粤语可显示拼音／粤拼提示 |
| 实时反馈 | 沉浸式正文，当前输入行保持固定高度，前后文字逐渐淡出 |
| 统计 | 正文上方显示速度、准确率、错误和时间；英文用 WPM，中文与粤语用字/分钟（CPM） |
| 记录 | 保存本机最佳成绩和最近 100 次练习，可按语言筛选、查看同篇记录或清空 |
| 设置 | 光标、注音和键盘音效集中设置，选项保存在本机浏览器 |
| 界面 | 中英双语，跟随 DSH 界面语言及亮／暗主题 |

## 语料与练习方式

默认语料共 **288 篇，三种语言各 96 篇，短／中／长各 32 篇**，覆盖八类主题。每种语言包含 32 个场景，每个场景提供三个篇幅的完整版本：中篇补充事件发展，长篇进一步展开细节和后续。三档均可独立练习。中文为简体，粤语为繁体口语文本。

| 篇幅 | 英文词数范围 | 中文／粤语可见字符范围 | 每语种数量 |
|---|---:|---:|---:|
| 短篇 | 40–79 | 80–159 | 32 |
| 中篇 | 80–139 | 160–279 | 32 |
| 长篇 | 140–220 | 280–440 | 32 |

在页面下方选择语言和练习方式：`英文／中文／粤语 | 15 秒／30 秒／60 秒 | 短篇／中篇／长篇`。语言和练习方式各自单选。

首次默认 30 秒，之后记住最后选择。限时练习在倒计时结束时结算；短篇／中篇／长篇各选择一篇完整文本，显示用时，打完结束。

切换来源保留当前练习选项；切换练习方式或语言会重新选文。「重新开始」保留当前文本，「换一段」重新选文。

默认短文均为本项目原创，随插件提供，按项目 MIT 许可分发。选文完全离线，不访问远程语料库，也不调用用户模型额度。

默认语料和本地对话统一使用常用标点：英文使用 `"` 和 `'`，中文与粤语使用 `“”`。文本会清理装饰符号和多余空白，全角英文字母及数字转为半角；含不适合练习符号的本地句子会被跳过。

练习输入仍严格匹配清理后的目标文本；不自动转换用户输入的简繁字或标点，也不删除输入法自动补全的成对标点。

中文与粤语可在「设置 → 注音」中选择「当前词」「全部」或「关闭」。两种语言共用这个选项，切换后自动应用；更改注音会保留当前文本并重新开始。

拼音与粤拼词库随插件提供，在本地加载，不调用远程注音服务。加载失败时可重试，或关闭注音继续练习。

### 本地对话语料

在页面下方选择「本地对话语料」，插件会按当前英文／中文／粤语模式选取文本，点击「换一段」可重新选取。插件会记住来源选项；首次使用默认为「默认语料」。没有合适的本地内容时，自动切回默认语料。

本地对话只使用当前 DSH profile 近 30 天的用户正文和已完成的模型回复，不区分两种角色。短篇／中篇／长篇按上表档位选取完整片段；限时模式会在开始前准备好所需文本。

## 键盘音效

打开右上角「设置」的「音效」分组，可选 Cherry MX Blue、Cherry MX Brown、NovelKeys Cream 和 Holy Panda。点击「试听」预览，用音量滑块调整大小。音效默认关闭，初始音量 30%；音色和音量会自动保存。练习进行中暂时禁用设置入口，结束或重新开始后可调整。

四套声音来自 [kbsim](https://github.com/tplai/kbsim) 的 MIT 许可录音，随插件提供。这些录音来自具体键盘配置，不代表所有同名轴体的声音。来源和许可见[第三方声明](THIRD_PARTY_NOTICES.md)。

## 常用操作

- 点击正文或用 `Tab` 聚焦后输入，使用自己的输入法完成中文或粤语上屏。
- 「重新开始」或 `Esc`：重练当前文本。
- 「换一段」：macOS 使用 `⌘ R`，Windows／Linux 使用 `Ctrl+R`。悬停按钮可查看快捷键。
- 「记录」：查看最佳成绩和练习历史。练习结束或重新开始后可打开。
- 弹窗内按 `Esc` 关闭；使用 `Tab` / `Shift+Tab` 在控件间移动。

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

安装后刷新 DSH Web 页面，左侧栏会出现「打字练习」。仓库包含已构建的注音与音效文件，无需自行构建。插件安装在所选 DSH profile 下，该 profile 的所有会话均可使用。

更新后，可在插件管理页关闭再开启「打字练习」，然后刷新页面。卸载时使用 `plugin_manager`。

## License

[MIT](LICENSE)。随包注音依赖和键盘录音的版本、来源和许可见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

---

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
