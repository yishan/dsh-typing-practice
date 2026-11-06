// Typing practice client half: sidebar entry, timed practice and local passages.
//
// Loaded as a classic-script plugin through window.__ModuleLoader__; the only
// external module it imports is the platform React runtime. Pronunciation
// engines and keyboard recordings arrive as package-local DSH chunks. The Host can select local conversation
// text; timing uses performance.now(). Records and preferences are
// kept locally, separated from ephemeral conversation text.

window.__ModuleLoader__.load({
  id: 'typing-practice',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const NS = 'typing-practice';
    const LEGACY_STORE_KEY = 'dsh.typing-practice.v1';
    const STORE_KEY = 'dsh.typing-practice.v2';
    const RECORDS_KEY = 'dsh.typing-practice.v3';
    const HISTORY_LIMIT = 100;
    const PREFERENCES_KEY = 'dsh.typing-practice.preferences.v1';
    const EXERCISE_KEY = 'dsh.typing-practice.exercise.v2';
    const LEGACY_EXERCISE_KEY = 'dsh.typing-practice.exercise.v1';
    const SOUND_KEY = 'dsh.typing-practice.sound.v1';
    const SOUND_PACKS = ['off', 'mxblue', 'mxbrown', 'cream', 'holypanda'];
    const CURSOR_KEY = 'dsh.typing-practice.cursor.v1';
    const CURSOR_SHAPES = ['line', 'underline', 'outline'];
    const LANGUAGES = ['en', 'zh', 'yue'];
    const HINT_MODES = ['off', 'current', 'all'];
    const HINT_KEY = 'dsh.typing-practice.annotations.v1';
    const RULES_VERSION = 2;
    const DURATIONS = [15, 30, 60];
    const DEFAULT_DURATION = 30;
    const TEXT_CHARS = 1200;

    // ---------- copy ----------

    const zh = {
      panelLabel: '打字练习',
      panelTitle: '打字练习',
      panelSubtitle: '实时统计速度与准确率',
      bestValue: '最佳 {speed} {unit} · {acc}%',
      legacyBestValue: '旧版最佳 {speed} WPM · {acc}%',
      bestNone: '暂无最佳记录',
      languageLabel: '语料语言',
      language_en: '英文',
      language_zh: '中文',
      language_yue: '粤语',
      statsCpm: '字/分钟',
      cpmTip: '按正确上屏的可见字符计速，含标点；组字和选词时间计入用时。',
      storageError: '本次成绩未能保存到浏览器。',
      hint_zh: '拼音',
      hint_yue: '粤拼',
      hint_off: '关闭',
      hint_current: '当前词',
      hint_all: '全部',
      hintChange: '更改提示会开始新一轮',
      hintLoading: '正在准备注音…',
      hintError: '注音暂时不可用，可重试或关闭提示继续练习。',
      hintRetry: '重试注音',
      exerciseLabel: '练习方式',
      length_short: '短篇', length_medium: '中篇', length_long: '长篇',
      exerciseSaveError: '练习选项未能保存，下次打开时可能需要重新选择。',
      durationLabel: '练习时长',
      durationOption: '{n} 秒',
      statsWpm: 'WPM',
      statsAccuracy: '准确率',
      statsErrors: '错误',
      statsRemaining: '剩余',
      unitSeconds: '秒',
      unitPercent: '%',
      timebarLabel: '本轮进度',
      focusHint: '点击或用 Tab 聚焦后输入',
      inputLabel: '打字练习输入区',
      resultTitle: '本轮成绩',
      resultEarly: '提前完成 · {seconds} 秒（不计入限时最佳）',
      resultAccuracy: '准确率',
      resultCorrect: '正确字符',
      resultErrors: '错误',
      newRecordBadge: '新纪录',
      restart: '再来一次',
      restartRun: '重新开始',
      restartHint: '开始打字即计时',
      restartHintIme: '开始组字即计时，上屏后判分',
      inputPlaceholder: '',
      corpusNext: '换一段', corpusCancel: '取消选取', corpusBuiltin: '默认语料',
      corpusSource: '语料来源', corpusLocal: '本地对话语料',
      corpusPreferenceError: '语料来源已切换，但未能保存，下次打开时需要重新选择。',
      corpusRecent: '近 30 天对话', corpusLoading: '正在选取近 30 天的语料…',
      corpusEmpty: '本次未找到合适的近期语料，已使用默认语料。',
      corpusUnavailable: '本地对话暂不可用，已使用默认语料。',
      corpusPassage: '完成一段', corpusElapsed: '用时', corpusCompleted: '已完成 · {seconds} 秒',
      corpusCount: '{n} 字符', corpusFooter: '仅保存练习统计与片段指纹，不保存对话正文。',
      records: '记录', recordsTitle: '练习记录', recordsClose: '关闭记录',
      recordsRunning: '完成或重新开始后可查看记录', recordsRecent: '最近练习', recordsBest: '限时最佳',
      recordsAll: '全部语言', recordsLanguage: '记录语言', recordsEmpty: '完成一轮练习后，成绩会出现在这里。',
      recordsBestEmpty: '还没有符合条件的限时最佳。', recordsLimit: '保留最近 100 次练习；同篇比较仅使用这些记录。',
      recordsOldCorpus: '旧语料', recordsLegacy: '旧版最佳', recordsHints: '提示：{mode}', recordsTimed: '{n} 秒限时',
      recordsCompleted: '已完成', recordsEarly: '提前完成', recordsDetails: '用时 {seconds} 秒 · 正确 {correct} · 错误 {errors}',
      recordsSame: '同篇记录', recordsSameTitle: '此片段的练习', recordsShowAll: '查看全部',
      recordsClear: '清空全部记录', recordsClearTitle: '清空练习记录？',
      recordsClearBody: '将清空练习历史和新旧最佳成绩，无法撤销。语料来源选项会保留。',
      recordsClearConfirm: '确认清空', recordsCancel: '取消', recordsClearError: '未能清空记录，请重试。现有记录仍保留。',
      compareFirst: '首次完成此条件的限时练习', compareFirstPassage: '近期还没有同篇、同提示档位的完成记录',
      compareTimed: '此前最佳 {speed} {unit} · {acc}% · 本次 {delta} {unit}',
      comparePassage: '近期同篇最佳 {speed} {unit} · {acc}% · 本次 {delta} {unit}',
      newPassageRecord: '同篇新纪录',
      settings: '设置', settingsClose: '关闭设置', settingsRunning: '完成或重新开始后可调整设置',
      settingsLocalTextNote: '本地语料只读取当前 DSH 的本地对话，用于本次打字练习。对话正文不会上传到网络，也不会额外保存或用于其他用途，你可以放心练习。',
      annotations: '注音', hintDisplay: '拼音／粤拼', hintSaveError: '注音选项未能保存，下次打开时需要重新选择。', liveStats: '实时输入统计',
      sound: '音效', soundTitle: '键盘音效', soundClose: '关闭音效设置', soundPack: '声音', soundVolume: '音量', soundPreview: '试听',
      sound_off: '关闭', sound_mxblue: 'Cherry MX Blue · 青轴', sound_mxbrown: 'Cherry MX Brown · 茶轴',
      sound_cream: 'NovelKeys Cream · 奶油轴', sound_holypanda: 'Holy Panda · 圣熊猫',
      soundRunning: '完成或重新开始后可设置音效', soundLoading: '正在准备音效…',
      soundError: '音效暂不可用，可点击试听重试。练习不受影响。', soundSaveError: '音效选项未能保存，下次打开可能需要重新选择。',
      soundCredit: '录音：kbsim / Thomas Lai · MIT',
      cursor: '光标', cursorTitle: '光标样式', cursorClose: '关闭光标设置', cursorShape: '形状',
      cursor_line: '竖线', cursor_underline: '下划线', cursor_outline: '方框',
      cursorGlow: '光晕', cursorBlink: '闪烁', cursorPreview: '光标预览',
      cursorRunning: '完成或重新开始后可设置光标', cursorSaveError: '光标选项未能保存，下次打开可能需要重新选择。',
    };

    const en = {
      panelLabel: 'Typing practice',
      panelTitle: 'Typing practice',
      panelSubtitle: 'Live speed and accuracy',
      bestValue: 'Best {speed} {unit} · {acc}%',
      legacyBestValue: 'Legacy best {speed} WPM · {acc}%',
      bestNone: 'No best score yet',
      languageLabel: 'Text language',
      language_en: 'English',
      language_zh: '中文',
      language_yue: '粵語',
      statsCpm: 'CPM',
      cpmTip: 'Correct committed characters per minute, including punctuation. Composition and candidate selection count toward time.',
      storageError: 'This score could not be saved in the browser.',
      hint_zh: 'Pinyin',
      hint_yue: 'Jyutping',
      hint_off: 'Off',
      hint_current: 'Current word',
      hint_all: 'All',
      hintChange: 'Changing hints starts a new run',
      hintLoading: 'Preparing pronunciation…',
      hintError: 'Pronunciation is unavailable. Retry or turn hints off to continue.',
      hintRetry: 'Retry pronunciation',
      exerciseLabel: 'Practice',
      length_short: 'Short', length_medium: 'Medium', length_long: 'Long',
      exerciseSaveError: 'Practice options could not be saved. Select them again next time.',
      durationLabel: 'Test duration',
      durationOption: '{n}s',
      statsWpm: 'WPM',
      statsAccuracy: 'Accuracy',
      statsErrors: 'Errors',
      statsRemaining: 'Left',
      unitSeconds: 's',
      unitPercent: '%',
      timebarLabel: 'Test progress',
      focusHint: 'Click or Tab here to type',
      inputLabel: 'Typing practice input',
      resultTitle: 'Result',
      resultEarly: 'Completed early · {seconds}s (excluded from timed best)',
      resultAccuracy: 'Accuracy',
      resultCorrect: 'Correct chars',
      resultErrors: 'Errors',
      newRecordBadge: 'New record',
      restart: 'Try again',
      restartRun: 'Restart',
      restartHint: 'Timing starts on the first key',
      restartHintIme: 'Time starts with composition; committed text is scored',
      inputPlaceholder: '',
      corpusNext: 'New passage', corpusCancel: 'Cancel selection', corpusBuiltin: 'Built-in text',
      corpusSource: 'Text source', corpusLocal: 'Local conversations',
      corpusPreferenceError: 'Text source changed but could not be saved. Select it again next time.',
      corpusRecent: 'Conversations · past 30 days', corpusLoading: 'Choosing text from the past 30 days…',
      corpusEmpty: 'No suitable recent text found. Using built-in text.',
      corpusUnavailable: 'Local history is unavailable. Using built-in text.',
      corpusPassage: 'Complete a passage', corpusElapsed: 'Elapsed', corpusCompleted: 'Completed · {seconds}s',
      corpusCount: '{n} characters', corpusFooter: 'Only statistics and a passage fingerprint are saved, never conversation text.',
      records: 'Records', recordsTitle: 'Practice records', recordsClose: 'Close records',
      recordsRunning: 'Finish or restart this run to view records', recordsRecent: 'Recent practice', recordsBest: 'Timed bests',
      recordsAll: 'All languages', recordsLanguage: 'Record language', recordsEmpty: 'Complete a practice run to see your results here.',
      recordsBestEmpty: 'No matching timed bests yet.', recordsLimit: 'Keeps the latest 100 runs. Same-passage comparisons use only these records.',
      recordsOldCorpus: 'Previous corpus', recordsLegacy: 'Legacy bests', recordsHints: 'Hints: {mode}', recordsTimed: '{n}s timed',
      recordsCompleted: 'Completed', recordsEarly: 'Completed early', recordsDetails: '{seconds}s elapsed · {correct} correct · {errors} errors',
      recordsSame: 'Same passage', recordsSameTitle: 'Practice on this passage', recordsShowAll: 'Show all',
      recordsClear: 'Clear all records', recordsClearTitle: 'Clear practice records?',
      recordsClearBody: 'This permanently clears practice history and current and legacy bests. Your text source preference is kept.',
      recordsClearConfirm: 'Confirm clear', recordsCancel: 'Cancel', recordsClearError: 'Could not clear records. Your existing records are kept. Try again.',
      compareFirst: 'First completed timed run with these settings', compareFirstPassage: 'No recent completed run with this passage and hint setting',
      compareTimed: 'Previous best {speed} {unit} · {acc}% · This run {delta} {unit}',
      comparePassage: 'Recent same-passage best {speed} {unit} · {acc}% · This run {delta} {unit}',
      newPassageRecord: 'New passage best',
      settings: 'Settings', settingsClose: 'Close settings', settingsRunning: 'Finish or restart this run to change settings',
      settingsLocalTextNote: 'Local text comes from conversations in your current DSH and is used only for this practice session. Your conversation text is never uploaded, saved as an extra copy, or used for anything else, so you can practice with peace of mind.',
      annotations: 'Pronunciation', hintDisplay: 'Pinyin / Jyutping', hintSaveError: 'Pronunciation settings could not be saved. Select them again next time.', liveStats: 'Live typing statistics',
      sound: 'Sound', soundTitle: 'Keyboard sounds', soundClose: 'Close sound settings', soundPack: 'Sound', soundVolume: 'Volume', soundPreview: 'Preview',
      sound_off: 'Off', sound_mxblue: 'Cherry MX Blue', sound_mxbrown: 'Cherry MX Brown',
      sound_cream: 'NovelKeys Cream', sound_holypanda: 'Holy Panda',
      soundRunning: 'Finish or restart this run to change sounds', soundLoading: 'Preparing sounds…',
      soundError: 'Sound is unavailable. Preview to retry. Practice still works.', soundSaveError: 'Sound settings could not be saved. You may need to choose again next time.',
      soundCredit: 'Recordings: kbsim / Thomas Lai · MIT',
      cursor: 'Cursor', cursorTitle: 'Cursor style', cursorClose: 'Close cursor settings', cursorShape: 'Shape',
      cursor_line: 'Line', cursor_underline: 'Underline', cursor_outline: 'Outline',
      cursorGlow: 'Glow', cursorBlink: 'Blink', cursorPreview: 'Cursor preview',
      cursorRunning: 'Finish or restart this run to change the cursor', cursorSaveError: 'Cursor settings could not be saved. You may need to choose again next time.',
    };

    const dictionaries = { zh, en };
    let activeLanguage = 'zh';
    let localeService = null;

    function interpolate(text, vars) {
      return String(text == null ? '' : text).replace(/\{(\w+)\}/g, (match, key) => {
        if (vars && vars[key] != null) return String(vars[key]);
        return match;
      });
    }

    let t = (key, vars) => interpolate((dictionaries[activeLanguage] || zh)[key] ?? key, vars);

    function detectLanguage(locale) {
      try {
        const snapshot = locale && locale.getLocale ? locale.getLocale() : null;
        const id = String(snapshot && (snapshot.active || snapshot.id || snapshot.locale || snapshot.current) || '');
        if (id.toLowerCase().startsWith('en')) return 'en';
      } catch {
        // fall through to the Chinese default
      }
      return 'zh';
    }

    // ---------- practice text ----------

    // BEGIN GENERATED PRACTICE CORPUS
    const PracticeCorpus = (() => { const module = { exports: {} }; const exports = module.exports;
var c=Object.defineProperty;var b=Object.getOwnPropertyDescriptor;var k=Object.getOwnPropertyNames;var v=Object.prototype.hasOwnProperty;var x=(a,t)=>{for(var h in t)c(a,h,{get:t[h],enumerable:!0})},I=(a,t,h,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of k(t))!v.call(a,n)&&n!==h&&c(a,n,{get:()=>t[n],enumerable:!(s=b(t,n))||s.enumerable});return a};var z=a=>I(c({},"__esModule",{value:!0}),a);var j={};x(j,{CORPUS_VERSION:()=>W,PASSAGE_LENGTHS:()=>w,RECENT_LIMIT:()=>A,TEXT_LENGTHS:()=>p,entries:()=>m,selectPassage:()=>O,selectPractice:()=>q});module.exports=z(j);var f={version:2,license:"MIT",provenance:{kind:"original",description:"Written for typing-practice. No third-party passages or user conversations are included."},entries:[{id:"en-travel-01",language:"en",topic:"travel",text:"The bus stop was quieter than usual when we arrived. A notice said that the next bus would leave in ten minutes, so we waited under the shelter. My friend checked the route while I looked for our tickets. When the bus came, we found two seats by the window and watched the town wake up.",family:"en-travel-01",length:"short"},{id:"en-travel-01-medium",language:"en",topic:"travel",text:"The bus stop was quieter than usual when we arrived. A notice said that the next bus would leave in ten minutes, so we waited under the shelter. My friend checked the route while I looked for our tickets. When the bus came, we found two seats by the window and watched the town wake up. At the next stop, an older passenger asked whether the bus passed the hospital. We checked the map above the door together and pointed out where she should get off. She thanked us and settled into the seat across the aisle.",family:"en-travel-01",length:"medium"},{id:"en-travel-01-long",language:"en",topic:"travel",text:"The bus stop was quieter than usual when we arrived. A notice said that the next bus would leave in ten minutes, so we waited under the shelter. My friend checked the route while I looked for our tickets. When the bus came, we found two seats by the window and watched the town wake up. At the next stop, an older passenger asked whether the bus passed the hospital. We checked the map above the door together and pointed out where she should get off. She thanked us and settled into the seat across the aisle. A few minutes later, the driver announced a temporary change of route. The passenger looked worried, so my friend asked which stop would now be closest to the hospital. The driver explained that the side entrance was only a short walk from the new stop. Before she left, we repeated the directions and watched her find the correct street through the window.",family:"en-travel-01",length:"long"},{id:"en-travel-02",language:"en",topic:"travel",text:"We reached the station early enough to buy breakfast before the train left. The bakery near the entrance had just opened, and the bread was still warm. We carried our bags to the platform and checked the departure board. There was no need to rush, so we ate slowly and talked about the journey ahead.",family:"en-travel-02",length:"short"},{id:"en-travel-02-medium",language:"en",topic:"travel",text:"We reached the station early enough to buy breakfast before the train left. The bakery near the entrance had just opened, and the bread was still warm. We carried our bags to the platform and checked the departure board. There was no need to rush, so we ate slowly and talked about the journey ahead. On the train, we compared the stations on our tickets with the route displayed above the seats. Our destination was the last stop before the mountains. We put the tickets in a small pocket instead of leaving them among the breakfast wrappers.",family:"en-travel-02",length:"medium"},{id:"en-travel-02-long",language:"en",topic:"travel",text:"We reached the station early enough to buy breakfast before the train left. The bakery near the entrance had just opened, and the bread was still warm. We carried our bags to the platform and checked the departure board. There was no need to rush, so we ate slowly and talked about the journey ahead. On the train, we compared the stations on our tickets with the route displayed above the seats. Our destination was the last stop before the mountains. We put the tickets in a small pocket instead of leaving them among the breakfast wrappers. Halfway through the journey, the train paused beside a field for several minutes. Nobody knew the reason until a clear announcement explained that another train was passing ahead. We used the extra time to finish our drinks and pack away the bags. When we finally arrived, the station was smaller than we expected, and the path to the village began just beyond the exit.",family:"en-travel-02",length:"long"},{id:"en-travel-03",language:"en",topic:"travel",text:`The rain stopped just before we left the museum. "Let's walk back," my sister said, pointing to a quiet street beside the river. We passed a small bookshop and stopped to look through the window. By the time we reached our hotel, the clouds had cleared and the evening light was reflected on the water.`,family:"en-travel-03",length:"short"},{id:"en-travel-03-medium",language:"en",topic:"travel",text:`The rain stopped just before we left the museum. "Let's walk back," my sister said, pointing to a quiet street beside the river. We passed a small bookshop and stopped to look through the window. By the time we reached our hotel, the clouds had cleared and the evening light was reflected on the water. At the hotel desk, we picked up a paper map of the neighbourhood. My sister marked the bookshop with a small circle so that we could return the next morning. I added the riverside path, which was missing from our earlier plan.`,family:"en-travel-03",length:"medium"},{id:"en-travel-03-long",language:"en",topic:"travel",text:`The rain stopped just before we left the museum. "Let's walk back," my sister said, pointing to a quiet street beside the river. We passed a small bookshop and stopped to look through the window. By the time we reached our hotel, the clouds had cleared and the evening light was reflected on the water. At the hotel desk, we picked up a paper map of the neighbourhood. My sister marked the bookshop with a small circle so that we could return the next morning. I added the riverside path, which was missing from our earlier plan. The shop was open when we went back after breakfast. A narrow staircase led to a room full of used books, with a low table beside the window. We each chose something light enough to carry home. The owner wrapped the books in plain paper and suggested another walk nearby. We kept the map as a record of the places we had found by chance.`,family:"en-travel-03",length:"long"},{id:"en-travel-04",language:"en",topic:"travel",text:"Before setting out for the coast, we checked the weather and packed a light jacket. The path from the village was easy to follow, with signs at each turning. We paused at a bench overlooking the sea and shared some fruit. After a short rest, we continued at a steady pace and reached the beach before noon.",family:"en-travel-04",length:"short"},{id:"en-travel-04-medium",language:"en",topic:"travel",text:"Before setting out for the coast, we checked the weather and packed a light jacket. The path from the village was easy to follow, with signs at each turning. We paused at a bench overlooking the sea and shared some fruit. After a short rest, we continued at a steady pace and reached the beach before noon. The beach was still quiet, and a few families were setting out towels near the steps. We chose a place above the wet sand and left our shoes together. Before going closer to the water, we checked where the path back began.",family:"en-travel-04",length:"medium"},{id:"en-travel-04-long",language:"en",topic:"travel",text:"Before setting out for the coast, we checked the weather and packed a light jacket. The path from the village was easy to follow, with signs at each turning. We paused at a bench overlooking the sea and shared some fruit. After a short rest, we continued at a steady pace and reached the beach before noon. The beach was still quiet, and a few families were setting out towels near the steps. We chose a place above the wet sand and left our shoes together. Before going closer to the water, we checked where the path back began. Later, the clouds gathered again and a cool wind blew across the shore. We decided to leave earlier than planned rather than wait for the rain. On the way uphill, we met a couple looking for the same path and showed them the sign we had noticed that morning. Back in the village, we found a sheltered table and ate the rest of our lunch.",family:"en-travel-04",length:"long"},{id:"en-food-01",language:"en",topic:"food",text:"I wrote a short shopping list before leaving for the market. We already had rice and eggs at home, but we needed vegetables for dinner. At the first stall, I chose a few tomatoes and asked for a paper bag. Buying only what we needed made the journey home lighter and left less food to waste.",family:"en-food-01",length:"short"},{id:"en-food-01-medium",language:"en",topic:"food",text:"I wrote a short shopping list before leaving for the market. We already had rice and eggs at home, but we needed vegetables for dinner. At the first stall, I chose a few tomatoes and asked for a paper bag. Buying only what we needed made the journey home lighter and left less food to waste. At home, I put the older vegetables at the front of the fridge and the new ones behind them. A small bowl of tomatoes was left on the counter for that evening. I crossed the items off the list before putting it away.",family:"en-food-01",length:"medium"},{id:"en-food-01-long",language:"en",topic:"food",text:"I wrote a short shopping list before leaving for the market. We already had rice and eggs at home, but we needed vegetables for dinner. At the first stall, I chose a few tomatoes and asked for a paper bag. Buying only what we needed made the journey home lighter and left less food to waste. At home, I put the older vegetables at the front of the fridge and the new ones behind them. A small bowl of tomatoes was left on the counter for that evening. I crossed the items off the list before putting it away. While preparing dinner, I discovered that the last onion was softer than expected. I changed the plan and used the fresh tomatoes with eggs instead. The unused vegetables would keep for another meal, so nothing else needed to be bought. After eating, I noted the change on next week's list. Planning helped, but leaving room for a small change made the meal easier to finish.",family:"en-food-01",length:"long"},{id:"en-food-02",language:"en",topic:"food",text:"Making soup became easier once I prepared everything before turning on the stove. I washed the vegetables, cut them into small pieces, and placed a bowl nearby for the peelings. While the soup cooked, I cleared the table and set out two spoons. Soon the kitchen was tidy again, and we could sit down to eat.",family:"en-food-02",length:"short"},{id:"en-food-02-medium",language:"en",topic:"food",text:"Making soup became easier once I prepared everything before turning on the stove. I washed the vegetables, cut them into small pieces, and placed a bowl nearby for the peelings. While the soup cooked, I cleared the table and set out two spoons. Soon the kitchen was tidy again, and we could sit down to eat. The soup needed a little more time than I had expected. I turned down the heat and checked a piece of carrot with a spoon. While waiting, I put the remaining vegetables into a covered container for the next day's lunch.",family:"en-food-02",length:"medium"},{id:"en-food-02-long",language:"en",topic:"food",text:"Making soup became easier once I prepared everything before turning on the stove. I washed the vegetables, cut them into small pieces, and placed a bowl nearby for the peelings. While the soup cooked, I cleared the table and set out two spoons. Soon the kitchen was tidy again, and we could sit down to eat. The soup needed a little more time than I had expected. I turned down the heat and checked a piece of carrot with a spoon. While waiting, I put the remaining vegetables into a covered container for the next day's lunch. When our neighbour knocked to return a dish, the soup was finally ready. We offered her a small bowl and sat near the open kitchen window. She told us about a market stall that sold vegetables in smaller amounts. I wrote down the name on the shopping list, then divided the leftover soup into two portions after our guest had gone home.",family:"en-food-02",length:"long"},{id:"en-food-03",language:"en",topic:"food",text:"Our friends brought different dishes to lunch, so nobody had to prepare the whole meal. I made a salad while another guest warmed the bread. We put everything in the middle of the table and passed the bowls around. The conversation lasted much longer than the meal, and we agreed to meet again the following month.",family:"en-food-03",length:"short"},{id:"en-food-03-medium",language:"en",topic:"food",text:"Our friends brought different dishes to lunch, so nobody had to prepare the whole meal. I made a salad while another guest warmed the bread. We put everything in the middle of the table and passed the bowls around. The conversation lasted much longer than the meal, and we agreed to meet again the following month. Before everyone left, we returned the empty containers to their owners and shared out the leftovers. Someone suggested writing down the dishes for next time. We made a short list so that the next lunch would not end up with four salads.",family:"en-food-03",length:"medium"},{id:"en-food-03-long",language:"en",topic:"food",text:"Our friends brought different dishes to lunch, so nobody had to prepare the whole meal. I made a salad while another guest warmed the bread. We put everything in the middle of the table and passed the bowls around. The conversation lasted much longer than the meal, and we agreed to meet again the following month. Before everyone left, we returned the empty containers to their owners and shared out the leftovers. Someone suggested writing down the dishes for next time. We made a short list so that the next lunch would not end up with four salads. At the following gathering, one friend arrived late because her bus had been delayed. We kept a plate for her and began with the food that was best eaten warm. When she arrived, there was still plenty to share. The list had helped us prepare, but nobody minded that one planned dish had been replaced by fruit from a stall near the bus stop.",family:"en-food-03",length:"long"},{id:"en-food-04",language:"en",topic:"food",text:`A new cafe opened near the library last week. On Saturday morning, I stopped there after returning a book and chose a table away from the door. The owner asked whether the music was too loud. "It's fine here," I replied, then opened my notebook and wrote down a few ideas while waiting for breakfast.`,family:"en-food-04",length:"short"},{id:"en-food-04-medium",language:"en",topic:"food",text:`A new cafe opened near the library last week. On Saturday morning, I stopped there after returning a book and chose a table away from the door. The owner asked whether the music was too loud. "It's fine here," I replied, then opened my notebook and wrote down a few ideas while waiting for breakfast. When the food arrived, I closed the notebook and moved it away from my cup. The cafe was becoming busier, and the owner opened a second till. I finished breakfast, paid at the counter, and asked when the quietest hours usually were.`,family:"en-food-04",length:"medium"},{id:"en-food-04-long",language:"en",topic:"food",text:`A new cafe opened near the library last week. On Saturday morning, I stopped there after returning a book and chose a table away from the door. The owner asked whether the music was too loud. "It's fine here," I replied, then opened my notebook and wrote down a few ideas while waiting for breakfast. When the food arrived, I closed the notebook and moved it away from my cup. The cafe was becoming busier, and the owner opened a second till. I finished breakfast, paid at the counter, and asked when the quietest hours usually were. A week later, I returned in the late afternoon with a friend. The same table was free, but the light through the window was softer. We read a few pages in silence before discussing the ideas I had written down on my first visit. One idea still seemed useful, so we made a small plan to try it during the coming weekend.`,family:"en-food-04",length:"long"},{id:"en-work-01",language:"en",topic:"work",text:"Before starting the next task, I read through yesterday's notes. One question was still unanswered, so I added it to the meeting agenda instead of guessing. When the team arrived, we settled that point first and divided the remaining work. Everyone left with a clear next step, and the afternoon passed without another long meeting.",family:"en-work-01",length:"short"},{id:"en-work-01-medium",language:"en",topic:"work",text:"Before starting the next task, I read through yesterday's notes. One question was still unanswered, so I added it to the meeting agenda instead of guessing. When the team arrived, we settled that point first and divided the remaining work. Everyone left with a clear next step, and the afternoon passed without another long meeting. After lunch, a colleague sent an updated example that answered one of the remaining questions. I added it beside the relevant note and marked the earlier example as outdated. The team could now follow one clear version without comparing several messages.",family:"en-work-01",length:"medium"},{id:"en-work-01-long",language:"en",topic:"work",text:"Before starting the next task, I read through yesterday's notes. One question was still unanswered, so I added it to the meeting agenda instead of guessing. When the team arrived, we settled that point first and divided the remaining work. Everyone left with a clear next step, and the afternoon passed without another long meeting. After lunch, a colleague sent an updated example that answered one of the remaining questions. I added it beside the relevant note and marked the earlier example as outdated. The team could now follow one clear version without comparing several messages. Near the end of the day, we checked whether the agreed steps still matched the work. One small part had taken longer than expected, so its owner explained the delay and proposed a simpler first version. We recorded that decision in the same place as the original plan. The next morning, anyone returning to the task could see both the change and its reason.",family:"en-work-01",length:"long"},{id:"en-work-02",language:"en",topic:"work",text:"The shared folder had become difficult to use because several files had almost identical names. We agreed on a simple naming rule and moved the older copies into an archive. I tested the arrangement by looking for a report from last month. Finding it quickly showed that the new structure was worth keeping.",family:"en-work-02",length:"short"},{id:"en-work-02-medium",language:"en",topic:"work",text:"The shared folder had become difficult to use because several files had almost identical names. We agreed on a simple naming rule and moved the older copies into an archive. I tested the arrangement by looking for a report from last month. Finding it quickly showed that the new structure was worth keeping. We also added a short note explaining where new documents should go. A colleague who had not joined the discussion tried to save a sample file. Her question revealed an unclear folder name, which we changed before moving the remaining documents.",family:"en-work-02",length:"medium"},{id:"en-work-02-long",language:"en",topic:"work",text:"The shared folder had become difficult to use because several files had almost identical names. We agreed on a simple naming rule and moved the older copies into an archive. I tested the arrangement by looking for a report from last month. Finding it quickly showed that the new structure was worth keeping. We also added a short note explaining where new documents should go. A colleague who had not joined the discussion tried to save a sample file. Her question revealed an unclear folder name, which we changed before moving the remaining documents. For the first week, we kept a list of files that people still struggled to find. Most problems came from old links rather than the new arrangement. We updated the links in the team notes and left a simple pointer in the previous folder. By Friday, the list had stopped growing, and the team could use the structure without asking someone to explain it each time.",family:"en-work-02",length:"long"},{id:"en-work-03",language:"en",topic:"work",text:"I was about to send the document when I noticed that one date did not match the schedule. Rather than changing it from memory, I checked the original note and corrected both places. A final reading took only a few minutes. After sending the file, I recorded the change so that the next person would understand it.",family:"en-work-03",length:"short"},{id:"en-work-03-medium",language:"en",topic:"work",text:"I was about to send the document when I noticed that one date did not match the schedule. Rather than changing it from memory, I checked the original note and corrected both places. A final reading took only a few minutes. After sending the file, I recorded the change so that the next person would understand it. The reply arrived later that afternoon with a question about one paragraph. I opened the saved copy rather than the draft still on my desk. Looking at the same version made it easier to explain the sentence and agree on a small revision.",family:"en-work-03",length:"medium"},{id:"en-work-03-long",language:"en",topic:"work",text:"I was about to send the document when I noticed that one date did not match the schedule. Rather than changing it from memory, I checked the original note and corrected both places. A final reading took only a few minutes. After sending the file, I recorded the change so that the next person would understand it. The reply arrived later that afternoon with a question about one paragraph. I opened the saved copy rather than the draft still on my desk. Looking at the same version made it easier to explain the sentence and agree on a small revision. Before preparing the next document, I added a final check for dates and version names to my usual routine. The check was short enough to finish even on a busy day. A month later, it helped me notice an old heading that had survived several rounds of editing. Fixing it before sending saved the reader from having to work out which information was current.",family:"en-work-03",length:"long"},{id:"en-work-04",language:"en",topic:"work",text:"A large task felt more manageable after we divided it into smaller parts. We began with the section that had the fewest unknowns and used it to check our approach. The first attempt revealed a missing step, which we added to the plan. Progress was slower that morning, but the remaining work became much clearer.",family:"en-work-04",length:"short"},{id:"en-work-04-medium",language:"en",topic:"work",text:"A large task felt more manageable after we divided it into smaller parts. We began with the section that had the fewest unknowns and used it to check our approach. The first attempt revealed a missing step, which we added to the plan. Progress was slower that morning, but the remaining work became much clearer. At midday, we placed the finished parts beside the original outline. One section was longer than it needed to be, while another lacked an example. We adjusted the remaining tasks so that the afternoon work would fill those gaps instead of adding more detail everywhere.",family:"en-work-04",length:"medium"},{id:"en-work-04-long",language:"en",topic:"work",text:"A large task felt more manageable after we divided it into smaller parts. We began with the section that had the fewest unknowns and used it to check our approach. The first attempt revealed a missing step, which we added to the plan. Progress was slower that morning, but the remaining work became much clearer. At midday, we placed the finished parts beside the original outline. One section was longer than it needed to be, while another lacked an example. We adjusted the remaining tasks so that the afternoon work would fill those gaps instead of adding more detail everywhere. The review the next day focused on whether a new reader could follow the whole result. We asked a colleague to explain what she thought the first step was. Her answer showed that one instruction was still too vague. We rewrote that sentence and tested it again. The small example from the first morning remained useful because it gave everyone something concrete to compare against.",family:"en-work-04",length:"long"},{id:"en-learning-01",language:"en",topic:"learning",text:"I keep a small notebook beside me when learning something new. Instead of copying every sentence, I write down the main idea and one example that makes sense to me. At the end of the day, I try to explain the idea without looking. Any part I cannot explain becomes a question for the next session.",family:"en-learning-01",length:"short"},{id:"en-learning-01-medium",language:"en",topic:"learning",text:"I keep a small notebook beside me when learning something new. Instead of copying every sentence, I write down the main idea and one example that makes sense to me. At the end of the day, I try to explain the idea without looking. Any part I cannot explain becomes a question for the next session. A week later, I returned to the earliest pages of the notebook. Some questions now seemed straightforward, while others still needed a better example. I used a different colour to mark the parts I could explain clearly and left the rest for another session.",family:"en-learning-01",length:"medium"},{id:"en-learning-01-long",language:"en",topic:"learning",text:"I keep a small notebook beside me when learning something new. Instead of copying every sentence, I write down the main idea and one example that makes sense to me. At the end of the day, I try to explain the idea without looking. Any part I cannot explain becomes a question for the next session. A week later, I returned to the earliest pages of the notebook. Some questions now seemed straightforward, while others still needed a better example. I used a different colour to mark the parts I could explain clearly and left the rest for another session. When a friend asked what I had been studying, I tried one of those explanations in conversation. She understood the example but asked about a detail I had overlooked. I added her question to the notebook without rewriting the whole page. The notes gradually became a record of what I understood and what still puzzled me, instead of a collection of sentences copied from lessons.",family:"en-learning-01",length:"long"},{id:"en-learning-02",language:"en",topic:"learning",text:"The first exercise looked simple, but I made the same mistake twice. I stopped, compared my answer with the instructions, and found that I had skipped a small detail. On the next attempt, I worked more slowly and checked each step. Getting it right helped more than finishing quickly with the same error.",family:"en-learning-02",length:"short"},{id:"en-learning-02-medium",language:"en",topic:"learning",text:"The first exercise looked simple, but I made the same mistake twice. I stopped, compared my answer with the instructions, and found that I had skipped a small detail. On the next attempt, I worked more slowly and checked each step. Getting it right helped more than finishing quickly with the same error. I put the incorrect answer beside the corrected one and circled the step where they became different. This made the mistake easier to recognise. The next exercise used different numbers, but I could still apply the same check without copying the previous answer.",family:"en-learning-02",length:"medium"},{id:"en-learning-02-long",language:"en",topic:"learning",text:"The first exercise looked simple, but I made the same mistake twice. I stopped, compared my answer with the instructions, and found that I had skipped a small detail. On the next attempt, I worked more slowly and checked each step. Getting it right helped more than finishing quickly with the same error. I put the incorrect answer beside the corrected one and circled the step where they became different. This made the mistake easier to recognise. The next exercise used different numbers, but I could still apply the same check without copying the previous answer. At the end of the session, I tried a similar question without looking at either example. I paused at the step I had missed earlier and explained it aloud before continuing. The answer was correct, although it took a little longer. I stopped there rather than rush into more exercises, leaving a fresh question ready for the next morning's practice.",family:"en-learning-02",length:"long"},{id:"en-learning-03",language:"en",topic:"learning",text:"Our study group meets in the library once a week. Each person brings one question and takes a turn explaining how they approached it. Sometimes a clear example helps more than a long explanation. Before leaving, we choose a small task to try on our own and discuss the results at the next meeting.",family:"en-learning-03",length:"short"},{id:"en-learning-03-medium",language:"en",topic:"learning",text:"Our study group meets in the library once a week. Each person brings one question and takes a turn explaining how they approached it. Sometimes a clear example helps more than a long explanation. Before leaving, we choose a small task to try on our own and discuss the results at the next meeting. At our next meeting, two people had reached different answers using similar steps. We laid both attempts on the table and compared them line by line. The difference came from a word in the question that we had interpreted in different ways.",family:"en-learning-03",length:"medium"},{id:"en-learning-03-long",language:"en",topic:"learning",text:"Our study group meets in the library once a week. Each person brings one question and takes a turn explaining how they approached it. Sometimes a clear example helps more than a long explanation. Before leaving, we choose a small task to try on our own and discuss the results at the next meeting. At our next meeting, two people had reached different answers using similar steps. We laid both attempts on the table and compared them line by line. The difference came from a word in the question that we had interpreted in different ways. We agreed to write our assumptions beside future answers so that disagreements would be easier to discuss. A quiet member of the group then offered an example from her own work that made the wording clearer. We added it to the shared notes with a brief explanation. Before leaving, each person chose a new question, keeping the next meeting small enough for everyone to take part.",family:"en-learning-03",length:"long"},{id:"en-learning-04",language:"en",topic:"learning",text:"I wanted to practise a little every day, so I chose a time that already fitted my routine. After breakfast, I spent ten minutes reviewing a short lesson before opening other apps. Some days were easier than others, but the small sessions added up. Keeping the task simple made it easier to return the following morning.",family:"en-learning-04",length:"short"},{id:"en-learning-04-medium",language:"en",topic:"learning",text:"I wanted to practise a little every day, so I chose a time that already fitted my routine. After breakfast, I spent ten minutes reviewing a short lesson before opening other apps. Some days were easier than others, but the small sessions added up. Keeping the task simple made it easier to return the following morning. After two weeks, I missed a morning because I had to leave early. I did not try to make up every minute that evening. Instead, I put the notebook beside my breakfast bowl so that returning to the routine the next day would be easy.",family:"en-learning-04",length:"medium"},{id:"en-learning-04-long",language:"en",topic:"learning",text:"I wanted to practise a little every day, so I chose a time that already fitted my routine. After breakfast, I spent ten minutes reviewing a short lesson before opening other apps. Some days were easier than others, but the small sessions added up. Keeping the task simple made it easier to return the following morning. After two weeks, I missed a morning because I had to leave early. I did not try to make up every minute that evening. Instead, I put the notebook beside my breakfast bowl so that returning to the routine the next day would be easy. Some lessons later needed more than ten minutes, so I split them at a clear stopping point. I wrote one sentence about where to begin next time and closed the book. This kept the short session useful without turning it into another unfinished task. At the end of the month, I looked back through the notes and found several small questions that I could now answer confidently.",family:"en-learning-04",length:"long"},{id:"en-reading-01",language:"en",topic:"reading",text:"The book I borrowed had a map printed inside the front cover. At first I skipped it, but later I found myself turning back to follow the characters' journey. The place names began to feel familiar after a few chapters. I read more slowly than usual and enjoyed noticing how each scene connected to the next.",family:"en-reading-01",length:"short"},{id:"en-reading-01-medium",language:"en",topic:"reading",text:"The book I borrowed had a map printed inside the front cover. At first I skipped it, but later I found myself turning back to follow the characters' journey. The place names began to feel familiar after a few chapters. I read more slowly than usual and enjoyed noticing how each scene connected to the next. The unfamiliar subject turned out to connect with something I had noticed on my daily walk. I placed a bookmark beside that page and checked the explanation again after returning home. The connection gave me a reason to continue reading beyond the first chapter.",family:"en-reading-01",length:"medium"},{id:"en-reading-01-long",language:"en",topic:"reading",text:"The book I borrowed had a map printed inside the front cover. At first I skipped it, but later I found myself turning back to follow the characters' journey. The place names began to feel familiar after a few chapters. I read more slowly than usual and enjoyed noticing how each scene connected to the next. The unfamiliar subject turned out to connect with something I had noticed on my daily walk. I placed a bookmark beside that page and checked the explanation again after returning home. The connection gave me a reason to continue reading beyond the first chapter. When I returned the book, I looked for another title on the same shelf. This time, I read the contents page before choosing. Some books assumed more background knowledge than I had, so I picked one with short examples and clear diagrams. The staff recommendation had opened a new subject, but I was beginning to recognise which kind of explanation helped me explore it on my own.",family:"en-reading-01",length:"long"},{id:"en-reading-02",language:"en",topic:"reading",text:"At the library, a display of staff recommendations caught my attention. I picked up a short book about a subject I knew little about and read the opening page. The writing was clear enough to draw me in without a long introduction. I borrowed it along with the novel I had originally come to find.",family:"en-reading-02",length:"short"},{id:"en-reading-02-medium",language:"en",topic:"reading",text:"At the library, a display of staff recommendations caught my attention. I picked up a short book about a subject I knew little about and read the opening page. The writing was clear enough to draw me in without a long introduction. I borrowed it along with the novel I had originally come to find. One evening, I noticed that a place on the map had a different name in an earlier chapter. I checked the surrounding pages and found that the change was part of the story. Keeping track of the places helped me understand why the journey mattered.",family:"en-reading-02",length:"medium"},{id:"en-reading-02-long",language:"en",topic:"reading",text:"At the library, a display of staff recommendations caught my attention. I picked up a short book about a subject I knew little about and read the opening page. The writing was clear enough to draw me in without a long introduction. I borrowed it along with the novel I had originally come to find. One evening, I noticed that a place on the map had a different name in an earlier chapter. I checked the surrounding pages and found that the change was part of the story. Keeping track of the places helped me understand why the journey mattered. After finishing the book, I drew a rough route on a spare sheet of paper. It was not a copy of the printed map, but a record of the scenes I remembered. A friend recognised one town from my description and asked to borrow the book. I left the drawing inside the cover, making it clear that it showed my reading of the journey rather than an official guide.",family:"en-reading-02",length:"long"},{id:"en-reading-03",language:"en",topic:"reading",text:"A friend and I decided to read the same story over the weekend. When we met on Monday, we discovered that we had noticed completely different details. One conversation that I barely remembered had changed her view of the ending. Talking about the story made me want to read that part again with more care.",family:"en-reading-03",length:"short"},{id:"en-reading-03-medium",language:"en",topic:"reading",text:"A friend and I decided to read the same story over the weekend. When we met on Monday, we discovered that we had noticed completely different details. One conversation that I barely remembered had changed her view of the ending. Talking about the story made me want to read that part again with more care. I wrote the date on a small card beside the pot and checked it during breakfast. The soil did not dry at the same speed every day. Instead of watering by habit, I learned to look at the plant and its surroundings first.",family:"en-reading-03",length:"medium"},{id:"en-reading-03-long",language:"en",topic:"reading",text:"A friend and I decided to read the same story over the weekend. When we met on Monday, we discovered that we had noticed completely different details. One conversation that I barely remembered had changed her view of the ending. Talking about the story made me want to read that part again with more care. I wrote the date on a small card beside the pot and checked it during breakfast. The soil did not dry at the same speed every day. Instead of watering by habit, I learned to look at the plant and its surroundings first. When we went away for a weekend, I asked a neighbour to look in on the plant. I left a short note about its usual place and showed her how I checked the soil. On returning, I found a new leaf beginning to open. We compared it with an earlier photograph, then moved the pot slightly so that the growing leaves would have enough space.",family:"en-reading-03",length:"long"},{id:"en-reading-04",language:"en",topic:"reading",text:"I used to leave bookmarks in several unfinished books at once. This month, I chose one to keep beside my chair and put the others back on the shelf. Reading a few pages each evening made the story easier to follow. When I reached the end, I wrote a short note about the part I liked best.",family:"en-reading-04",length:"short"},{id:"en-reading-04-medium",language:"en",topic:"reading",text:"I used to leave bookmarks in several unfinished books at once. This month, I chose one to keep beside my chair and put the others back on the shelf. Reading a few pages each evening made the story easier to follow. When I reached the end, I wrote a short note about the part I liked best. At the bus stop, I realised that the book I wanted was still on the shelf at home. It was not urgent, so I made a note to pack it that evening. The routine worked best when it followed what the next day actually required.",family:"en-reading-04",length:"medium"},{id:"en-reading-04-long",language:"en",topic:"reading",text:"I used to leave bookmarks in several unfinished books at once. This month, I chose one to keep beside my chair and put the others back on the shelf. Reading a few pages each evening made the story easier to follow. When I reached the end, I wrote a short note about the part I liked best. At the bus stop, I realised that the book I wanted was still on the shelf at home. It was not urgent, so I made a note to pack it that evening. The routine worked best when it followed what the next day actually required. That night, I placed a small card beside the keys with the next morning's two unusual tasks. I needed to return the book and collect a parcel on the way back. Reading the card helped me choose a bag large enough for both. After completing those errands, I removed the card instead of leaving old reminders to gather beside the door and hide the useful ones.",family:"en-reading-04",length:"long"},{id:"en-home-01",language:"en",topic:"home",text:"The light by my desk was too far from the page, so I moved the lamp before starting work. I also cleared away a stack of old papers and left only the things I needed. The room itself had not changed much, but the desk felt easier to use. I could find a pen without moving everything else.",family:"en-home-01",length:"short"},{id:"en-home-01-medium",language:"en",topic:"home",text:"The light by my desk was too far from the page, so I moved the lamp before starting work. I also cleared away a stack of old papers and left only the things I needed. The room itself had not changed much, but the desk felt easier to use. I could find a pen without moving everything else. Before putting everything away, I checked which items we used most often. Those stayed within easy reach, while the things needed only occasionally went farther back. I left a small gap instead of filling every space, knowing that something else would soon need a place.",family:"en-home-01",length:"medium"},{id:"en-home-01-long",language:"en",topic:"home",text:"The light by my desk was too far from the page, so I moved the lamp before starting work. I also cleared away a stack of old papers and left only the things I needed. The room itself had not changed much, but the desk felt easier to use. I could find a pen without moving everything else. Before putting everything away, I checked which items we used most often. Those stayed within easy reach, while the things needed only occasionally went farther back. I left a small gap instead of filling every space, knowing that something else would soon need a place. A few days later, that gap made it easy to put away a parcel without covering the table. We could open it, keep what we needed, and flatten the packaging straight away. The arrangement was simple enough for everyone at home to follow. When something was left out, returning it took less effort because its place was visible and there was room to reach it.",family:"en-home-01",length:"long"},{id:"en-home-02",language:"en",topic:"home",text:"We set aside a rainy afternoon to sort the cupboard in the hall. Empty boxes went into one pile, useful things into another, and items to give away into a third. A missing scarf turned up behind an old bag. By the end, there was enough room to close the door without pushing anything inside.",family:"en-home-02",length:"short"},{id:"en-home-02-medium",language:"en",topic:"home",text:"We set aside a rainy afternoon to sort the cupboard in the hall. Empty boxes went into one pile, useful things into another, and items to give away into a third. A missing scarf turned up behind an old bag. By the end, there was enough room to close the door without pushing anything inside. I checked the space again after using it for a few days. The lamp was useful, but the chair blocked the drawer when pulled out. Moving the table a little to one side solved the problem and left enough room to walk past comfortably.",family:"en-home-02",length:"medium"},{id:"en-home-02-long",language:"en",topic:"home",text:"We set aside a rainy afternoon to sort the cupboard in the hall. Empty boxes went into one pile, useful things into another, and items to give away into a third. A missing scarf turned up behind an old bag. By the end, there was enough room to close the door without pushing anything inside. I checked the space again after using it for a few days. The lamp was useful, but the chair blocked the drawer when pulled out. Moving the table a little to one side solved the problem and left enough room to walk past comfortably. On the weekend, a friend visited and used the table to write a note. She asked where to put her cup, and I realised that the surface had no clear space for it. I moved a stack of papers to a shelf and kept one corner empty. The room still looked familiar, but ordinary actions no longer required shifting several objects first.",family:"en-home-02",length:"long"},{id:"en-home-03",language:"en",topic:"home",text:"A small plant on the windowsill began leaning towards the light. I turned its pot a little and moved the books that were shading one side. Over the next few days, I paid closer attention to the leaves and the soil. Looking after that one corner made me notice more about the room around it.",family:"en-home-03",length:"short"},{id:"en-home-03-medium",language:"en",topic:"home",text:"A small plant on the windowsill began leaning towards the light. I turned its pot a little and moved the books that were shading one side. Over the next few days, I paid closer attention to the leaves and the soil. Looking after that one corner made me notice more about the room around it. While clearing the last shelf, I found a small box of spare buttons and loose keys. I labelled the buttons and checked which locks the keys belonged to. Anything I could not identify went into a separate tray to ask the family about later.",family:"en-home-03",length:"medium"},{id:"en-home-03-long",language:"en",topic:"home",text:"A small plant on the windowsill began leaning towards the light. I turned its pot a little and moved the books that were shading one side. Over the next few days, I paid closer attention to the leaves and the soil. Looking after that one corner made me notice more about the room around it. While clearing the last shelf, I found a small box of spare buttons and loose keys. I labelled the buttons and checked which locks the keys belonged to. Anything I could not identify went into a separate tray to ask the family about later. That evening, we went through the tray together. One key belonged to an old bicycle lock, and another opened a cupboard we rarely used. We put each key beside the item it matched and agreed where the remaining spare parts should stay. A week later, finding a missing button took only a moment because we all remembered the same place instead of searching different drawers.",family:"en-home-03",length:"long"},{id:"en-home-04",language:"en",topic:"home",text:"Before going to bed, I put my keys and bag in the same place near the door. I checked what I would need in the morning and filled a bottle with water. The routine took only a moment, but it saved a search through the house the next day. I left home with time to spare.",family:"en-home-04",length:"short"},{id:"en-home-04-medium",language:"en",topic:"home",text:"Before going to bed, I put my keys and bag in the same place near the door. I checked what I would need in the morning and filled a bottle with water. The routine took only a moment, but it saved a search through the house the next day. I left home with time to spare. The next morning, I checked the list before starting another job. One item needed a tool we did not have, so I set it aside and finished the easier tasks first. This left the room usable while we worked out what the remaining repair required.",family:"en-home-04",length:"medium"},{id:"en-home-04-long",language:"en",topic:"home",text:"Before going to bed, I put my keys and bag in the same place near the door. I checked what I would need in the morning and filled a bottle with water. The routine took only a moment, but it saved a search through the house the next day. I left home with time to spare. The next morning, I checked the list before starting another job. One item needed a tool we did not have, so I set it aside and finished the easier tasks first. This left the room usable while we worked out what the remaining repair required. At the local shop, I described the problem and showed a drawing with the measurements. The assistant helped me find a suitable part without buying a whole set of tools. Back at home, we compared the new part with the old one before fitting it. Once the repair was finished, I kept the receipt and wrote down the part's name for another time.",family:"en-home-04",length:"long"},{id:"en-hobbies-01",language:"en",topic:"hobbies",text:"I took my camera on a walk without planning to visit anywhere special. At the corner of our street, sunlight fell across an old wall and made a pattern of shadows. I waited for a person to pass, then took a photograph. The picture reminded me that familiar places can look different when I slow down.",family:"en-hobbies-01",length:"short"},{id:"en-hobbies-01-medium",language:"en",topic:"hobbies",text:"I took my camera on a walk without planning to visit anywhere special. At the corner of our street, sunlight fell across an old wall and made a pattern of shadows. I waited for a person to pass, then took a photograph. The picture reminded me that familiar places can look different when I slow down. I saved the first attempt instead of throwing it away. A week later, placing it beside the newer work made the changes easier to see. Some details were still uneven, but I could identify one small thing to practise during the next session.",family:"en-hobbies-01",length:"medium"},{id:"en-hobbies-01-long",language:"en",topic:"hobbies",text:"I took my camera on a walk without planning to visit anywhere special. At the corner of our street, sunlight fell across an old wall and made a pattern of shadows. I waited for a person to pass, then took a photograph. The picture reminded me that familiar places can look different when I slow down. I saved the first attempt instead of throwing it away. A week later, placing it beside the newer work made the changes easier to see. Some details were still uneven, but I could identify one small thing to practise during the next session. For the next attempt, I chose a simpler subject and limited myself to the materials already on the table. Having fewer choices helped me concentrate on the part I wanted to improve. When I finished, I wrote the date on the back and left it to dry. The small collection gradually became a useful record of practice, including the attempts that had not worked as planned.",family:"en-hobbies-01",length:"long"},{id:"en-hobbies-02",language:"en",topic:"hobbies",text:"Our local team practised passing before playing a short game. We began close together, then moved farther apart once everyone found a comfortable rhythm. A few passes went wide, but we collected the ball and tried again. By the end of the session, the quieter players were asking for the ball more often.",family:"en-hobbies-02",length:"short"},{id:"en-hobbies-02-medium",language:"en",topic:"hobbies",text:"Our local team practised passing before playing a short game. We began close together, then moved farther apart once everyone found a comfortable rhythm. A few passes went wide, but we collected the ball and tried again. By the end of the session, the quieter players were asking for the ball more often. Before the next session, I checked the equipment and put the missing pieces in one bag. Preparing it early meant we could begin as soon as everyone arrived. We also agreed on a clear finishing time so that packing up would not feel rushed.",family:"en-hobbies-02",length:"medium"},{id:"en-hobbies-02-long",language:"en",topic:"hobbies",text:"Our local team practised passing before playing a short game. We began close together, then moved farther apart once everyone found a comfortable rhythm. A few passes went wide, but we collected the ball and tried again. By the end of the session, the quieter players were asking for the ball more often. Before the next session, I checked the equipment and put the missing pieces in one bag. Preparing it early meant we could begin as soon as everyone arrived. We also agreed on a clear finishing time so that packing up would not feel rushed. One friend brought a new idea that needed more space than we had available. We tried a smaller version first and discovered which parts were worth keeping. Nobody had to abandon the original activity, and the new idea became something to explore another day. At the end, we put the equipment back in its labelled places and wrote a short note about what to bring next time.",family:"en-hobbies-02",length:"long"},{id:"en-hobbies-03",language:"en",topic:"hobbies",text:"I had not drawn for years, so I began with a cup on the kitchen table. The first sketch looked uneven, but I could see where the handle needed to move. I tried again on a fresh page and noticed more of the shape. Keeping both drawings helped me see a small improvement instead of only the mistakes.",family:"en-hobbies-03",length:"short"},{id:"en-hobbies-03-medium",language:"en",topic:"hobbies",text:"I had not drawn for years, so I began with a cup on the kitchen table. The first sketch looked uneven, but I could see where the handle needed to move. I tried again on a fresh page and noticed more of the shape. Keeping both drawings helped me see a small improvement instead of only the mistakes. Looking through the results later, I selected only a few that showed what I had been trying to notice. I kept the rest in a separate folder. Choosing a small set made it easier to compare details instead of losing them among many similar attempts.",family:"en-hobbies-03",length:"medium"},{id:"en-hobbies-03-long",language:"en",topic:"hobbies",text:"I had not drawn for years, so I began with a cup on the kitchen table. The first sketch looked uneven, but I could see where the handle needed to move. I tried again on a fresh page and noticed more of the shape. Keeping both drawings helped me see a small improvement instead of only the mistakes. Looking through the results later, I selected only a few that showed what I had been trying to notice. I kept the rest in a separate folder. Choosing a small set made it easier to compare details instead of losing them among many similar attempts. I showed the selection to a friend without explaining it first. The detail she noticed was different from the one I had expected, which made us look more closely at the whole scene. We discussed what could be changed on the next outing, then chose a familiar place to visit again. Returning to the same setting would let us notice changes in both the place and our own approach.",family:"en-hobbies-03",length:"long"},{id:"en-hobbies-04",language:"en",topic:"hobbies",text:"We chose a simple board game for an evening with friends. One person read the rules aloud while the rest of us set out the pieces. After a practice round, everyone understood what to do. We played several short games, changed seats between rounds, and laughed when a plan failed in an unexpected way.",family:"en-hobbies-04",length:"short"},{id:"en-hobbies-04-medium",language:"en",topic:"hobbies",text:"We chose a simple board game for an evening with friends. One person read the rules aloud while the rest of us set out the pieces. After a practice round, everyone understood what to do. We played several short games, changed seats between rounds, and laughed when a plan failed in an unexpected way. After the final game, we checked the table and floor for missing pieces. One card had slipped beneath a cushion, so we counted the cards before closing the box. We put a note inside with the rule that had caused the most discussion.",family:"en-hobbies-04",length:"medium"},{id:"en-hobbies-04-long",language:"en",topic:"hobbies",text:"We chose a simple board game for an evening with friends. One person read the rules aloud while the rest of us set out the pieces. After a practice round, everyone understood what to do. We played several short games, changed seats between rounds, and laughed when a plan failed in an unexpected way. After the final game, we checked the table and floor for missing pieces. One card had slipped beneath a cushion, so we counted the cards before closing the box. We put a note inside with the rule that had caused the most discussion. The next time we played, a new friend joined us. Instead of explaining every rule at once, we used the first round as a demonstration and answered questions as they came up. The note saved us from repeating the earlier argument. By the second round, everyone could take a turn without help, and we had more time to enjoy the choices in the game.",family:"en-hobbies-04",length:"long"},{id:"en-nature-01",language:"en",topic:"nature",text:"On the way to work, I passed the same tree every morning without paying much attention. One day, a few new leaves caught the light above the pavement. I began looking up as I walked past and noticed the branches changing over the following weeks. A familiar route became a little more interesting.",family:"en-nature-01",length:"short"},{id:"en-nature-01-medium",language:"en",topic:"nature",text:"On the way to work, I passed the same tree every morning without paying much attention. One day, a few new leaves caught the light above the pavement. I began looking up as I walked past and noticed the branches changing over the following weeks. A familiar route became a little more interesting. I began making a brief note of the changes once a week. Sometimes there was little to record beyond the colour of the leaves or the shadow on the pavement. Looking at the earlier notes helped me notice how gradually the tree was changing.",family:"en-nature-01",length:"medium"},{id:"en-nature-01-long",language:"en",topic:"nature",text:"On the way to work, I passed the same tree every morning without paying much attention. One day, a few new leaves caught the light above the pavement. I began looking up as I walked past and noticed the branches changing over the following weeks. A familiar route became a little more interesting. I began making a brief note of the changes once a week. Sometimes there was little to record beyond the colour of the leaves or the shadow on the pavement. Looking at the earlier notes helped me notice how gradually the tree was changing. One morning, a worker was clearing fallen branches near the tree. I waited until the path was open and noticed a small bird moving between the remaining leaves. That detail would not have appeared in a quick photograph of the whole street. I added it to the week's note, along with the weather, and continued to work without turning the walk into a task that needed a perfect result.",family:"en-nature-01",length:"long"},{id:"en-nature-02",language:"en",topic:"nature",text:"The park was quiet after the rain, with small puddles along the path. We walked around them and watched a bird searching the grass near a bench. Farther ahead, the clouds opened enough for sunlight to reach the pond. We stayed there for a few minutes before continuing our walk towards the gate.",family:"en-nature-02",length:"short"},{id:"en-nature-02-medium",language:"en",topic:"nature",text:"The park was quiet after the rain, with small puddles along the path. We walked around them and watched a bird searching the grass near a bench. Farther ahead, the clouds opened enough for sunlight to reach the pond. We stayed there for a few minutes before continuing our walk towards the gate. Near the gate, we found a bench that had already dried in the sun. We sat there while the path became busier. A child stopped to look at a leaf floating in a puddle, and we watched it turn slowly each time the wind changed.",family:"en-nature-02",length:"medium"},{id:"en-nature-02-long",language:"en",topic:"nature",text:"The park was quiet after the rain, with small puddles along the path. We walked around them and watched a bird searching the grass near a bench. Farther ahead, the clouds opened enough for sunlight to reach the pond. We stayed there for a few minutes before continuing our walk towards the gate. Near the gate, we found a bench that had already dried in the sun. We sat there while the path became busier. A child stopped to look at a leaf floating in a puddle, and we watched it turn slowly each time the wind changed. On the way home, we chose a different exit and discovered a narrow path behind the flower beds. It joined the same street we used every day, though we had never noticed it from that side. We made a note to return when the ground was dry. The morning had not needed a long journey or a detailed plan to offer something unfamiliar.",family:"en-nature-02",length:"long"},{id:"en-nature-03",language:"en",topic:"nature",text:"We visited the community garden on a cool Sunday morning. A volunteer showed us where the paths ended and asked us to stay clear of the young plants. We helped carry empty pots to a shed and swept the steps near the entrance. Before leaving, we sat outside and enjoyed the quieter part of the morning.",family:"en-nature-03",length:"short"},{id:"en-nature-03-medium",language:"en",topic:"nature",text:"We visited the community garden on a cool Sunday morning. A volunteer showed us where the paths ended and asked us to stay clear of the young plants. We helped carry empty pots to a shed and swept the steps near the entrance. Before leaving, we sat outside and enjoyed the quieter part of the morning. Before leaving, we asked whether the volunteers needed help again the following week. They explained which jobs changed with the weather and which could be done indoors. We chose a short shift and wrote down where to meet so that nobody would have to search for us.",family:"en-nature-03",length:"medium"},{id:"en-nature-03-long",language:"en",topic:"nature",text:"We visited the community garden on a cool Sunday morning. A volunteer showed us where the paths ended and asked us to stay clear of the young plants. We helped carry empty pots to a shed and swept the steps near the entrance. Before leaving, we sat outside and enjoyed the quieter part of the morning. Before leaving, we asked whether the volunteers needed help again the following week. They explained which jobs changed with the weather and which could be done indoors. We chose a short shift and wrote down where to meet so that nobody would have to search for us. When we returned, rain had changed the plan. Instead of working outside, we cleaned small pots under the shelter and sorted them by size. Another volunteer showed us how to recognise the ones that were too damaged to reuse. The work was quieter than our first visit, but by the end of the morning the shelves were ready for the next group to use.",family:"en-nature-03",length:"long"},{id:"en-nature-04",language:"en",topic:"nature",text:"The wind became stronger as we climbed the last part of the hill. At the top, we put on our jackets and found a sheltered place to rest. The fields below looked smaller than we expected from the path. We ate our lunch, checked the time, and started down while there was still plenty of daylight.",family:"en-nature-04",length:"short"},{id:"en-nature-04-medium",language:"en",topic:"nature",text:"The wind became stronger as we climbed the last part of the hill. At the top, we put on our jackets and found a sheltered place to rest. The fields below looked smaller than we expected from the path. We ate our lunch, checked the time, and started down while there was still plenty of daylight. At a turning halfway down, we stopped to check that everyone was still together. The path was easy to recognise in daylight, but a fallen branch covered one sign. We moved around it carefully and waited until the slower walkers had reached the same point.",family:"en-nature-04",length:"medium"},{id:"en-nature-04-long",language:"en",topic:"nature",text:"The wind became stronger as we climbed the last part of the hill. At the top, we put on our jackets and found a sheltered place to rest. The fields below looked smaller than we expected from the path. We ate our lunch, checked the time, and started down while there was still plenty of daylight. At a turning halfway down, we stopped to check that everyone was still together. The path was easy to recognise in daylight, but a fallen branch covered one sign. We moved around it carefully and waited until the slower walkers had reached the same point. Back at the starting place, we checked our bags and made sure no cups or wrappers had been left behind. Someone compared the route with the times we had written down before setting off. The rest near the top had taken longer than expected, so we added that to our notes. For the next walk, we would leave a little earlier and keep the same generous margin for returning.",family:"en-nature-04",length:"long"},{id:"zh-travel-01",language:"zh",topic:"travel",text:"早上出门时，我发现公交站比平时安静。站牌显示下一班车还有一会儿才到，于是我走到雨棚下，把车票和水杯放进容易拿到的位置。车来了以后，我找到一个靠窗的座位，看着街边的店铺陆续开门，原本有些匆忙的心情也慢慢平静下来。",family:"zh-travel-01",length:"short"},{id:"zh-travel-01-medium",language:"zh",topic:"travel",text:"早上出门时，我发现公交站比平时安静。站牌显示下一班车还有一会儿才到，于是我走到雨棚下，把车票和水杯放进容易拿到的位置。车来了以后，我找到一个靠窗的座位，看着街边的店铺陆续开门，原本有些匆忙的心情也慢慢平静下来。下一站上来一位乘客，问这辆车是否经过医院。我和朋友一起看了车门上方的路线图，找出离医院最近的站点。她把站名记在纸上，又确认了一遍下车后应该往哪边走，随后坐到过道对面，安心等着到站。",family:"zh-travel-01",length:"medium"},{id:"zh-travel-01-long",language:"zh",topic:"travel",text:"早上出门时，我发现公交站比平时安静。站牌显示下一班车还有一会儿才到，于是我走到雨棚下，把车票和水杯放进容易拿到的位置。车来了以后，我找到一个靠窗的座位，看着街边的店铺陆续开门，原本有些匆忙的心情也慢慢平静下来。下一站上来一位乘客，问这辆车是否经过医院。我和朋友一起看了车门上方的路线图，找出离医院最近的站点。她把站名记在纸上，又确认了一遍下车后应该往哪边走，随后坐到过道对面，安心等着到站。车开了一会儿，司机提醒前方正在修路，需要临时绕行。那位乘客听见以后有些着急，我便替她问清楚新的下车位置。司机说，新站离医院侧门更近，只需要沿着路口右边走。临近到站时，我们把方向再说了一次。她下车后很快找到了路口，回头向车窗挥手。我这才收好路线图，发现原本熟悉的通勤路上，还有不少自己从未留意的地方。",family:"zh-travel-01",length:"long"},{id:"zh-travel-02",language:"zh",topic:"travel",text:"我们提前到了车站，先看清站台的位置，再去附近的小店买早餐。刚出炉的面包还有一点烫，大家便坐在长椅上慢慢吃。等到广播提醒检票，我们收好包装，把行李提到身边。这次没有一路奔跑，出发前反而多了一点聊天的时间。",family:"zh-travel-02",length:"short"},{id:"zh-travel-02-medium",language:"zh",topic:"travel",text:"我们提前到了车站，先看清站台的位置，再去附近的小店买早餐。刚出炉的面包还有一点烫，大家便坐在长椅上慢慢吃。等到广播提醒检票，我们收好包装，把行李提到身边。这次没有一路奔跑，出发前反而多了一点聊天的时间。上车以后，我们把车票上的站名和座位上方的路线对照了一遍，确认目的地就在山脚附近。早餐的包装先放进纸袋，车票则收进背包外侧的小口袋。这样需要检票时，不必再从食物和杂物之间翻找。",family:"zh-travel-02",length:"medium"},{id:"zh-travel-02-long",language:"zh",topic:"travel",text:"我们提前到了车站，先看清站台的位置，再去附近的小店买早餐。刚出炉的面包还有一点烫，大家便坐在长椅上慢慢吃。等到广播提醒检票，我们收好包装，把行李提到身边。这次没有一路奔跑，出发前反而多了一点聊天的时间。上车以后，我们把车票上的站名和座位上方的路线对照了一遍，确认目的地就在山脚附近。早餐的包装先放进纸袋，车票则收进背包外侧的小口袋。这样需要检票时，不必再从食物和杂物之间翻找。列车经过一片田地时停了下来，车厢里的人纷纷抬头看向窗外。广播随后说明，前方需要等待另一班列车通过。我们趁这段时间喝完水，把随身行李整理好，没有急着站到门口。到站后才发现，小车站的出口比想象中近，通往村子的路就在台阶旁边。提前整理省下的几分钟，让我们有时间看清指示牌，再从容地走向约好的地方。",family:"zh-travel-02",length:"long"},{id:"zh-travel-03",language:"zh",topic:"travel",text:"走出展馆时，雨刚好停了。朋友看了看地图，说：“不如沿着河边走回去吧。”我们挑了一条安静的小路，经过书店时又停下来看看橱窗。虽然比坐车多花了一些时间，却发现了几家以前没有留意过的小店，也聊完了一个有趣的话题。",family:"zh-travel-03",length:"short"},{id:"zh-travel-03-medium",language:"zh",topic:"travel",text:"走出展馆时，雨刚好停了。朋友看了看地图，说：“不如沿着河边走回去吧。”我们挑了一条安静的小路，经过书店时又停下来看看橱窗。虽然比坐车多花了一些时间，却发现了几家以前没有留意过的小店，也聊完了一个有趣的话题。回到住处后，我们向前台要了一张附近的纸地图。我把书店的位置画上圆圈，妹妹则补上刚才走过的河边小路。原来的行程表没有这两个地方，我们决定留出第二天上午的时间，慢慢回去看看。",family:"zh-travel-03",length:"medium"},{id:"zh-travel-03-long",language:"zh",topic:"travel",text:"走出展馆时，雨刚好停了。朋友看了看地图，说：“不如沿着河边走回去吧。”我们挑了一条安静的小路，经过书店时又停下来看看橱窗。虽然比坐车多花了一些时间，却发现了几家以前没有留意过的小店，也聊完了一个有趣的话题。回到住处后，我们向前台要了一张附近的纸地图。我把书店的位置画上圆圈，妹妹则补上刚才走过的河边小路。原来的行程表没有这两个地方，我们决定留出第二天上午的时间，慢慢回去看看。第二天吃过早餐，书店已经开门。店里有一道窄楼梯，通向摆满旧书的小房间，窗边还放着一张矮桌。我们各挑了一本容易随身携带的书，没有急着把整排书架都看完。店主用普通纸张包好书，又指给我们一条通往广场的小路。那张地图最后留在了包里，上面的几个圆圈记录了偶然发现的地方，比最初排得很满的行程更让人记得清楚。",family:"zh-travel-03",length:"long"},{id:"zh-travel-04",language:"zh",topic:"travel",text:"周末去海边之前，我们先查看天气，再把外套、饮水和简单的午餐装好。村口的路牌很清楚，每到一个岔路口，大家都会停下来确认方向。走到能看见海面的长椅旁，我们休息了一会儿。后面的路不远，慢慢走也能在中午之前到达。",family:"zh-travel-04",length:"short"},{id:"zh-travel-04-medium",language:"zh",topic:"travel",text:"周末去海边之前，我们先查看天气，再把外套、饮水和简单的午餐装好。村口的路牌很清楚，每到一个岔路口，大家都会停下来确认方向。走到能看见海面的长椅旁，我们休息了一会儿。后面的路不远，慢慢走也能在中午之前到达。海滩上还没有很多人，几户人家正在台阶附近铺开毛巾。我们在干燥的沙地放好鞋子，把水杯和外套放在一起。走近海边以前，大家又回头确认了一下上山小路的位置，免得回来时只顾着寻找自己的脚印。",family:"zh-travel-04",length:"medium"},{id:"zh-travel-04-long",language:"zh",topic:"travel",text:"周末去海边之前，我们先查看天气，再把外套、饮水和简单的午餐装好。村口的路牌很清楚，每到一个岔路口，大家都会停下来确认方向。走到能看见海面的长椅旁，我们休息了一会儿。后面的路不远，慢慢走也能在中午之前到达。海滩上还没有很多人，几户人家正在台阶附近铺开毛巾。我们在干燥的沙地放好鞋子，把水杯和外套放在一起。走近海边以前，大家又回头确认了一下上山小路的位置，免得回来时只顾着寻找自己的脚印。午后云层重新聚拢，海面吹来的风也凉了些。我们决定提前返回，没有等到下雨才收拾东西。走上坡时，一对游客正在岔路口看地图，我们便指给他们早上见过的路标。回到村里，大家找了张有遮挡的桌子，吃完剩下的水果。虽然在海边停留的时间比计划短，回程却很从容，也留出了慢慢查看照片和谈论沿途见闻的空闲。",family:"zh-travel-04",length:"long"},{id:"zh-food-01",language:"zh",topic:"food",text:"去菜市场之前，我先打开冰箱，看清家里还剩下什么。米饭和鸡蛋已经够了，只需要再买几样新鲜蔬菜。摊主帮我把番茄装进纸袋，我又挑了一小把青菜。按照清单买东西，提回家的袋子轻了不少，也不用担心买得太多吃不完。",family:"zh-food-01",length:"short"},{id:"zh-food-01-medium",language:"zh",topic:"food",text:"去菜市场之前，我先打开冰箱，看清家里还剩下什么。米饭和鸡蛋已经够了，只需要再买几样新鲜蔬菜。摊主帮我把番茄装进纸袋，我又挑了一小把青菜。按照清单买东西，提回家的袋子轻了不少，也不用担心买得太多吃不完。回家以后，我先把冰箱里较早买的蔬菜放到前面，新买的放在后面。晚饭要用的西红柿单独装进小碗，留在容易看到的位置。购物清单上的东西逐项划掉，剩下还没买的，也重新确认是否真的需要。",family:"zh-food-01",length:"medium"},{id:"zh-food-01-long",language:"zh",topic:"food",text:"去菜市场之前，我先打开冰箱，看清家里还剩下什么。米饭和鸡蛋已经够了，只需要再买几样新鲜蔬菜。摊主帮我把番茄装进纸袋，我又挑了一小把青菜。按照清单买东西，提回家的袋子轻了不少，也不用担心买得太多吃不完。回家以后，我先把冰箱里较早买的蔬菜放到前面，新买的放在后面。晚饭要用的西红柿单独装进小碗，留在容易看到的位置。购物清单上的东西逐项划掉，剩下还没买的，也重新确认是否真的需要。准备晚饭时，我发现最后一个洋葱已经不太新鲜，于是把原先的菜改成了西红柿炒鸡蛋。其他蔬菜还能留到下一餐，不必为了照着清单做饭再跑一趟。吃完后，我在下周的采购记录上补了一句，提醒自己先看看家里的存货。清单让准备更清楚，但愿意根据实际情况调整，也让这顿饭少了一些折腾，桌上最后没有留下吃不完的一大盘菜。",family:"zh-food-01",length:"long"},{id:"zh-food-02",language:"zh",topic:"food",text:"准备晚饭时，我先洗好蔬菜，把需要的碗和调料放在手边，再打开炉子。汤煮起来以后，正好可以收拾案板，把果皮和菜叶分开装好。等家人回到家，桌上已经摆好碗筷。厨房没有堆满东西，吃完饭后的清理也比以前轻松一些。",family:"zh-food-02",length:"short"},{id:"zh-food-02-medium",language:"zh",topic:"food",text:"准备晚饭时，我先洗好蔬菜，把需要的碗和调料放在手边，再打开炉子。汤煮起来以后，正好可以收拾案板，把果皮和菜叶分开装好。等家人回到家，桌上已经摆好碗筷。厨房没有堆满东西，吃完饭后的清理也比以前轻松一些。锅里的汤比预想中煮得慢，我把火调小，用勺子试了试胡萝卜是否已经变软。等待的时候，剩下的蔬菜被装进带盖的盒子，留作第二天的午餐。厨房里需要做的事不多，我便把刚才用过的台面擦干净。",family:"zh-food-02",length:"medium"},{id:"zh-food-02-long",language:"zh",topic:"food",text:"准备晚饭时，我先洗好蔬菜，把需要的碗和调料放在手边，再打开炉子。汤煮起来以后，正好可以收拾案板，把果皮和菜叶分开装好。等家人回到家，桌上已经摆好碗筷。厨房没有堆满东西，吃完饭后的清理也比以前轻松一些。锅里的汤比预想中煮得慢，我把火调小，用勺子试了试胡萝卜是否已经变软。等待的时候，剩下的蔬菜被装进带盖的盒子，留作第二天的午餐。厨房里需要做的事不多，我便把刚才用过的台面擦干净。邻居来归还盘子时，汤正好煮好了。我们请她尝了一小碗，坐在打开的厨房窗边聊了一会儿。她提起附近市场有个摊位，可以按少量搭配购买蔬菜，适合不想一次买太多的人。我把摊位的位置记在购物清单背面。等她离开以后，剩下的汤分成两份收好，锅和勺子也洗干净，第二天只需要按原先准备的顺序开始，就能很快做好午饭。",family:"zh-food-02",length:"long"},{id:"zh-food-03",language:"zh",topic:"food",text:"朋友们约好一起吃午饭，每个人负责带一道菜。我准备凉拌蔬菜，另一个朋友带来刚烤好的面包。大家把盘子放在桌子中间，边吃边聊最近的生活。饭菜很快吃完了，谈话却一直没有停，最后又一起商量下次见面时可以做些什么。",family:"zh-food-03",length:"short"},{id:"zh-food-03-medium",language:"zh",topic:"food",text:"朋友们约好一起吃午饭，每个人负责带一道菜。我准备凉拌蔬菜，另一个朋友带来刚烤好的面包。大家把盘子放在桌子中间，边吃边聊最近的生活。饭菜很快吃完了，谈话却一直没有停，最后又一起商量下次见面时可以做些什么。朋友们离开前，我们先把空盒子分给各自的主人，再把剩下的菜分成几份。有人提议记下这次带来的菜名，免得下次又有好几个人都准备沙拉。大家把愿意带的东西写在一起，分工并没有因此变得复杂。",family:"zh-food-03",length:"medium"},{id:"zh-food-03-long",language:"zh",topic:"food",text:"朋友们约好一起吃午饭，每个人负责带一道菜。我准备凉拌蔬菜，另一个朋友带来刚烤好的面包。大家把盘子放在桌子中间，边吃边聊最近的生活。饭菜很快吃完了，谈话却一直没有停，最后又一起商量下次见面时可以做些什么。朋友们离开前，我们先把空盒子分给各自的主人，再把剩下的菜分成几份。有人提议记下这次带来的菜名，免得下次又有好几个人都准备沙拉。大家把愿意带的东西写在一起，分工并没有因此变得复杂。下一次聚餐，一位朋友因为公交车晚点，没能准时到达。我们先吃需要趁热吃的菜，为她留了一份，也没有不停催问她到了哪里。她进门时，桌上仍有足够的食物可以分享。原定的一道菜换成了她在车站附近买的水果，大家觉得也很合适。那张小清单帮忙减少了重复准备，但真正让午餐轻松的，还是每个人都愿意照顾当天的实际情况。",family:"zh-food-03",length:"long"},{id:"zh-food-04",language:"zh",topic:"food",text:"图书馆旁边新开了一家小店，我还完书后进去坐了一会儿。店主问音乐会不会太响，我说：“这个位置刚刚好。”等早餐的时候，我打开随身带着的本子，把路上想到的事情记下来。窗外有人慢慢走过，店里的气氛也让人放松下来。",family:"zh-food-04",length:"short"},{id:"zh-food-04-medium",language:"zh",topic:"food",text:"图书馆旁边新开了一家小店，我还完书后进去坐了一会儿。店主问音乐会不会太响，我说：“这个位置刚刚好。”等早餐的时候，我打开随身带着的本子，把路上想到的事情记下来。窗外有人慢慢走过，店里的气氛也让人放松下来。早餐送来以后，我合上笔记本，把它挪到离杯子远一点的位置。店里渐渐热闹起来，店主打开了另一台收银机。我吃完后去柜台结账，顺便问了问通常哪个时段比较安静，方便下次约朋友过来坐坐。",family:"zh-food-04",length:"medium"},{id:"zh-food-04-long",language:"zh",topic:"food",text:"图书馆旁边新开了一家小店，我还完书后进去坐了一会儿。店主问音乐会不会太响，我说：“这个位置刚刚好。”等早餐的时候，我打开随身带着的本子，把路上想到的事情记下来。窗外有人慢慢走过，店里的气氛也让人放松下来。早餐送来以后，我合上笔记本，把它挪到离杯子远一点的位置。店里渐渐热闹起来，店主打开了另一台收银机。我吃完后去柜台结账，顺便问了问通常哪个时段比较安静，方便下次约朋友过来坐坐。过了一周，我和朋友选在下午再次来到这家店。上次的座位还空着，只是窗外的光线柔和了许多。我们先各自读了一会儿书，再讨论我第一次来时记下的几个想法。其中一个仍然值得试试，我们就把第一步写得具体些，约好周末各做一小部分。离开时，笔记本上多了几行能实际行动的内容，而不是一张越来越长却没有起点的计划表。",family:"zh-food-04",length:"long"},{id:"zh-work-01",language:"zh",topic:"work",text:"开始今天的工作之前，我先读了一遍昨天留下的笔记。其中有一个问题还没有确认，我便把它写进会议提纲，没有凭印象继续往下做。大家到齐后，先把这个问题说清楚，再分配后面的任务。每个人都知道下一步要做什么，下午少了许多来回询问。",family:"zh-work-01",length:"short"},{id:"zh-work-01-medium",language:"zh",topic:"work",text:"开始今天的工作之前，我先读了一遍昨天留下的笔记。其中有一个问题还没有确认，我便把它写进会议提纲，没有凭印象继续往下做。大家到齐后，先把这个问题说清楚，再分配后面的任务。每个人都知道下一步要做什么，下午少了许多来回询问。午饭后，同事发来一个更新过的例子，正好回答了上午还没说清楚的问题。我把它放在对应的说明旁边，并标明旧例子已经不再使用。大家打开同一份材料就能继续工作，不必在几段聊天之间来回比较。",family:"zh-work-01",length:"medium"},{id:"zh-work-01-long",language:"zh",topic:"work",text:"开始今天的工作之前，我先读了一遍昨天留下的笔记。其中有一个问题还没有确认，我便把它写进会议提纲，没有凭印象继续往下做。大家到齐后，先把这个问题说清楚，再分配后面的任务。每个人都知道下一步要做什么，下午少了许多来回询问。午饭后，同事发来一个更新过的例子，正好回答了上午还没说清楚的问题。我把它放在对应的说明旁边，并标明旧例子已经不再使用。大家打开同一份材料就能继续工作，不必在几段聊天之间来回比较。快下班时，我们重新对照了当天约定的步骤。其中一部分比预计花的时间长，负责的同事说明了原因，也提出先交付一个较简单的版本。我们把这个决定记在原计划旁边，而不是只留在口头讨论里。第二天有人回来接着处理，就能同时看到原来的安排、后来发生的变化和调整原因。记录只多了几行，却省去了重新找人追问的时间。",family:"zh-work-01",length:"long"},{id:"zh-work-02",language:"zh",topic:"work",text:"共享文件夹里的几个文件名称太相似，找一份旧报告经常要打开好几次。我们商量了一套简单的命名方法，把不再使用的副本移到归档目录。整理完成后，我试着寻找上个月的记录，很快就找到了。以后保存文件时，多写清楚一点，大家都能少花一些时间。",family:"zh-work-02",length:"short"},{id:"zh-work-02-medium",language:"zh",topic:"work",text:"共享文件夹里的几个文件名称太相似，找一份旧报告经常要打开好几次。我们商量了一套简单的命名方法，把不再使用的副本移到归档目录。整理完成后，我试着寻找上个月的记录，很快就找到了。以后保存文件时，多写清楚一点，大家都能少花一些时间。我们还补了一段简短说明，写清新文件应该放在哪里。没有参加讨论的同事试着保存一份 PDF，结果在两个名称接近的文件夹之间犹豫了。她的问题让我们发现了命名上的歧义，于是先改清楚，再移动剩余文件。",family:"zh-work-02",length:"medium"},{id:"zh-work-02-long",language:"zh",topic:"work",text:"共享文件夹里的几个文件名称太相似，找一份旧报告经常要打开好几次。我们商量了一套简单的命名方法，把不再使用的副本移到归档目录。整理完成后，我试着寻找上个月的记录，很快就找到了。以后保存文件时，多写清楚一点，大家都能少花一些时间。我们还补了一段简短说明，写清新文件应该放在哪里。没有参加讨论的同事试着保存一份 PDF，结果在两个名称接近的文件夹之间犹豫了。她的问题让我们发现了命名上的歧义，于是先改清楚，再移动剩余文件。接下来的一周，我们顺手记录仍然难找的文件。多数问题来自旧链接，而不是新目录本身。大家逐一更新团队笔记中的链接，并在原来的位置留下一句指向新目录的说明。到了周五，记录里不再出现新的同类问题。后来加入的人也能根据说明放好文件，不必先听一遍整理过程，目录的用途才真正变得清楚起来。",family:"zh-work-02",length:"long"},{id:"zh-work-03",language:"zh",topic:"work",text:"准备发送文档时，我发现其中一个日期和日程表对不上。我没有直接凭记忆修改，而是找到最初的记录，确认以后再把两处内容一起改好。发送前又从头检查了一遍，并在说明里写清这次调整。多花几分钟核对，可以让接手的人少一些疑惑。",family:"zh-work-03",length:"short"},{id:"zh-work-03-medium",language:"zh",topic:"work",text:"准备发送文档时，我发现其中一个日期和日程表对不上。我没有直接凭记忆修改，而是找到最初的记录，确认以后再把两处内容一起改好。发送前又从头检查了一遍，并在说明里写清这次调整。多花几分钟核对，可以让接手的人少一些疑惑。下午收到回复时，对方问起其中一段话的意思。我打开已经发送的 PDF，而没有继续看桌面上的旧草稿。双方对照同一个版本，才发现只需把一句话的先后顺序调整一下，就能减少原先的理解分歧。",family:"zh-work-03",length:"medium"},{id:"zh-work-03-long",language:"zh",topic:"work",text:"准备发送文档时，我发现其中一个日期和日程表对不上。我没有直接凭记忆修改，而是找到最初的记录，确认以后再把两处内容一起改好。发送前又从头检查了一遍，并在说明里写清这次调整。多花几分钟核对，可以让接手的人少一些疑惑。下午收到回复时，对方问起其中一段话的意思。我打开已经发送的 PDF，而没有继续看桌面上的旧草稿。双方对照同一个版本，才发现只需把一句话的先后顺序调整一下，就能减少原先的理解分歧。准备下一份文档前，我在自己的检查清单里加上日期和版本名称两项。检查并不长，忙的时候也能做完。一个月后，这个步骤帮助我发现了一处沿用旧月份的标题。内容本身已经更新，标题却还停在上一版，如果直接发出，读者就需要猜测究竟哪一处有效。我改好后再次通读，把最终文件和对应说明一起放回了固定的位置。",family:"zh-work-03",length:"long"},{id:"zh-work-04",language:"zh",topic:"work",text:"一项任务看起来很大，我们先把它拆成几个小部分，再挑最清楚的一部分开始。第一次尝试就发现少考虑了一个步骤，于是及时补进计划。那天上午完成的内容不多，但后面的安排变得明确了。大家也更容易判断哪些事情可以同时进行，哪些需要先等结果。",family:"zh-work-04",length:"short"},{id:"zh-work-04-medium",language:"zh",topic:"work",text:"一项任务看起来很大，我们先把它拆成几个小部分，再挑最清楚的一部分开始。第一次尝试就发现少考虑了一个步骤，于是及时补进计划。那天上午完成的内容不多，但后面的安排变得明确了。大家也更容易判断哪些事情可以同时进行，哪些需要先等结果。中午，我们把完成的部分放到最初的提纲旁边比较。一节写得过长，另一节却缺少具体例子。下午的任务因此作了小调整，先补齐这些缺口，再删去重复的解释，而不是给每个部分都继续增加内容。",family:"zh-work-04",length:"medium"},{id:"zh-work-04-long",language:"zh",topic:"work",text:"一项任务看起来很大，我们先把它拆成几个小部分，再挑最清楚的一部分开始。第一次尝试就发现少考虑了一个步骤，于是及时补进计划。那天上午完成的内容不多，但后面的安排变得明确了。大家也更容易判断哪些事情可以同时进行，哪些需要先等结果。中午，我们把完成的部分放到最初的提纲旁边比较。一节写得过长，另一节却缺少具体例子。下午的任务因此作了小调整，先补齐这些缺口，再删去重复的解释，而不是给每个部分都继续增加内容。第二天的检查重点，是没参加过讨论的人能否顺着材料完成第一步。我们请一位同事先看说明，再说说她准备如何开始。她的回答让我们发现，有一句指令仍然太含糊。大家把那句话改得具体些，再请她试一次。第一天做出的简单样例始终放在旁边，帮助我们对照实际结果。整个任务没有一次成形，但每次修改都有清楚的依据。",family:"zh-work-04",length:"long"},{id:"zh-learning-01",language:"zh",topic:"learning",text:"学习新内容时，我会在旁边放一本小笔记本。不是把每句话都抄下来，而是记住主要意思，再写一个自己能够解释的例子。当天结束前，我试着合上书重新说一遍。说不清楚的地方就留下一个问题，等下一次学习时再有针对性地查找答案。",family:"zh-learning-01",length:"short"},{id:"zh-learning-01-medium",language:"zh",topic:"learning",text:"学习新内容时，我会在旁边放一本小笔记本。不是把每句话都抄下来，而是记住主要意思，再写一个自己能够解释的例子。当天结束前，我试着合上书重新说一遍。说不清楚的地方就留下一个问题，等下一次学习时再有针对性地查找答案。过了一周，我翻回笔记本最前面的几页。有些问题已经能说清楚，有些仍然缺少合适的例子。我用另一种颜色标出真正理解的部分，把还不确定的内容留在原处，准备下次有时间时继续查证。",family:"zh-learning-01",length:"medium"},{id:"zh-learning-01-long",language:"zh",topic:"learning",text:"学习新内容时，我会在旁边放一本小笔记本。不是把每句话都抄下来，而是记住主要意思，再写一个自己能够解释的例子。当天结束前，我试着合上书重新说一遍。说不清楚的地方就留下一个问题，等下一次学习时再有针对性地查找答案。过了一周，我翻回笔记本最前面的几页。有些问题已经能说清楚，有些仍然缺少合适的例子。我用另一种颜色标出真正理解的部分，把还不确定的内容留在原处，准备下次有时间时继续查证。朋友问起最近在学什么时，我试着用笔记里的例子向她解释。她听懂了主要意思，却又问了一个我之前忽略的细节。我把这个问题补在旁边，没有为了让页面整齐就重新抄写整段内容。随着学习继续，笔记渐渐变成理解过程的记录：哪些已经明确，哪些还需要思考，都能一眼看见。它也不再只是从课程里复制下来的句子集合。",family:"zh-learning-01",length:"long"},{id:"zh-learning-02",language:"zh",topic:"learning",text:"一道练习看起来很简单，我却连续两次做错了同一个地方。停下来重新阅读要求后，才发现自己漏看了一个细节。第三次尝试时，我放慢速度，每做完一步就检查一下。虽然用的时间更多，但终于明白了出错的原因，也知道下次应该注意什么。",family:"zh-learning-02",length:"short"},{id:"zh-learning-02-medium",language:"zh",topic:"learning",text:"一道练习看起来很简单，我却连续两次做错了同一个地方。停下来重新阅读要求后，才发现自己漏看了一个细节。第三次尝试时，我放慢速度，每做完一步就检查一下。虽然用的时间更多，但终于明白了出错的原因，也知道下次应该注意什么。我把错误答案和改正后的答案放在一起，圈出从哪一步开始出现不同。这样再碰到类似问题时，就能更快认出原来的误区。下一道题虽然换了数字，我仍然可以使用同一个检查方法，而不用照抄上一题。",family:"zh-learning-02",length:"medium"},{id:"zh-learning-02-long",language:"zh",topic:"learning",text:"一道练习看起来很简单，我却连续两次做错了同一个地方。停下来重新阅读要求后，才发现自己漏看了一个细节。第三次尝试时，我放慢速度，每做完一步就检查一下。虽然用的时间更多，但终于明白了出错的原因，也知道下次应该注意什么。我把错误答案和改正后的答案放在一起，圈出从哪一步开始出现不同。这样再碰到类似问题时，就能更快认出原来的误区。下一道题虽然换了数字，我仍然可以使用同一个检查方法，而不用照抄上一题。练习快结束时，我找了一道相近的问题，先把例子合上再独立做一遍。走到之前漏掉的步骤，我停下来，试着把原因说完整，然后才继续计算。答案正确了，速度却还不算快。我没有为了多做几题立刻往下赶，而是把一个新问题留给第二天。桌上的两份答案也一起收好，方便下次回顾自己究竟改进了哪里。",family:"zh-learning-02",length:"long"},{id:"zh-learning-03",language:"zh",topic:"learning",text:"我们每周在图书馆碰面一次，每个人带来一个学习中遇到的问题。轮到自己时，先说明已经尝试过哪些办法，再请其他人补充。有时一个具体的例子，比很长的解释更容易理解。离开之前，大家各自选一件小事继续练习，下次再交流新的发现。",family:"zh-learning-03",length:"short"},{id:"zh-learning-03-medium",language:"zh",topic:"learning",text:"我们每周在图书馆碰面一次，每个人带来一个学习中遇到的问题。轮到自己时，先说明已经尝试过哪些办法，再请其他人补充。有时一个具体的例子，比很长的解释更容易理解。离开之前，大家各自选一件小事继续练习，下次再交流新的发现。下次见面时，两位同学用相似的方法得到了不同答案。我们把过程并排放在桌上，一行一行地比较，才发现大家对题目里的一个词有不同理解。先说清这个词的意思，比急着判断谁对谁错更有帮助。",family:"zh-learning-03",length:"medium"},{id:"zh-learning-03-long",language:"zh",topic:"learning",text:"我们每周在图书馆碰面一次，每个人带来一个学习中遇到的问题。轮到自己时，先说明已经尝试过哪些办法，再请其他人补充。有时一个具体的例子，比很长的解释更容易理解。离开之前，大家各自选一件小事继续练习，下次再交流新的发现。下次见面时，两位同学用相似的方法得到了不同答案。我们把过程并排放在桌上，一行一行地比较，才发现大家对题目里的一个词有不同理解。先说清这个词的意思，比急着判断谁对谁错更有帮助。从那以后，我们约定在答案旁边写出自己的假设，方便讨论时看见差别。平时话不多的一位同学，举了一个工作中遇到的例子，让那句原本抽象的说明变得容易理解。我们把例子和必要的解释记进共同笔记。离开前，每个人只选一个新问题带回去研究，下一次见面仍然保持小范围讨论，让每个人都有时间讲清自己的想法。",family:"zh-learning-03",length:"long"},{id:"zh-learning-04",language:"zh",topic:"learning",text:"我想养成每天练习的习惯，便把时间安排在早餐之后。先用十分钟复习一小段内容，再打开其他应用处理事情。有些早晨状态不错，有些早晨只能完成最基本的部分。因为任务不大，即使前一天比较忙，第二天也容易重新开始，不必一直等到有整块空闲。",family:"zh-learning-04",length:"short"},{id:"zh-learning-04-medium",language:"zh",topic:"learning",text:"我想养成每天练习的习惯，便把时间安排在早餐之后。先用十分钟复习一小段内容，再打开其他应用处理事情。有些早晨状态不错，有些早晨只能完成最基本的部分。因为任务不大，即使前一天比较忙，第二天也容易重新开始，不必一直等到有整块空闲。两周后，有一天早上需要提前出门，我没能按时练习。晚上回家时，我没有要求自己把漏掉的时间全部补回来，只把笔记本放到早餐碗旁边。第二天看到它，就能顺着原来的节奏继续，不必重新作决定。",family:"zh-learning-04",length:"medium"},{id:"zh-learning-04-long",language:"zh",topic:"learning",text:"我想养成每天练习的习惯，便把时间安排在早餐之后。先用十分钟复习一小段内容，再打开其他应用处理事情。有些早晨状态不错，有些早晨只能完成最基本的部分。因为任务不大，即使前一天比较忙，第二天也容易重新开始，不必一直等到有整块空闲。两周后，有一天早上需要提前出门，我没能按时练习。晚上回家时，我没有要求自己把漏掉的时间全部补回来，只把笔记本放到早餐碗旁边。第二天看到它，就能顺着原来的节奏继续，不必重新作决定。后面的内容逐渐变难，有一课需要比十分钟更长的时间。我便在一个意思完整的位置停下，写一句下次从哪里开始，再把书合上。短练习因此仍然有清楚的起点和终点，没有变成另一件悬着的事情。月底回看笔记时，几道曾经反复卡住我的问题已经能够解释。进度不是每天都一样，但这段过程留下了可以检查的变化。",family:"zh-learning-04",length:"long"},{id:"zh-reading-01",language:"zh",topic:"reading",text:"借来的书在封面内侧印着一张地图，刚开始我没有仔细看。读到后面，人物走过的地点越来越多，我便翻回去对照路线。几个陌生的地名渐渐熟悉起来，不同章节之间的联系也清楚了。这次读得比平时慢，却注意到了许多原本可能忽略的细节。",family:"zh-reading-01",length:"short"},{id:"zh-reading-01-medium",language:"zh",topic:"reading",text:"借来的书在封面内侧印着一张地图，刚开始我没有仔细看。读到后面，人物走过的地点越来越多，我便翻回去对照路线。几个陌生的地名渐渐熟悉起来，不同章节之间的联系也清楚了。这次读得比平时慢，却注意到了许多原本可能忽略的细节。有天晚上，我发现地图上的一处地名，在前面的章节里用了不同称呼。我往前翻了几页，才知道名字变化本身就是故事的一部分。留意地点并不只是帮助记路，也让我更容易明白人物为什么要离开。",family:"zh-reading-01",length:"medium"},{id:"zh-reading-01-long",language:"zh",topic:"reading",text:"借来的书在封面内侧印着一张地图，刚开始我没有仔细看。读到后面，人物走过的地点越来越多，我便翻回去对照路线。几个陌生的地名渐渐熟悉起来，不同章节之间的联系也清楚了。这次读得比平时慢，却注意到了许多原本可能忽略的细节。有天晚上，我发现地图上的一处地名，在前面的章节里用了不同称呼。我往前翻了几页，才知道名字变化本身就是故事的一部分。留意地点并不只是帮助记路，也让我更容易明白人物为什么要离开。读完全书后，我在一张旧纸背面画了大致路线。它没有照搬书中的地图，只标出了自己记得最清楚的场景。朋友听到其中一个地方的描述，便向我借这本书。我把纸留在封面里面，同时告诉她，这只是我的阅读记录，不是正式的路线说明。后来她还书时，也在空白处补了一个印象深刻的位置，让同一张图多了一种观察角度。",family:"zh-reading-01",length:"long"},{id:"zh-reading-02",language:"zh",topic:"reading",text:"图书馆入口摆着一排工作人员推荐的书，其中一本讲的是我不太熟悉的话题。我随手翻开第一页，发现文字很清楚，不需要先知道很多背景也能读下去。最后，除了原本打算借的小说，我还把这本书带回了家，准备每天看上一小段。",family:"zh-reading-02",length:"short"},{id:"zh-reading-02-medium",language:"zh",topic:"reading",text:"图书馆入口摆着一排工作人员推荐的书，其中一本讲的是我不太熟悉的话题。我随手翻开第一页，发现文字很清楚，不需要先知道很多背景也能读下去。最后，除了原本打算借的小说，我还把这本书带回了家，准备每天看上一小段。书里原本陌生的主题，意外地和我每天散步时注意到的一件小事联系起来。我在那一页放上书签，回家后又读了一遍解释。这个具体的联系让我愿意继续往后看，而不只是因为封面上的推荐语。",family:"zh-reading-02",length:"medium"},{id:"zh-reading-02-long",language:"zh",topic:"reading",text:"图书馆入口摆着一排工作人员推荐的书，其中一本讲的是我不太熟悉的话题。我随手翻开第一页，发现文字很清楚，不需要先知道很多背景也能读下去。最后，除了原本打算借的小说，我还把这本书带回了家，准备每天看上一小段。书里原本陌生的主题，意外地和我每天散步时注意到的一件小事联系起来。我在那一页放上书签，回家后又读了一遍解释。这个具体的联系让我愿意继续往后看，而不只是因为封面上的推荐语。还书那天，我到同一排书架寻找下一本。这次先看目录，再读一小段内容。有些书默认读者已经了解很多背景，我便选了一本例子较短、配图清楚的。最初的推荐帮我打开了一个新主题，而接下来的选择，需要我自己判断哪种解释适合当前的程度。走出图书馆时，我仍然只借了两本，留出足够时间真正把它们读完。",family:"zh-reading-02",length:"long"},{id:"zh-reading-03",language:"zh",topic:"reading",text:"我和朋友约好在周末读完同一篇故事。星期一见面时，才发现我们注意到的地方完全不同。我几乎没有印象的一段对话，竟然改变了他对结尾的理解。听完他的解释，我又把那几页翻出来读了一遍。一本书没有变，读过之后的感受却多了一层。",family:"zh-reading-03",length:"short"},{id:"zh-reading-03-medium",language:"zh",topic:"reading",text:"我和朋友约好在周末读完同一篇故事。星期一见面时，才发现我们注意到的地方完全不同。我几乎没有印象的一段对话，竟然改变了他对结尾的理解。听完他的解释，我又把那几页翻出来读了一遍。一本书没有变，读过之后的感受却多了一层。我们约好下次讨论时，各自选一小段印象深刻的文字带来。为了作选择，阅读时就要重新注意具体用词，而不只是记住故事大意。这样说起不同看法时，双方都能指出是哪一处细节影响了自己的判断。",family:"zh-reading-03",length:"medium"},{id:"zh-reading-03-long",language:"zh",topic:"reading",text:"我和朋友约好在周末读完同一篇故事。星期一见面时，才发现我们注意到的地方完全不同。我几乎没有印象的一段对话，竟然改变了他对结尾的理解。听完他的解释，我又把那几页翻出来读了一遍。一本书没有变，读过之后的感受却多了一层。我们约好下次讨论时，各自选一小段印象深刻的文字带来。为了作选择，阅读时就要重新注意具体用词，而不只是记住故事大意。这样说起不同看法时，双方都能指出是哪一处细节影响了自己的判断。第二次讨论比之前短，却更容易把问题说清楚。对于某个人物的决定，我们仍然没有得出相同结论，也没有急着找一个能结束争论的标准答案。大家把各自看到的线索放在一起，又重新读了相关的几句话。后来我借了同一位作者的另一篇故事，想看看那些看似安静的细节，是否还会在结尾处发挥类似的作用。",family:"zh-reading-03",length:"long"},{id:"zh-reading-04",language:"zh",topic:"reading",text:"以前我常常同时翻看好几本书，每一本都停在不同的地方。这个月，我只选一本放在椅子旁边，其余的先收回书架。每天晚上读几页，故事反而更容易接得上。读完以后，我在本子里记下最喜欢的一段情节，也写了一个还想继续思考的问题。",family:"zh-reading-04",length:"short"},{id:"zh-reading-04-medium",language:"zh",topic:"reading",text:"以前我常常同时翻看好几本书，每一本都停在不同的地方。这个月，我只选一本放在椅子旁边，其余的先收回书架。每天晚上读几页，故事反而更容易接得上。读完以后，我在本子里记下最喜欢的一段情节，也写了一个还想继续思考的问题。笔记只有几行，却让我记住了自己为什么喜欢那个结尾。还书前，我把纸夹在封面里面。选择下一本时，我特意找了篇幅短一点的作品，希望忙碌的晚上也能找到自然的停顿处，不必每次都勉强多读。",family:"zh-reading-04",length:"medium"},{id:"zh-reading-04-long",language:"zh",topic:"reading",text:"以前我常常同时翻看好几本书，每一本都停在不同的地方。这个月，我只选一本放在椅子旁边，其余的先收回书架。每天晚上读几页，故事反而更容易接得上。读完以后，我在本子里记下最喜欢的一段情节，也写了一个还想继续思考的问题。笔记只有几行，却让我记住了自己为什么喜欢那个结尾。还书前，我把纸夹在封面里面。选择下一本时，我特意找了篇幅短一点的作品，希望忙碌的晚上也能找到自然的停顿处，不必每次都勉强多读。有一晚我实在太累，连很短的一章也没能跟上情节。我把书签放回原处就停下，没有把这当成习惯失败。第二天重新打开时，先往前读了一页，找回当时的场景，再继续后面的内容。只把一本书留在手边，仍然让选择变简单，但比每天读相同页数更有用的，是给自己留下一个容易回来继续的位置。",family:"zh-reading-04",length:"long"},{id:"zh-home-01",language:"zh",topic:"home",text:"书桌上的台灯离书本太远，晚上看东西有些费力。我先调整灯的位置，再收起桌面上用不到的旧纸，只留下本子和一支笔。房间没有大幅改变，桌子却方便了许多。需要记录事情时，不必先搬开一堆杂物，收工以后也能很快整理回原来的样子。",family:"zh-home-01",length:"short"},{id:"zh-home-01-medium",language:"zh",topic:"home",text:"书桌上的台灯离书本太远，晚上看东西有些费力。我先调整灯的位置，再收起桌面上用不到的旧纸，只留下本子和一支笔。房间没有大幅改变，桌子却方便了许多。需要记录事情时，不必先搬开一堆杂物，收工以后也能很快整理回原来的样子。用了几天以后，我又检查了一次桌边的空间。灯的位置合适了，椅子拉开时却会挡住抽屉。我把桌子稍微向旁边挪了一点，让人坐下时也能拿到常用物品，经过桌边的人不需要侧着身子绕过去。",family:"zh-home-01",length:"medium"},{id:"zh-home-01-long",language:"zh",topic:"home",text:"书桌上的台灯离书本太远，晚上看东西有些费力。我先调整灯的位置，再收起桌面上用不到的旧纸，只留下本子和一支笔。房间没有大幅改变，桌子却方便了许多。需要记录事情时，不必先搬开一堆杂物，收工以后也能很快整理回原来的样子。用了几天以后，我又检查了一次桌边的空间。灯的位置合适了，椅子拉开时却会挡住抽屉。我把桌子稍微向旁边挪了一点，让人坐下时也能拿到常用物品，经过桌边的人不需要侧着身子绕过去。周末朋友来家里，借用桌子写了一张便条。她问水杯能放在哪里，我才发现桌面虽然整齐，却没有留出可以临时放东西的空位。我把一叠 A4 纸移到旁边的架子上，空出靠外的一角。房间并没有因此换一种样子，只是常见的小动作不再需要先搬开几件物品。几天后自己坐回桌前，也能明显感觉到这些细小调整带来的方便。",family:"zh-home-01",length:"long"},{id:"zh-home-02",language:"zh",topic:"home",text:"下雨的下午，我们决定整理门口的柜子。空盒子放在一边，还会用到的东西重新分类，准备送人的物品另外装袋。一条找了很久的围巾，原来压在旧背包后面。整理结束后，柜门终于可以轻松关上，常用的雨伞和购物袋也都有了固定的位置。",family:"zh-home-02",length:"short"},{id:"zh-home-02-medium",language:"zh",topic:"home",text:"下雨的下午，我们决定整理门口的柜子。空盒子放在一边，还会用到的东西重新分类，准备送人的物品另外装袋。一条找了很久的围巾，原来压在旧背包后面。整理结束后，柜门终于可以轻松关上，常用的雨伞和购物袋也都有了固定的位置。整理最后一层时，我们又找到一盒备用纽扣和几把散放的钥匙。纽扣按用途装进小袋，钥匙则逐一确认对应哪把锁。暂时认不出来的东西先留在浅盘里，等家人回来一起看，没有随手重新塞进柜子深处。",family:"zh-home-02",length:"medium"},{id:"zh-home-02-long",language:"zh",topic:"home",text:"下雨的下午，我们决定整理门口的柜子。空盒子放在一边，还会用到的东西重新分类，准备送人的物品另外装袋。一条找了很久的围巾，原来压在旧背包后面。整理结束后，柜门终于可以轻松关上，常用的雨伞和购物袋也都有了固定的位置。整理最后一层时，我们又找到一盒备用纽扣和几把散放的钥匙。纽扣按用途装进小袋，钥匙则逐一确认对应哪把锁。暂时认不出来的东西先留在浅盘里，等家人回来一起看，没有随手重新塞进柜子深处。晚上大家检查浅盘，才发现其中一把钥匙属于旧自行车锁，另一把是很少打开的小柜子。我们把它们分别放回对应物品旁边，又商量了剩余零件的固定位置。过了一周，外套掉了一颗纽扣，找备用纽扣只花了一会儿。家里的人都记得同一个存放位置，不必像以前那样，各自在不同抽屉里翻找一遍才碰巧找到。",family:"zh-home-02",length:"long"},{id:"zh-home-03",language:"zh",topic:"home",text:"窗台上的小植物一直朝着有光的方向倾斜。我把花盆轻轻转了一个方向，又移开挡在旁边的几本书。接下来的几天，我留意叶子的变化，也看看泥土是不是太干。照顾这一小块地方以后，我开始注意到一天里不同时间的光线，房间也显得更有生气。",family:"zh-home-03",length:"short"},{id:"zh-home-03-medium",language:"zh",topic:"home",text:"窗台上的小植物一直朝着有光的方向倾斜。我把花盆轻轻转了一个方向，又移开挡在旁边的几本书。接下来的几天，我留意叶子的变化，也看看泥土是不是太干。照顾这一小块地方以后，我开始注意到一天里不同时间的光线，房间也显得更有生气。我在花盆旁放了一张小卡片，记下日期，每天吃早餐时顺便看一眼。泥土并不是每天都以相同速度变干，所以我没有只按习惯浇水，而是先看看叶子、土壤和窗边的光线，再决定当天需要做什么。",family:"zh-home-03",length:"medium"},{id:"zh-home-03-long",language:"zh",topic:"home",text:"窗台上的小植物一直朝着有光的方向倾斜。我把花盆轻轻转了一个方向，又移开挡在旁边的几本书。接下来的几天，我留意叶子的变化，也看看泥土是不是太干。照顾这一小块地方以后，我开始注意到一天里不同时间的光线，房间也显得更有生气。我在花盆旁放了一张小卡片，记下日期，每天吃早餐时顺便看一眼。泥土并不是每天都以相同速度变干，所以我没有只按习惯浇水，而是先看看叶子、土壤和窗边的光线，再决定当天需要做什么。有个周末要外出，我请邻居帮忙照看这盆植物。临走前留下简短说明，介绍平时摆放的位置，也让她看了我是如何检查土壤的。回来时，一片新叶刚开始展开。我们把它和之前拍的照片比较了一下，再把花盆稍微挪开，为长大的叶子留出空间。这件小事不需要复杂安排，但说明写得清楚，别人接手时就不用猜测我的意思。",family:"zh-home-03",length:"long"},{id:"zh-home-04",language:"zh",topic:"home",text:"睡觉之前，我把钥匙和背包放到门口固定的位置，再看看第二天出门需要带什么。水杯装好，借来的书也提前放进包里。这些事情只花了一点时间，却省去了早晨翻找的麻烦。起床后可以从容吃完早餐，不必一边穿鞋，一边回想还有什么没有拿。",family:"zh-home-04",length:"short"},{id:"zh-home-04-medium",language:"zh",topic:"home",text:"睡觉之前，我把钥匙和背包放到门口固定的位置，再看看第二天出门需要带什么。水杯装好，借来的书也提前放进包里。这些事情只花了一点时间，却省去了早晨翻找的麻烦。起床后可以从容吃完早餐，不必一边穿鞋，一边回想还有什么没有拿。走到车站时，我想起准备借给朋友的书还在家里的架子上。事情并不着急，我便先记下来，提醒晚上装进包里。固定的准备习惯能够减少遗漏，但也需要根据第二天真正要做的事，作一点小调整。",family:"zh-home-04",length:"medium"},{id:"zh-home-04-long",language:"zh",topic:"home",text:"睡觉之前，我把钥匙和背包放到门口固定的位置，再看看第二天出门需要带什么。水杯装好，借来的书也提前放进包里。这些事情只花了一点时间，却省去了早晨翻找的麻烦。起床后可以从容吃完早餐，不必一边穿鞋，一边回想还有什么没有拿。走到车站时，我想起准备借给朋友的书还在家里的架子上。事情并不着急，我便先记下来，提醒晚上装进包里。固定的准备习惯能够减少遗漏，但也需要根据第二天真正要做的事，作一点小调整。当天晚上，我在钥匙旁放了一张卡片，只写第二天与平常不同的两件事：还书，以及回家时取一件包裹。看过卡片后，我换了一个装得下两样东西的袋子。第二天办完事情，就把这张提醒收走，没有让过期的便条继续堆在门边。留下来的位置仍然简单清楚，需要带走的东西很容易看见，新的提醒也不会被旧纸条遮住。",family:"zh-home-04",length:"long"},{id:"zh-hobbies-01",language:"zh",topic:"hobbies",text:"周末散步时，我带上相机，却没有特意安排要去哪里。走到熟悉的街角，阳光刚好照在一面旧墙上，树枝的影子形成了有趣的图案。我等路人走过以后拍了一张照片。原来不一定要去很远的地方，放慢脚步，也能在日常路线里发现新的画面。",family:"zh-hobbies-01",length:"short"},{id:"zh-hobbies-01-medium",language:"zh",topic:"hobbies",text:"周末散步时，我带上相机，却没有特意安排要去哪里。走到熟悉的街角，阳光刚好照在一面旧墙上，树枝的影子形成了有趣的图案。我等路人走过以后拍了一张照片。原来不一定要去很远的地方，放慢脚步，也能在日常路线里发现新的画面。回家查看照片时，我只挑出几张最能表达当时观察的作品，其余先放进另一个文件夹。选得少一些，反而更容易比较光线、人物位置和画面边缘的差别，不至于在许多相似照片之间来回切换。",family:"zh-hobbies-01",length:"medium"},{id:"zh-hobbies-01-long",language:"zh",topic:"hobbies",text:"周末散步时，我带上相机，却没有特意安排要去哪里。走到熟悉的街角，阳光刚好照在一面旧墙上，树枝的影子形成了有趣的图案。我等路人走过以后拍了一张照片。原来不一定要去很远的地方，放慢脚步，也能在日常路线里发现新的画面。回家查看照片时，我只挑出几张最能表达当时观察的作品，其余先放进另一个文件夹。选得少一些，反而更容易比较光线、人物位置和画面边缘的差别，不至于在许多相似照片之间来回切换。我先让朋友自己看这几张照片，没有立刻解释拍摄时的想法。她注意到的细节和我预想的不一样，我们因此重新观察了整个画面。讨论以后，大家决定下次再走一次同样的路线，试试换个时段会看到什么。熟悉的地点仍然可以重新拍摄，变化的不只是光线，也包括我们愿意停下来观察哪里，以及如何从许多画面里选出真正想留下的一张。",family:"zh-hobbies-01",length:"long"},{id:"zh-hobbies-02",language:"zh",topic:"hobbies",text:"球队练习开始时，我们先站得近一些，轮流把球传给旁边的人。等大家找到节奏，再慢慢拉开距离。有几次传球偏了，捡回来重新试就好。练习结束前又踢了一场短比赛，平时不太主动的队友也开始举手要球，场上的配合比刚来时自然了不少。",family:"zh-hobbies-02",length:"short"},{id:"zh-hobbies-02-medium",language:"zh",topic:"hobbies",text:"球队练习开始时，我们先站得近一些，轮流把球传给旁边的人。等大家找到节奏，再慢慢拉开距离。有几次传球偏了，捡回来重新试就好。练习结束前又踢了一场短比赛，平时不太主动的队友也开始举手要球，场上的配合比刚来时自然了不少。下一次训练前，我检查了球和其他用品，把需要带走的东西集中放在一个袋子里。大家还提前约好结束时间，免得玩到最后才匆忙收拾。到场以后，简单活动一下就能开始，不用再四处借找遗漏的物品。",family:"zh-hobbies-02",length:"medium"},{id:"zh-hobbies-02-long",language:"zh",topic:"hobbies",text:"球队练习开始时，我们先站得近一些，轮流把球传给旁边的人。等大家找到节奏，再慢慢拉开距离。有几次传球偏了，捡回来重新试就好。练习结束前又踢了一场短比赛，平时不太主动的队友也开始举手要球，场上的配合比刚来时自然了不少。下一次训练前，我检查了球和其他用品，把需要带走的东西集中放在一个袋子里。大家还提前约好结束时间，免得玩到最后才匆忙收拾。到场以后，简单活动一下就能开始，不用再四处借找遗漏的物品。有位朋友提出一种新玩法，需要的场地比当天能用的空间大。我们先缩小范围试了一轮，看清哪些部分值得保留，再继续原来的传球练习。这样既没有因为新主意打乱整个安排，也给下一次活动留下了可以尝试的内容。结束时，大家把用品放回固定位置，记下下次需要多带的东西，再一起走出球场，训练没有在忙乱的收尾中结束。",family:"zh-hobbies-02",length:"long"},{id:"zh-hobbies-03",language:"zh",topic:"hobbies",text:"很久没有画画，我决定先画桌上的一只杯子。第一张的线条有些歪，但已经能看出杯柄应该往哪里调整。我换了一页纸，再仔细观察一次。这次没有急着擦掉所有错误，而是把两张画都留下来。放在一起比较，反而更容易发现自己进步的地方。",family:"zh-hobbies-03",length:"short"},{id:"zh-hobbies-03-medium",language:"zh",topic:"hobbies",text:"很久没有画画，我决定先画桌上的一只杯子。第一张的线条有些歪，但已经能看出杯柄应该往哪里调整。我换了一页纸，再仔细观察一次。这次没有急着擦掉所有错误，而是把两张画都留下来。放在一起比较，反而更容易发现自己进步的地方。我把第一次画的草图也保存下来，没有因为线条不准就扔掉。过了一周，把它和新画并排放着，变化比单看一张时清楚。还有一些地方不够自然，但我已经能指出下一次最想练习的是杯口的形状。",family:"zh-hobbies-03",length:"medium"},{id:"zh-hobbies-03-long",language:"zh",topic:"hobbies",text:"很久没有画画，我决定先画桌上的一只杯子。第一张的线条有些歪，但已经能看出杯柄应该往哪里调整。我换了一页纸，再仔细观察一次。这次没有急着擦掉所有错误，而是把两张画都留下来。放在一起比较，反而更容易发现自己进步的地方。我把第一次画的草图也保存下来，没有因为线条不准就扔掉。过了一周，把它和新画并排放着，变化比单看一张时清楚。还有一些地方不够自然，但我已经能指出下一次最想练习的是杯口的形状。再画时，我换成轮廓更简单的物品，只使用桌上已经准备好的纸和铅笔。选择少了，注意力更容易放在需要改进的地方。画完以后，我在背面写上日期，把它放到旧草图旁边。慢慢积累的这几张纸，记录了每次观察和修改的过程，包括那些不太成功的尝试。回看时，我不用只凭印象判断自己是否进步，也不必让每一张都成为完成度很高的作品。",family:"zh-hobbies-03",length:"long"},{id:"zh-hobbies-04",language:"zh",topic:"hobbies",text:"朋友来家里做客时，我们选了一个规则简单的桌面游戏。一个人负责读说明，其他人把卡片和棋子摆好。先试着玩了一轮，大家就明白了基本方法。后面每一局都换个座位，有时精心准备的计划突然落空，也有时一次随手的选择带来了意外的结果。",family:"zh-hobbies-04",length:"short"},{id:"zh-hobbies-04-medium",language:"zh",topic:"hobbies",text:"朋友来家里做客时，我们选了一个规则简单的桌面游戏。一个人负责读说明，其他人把卡片和棋子摆好。先试着玩了一轮，大家就明白了基本方法。后面每一局都换个座位，有时精心准备的计划突然落空，也有时一次随手的选择带来了意外的结果。最后一局结束，我们检查桌面和地板有没有漏下的零件。一张卡片滑到了坐垫下面，于是大家先清点数量，再把盒子合上。对刚才讨论最久的一条规则，我们写了一句说明，放在说明书旁边。",family:"zh-hobbies-04",length:"medium"},{id:"zh-hobbies-04-long",language:"zh",topic:"hobbies",text:"朋友来家里做客时，我们选了一个规则简单的桌面游戏。一个人负责读说明，其他人把卡片和棋子摆好。先试着玩了一轮，大家就明白了基本方法。后面每一局都换个座位，有时精心准备的计划突然落空，也有时一次随手的选择带来了意外的结果。最后一局结束，我们检查桌面和地板有没有漏下的零件。一张卡片滑到了坐垫下面，于是大家先清点数量，再把盒子合上。对刚才讨论最久的一条规则，我们写了一句说明，放在说明书旁边。下一次玩时，有位新朋友加入。我们没有一开始就把所有规则讲完，而是用第一轮作示范，遇到具体情况再回答问题。盒子里的那句说明，也让大家不用重新争论上次没有说清楚的地方。到了第二轮，新朋友已经能自己决定下一步。准备工作少了一些重复，游戏里真正需要思考的选择，反而有了更多可以慢慢讨论的时间。",family:"zh-hobbies-04",length:"long"},{id:"zh-nature-01",language:"zh",topic:"nature",text:"每天上班都会经过同一棵树，以前我很少抬头看。一天早晨，几片新叶在阳光下特别明亮，我才发现枝头已经和上个月不同。后来每次路过，我都会留意一下它的变化。走的仍然是熟悉的路线，却多了一件可以期待的小事，也更容易察觉季节正在慢慢改变。",family:"zh-nature-01",length:"short"},{id:"zh-nature-01-medium",language:"zh",topic:"nature",text:"每天上班都会经过同一棵树，以前我很少抬头看。一天早晨，几片新叶在阳光下特别明亮，我才发现枝头已经和上个月不同。后来每次路过，我都会留意一下它的变化。走的仍然是熟悉的路线，却多了一件可以期待的小事，也更容易察觉季节正在慢慢改变。后来我每周记一次这棵树的变化，有时只写叶子的颜色，或者树影落在路面的方向。翻回之前的记录，才发现一些看似没有变化的日子，实际上也在慢慢积累差别，季节并不是突然换了一种样子。",family:"zh-nature-01",length:"medium"},{id:"zh-nature-01-long",language:"zh",topic:"nature",text:"每天上班都会经过同一棵树，以前我很少抬头看。一天早晨，几片新叶在阳光下特别明亮，我才发现枝头已经和上个月不同。后来每次路过，我都会留意一下它的变化。走的仍然是熟悉的路线，却多了一件可以期待的小事，也更容易察觉季节正在慢慢改变。后来我每周记一次这棵树的变化，有时只写叶子的颜色，或者树影落在路面的方向。翻回之前的记录，才发现一些看似没有变化的日子，实际上也在慢慢积累差别，季节并不是突然换了一种样子。有天早上，工作人员正在树旁清理掉落的树枝。我等小路重新通畅，注意到一只小鸟在剩下的叶子之间移动。如果只是匆忙拍一张整条街的照片，这个细节大概不会被留下。我把它和当天的天气写进本周记录，然后继续去上班。散步并没有因此变成必须交出成果的任务，只是熟悉的路上，多了一个愿意认真看一眼的地方。",family:"zh-nature-01",length:"long"},{id:"zh-nature-02",language:"zh",topic:"nature",text:"雨后的公园很安静，小路上留下几处浅浅的水洼。我们绕着走过去，看见一只小鸟在长椅旁的草地里寻找食物。再往前走，云层渐渐散开，池塘上出现了一小片阳光。大家在岸边停留了一会儿，没有急着拍照，只是听着周围重新响起的声音。",family:"zh-nature-02",length:"short"},{id:"zh-nature-02-medium",language:"zh",topic:"nature",text:"雨后的公园很安静，小路上留下几处浅浅的水洼。我们绕着走过去，看见一只小鸟在长椅旁的草地里寻找食物。再往前走，云层渐渐散开，池塘上出现了一小片阳光。大家在岸边停留了一会儿，没有急着拍照，只是听着周围重新响起的声音。走到公园门口附近，我们找到一张已经被太阳晒干的长椅，坐着看小路渐渐热闹起来。一个孩子停在水洼旁，观察漂着的树叶。每当风向改变，叶子就慢慢转动，旁边的人也跟着安静了一会儿。",family:"zh-nature-02",length:"medium"},{id:"zh-nature-02-long",language:"zh",topic:"nature",text:"雨后的公园很安静，小路上留下几处浅浅的水洼。我们绕着走过去，看见一只小鸟在长椅旁的草地里寻找食物。再往前走，云层渐渐散开，池塘上出现了一小片阳光。大家在岸边停留了一会儿，没有急着拍照，只是听着周围重新响起的声音。走到公园门口附近，我们找到一张已经被太阳晒干的长椅，坐着看小路渐渐热闹起来。一个孩子停在水洼旁，观察漂着的树叶。每当风向改变，叶子就慢慢转动，旁边的人也跟着安静了一会儿。回家时，我们换了另一个出口，发现花坛后面还有一条窄路。它最后接到每天都会经过的街道，只是从这一侧看过去，显得有些陌生。大家约好等地面干燥时再来走一次，没有急着当天把所有小路都找出来。这个上午既没有很远的目的地，也没有排满的行程，却因为愿意多停几分钟，留下了几个以前匆匆经过时没有注意到的画面。",family:"zh-nature-02",length:"long"},{id:"zh-nature-03",language:"zh",topic:"nature",text:"星期天早上，我们去了附近的社区花园。志愿者先指给大家看可以走的路，提醒我们留意刚种下的小苗。我们帮忙把空花盆搬进工具棚，又扫干净入口的台阶。做完事情后，坐在外面的椅子上休息，才发现平时匆忙经过的地方，其实还有这样安静的一角。",family:"zh-nature-03",length:"short"},{id:"zh-nature-03-medium",language:"zh",topic:"nature",text:"星期天早上，我们去了附近的社区花园。志愿者先指给大家看可以走的路，提醒我们留意刚种下的小苗。我们帮忙把空花盆搬进工具棚，又扫干净入口的台阶。做完事情后，坐在外面的椅子上休息，才发现平时匆忙经过的地方，其实还有这样安静的一角。离开前，我们问义工下周是否还需要帮忙。他介绍了哪些工作要看天气，哪些可以在室内完成。大家选了一个不太长的时段，写清碰面的地点和时间，免得到时有人需要放下手上的工作来找我们。",family:"zh-nature-03",length:"medium"},{id:"zh-nature-03-long",language:"zh",topic:"nature",text:"星期天早上，我们去了附近的社区花园。志愿者先指给大家看可以走的路，提醒我们留意刚种下的小苗。我们帮忙把空花盆搬进工具棚，又扫干净入口的台阶。做完事情后，坐在外面的椅子上休息，才发现平时匆忙经过的地方，其实还有这样安静的一角。离开前，我们问义工下周是否还需要帮忙。他介绍了哪些工作要看天气，哪些可以在室内完成。大家选了一个不太长的时段，写清碰面的地点和时间，免得到时有人需要放下手上的工作来找我们。第二次过去时，雨改变了原来的安排。大家没有到花圃里活动，而是在棚下清洗小花盆，再按大小放好。一位义工教我们看清哪些花盆已经破损，不适合继续使用。工作比第一次安静，来回走动也少了，但到了中午，原本杂乱的架子已经整理好，下一组人可以直接取用。临走前，我们把当天做过的事说明白，再把工具交回原处。",family:"zh-nature-03",length:"long"},{id:"zh-nature-04",language:"zh",topic:"nature",text:"快走到山顶时，风比山脚下大了不少。我们穿好外套，找了一个背风的地方坐下。从高处看，刚才经过的田地变成了一小块一小块的颜色。吃完午餐，大家检查了一下时间，就沿着原路慢慢下山，希望在天色还亮的时候回到出发的地方。",family:"zh-nature-04",length:"short"},{id:"zh-nature-04-medium",language:"zh",topic:"nature",text:"快走到山顶时，风比山脚下大了不少。我们穿好外套，找了一个背风的地方坐下。从高处看，刚才经过的田地变成了一小块一小块的颜色。吃完午餐，大家检查了一下时间，就沿着原路慢慢下山，希望在天色还亮的时候回到出发的地方。走到半山的一处转弯，我们停下来，确认后面的人都跟上了。白天的小路仍然容易辨认，只是有根树枝挡住了部分路标。大家小心绕过去，等走得慢的同伴到了同一个位置，才继续沿着下坡走。",family:"zh-nature-04",length:"medium"},{id:"zh-nature-04-long",language:"zh",topic:"nature",text:"快走到山顶时，风比山脚下大了不少。我们穿好外套，找了一个背风的地方坐下。从高处看，刚才经过的田地变成了一小块一小块的颜色。吃完午餐，大家检查了一下时间，就沿着原路慢慢下山，希望在天色还亮的时候回到出发的地方。走到半山的一处转弯，我们停下来，确认后面的人都跟上了。白天的小路仍然容易辨认，只是有根树枝挡住了部分路标。大家小心绕过去，等走得慢的同伴到了同一个位置，才继续沿着下坡走。回到出发的地方，我们检查各自的背包，确认杯子和包装纸都带了回来。有人把实际用时和出门前写下的安排比较，发现山顶休息比预计长了一些。于是大家在记录里补上这一点，决定下次早点出发，仍然为回程留出宽松的时间。路线没有变成需要赶着完成的任务，这些具体记录只是帮助下一次安排得更从容，让每个人都能按合适的速度走完。",family:"zh-nature-04",length:"long"},{id:"yue-travel-01",language:"yue",topic:"travel",text:"今朝去到巴士站，等車嘅人比平時少。站牌話下一班車仲有一陣先到，我就行入雨棚，將車票同水樽放喺容易攞到嘅位置。架車嚟咗之後，我搵到個靠窗位坐低，睇住街邊啲舖頭逐間開門。唔使一路趕，成個朝早都好似輕鬆咗啲。",family:"yue-travel-01",length:"short"},{id:"yue-travel-01-medium",language:"yue",topic:"travel",text:"今朝去到巴士站，等車嘅人比平時少。站牌話下一班車仲有一陣先到，我就行入雨棚，將車票同水樽放喺容易攞到嘅位置。架車嚟咗之後，我搵到個靠窗位坐低，睇住街邊啲舖頭逐間開門。唔使一路趕，成個朝早都好似輕鬆咗啲。下一站有位乘客上車，問架車係咪經過醫院。我同朋友一齊睇車門上面張路線圖，搵到最近嗰個站。佢攞張紙記低站名，又問清楚落車之後要向邊面行，先坐返過道對面，安心等架車到站。",family:"yue-travel-01",length:"medium"},{id:"yue-travel-01-long",language:"yue",topic:"travel",text:"今朝去到巴士站，等車嘅人比平時少。站牌話下一班車仲有一陣先到，我就行入雨棚，將車票同水樽放喺容易攞到嘅位置。架車嚟咗之後，我搵到個靠窗位坐低，睇住街邊啲舖頭逐間開門。唔使一路趕，成個朝早都好似輕鬆咗啲。下一站有位乘客上車，問架車係咪經過醫院。我同朋友一齊睇車門上面張路線圖，搵到最近嗰個站。佢攞張紙記低站名，又問清楚落車之後要向邊面行，先坐返過道對面，安心等架車到站。架車行咗一陣，司機話前面整路，要暫時兜另一條路。嗰位乘客聽完有啲擔心，我就幫佢問清楚新嘅落車位置。司機解釋，新站反而近醫院側門，沿住路口右邊行就到。就快到站嗰陣，我哋再講一次方向。佢落車後好快搵到個路口，仲轉身向車窗揮手。我收返張路線圖，先發現自己日日經過嘅地方，原來仲有好多細節未留意過，搭車都可以慢慢認識條路。",family:"yue-travel-01",length:"long"},{id:"yue-travel-02",language:"yue",topic:"travel",text:"我哋早咗到車站，先睇清楚月台喺邊，再去附近買早餐。啱啱出爐嘅麵包仲有啲熱，大家就坐喺長櫈慢慢食。聽到廣播叫人入閘，先收好個袋同手上啲嘢。今次唔使一落車就跑，出發之前反而有時間傾下今日想去邊幾個地方。",family:"yue-travel-02",length:"short"},{id:"yue-travel-02-medium",language:"yue",topic:"travel",text:"我哋早咗到車站，先睇清楚月台喺邊，再去附近買早餐。啱啱出爐嘅麵包仲有啲熱，大家就坐喺長櫈慢慢食。聽到廣播叫人入閘，先收好個袋同手上啲嘢。今次唔使一落車就跑，出發之前反而有時間傾下今日想去邊幾個地方。上車之後，我哋對一對車票同座位上面啲站名，確定目的地喺山腳附近。食完早餐嘅包裝先放入紙袋，車票就收好喺背囊外面個細格。之後查票就唔使喺食物同雜物中間搵，大家亦可以坐定睇窗外。",family:"yue-travel-02",length:"medium"},{id:"yue-travel-02-long",language:"yue",topic:"travel",text:"我哋早咗到車站，先睇清楚月台喺邊，再去附近買早餐。啱啱出爐嘅麵包仲有啲熱，大家就坐喺長櫈慢慢食。聽到廣播叫人入閘，先收好個袋同手上啲嘢。今次唔使一落車就跑，出發之前反而有時間傾下今日想去邊幾個地方。上車之後，我哋對一對車票同座位上面啲站名，確定目的地喺山腳附近。食完早餐嘅包裝先放入紙袋，車票就收好喺背囊外面個細格。之後查票就唔使喺食物同雜物中間搵，大家亦可以坐定睇窗外。架車行到一片田旁邊就停低，車廂入面好多人都抬頭望出去。過咗一陣，廣播解釋要等另一班車行過先。我哋趁呢段時間飲完水，執好隨身啲袋，冇急住企喺門口等。到站先發現個車站好細，出口就喺月台旁邊，落幾級樓梯已經見到入村條路。早啲執好行李，落車就有時間睇清楚路牌，再慢慢行去約好見面嘅地方，唔使一路拖住個袋一路問路。",family:"yue-travel-02",length:"long"},{id:"yue-travel-03",language:"yue",topic:"travel",text:"行出展館嗰陣，場雨啱啱停。朋友睇咗眼地圖，話：“不如沿住河邊行返去啦。”我哋揀咗條靜啲嘅路，經過書店又停低睇下櫥窗。雖然比搭車花多咗少少時間，但沿途見到幾間以前冇留意過嘅小店，仲傾埋個未講完嘅話題。",family:"yue-travel-03",length:"short"},{id:"yue-travel-03-medium",language:"yue",topic:"travel",text:"行出展館嗰陣，場雨啱啱停。朋友睇咗眼地圖，話：“不如沿住河邊行返去啦。”我哋揀咗條靜啲嘅路，經過書店又停低睇下櫥窗。雖然比搭車花多咗少少時間，但沿途見到幾間以前冇留意過嘅小店，仲傾埋個未講完嘅話題。返到住處，我哋向前台攞咗張附近嘅紙地圖。我圈低書店個位，阿妹就加返頭先行過嗰條河邊小路。原本張行程表冇寫呢兩個地方，我哋決定留返第二朝早，食完早餐再慢慢行過去睇。",family:"yue-travel-03",length:"medium"},{id:"yue-travel-03-long",language:"yue",topic:"travel",text:"行出展館嗰陣，場雨啱啱停。朋友睇咗眼地圖，話：“不如沿住河邊行返去啦。”我哋揀咗條靜啲嘅路，經過書店又停低睇下櫥窗。雖然比搭車花多咗少少時間，但沿途見到幾間以前冇留意過嘅小店，仲傾埋個未講完嘅話題。返到住處，我哋向前台攞咗張附近嘅紙地圖。我圈低書店個位，阿妹就加返頭先行過嗰條河邊小路。原本張行程表冇寫呢兩個地方，我哋決定留返第二朝早，食完早餐再慢慢行過去睇。第二朝去到，書店已經開門。店入面有條窄樓梯，上面係放滿舊書嘅細房，窗邊仲有張矮枱。我哋各自揀咗一本方便帶走嘅書，冇趕住一次過睇晒所有書架。老闆用普通紙包好啲書，又指畀我哋睇一條去廣場嘅小路。最後張地圖一直留喺背囊入面，上面幾個圓圈記住咗途中撞見嘅地方。返到屋企再攞出嚟睇，反而比原先排到密麻麻嘅行程更容易諗返起當時嘅情景。",family:"yue-travel-03",length:"long"},{id:"yue-travel-04",language:"yue",topic:"travel",text:"週末去海邊之前，我哋先睇天氣，再執好外套、水同簡單午餐。村口啲路牌幾清楚，每到一個路口，大家都會停低對下方向。行到張望到海嘅長櫈，就坐低抖一陣。後面條路唔算遠，唔使急急腳，慢慢行都可以喺中午之前去到。",family:"yue-travel-04",length:"short"},{id:"yue-travel-04-medium",language:"yue",topic:"travel",text:"週末去海邊之前，我哋先睇天氣，再執好外套、水同簡單午餐。村口啲路牌幾清楚，每到一個路口，大家都會停低對下方向。行到張望到海嘅長櫈，就坐低抖一陣。後面條路唔算遠，唔使急急腳，慢慢行都可以喺中午之前去到。沙灘仲未有好多人，幾家人喺樓梯附近鋪緊毛巾。我哋揀咗塊乾沙放低對鞋，水樽同外套就擺埋一邊。行近海邊之前，大家轉頭望一望上山條小路喺邊，免得返去嗰陣淨係顧住搵沙上面啲腳印。",family:"yue-travel-04",length:"medium"},{id:"yue-travel-04-long",language:"yue",topic:"travel",text:"週末去海邊之前，我哋先睇天氣，再執好外套、水同簡單午餐。村口啲路牌幾清楚，每到一個路口，大家都會停低對下方向。行到張望到海嘅長櫈，就坐低抖一陣。後面條路唔算遠，唔使急急腳，慢慢行都可以喺中午之前去到。沙灘仲未有好多人，幾家人喺樓梯附近鋪緊毛巾。我哋揀咗塊乾沙放低對鞋，水樽同外套就擺埋一邊。行近海邊之前，大家轉頭望一望上山條小路喺邊，免得返去嗰陣淨係顧住搵沙上面啲腳印。晏晝啲雲又慢慢聚埋，海風吹過嚟都涼咗啲。我哋決定早少少返去，唔等到落雨先執嘢。行上斜路時，有兩個遊客喺路口睇緊地圖，我哋就指返朝早見過嗰塊路牌畀佢哋睇。返到村入面，大家搵張有遮擋嘅枱，食埋剩低啲生果。雖然留喺沙灘嘅時間短咗，但回程唔使趕，仲可以坐低慢慢睇相，講返一路見到嘅小事，等場雨過咗先繼續行。",family:"yue-travel-04",length:"long"},{id:"yue-food-01",language:"yue",topic:"food",text:"去街市之前，我先打開雪櫃，睇下屋企仲有啲乜。米同雞蛋都夠，只係要買幾樣新鮮菜。檔主幫我將番茄裝入紙袋，我再揀咗一小棵菜。照住張清單買，拎返屋企個袋輕咗好多，亦都唔使食飯嗰陣先諗起有啲餸買多咗未煮。",family:"yue-food-01",length:"short"},{id:"yue-food-01-medium",language:"yue",topic:"food",text:"去街市之前，我先打開雪櫃，睇下屋企仲有啲乜。米同雞蛋都夠，只係要買幾樣新鮮菜。檔主幫我將番茄裝入紙袋，我再揀咗一小棵菜。照住張清單買，拎返屋企個袋輕咗好多，亦都唔使食飯嗰陣先諗起有啲餸買多咗未煮。返到屋企，我先將雪櫃入面早啲買嘅菜放喺前面，新買嗰啲放後面。今晚要用嘅番茄另外放入細碗，擺喺容易見到嘅位。張清單買齊一樣就劃走一樣，剩低未買嗰啲，我又再諗下係咪真係需要。",family:"yue-food-01",length:"medium"},{id:"yue-food-01-long",language:"yue",topic:"food",text:"去街市之前，我先打開雪櫃，睇下屋企仲有啲乜。米同雞蛋都夠，只係要買幾樣新鮮菜。檔主幫我將番茄裝入紙袋，我再揀咗一小棵菜。照住張清單買，拎返屋企個袋輕咗好多，亦都唔使食飯嗰陣先諗起有啲餸買多咗未煮。返到屋企，我先將雪櫃入面早啲買嘅菜放喺前面，新買嗰啲放後面。今晚要用嘅番茄另外放入細碗，擺喺容易見到嘅位。張清單買齊一樣就劃走一樣，剩低未買嗰啲，我又再諗下係咪真係需要。準備煮飯嗰陣，我發現最後一個洋蔥已經唔係咁新鮮，就改咗煮番茄炒蛋。其他菜仲可以留到下一餐，唔使為咗照足原先個計劃再出門買嘢。食完之後，我喺下星期張清單加咗句提醒，叫自己先睇清楚屋企有咩。寫低要買乜令準備容易咗，但肯跟住實際情況改一改，呢餐飯就少咗好多來回奔波，最後亦冇留低一大碟食唔晒嘅餸。",family:"yue-food-01",length:"long"},{id:"yue-food-02",language:"yue",topic:"food",text:"準備晚飯嗰陣，我先洗好啲菜，將碗同調味料放喺手邊，之後先開火。煲湯嗰段時間，啱啱可以執下砧板，分開裝好果皮同菜葉。等屋企人返到嚟，張枱已經擺好碗筷。廚房冇堆到周圍都係嘢，食完飯要收拾都冇咁頭痛。",family:"yue-food-02",length:"short"},{id:"yue-food-02-medium",language:"yue",topic:"food",text:"準備晚飯嗰陣，我先洗好啲菜，將碗同調味料放喺手邊，之後先開火。煲湯嗰段時間，啱啱可以執下砧板，分開裝好果皮同菜葉。等屋企人返到嚟，張枱已經擺好碗筷。廚房冇堆到周圍都係嘢，食完飯要收拾都冇咁頭痛。煲湯用嘅時間比我估計長，我收細火，用匙羹試下紅蘿蔔軟未。等緊嗰陣，剩低啲菜就放入有蓋嘅盒，留返聽日晏晝用。廚房冇咩急住做，我就抹乾淨頭先切菜張枱，等食完之後容易收拾啲。",family:"yue-food-02",length:"medium"},{id:"yue-food-02-long",language:"yue",topic:"food",text:"準備晚飯嗰陣，我先洗好啲菜，將碗同調味料放喺手邊，之後先開火。煲湯嗰段時間，啱啱可以執下砧板，分開裝好果皮同菜葉。等屋企人返到嚟，張枱已經擺好碗筷。廚房冇堆到周圍都係嘢，食完飯要收拾都冇咁頭痛。煲湯用嘅時間比我估計長，我收細火，用匙羹試下紅蘿蔔軟未。等緊嗰陣，剩低啲菜就放入有蓋嘅盒，留返聽日晏晝用。廚房冇咩急住做，我就抹乾淨頭先切菜張枱，等食完之後容易收拾啲。鄰居上嚟還碟嗰陣，個湯啱啱煲好。我哋請佢飲一細碗，坐喺開咗窗嘅廚房傾咗一陣。佢話附近街市有個檔口，可以每樣菜買少少，唔使一次過買咁多。我將個位置寫喺購物清單背面。等佢返屋企，剩低個湯就分成兩份收好，煲同匙羹亦洗乾淨。第二朝見到全部嘢已經準備好，就知道先做邊一步，唔使未開始煮飯已經喺廚房周圍搵嘢。",family:"yue-food-02",length:"long"},{id:"yue-food-03",language:"yue",topic:"food",text:"朋友約埋一齊食晏，每個人帶一道餸，唔使一個人煮晒。我整咗碟涼拌菜，另一個朋友就帶嚟啱啱焗好嘅麵包。大家將啲碟放喺枱中間，邊食邊傾近況。食物好快食完，話題就一直冇停，最後仲約定下次見面可以一齊試煮新菜式。",family:"yue-food-03",length:"short"},{id:"yue-food-03-medium",language:"yue",topic:"food",text:"朋友約埋一齊食晏，每個人帶一道餸，唔使一個人煮晒。我整咗碟涼拌菜，另一個朋友就帶嚟啱啱焗好嘅麵包。大家將啲碟放喺枱中間，邊食邊傾近況。食物好快食完，話題就一直冇停，最後仲約定下次見面可以一齊試煮新菜式。朋友走之前，我哋先將空盒還返畀主人，再分好剩低啲餸。有人提議記低今次各自帶咗乜，免得下次又有幾個人同時整沙律。大家寫低自己想帶嘅嘢，分工清楚咗，但唔使搞到每個人都要跟住張大表做。",family:"yue-food-03",length:"medium"},{id:"yue-food-03-long",language:"yue",topic:"food",text:"朋友約埋一齊食晏，每個人帶一道餸，唔使一個人煮晒。我整咗碟涼拌菜，另一個朋友就帶嚟啱啱焗好嘅麵包。大家將啲碟放喺枱中間，邊食邊傾近況。食物好快食完，話題就一直冇停，最後仲約定下次見面可以一齊試煮新菜式。朋友走之前，我哋先將空盒還返畀主人，再分好剩低啲餸。有人提議記低今次各自帶咗乜，免得下次又有幾個人同時整沙律。大家寫低自己想帶嘅嘢，分工清楚咗，但唔使搞到每個人都要跟住張大表做。下一次聚餐，有個朋友搭嗰班巴士遲咗，未能準時到。我哋先食要趁熱食嘅餸，留起一份畀佢，冇不停問佢仲有幾耐先到。等佢入門，枱上面仲有好多嘢可以一齊食。佢本來想帶嗰道菜，改成咗車站附近買嘅生果，大家都覺得幾好。張細清單幫我哋少做咗重複嘅準備，但呢餐飯咁輕鬆，主要都係因為大家肯就住當日嘅情況，唔需要每一步都照原定安排。",family:"yue-food-03",length:"long"},{id:"yue-food-04",language:"yue",topic:"food",text:"圖書館隔籬開咗間小店，我還完書就入去坐陣。老闆問音樂會唔會太嘈，我話：“坐呢度啱啱好。”等早餐嗰陣，我攞出隨身個簿，記低頭先行路諗到嘅幾件事。窗外有人慢慢行過，舖頭入面又唔多人，食完早餐先走都唔覺得趕。",family:"yue-food-04",length:"short"},{id:"yue-food-04-medium",language:"yue",topic:"food",text:"圖書館隔籬開咗間小店，我還完書就入去坐陣。老闆問音樂會唔會太嘈，我話：“坐呢度啱啱好。”等早餐嗰陣，我攞出隨身個簿，記低頭先行路諗到嘅幾件事。窗外有人慢慢行過，舖頭入面又唔多人，食完早餐先走都唔覺得趕。早餐送到，我合埋筆記簿，將佢移遠啲，免得畀杯嘢整濕。間店慢慢多人，老闆開多咗個收銀位。我食完去畀錢，順便問下平時邊個時段冇咁嘈，諗住下次可以約個朋友過嚟坐低慢慢傾。",family:"yue-food-04",length:"medium"},{id:"yue-food-04-long",language:"yue",topic:"food",text:"圖書館隔籬開咗間小店，我還完書就入去坐陣。老闆問音樂會唔會太嘈，我話：“坐呢度啱啱好。”等早餐嗰陣，我攞出隨身個簿，記低頭先行路諗到嘅幾件事。窗外有人慢慢行過，舖頭入面又唔多人，食完早餐先走都唔覺得趕。早餐送到，我合埋筆記簿，將佢移遠啲，免得畀杯嘢整濕。間店慢慢多人，老闆開多咗個收銀位。我食完去畀錢，順便問下平時邊個時段冇咁嘈，諗住下次可以約個朋友過嚟坐低慢慢傾。隔咗一個星期，我同朋友晏晝再去嗰間店。上次張枱仲未有人坐，不過窗外啲光柔和咗好多。我哋先各自睇咗陣書，再傾我第一次嚟時寫低嗰幾個諗法。其中一個仲值得試，我哋就寫清楚第一步要做乜，約好周末各自做一小部分。走嗰陣，筆記簿多咗幾行真係可以動手做嘅內容。個計劃冇越寫越長，反而終於有咗個清楚嘅起點，返到屋企都知道點繼續。",family:"yue-food-04",length:"long"},{id:"yue-work-01",language:"yue",topic:"work",text:"開工之前，我先睇返尋日留低啲筆記。有一個問題仲未問清楚，我就加落開會張清單，冇靠估繼續做。等大家到齊，先講清楚呢件事，再分配後面啲工作。每個人都知道下一步要做乜，下午少咗好多來回問嘢嘅時間，做起上嚟順手咗。",family:"yue-work-01",length:"short"},{id:"yue-work-01-medium",language:"yue",topic:"work",text:"開工之前，我先睇返尋日留低啲筆記。有一個問題仲未問清楚，我就加落開會張清單，冇靠估繼續做。等大家到齊，先講清楚呢件事，再分配後面啲工作。每個人都知道下一步要做乜，下午少咗好多來回問嘢嘅時間，做起上嚟順手咗。食完晏，同事傳咗個新例子過嚟，啱啱解答到朝早未講清楚嗰個問題。我將佢放喺相關說明旁邊，標明舊例子唔再用。大家開同一份資料就可以繼續做，唔使喺幾段訊息之間來回對，估邊個版本先係最新。",family:"yue-work-01",length:"medium"},{id:"yue-work-01-long",language:"yue",topic:"work",text:"開工之前，我先睇返尋日留低啲筆記。有一個問題仲未問清楚，我就加落開會張清單，冇靠估繼續做。等大家到齊，先講清楚呢件事，再分配後面啲工作。每個人都知道下一步要做乜，下午少咗好多來回問嘢嘅時間，做起上嚟順手咗。食完晏，同事傳咗個新例子過嚟，啱啱解答到朝早未講清楚嗰個問題。我將佢放喺相關說明旁邊，標明舊例子唔再用。大家開同一份資料就可以繼續做，唔使喺幾段訊息之間來回對，估邊個版本先係最新。就快收工，我哋再對一次朝早定低啲步驟。其中一部分比預計做得耐，負責嗰位同事講清楚原因，亦提議先交一個簡單啲嘅版本。我哋將個決定寫返喺原先計劃旁邊，冇淨係口頭講完就算。第二朝有人接手，打開份資料就見到原本點安排、後來改咗乜，同埋點解要改。其實只係多咗幾行記錄，但大家唔使重新搵人問過，手上嘅工作亦容易接得返。",family:"yue-work-01",length:"long"},{id:"yue-work-02",language:"yue",topic:"work",text:"共用資料夾入面有幾份文件個名太似，搵一份舊報告成日要開幾次。我哋商量好一套簡單嘅改名方法，將唔再用嘅副本搬去另一個位置。執完之後，我試住搵上個月份記錄，好快就搵到。以後存檔嗰陣寫清楚少少，大家都可以慳返啲時間。",family:"yue-work-02",length:"short"},{id:"yue-work-02-medium",language:"yue",topic:"work",text:"共用資料夾入面有幾份文件個名太似，搵一份舊報告成日要開幾次。我哋商量好一套簡單嘅改名方法，將唔再用嘅副本搬去另一個位置。執完之後，我試住搵上個月份記錄，好快就搵到。以後存檔嗰陣寫清楚少少，大家都可以慳返啲時間。我哋另外加咗段短說明，寫清楚新文件應該放喺邊。冇參加討論嘅同事試住存一份 PDF，喺兩個名差唔多嘅資料夾之間揀唔到。佢一問，我哋先發現個名仍然有啲含糊，就改清楚先搬剩低啲文件。",family:"yue-work-02",length:"medium"},{id:"yue-work-02-long",language:"yue",topic:"work",text:"共用資料夾入面有幾份文件個名太似，搵一份舊報告成日要開幾次。我哋商量好一套簡單嘅改名方法，將唔再用嘅副本搬去另一個位置。執完之後，我試住搵上個月份記錄，好快就搵到。以後存檔嗰陣寫清楚少少，大家都可以慳返啲時間。我哋另外加咗段短說明，寫清楚新文件應該放喺邊。冇參加討論嘅同事試住存一份 PDF，喺兩個名差唔多嘅資料夾之間揀唔到。佢一問，我哋先發現個名仍然有啲含糊，就改清楚先搬剩低啲文件。之後一個星期，大家順手記低仲有邊啲文件難搵。多數問題其實來自舊連結，唔係新目錄本身。我哋更新咗團隊筆記入面啲連結，喺原來個位留返一句指向新資料夾嘅說明。到星期五，記錄入面已經冇再出現同一類問題。後來加入嘅同事，照住說明都放得啱文件，唔使先聽人由頭講一次整理經過。個目錄終於係靠本身嘅結構幫大家搵嘢，唔係靠某個人記住晒。",family:"yue-work-02",length:"long"},{id:"yue-work-03",language:"yue",topic:"work",text:"準備寄份文件出去嗰陣，我發現有個日期同日程表對唔上。我冇憑印象改，而係搵返最初嗰份記錄，問清楚先一次過改好兩個位置。寄出之前再由頭睇多次，仲寫低今次改咗乜。花多少少時間核對，接手嗰個人就唔使再估來估去。",family:"yue-work-03",length:"short"},{id:"yue-work-03-medium",language:"yue",topic:"work",text:"準備寄份文件出去嗰陣，我發現有個日期同日程表對唔上。我冇憑印象改，而係搵返最初嗰份記錄，問清楚先一次過改好兩個位置。寄出之前再由頭睇多次，仲寫低今次改咗乜。花多少少時間核對，接手嗰個人就唔使再估來估去。晏晝收到回覆，對方問起其中一段意思。我開返已經寄出嗰份 PDF，冇繼續望住枱面個舊草稿。大家對住同一個版本，先發現只要將一句話前後調一調，就可以少咗原本嗰個理解分歧，唔使整段重寫。",family:"yue-work-03",length:"medium"},{id:"yue-work-03-long",language:"yue",topic:"work",text:"準備寄份文件出去嗰陣，我發現有個日期同日程表對唔上。我冇憑印象改，而係搵返最初嗰份記錄，問清楚先一次過改好兩個位置。寄出之前再由頭睇多次，仲寫低今次改咗乜。花多少少時間核對，接手嗰個人就唔使再估來估去。晏晝收到回覆，對方問起其中一段意思。我開返已經寄出嗰份 PDF，冇繼續望住枱面個舊草稿。大家對住同一個版本，先發現只要將一句話前後調一調，就可以少咗原本嗰個理解分歧，唔使整段重寫。準備下一份文件之前，我喺自己張檢查清單加咗日期同版本名兩項。個步驟好短，忙嘅時候都做得完。一個月後，我就靠呢個檢查搵到一個仲用緊舊月份嘅標題。內文已經更新，但標題留咗喺上一版，直接寄出去，睇嗰個人就要估究竟邊度先啱。我改好再讀一次，將最後版本同相關說明放返固定位置。下次有人要搵，唔使從幾份相似嘅草稿逐份猜。",family:"yue-work-03",length:"long"},{id:"yue-work-04",language:"yue",topic:"work",text:"有項工作睇落好多，我哋先拆開幾個細部分，再揀最清楚嗰部分開始。試做第一次，就發現原來漏咗一個步驟，於是即刻加返落計劃。嗰朝完成嘅嘢唔算多，但後面點做清楚咗。大家亦都容易分到邊啲可以同時做，邊啲要等前面有結果先繼續。",family:"yue-work-04",length:"short"},{id:"yue-work-04-medium",language:"yue",topic:"work",text:"有項工作睇落好多，我哋先拆開幾個細部分，再揀最清楚嗰部分開始。試做第一次，就發現原來漏咗一個步驟，於是即刻加返落計劃。嗰朝完成嘅嘢唔算多，但後面點做清楚咗。大家亦都容易分到邊啲可以同時做，邊啲要等前面有結果先繼續。晏晝我哋將做完嗰啲部分同最初張提綱放埋一齊睇。有一節太長，另一節反而少咗具體例子。於是下午啲工作改一改，先補返缺少嘅內容，再刪走重複解釋，唔係每一節都繼續加字，越整越難睇。",family:"yue-work-04",length:"medium"},{id:"yue-work-04-long",language:"yue",topic:"work",text:"有項工作睇落好多，我哋先拆開幾個細部分，再揀最清楚嗰部分開始。試做第一次，就發現原來漏咗一個步驟，於是即刻加返落計劃。嗰朝完成嘅嘢唔算多，但後面點做清楚咗。大家亦都容易分到邊啲可以同時做，邊啲要等前面有結果先繼續。晏晝我哋將做完嗰啲部分同最初張提綱放埋一齊睇。有一節太長，另一節反而少咗具體例子。於是下午啲工作改一改，先補返缺少嘅內容，再刪走重複解釋，唔係每一節都繼續加字，越整越難睇。第二朝再檢查，我哋想知冇參加討論嘅人，睇完係咪識得做第一步。於是請同事先讀份說明，再講佢打算點開始。聽完先知道，有一句指示仍然唔夠清楚。我哋寫得具體啲，再請佢試多次。第一朝做嗰個簡單例子一直擺喺旁邊，方便對返實際結果。份工作唔係一次就做好，但每次改都有原因，亦有辦法睇到改完有冇幫助，唔使淨係憑感覺話差唔多。",family:"yue-work-04",length:"long"},{id:"yue-learning-01",language:"yue",topic:"learning",text:"學新嘢嗰陣，我會放本細簿喺旁邊。唔係每句都抄低，而係記住個重點，再寫一個自己講得明嘅例子。到一日完結之前，我試下合埋本書，重新講一次。講唔清楚嘅地方就留低個問題，等下次學習時再搵答案，唔使由頭亂咁睇過。",family:"yue-learning-01",length:"short"},{id:"yue-learning-01-medium",language:"yue",topic:"learning",text:"學新嘢嗰陣，我會放本細簿喺旁邊。唔係每句都抄低，而係記住個重點，再寫一個自己講得明嘅例子。到一日完結之前，我試下合埋本書，重新講一次。講唔清楚嘅地方就留低個問題，等下次學習時再搵答案，唔使由頭亂咁睇過。過咗一星期，我翻返筆記簿最前面幾頁。有啲問題已經講得清楚，有啲仲欠一個啱用嘅例子。我用另一隻色標低真係明白嗰啲，未肯定嘅就留喺原位，等下次有時間再查，唔使為咗整齊扮自己全部都識。",family:"yue-learning-01",length:"medium"},{id:"yue-learning-01-long",language:"yue",topic:"learning",text:"學新嘢嗰陣，我會放本細簿喺旁邊。唔係每句都抄低，而係記住個重點，再寫一個自己講得明嘅例子。到一日完結之前，我試下合埋本書，重新講一次。講唔清楚嘅地方就留低個問題，等下次學習時再搵答案，唔使由頭亂咁睇過。過咗一星期，我翻返筆記簿最前面幾頁。有啲問題已經講得清楚，有啲仲欠一個啱用嘅例子。我用另一隻色標低真係明白嗰啲，未肯定嘅就留喺原位，等下次有時間再查，唔使為咗整齊扮自己全部都識。朋友問我最近學緊乜，我就試住用筆記入面個例子解釋畀佢聽。佢明白大概意思，但又問咗個我之前忽略嘅細節。我將個問題加喺旁邊，冇成頁重新抄過。慢慢學落去，筆記變咗一份理解過程嘅記錄：邊啲已經清楚，邊啲仲要諗，打開就睇得到。佢唔再只係從課堂抄返嚟嘅句子。下次重溫嗰陣，亦唔使每一頁由頭讀過，可以先處理自己真正未明嗰個地方。",family:"yue-learning-01",length:"long"},{id:"yue-learning-02",language:"yue",topic:"learning",text:"有道練習睇落好簡單，我偏偏連續兩次都錯喺同一個位。停低再睇清楚要求，先發現自己漏咗一個細節。第三次試嘅時候，我放慢啲，每做完一步就對一對。雖然用多咗時間，但終於知點解會錯，下次再遇到同類問題，心入面都有個底。",family:"yue-learning-02",length:"short"},{id:"yue-learning-02-medium",language:"yue",topic:"learning",text:"有道練習睇落好簡單，我偏偏連續兩次都錯喺同一個位。停低再睇清楚要求，先發現自己漏咗一個細節。第三次試嘅時候，我放慢啲，每做完一步就對一對。雖然用多咗時間，但終於知點解會錯，下次再遇到同類問題，心入面都有個底。我將錯嗰份答案同改好嗰份擺埋一齊，圈低由邊一步開始唔同。之後遇到相似問題，就容易認得返之前錯喺邊。下一題雖然換咗數字，我仍然用到同一個檢查方法，唔需要照抄上一題先做到。",family:"yue-learning-02",length:"medium"},{id:"yue-learning-02-long",language:"yue",topic:"learning",text:"有道練習睇落好簡單，我偏偏連續兩次都錯喺同一個位。停低再睇清楚要求，先發現自己漏咗一個細節。第三次試嘅時候，我放慢啲，每做完一步就對一對。雖然用多咗時間，但終於知點解會錯，下次再遇到同類問題，心入面都有個底。我將錯嗰份答案同改好嗰份擺埋一齊，圈低由邊一步開始唔同。之後遇到相似問題，就容易認得返之前錯喺邊。下一題雖然換咗數字，我仍然用到同一個檢查方法，唔需要照抄上一題先做到。就快練完嗰陣，我搵咗條差唔多嘅題目，合埋啲例子，自己做一次。去到之前漏咗嗰一步，我停低，試住將原因講完整，先繼續計。答案啱咗，但做得仲唔算快。我冇為咗多做幾題就趕住落去，反而留咗個新問題畀第二朝。枱面兩份答案一齊收好，下次打開就可以對返，睇清楚自己究竟改進咗乜。咁樣記住嘅唔只係最後個答案，仲有點樣避免再犯同一個錯。",family:"yue-learning-02",length:"long"},{id:"yue-learning-03",language:"yue",topic:"learning",text:"我哋每個星期喺圖書館見一次，每人帶一個學習時遇到嘅問題。輪到自己，就先講試過邊幾個方法，再請其他人補充。有時一個貼近日常嘅例子，比講一大段道理容易明。走之前，大家各自揀一件小事返去練，下次見面再傾有咩新發現。",family:"yue-learning-03",length:"short"},{id:"yue-learning-03-medium",language:"yue",topic:"learning",text:"我哋每個星期喺圖書館見一次，每人帶一個學習時遇到嘅問題。輪到自己，就先講試過邊幾個方法，再請其他人補充。有時一個貼近日常嘅例子，比講一大段道理容易明。走之前，大家各自揀一件小事返去練，下次見面再傾有咩新發現。下次見面，兩個同學用差唔多嘅方法，卻做到唔同答案。我哋將過程並排放喺枱上，一行一行對，先發現大家對題目入面一個詞理解唔同。先講清楚個詞點解，比急住判斷邊個啱、邊個錯更有用。",family:"yue-learning-03",length:"medium"},{id:"yue-learning-03-long",language:"yue",topic:"learning",text:"我哋每個星期喺圖書館見一次，每人帶一個學習時遇到嘅問題。輪到自己，就先講試過邊幾個方法，再請其他人補充。有時一個貼近日常嘅例子，比講一大段道理容易明。走之前，大家各自揀一件小事返去練，下次見面再傾有咩新發現。下次見面，兩個同學用差唔多嘅方法，卻做到唔同答案。我哋將過程並排放喺枱上，一行一行對，先發現大家對題目入面一個詞理解唔同。先講清楚個詞點解，比急住判斷邊個啱、邊個錯更有用。之後我哋約定，寫答案時順便記低自己作咗咩假設，方便討論嗰陣睇到分別。一個平時唔多出聲嘅同學，舉咗工作上遇過嘅例子，令嗰句抽象說明容易明白咗。我哋將個例子同必要解釋寫入共用筆記。走之前，每人只揀一個新問題返去研究，下次仍然保持細範圍討論。咁每個人都有時間講清楚自己點諗，唔會變成得幾個人一路講，其他人只係坐喺旁邊抄答案。",family:"yue-learning-03",length:"long"},{id:"yue-learning-04",language:"yue",topic:"learning",text:"我想養成每日練習嘅習慣，就將時間放喺早餐之後。先用十分鐘溫習一小段內容，再開其他程式做嘢。有啲朝早精神好，有啲就只做到最基本嗰部分。因為每次唔使做太多，就算前一日忙到冇空，第二朝都容易再開始，唔使等到放假先算。",family:"yue-learning-04",length:"short"},{id:"yue-learning-04-medium",language:"yue",topic:"learning",text:"我想養成每日練習嘅習慣，就將時間放喺早餐之後。先用十分鐘溫習一小段內容，再開其他程式做嘢。有啲朝早精神好，有啲就只做到最基本嗰部分。因為每次唔使做太多，就算前一日忙到冇空，第二朝都容易再開始，唔使等到放假先算。過咗兩星期，有朝早要提早出門，我冇時間照常練習。夜晚返到屋企，我冇要求自己補返晒啲時間，只係將筆記簿放喺早餐碗旁邊。第二朝見到，就順住原來個節奏繼續，唔使又重新決定幾時開始。",family:"yue-learning-04",length:"medium"},{id:"yue-learning-04-long",language:"yue",topic:"learning",text:"我想養成每日練習嘅習慣，就將時間放喺早餐之後。先用十分鐘溫習一小段內容，再開其他程式做嘢。有啲朝早精神好，有啲就只做到最基本嗰部分。因為每次唔使做太多，就算前一日忙到冇空，第二朝都容易再開始，唔使等到放假先算。過咗兩星期，有朝早要提早出門，我冇時間照常練習。夜晚返到屋企，我冇要求自己補返晒啲時間，只係將筆記簿放喺早餐碗旁邊。第二朝見到，就順住原來個節奏繼續，唔使又重新決定幾時開始。後面啲內容慢慢難咗，有一課十分鐘做唔完。我就揀個意思完整嘅位置停低，寫一句下次由邊度開始，再合埋本書。短短一段練習仍然有清楚嘅起點同終點，冇變成另一件一直掛住未做完嘅事。到月底翻返啲筆記，幾個以前成日卡住嘅問題，已經可以解釋得清楚。每日行得唔一樣快都唔緊要，因為記錄入面睇到具體變化，下次再學嗰陣亦知道自己企喺邊個位置。",family:"yue-learning-04",length:"long"},{id:"yue-reading-01",language:"yue",topic:"reading",text:"借返嚟本書喺封面入面印咗張地圖，開頭我冇點睇。讀到後面，人物去過嘅地方越嚟越多，我先翻返前面對下條路線。幾個陌生地名慢慢熟悉咗，唔同章節之間嘅關係都清楚啲。今次讀得慢過平時，但留意到好多本來可能睇漏嘅細節。",family:"yue-reading-01",length:"short"},{id:"yue-reading-01-medium",language:"yue",topic:"reading",text:"借返嚟本書喺封面入面印咗張地圖，開頭我冇點睇。讀到後面，人物去過嘅地方越嚟越多，我先翻返前面對下條路線。幾個陌生地名慢慢熟悉咗，唔同章節之間嘅關係都清楚啲。今次讀得慢過平時，但留意到好多本來可能睇漏嘅細節。有晚我發現地圖上一個地方，喺前面幾章用咗另一個名。我翻返前面幾頁，先知改名本身都係故事一部分。留意地點唔只係方便認路，仲令我更容易明白，點解個角色要離開熟悉嘅地方，去一個未去過嘅城鎮。",family:"yue-reading-01",length:"medium"},{id:"yue-reading-01-long",language:"yue",topic:"reading",text:"借返嚟本書喺封面入面印咗張地圖，開頭我冇點睇。讀到後面，人物去過嘅地方越嚟越多，我先翻返前面對下條路線。幾個陌生地名慢慢熟悉咗，唔同章節之間嘅關係都清楚啲。今次讀得慢過平時，但留意到好多本來可能睇漏嘅細節。有晚我發現地圖上一個地方，喺前面幾章用咗另一個名。我翻返前面幾頁，先知改名本身都係故事一部分。留意地點唔只係方便認路，仲令我更容易明白，點解個角色要離開熟悉嘅地方，去一個未去過嘅城鎮。睇完本書，我喺張舊紙背面畫咗條大概路線。唔係照抄書入面張地圖，只係標低自己記得最清楚嗰幾個場景。朋友聽我講其中一個地方，就想借本書返去睇。我將張紙夾喺封面入面，同佢講清楚呢個只係我嘅閱讀記錄，唔係正式指引。後來佢還書時，又喺空白位置加咗一個印象深刻嘅地方。同一張圖多咗另一個人嘅睇法，令我想再翻開嗰幾頁，睇下自己之前漏咗啲乜。",family:"yue-reading-01",length:"long"},{id:"yue-reading-02",language:"yue",topic:"reading",text:"圖書館門口擺咗一排職員推薦嘅書，其中一本講嘅題目我唔係好熟。我隨手揭開第一頁，發現寫得幾清楚，唔使預先識好多背景都睇得明。最後，除咗原本想借嗰本小說，我仲帶埋呢本返屋企，諗住每日睇少少，試下接觸平時少睇嘅內容。",family:"yue-reading-02",length:"short"},{id:"yue-reading-02-medium",language:"yue",topic:"reading",text:"圖書館門口擺咗一排職員推薦嘅書，其中一本講嘅題目我唔係好熟。我隨手揭開第一頁，發現寫得幾清楚，唔使預先識好多背景都睇得明。最後，除咗原本想借嗰本小說，我仲帶埋呢本返屋企，諗住每日睇少少，試下接觸平時少睇嘅內容。書入面原本陌生嘅主題，竟然同我日日散步時見到嘅一件小事有關。我喺嗰頁放低書籤，返到屋企又讀一次個解釋。有咗呢個具體連繫，我先真係想繼續睇，唔再只係因為封面有人話佢值得一讀。",family:"yue-reading-02",length:"medium"},{id:"yue-reading-02-long",language:"yue",topic:"reading",text:"圖書館門口擺咗一排職員推薦嘅書，其中一本講嘅題目我唔係好熟。我隨手揭開第一頁，發現寫得幾清楚，唔使預先識好多背景都睇得明。最後，除咗原本想借嗰本小說，我仲帶埋呢本返屋企，諗住每日睇少少，試下接觸平時少睇嘅內容。書入面原本陌生嘅主題，竟然同我日日散步時見到嘅一件小事有關。我喺嗰頁放低書籤，返到屋企又讀一次個解釋。有咗呢個具體連繫，我先真係想繼續睇，唔再只係因為封面有人話佢值得一讀。還書嗰日，我去返同一排書架揀下一本。今次先睇目錄，再讀一小段。有啲書預咗讀者已經識好多背景，我就揀咗本例子短啲、圖畫清楚啲嘅。最初個推薦幫我接觸新主題，但跟住點揀，就要自己判斷邊種解釋適合而家嘅程度。行出圖書館嗰陣，我都只係借咗兩本，想留返足夠時間真正睇完，唔好攞一大疊返屋企，最後只係記得自己曾經想睇過。",family:"yue-reading-02",length:"long"},{id:"yue-reading-03",language:"yue",topic:"reading",text:"我同朋友約好週末睇完同一篇故事。星期一見面，先發現大家留意嘅地方完全唔同。有段對話我幾乎冇印象，佢就話嗰段令佢對個結尾有另一種理解。聽完之後，我又翻返嗰幾頁再睇。故事本身冇變，但有人一齊傾，真係會見到多啲嘢。",family:"yue-reading-03",length:"short"},{id:"yue-reading-03-medium",language:"yue",topic:"reading",text:"我同朋友約好週末睇完同一篇故事。星期一見面，先發現大家留意嘅地方完全唔同。有段對話我幾乎冇印象，佢就話嗰段令佢對個結尾有另一種理解。聽完之後，我又翻返嗰幾頁再睇。故事本身冇變，但有人一齊傾，真係會見到多啲嘢。我哋約好下次傾書，每人帶一小段印象深刻嘅文字。要揀出嚟，就要重新留意啲字點用，唔可以淨係記住故事大概。之後講到唔同睇法，大家都指得出係邊個細節影響自己，唔使只係話感覺唔同。",family:"yue-reading-03",length:"medium"},{id:"yue-reading-03-long",language:"yue",topic:"reading",text:"我同朋友約好週末睇完同一篇故事。星期一見面，先發現大家留意嘅地方完全唔同。有段對話我幾乎冇印象，佢就話嗰段令佢對個結尾有另一種理解。聽完之後，我又翻返嗰幾頁再睇。故事本身冇變，但有人一齊傾，真係會見到多啲嘢。我哋約好下次傾書，每人帶一小段印象深刻嘅文字。要揀出嚟，就要重新留意啲字點用，唔可以淨係記住故事大概。之後講到唔同睇法，大家都指得出係邊個細節影響自己，唔使只係話感覺唔同。第二次討論比上次短，但問題反而容易講清楚。對於其中一個角色嘅決定，我哋仍然冇相同結論，亦冇急住搵個標準答案嚟結束爭論。大家將見到啲線索擺埋一齊，再讀一次相關嗰幾句。後來我借咗同一個作者另一篇故事，想睇下啲唔起眼嘅細節，係咪又會喺結尾發揮作用。讀新故事時，我自然慢咗少少，遇到簡單一句對話，都會諗下前面有冇留過類似嘅線索。",family:"yue-reading-03",length:"long"},{id:"yue-reading-04",language:"yue",topic:"reading",text:"以前我成日同時揭幾本書，每一本都停喺唔同位置。今個月，我只揀一本放喺張櫈旁邊，其餘先放返上書架。每晚睇幾頁，反而容易記得前面講過乜。睇完之後，我喺簿入面寫低最鍾意嗰段情節，仲記咗一個想搵人一齊討論嘅問題。",family:"yue-reading-04",length:"short"},{id:"yue-reading-04-medium",language:"yue",topic:"reading",text:"以前我成日同時揭幾本書，每一本都停喺唔同位置。今個月，我只揀一本放喺張櫈旁邊，其餘先放返上書架。每晚睇幾頁，反而容易記得前面講過乜。睇完之後，我喺簿入面寫低最鍾意嗰段情節，仲記咗一個想搵人一齊討論嘅問題。張筆記只有幾行，但幫我記得點解自己鍾意個結尾。還書之前，我將張紙夾喺封面入面。揀下一本嗰陣，我特登搵篇幅短啲嘅作品，想忙嘅晚上都容易搵到停頓位，唔使次次為咗睇完一章而勉強撐住。",family:"yue-reading-04",length:"medium"},{id:"yue-reading-04-long",language:"yue",topic:"reading",text:"以前我成日同時揭幾本書，每一本都停喺唔同位置。今個月，我只揀一本放喺張櫈旁邊，其餘先放返上書架。每晚睇幾頁，反而容易記得前面講過乜。睇完之後，我喺簿入面寫低最鍾意嗰段情節，仲記咗一個想搵人一齊討論嘅問題。張筆記只有幾行，但幫我記得點解自己鍾意個結尾。還書之前，我將張紙夾喺封面入面。揀下一本嗰陣，我特登搵篇幅短啲嘅作品，想忙嘅晚上都容易搵到停頓位，唔使次次為咗睇完一章而勉強撐住。有晚真係太攰，連一小章都跟唔到個故事。我放返書籤就停低，冇覺得咁樣代表個習慣失敗。第二晚再打開，我先向前讀一頁，諗返起當時個場景，先繼續後面。只留一本書喺手邊，仍然令選擇簡單咗，但比每日讀相同頁數更有用嘅，係留低一個容易返去繼續嘅位置。之後有幾晚讀得多啲、有幾晚少啲，都唔影響我慢慢跟住個故事行落去。",family:"yue-reading-04",length:"long"},{id:"yue-home-01",language:"yue",topic:"home",text:"書枱盞燈離本書太遠，夜晚睇嘢有啲辛苦。我先移一移盞燈，再收起枱面唔用嗰啲舊紙，只留低個簿同一支筆。間房冇大執過，但張枱好用咗好多。想記低啲嘢時，唔使先搬開成堆雜物，做完嘢又可以好快執返齊，第二日攞嚟用都方便。",family:"yue-home-01",length:"short"},{id:"yue-home-01-medium",language:"yue",topic:"home",text:"書枱盞燈離本書太遠，夜晚睇嘢有啲辛苦。我先移一移盞燈，再收起枱面唔用嗰啲舊紙，只留低個簿同一支筆。間房冇大執過，但張枱好用咗好多。想記低啲嘢時，唔使先搬開成堆雜物，做完嘢又可以好快執返齊，第二日攞嚟用都方便。用咗幾日，我再睇下張枱附近啲位。盞燈係方便咗，但張櫈拉出嚟就擋住個櫃桶。我將張枱移開少少，等坐低都攞到常用嘅嘢，其他人行過枱邊，亦唔需要側住身避開張櫈，成個角落用起上嚟順咗。",family:"yue-home-01",length:"medium"},{id:"yue-home-01-long",language:"yue",topic:"home",text:"書枱盞燈離本書太遠，夜晚睇嘢有啲辛苦。我先移一移盞燈，再收起枱面唔用嗰啲舊紙，只留低個簿同一支筆。間房冇大執過，但張枱好用咗好多。想記低啲嘢時，唔使先搬開成堆雜物，做完嘢又可以好快執返齊，第二日攞嚟用都方便。用咗幾日，我再睇下張枱附近啲位。盞燈係方便咗，但張櫈拉出嚟就擋住個櫃桶。我將張枱移開少少，等坐低都攞到常用嘅嘢，其他人行過枱邊，亦唔需要側住身避開張櫈，成個角落用起上嚟順咗。周末朋友上嚟，借張枱寫張便條。佢問杯水可以放邊，我先發現枱面雖然整齊，但冇留位畀人臨時放嘢。我將一疊 A4 紙搬去旁邊個架，空返出面一角。間房冇換咗另一種樣，只係日常啲小動作，唔使次次先搬開幾件物品先做得到。過幾日自己坐返低，都感覺到呢啲調整方便咗。最有用嘅唔係枱面睇落幾乾淨，而係要用嘅時候真係容易攞到，放返去亦唔費力。",family:"yue-home-01",length:"long"},{id:"yue-home-02",language:"yue",topic:"home",text:"落雨嗰個下午，我哋決定執下門口個櫃。空盒放一邊，仲會用嘅嘢重新分類，打算送人嗰啲就另外裝袋。搵咗好耐條頸巾，原來壓喺個舊背囊後面。執完之後，櫃門終於唔使大力推先閂到，平時用開把遮同購物袋亦都有咗固定位置。",family:"yue-home-02",length:"short"},{id:"yue-home-02-medium",language:"yue",topic:"home",text:"落雨嗰個下午，我哋決定執下門口個櫃。空盒放一邊，仲會用嘅嘢重新分類，打算送人嗰啲就另外裝袋。搵咗好耐條頸巾，原來壓喺個舊背囊後面。執完之後，櫃門終於唔使大力推先閂到，平時用開把遮同購物袋亦都有咗固定位置。執到最後一層，我哋搵到盒後備鈕同幾條散放嘅鎖匙。啲鈕按用途放入細袋，鎖匙就逐條試係開邊把鎖。暫時認唔出嗰啲先放喺淺盤，等屋企人返嚟一齊睇，冇隨手又塞返入櫃深處，當自己已經執完。",family:"yue-home-02",length:"medium"},{id:"yue-home-02-long",language:"yue",topic:"home",text:"落雨嗰個下午，我哋決定執下門口個櫃。空盒放一邊，仲會用嘅嘢重新分類，打算送人嗰啲就另外裝袋。搵咗好耐條頸巾，原來壓喺個舊背囊後面。執完之後，櫃門終於唔使大力推先閂到，平時用開把遮同購物袋亦都有咗固定位置。執到最後一層，我哋搵到盒後備鈕同幾條散放嘅鎖匙。啲鈕按用途放入細袋，鎖匙就逐條試係開邊把鎖。暫時認唔出嗰啲先放喺淺盤，等屋企人返嚟一齊睇，冇隨手又塞返入櫃深處，當自己已經執完。夜晚大家睇返個淺盤，先知有條鎖匙係舊單車鎖，另一條就開個好少用嘅細櫃。我哋將佢哋放返對應物品旁邊，又講好剩低啲零件放邊個固定位置。過咗一星期，件外套甩咗粒鈕，搵後備鈕只係用咗一陣。屋企人都記住同一個地方，唔使好似以前咁，各自去唔同櫃桶搵一輪，最後先撞啱。嗰晚我哋冇將所有嘢都處理晒，但常用同有用嘅部分，已經清楚好多。",family:"yue-home-02",length:"long"},{id:"yue-home-03",language:"yue",topic:"home",text:"窗邊盆小植物成日向住有光嗰邊斜。我輕輕轉咗少少個盆，再移開旁邊擋住光嗰幾本書。之後幾日，我留意啲葉有冇變，亦都摸下啲泥會唔會太乾。照顧住呢個小角落，先發現原來朝早同下午照入屋嘅光好唔同，間房都好似有生氣咗。",family:"yue-home-03",length:"short"},{id:"yue-home-03-medium",language:"yue",topic:"home",text:"窗邊盆小植物成日向住有光嗰邊斜。我輕輕轉咗少少個盆，再移開旁邊擋住光嗰幾本書。之後幾日，我留意啲葉有冇變，亦都摸下啲泥會唔會太乾。照顧住呢個小角落，先發現原來朝早同下午照入屋嘅光好唔同，間房都好似有生氣咗。我喺花盆旁邊放張細卡，寫低日期，食早餐時順便睇一眼。啲泥唔係每日都用同一個速度變乾，所以我唔再只係跟習慣淋水，而係先睇葉、摸下泥，再留意窗邊啲光，決定當日有冇需要做啲乜。",family:"yue-home-03",length:"medium"},{id:"yue-home-03-long",language:"yue",topic:"home",text:"窗邊盆小植物成日向住有光嗰邊斜。我輕輕轉咗少少個盆，再移開旁邊擋住光嗰幾本書。之後幾日，我留意啲葉有冇變，亦都摸下啲泥會唔會太乾。照顧住呢個小角落，先發現原來朝早同下午照入屋嘅光好唔同，間房都好似有生氣咗。我喺花盆旁邊放張細卡，寫低日期，食早餐時順便睇一眼。啲泥唔係每日都用同一個速度變乾，所以我唔再只係跟習慣淋水，而係先睇葉、摸下泥，再留意窗邊啲光，決定當日有冇需要做啲乜。有個周末要出門，我請鄰居幫手睇住盆植物。走之前留低幾句說明，講平時放喺邊，亦示範我點樣睇啲泥乾唔乾。返嚟嗰陣，一塊新葉啱啱開始打開。我哋拎返之前張相對一對，再將花盆移開少少，畀長大咗啲葉多啲空間。呢件小事唔需要複雜安排，但說明寫清楚，接手嗰個就唔使猜我想點。之後再要出門，我都知道可以用同一個簡單方法交代清楚。",family:"yue-home-03",length:"long"},{id:"yue-home-04",language:"yue",topic:"home",text:"瞓覺之前，我將鎖匙同背囊放喺門口固定個位，再諗下聽朝出門要帶啲乜。水樽裝好，借返嚟本書都預先放入袋。呢幾件事花唔到好多時間，但第二朝就唔使周圍搵。起身之後可以慢慢食早餐，唔使一邊着鞋，一邊諗仲有邊樣嘢未攞。",family:"yue-home-04",length:"short"},{id:"yue-home-04-medium",language:"yue",topic:"home",text:"瞓覺之前，我將鎖匙同背囊放喺門口固定個位，再諗下聽朝出門要帶啲乜。水樽裝好，借返嚟本書都預先放入袋。呢幾件事花唔到好多時間，但第二朝就唔使周圍搵。起身之後可以慢慢食早餐，唔使一邊着鞋，一邊諗仲有邊樣嘢未攞。行到車站，我先記起本來想借畀朋友本書，仲喺屋企個架上面。件事唔急，我就記低，提醒自己夜晚放入袋。固定嘅準備習慣幫到手，但都要睇第二日真係有咩要做，唔可以日日做一樣就當萬事齊備。",family:"yue-home-04",length:"medium"},{id:"yue-home-04-long",language:"yue",topic:"home",text:"瞓覺之前，我將鎖匙同背囊放喺門口固定個位，再諗下聽朝出門要帶啲乜。水樽裝好，借返嚟本書都預先放入袋。呢幾件事花唔到好多時間，但第二朝就唔使周圍搵。起身之後可以慢慢食早餐，唔使一邊着鞋，一邊諗仲有邊樣嘢未攞。行到車站，我先記起本來想借畀朋友本書，仲喺屋企個架上面。件事唔急，我就記低，提醒自己夜晚放入袋。固定嘅準備習慣幫到手，但都要睇第二日真係有咩要做，唔可以日日做一樣就當萬事齊備。嗰晚我放張卡喺鎖匙旁邊，只寫聽日同平時唔同嘅兩件事：還書，同埋返屋企時攞個包裹。睇完我換咗個大啲嘅袋，裝得落兩樣嘢。第二日辦好，就收走張卡，冇畀過期便條繼續堆喺門口。個位置仍然簡單，要帶出門嘅嘢容易見到，新提醒亦唔會畀舊紙遮住。過多幾日就算又有其他安排，我都只需要換一張細卡，唔使將整套習慣重新諗過一次。",family:"yue-home-04",length:"long"},{id:"yue-hobbies-01",language:"yue",topic:"hobbies",text:"週末行街嗰陣，我帶埋相機，但冇特登安排去邊。行到平時經過嘅街角，陽光啱啱照住幅舊牆，樹枝啲影砌出幾靚嘅圖案。我等個路人行過先影咗一張。原來唔一定要去好遠，行慢少少，喺熟悉嘅地方都可以搵到以前冇留意嘅畫面。",family:"yue-hobbies-01",length:"short"},{id:"yue-hobbies-01-medium",language:"yue",topic:"hobbies",text:"週末行街嗰陣，我帶埋相機，但冇特登安排去邊。行到平時經過嘅街角，陽光啱啱照住幅舊牆，樹枝啲影砌出幾靚嘅圖案。我等個路人行過先影咗一張。原來唔一定要去好遠，行慢少少，喺熟悉嘅地方都可以搵到以前冇留意嘅畫面。返到屋企睇相，我只揀幾張最能夠表達當時留意到啲乜，其餘先放入另一個資料夾。揀少啲，反而容易比較光線、人物位置同畫面邊緣嘅分別，唔使喺成堆差唔多嘅相之間切來切去，睇到最後連自己想揀乜都唔記得。",family:"yue-hobbies-01",length:"medium"},{id:"yue-hobbies-01-long",language:"yue",topic:"hobbies",text:"週末行街嗰陣，我帶埋相機，但冇特登安排去邊。行到平時經過嘅街角，陽光啱啱照住幅舊牆，樹枝啲影砌出幾靚嘅圖案。我等個路人行過先影咗一張。原來唔一定要去好遠，行慢少少，喺熟悉嘅地方都可以搵到以前冇留意嘅畫面。返到屋企睇相，我只揀幾張最能夠表達當時留意到啲乜，其餘先放入另一個資料夾。揀少啲，反而容易比較光線、人物位置同畫面邊緣嘅分別，唔使喺成堆差唔多嘅相之間切來切去，睇到最後連自己想揀乜都唔記得。我畀朋友先睇嗰幾張相，冇即刻解釋拍攝時點諗。佢留意到嘅細節，同我估嘅唔一樣，大家就重新望清楚成個畫面。傾完之後，我哋決定下次行返同一條路，試下另一個時間會見到啲乜。熟悉嘅地方都可以再影，變嘅唔只係啲光，仲有我哋肯喺邊度停低，以及點樣喺好多畫面之間揀出真係想留下嘅一張。咁樣再出門，就唔使一定去到好遠先覺得有嘢值得睇。",family:"yue-hobbies-01",length:"long"},{id:"yue-hobbies-02",language:"yue",topic:"hobbies",text:"球隊開始練波，我哋先企近啲，輪流傳個波畀旁邊嘅隊友。等大家搵到節奏，再慢慢拉開距離。有幾次傳歪咗，執返個波再試就得。練習完之前踢咗場短比賽，平時冇咁主動嘅隊友都開始舉手要波，場上啲配合比啱到嗰陣自然咗好多。",family:"yue-hobbies-02",length:"short"},{id:"yue-hobbies-02-medium",language:"yue",topic:"hobbies",text:"球隊開始練波，我哋先企近啲，輪流傳個波畀旁邊嘅隊友。等大家搵到節奏，再慢慢拉開距離。有幾次傳歪咗，執返個波再試就得。練習完之前踢咗場短比賽，平時冇咁主動嘅隊友都開始舉手要波，場上啲配合比啱到嗰陣自然咗好多。下一次練波前，我檢查咗個波同其他用品，將要帶嘅嘢放埋同一個袋。大家又預先講好幾點完，免得玩到最後先急急腳執嘢。去到場，熱完身就開始得，唔使四圍問人借嘢，或者等某個人返屋企攞漏咗嘅物品。",family:"yue-hobbies-02",length:"medium"},{id:"yue-hobbies-02-long",language:"yue",topic:"hobbies",text:"球隊開始練波，我哋先企近啲，輪流傳個波畀旁邊嘅隊友。等大家搵到節奏，再慢慢拉開距離。有幾次傳歪咗，執返個波再試就得。練習完之前踢咗場短比賽，平時冇咁主動嘅隊友都開始舉手要波，場上啲配合比啱到嗰陣自然咗好多。下一次練波前，我檢查咗個波同其他用品，將要帶嘅嘢放埋同一個袋。大家又預先講好幾點完，免得玩到最後先急急腳執嘢。去到場，熱完身就開始得，唔使四圍問人借嘢，或者等某個人返屋企攞漏咗嘅物品。有個朋友提議新玩法，要用嘅場比當日可以用嗰塊地方大。我哋先縮細範圍試一輪，睇清楚邊部分值得保留，再繼續原本嘅傳波練習。咁既冇因為新主意打亂晒成日安排，又留咗啲下次可以再試嘅內容。完場時，大家將用品放返固定位置，記低下次要多帶乜，再一齊離開球場。收尾有時間慢慢做，之後再約練波，就唔使先花一大輪時間搵返上次散咗喺邊度嘅嘢。",family:"yue-hobbies-02",length:"long"},{id:"yue-hobbies-03",language:"yue",topic:"hobbies",text:"好耐冇畫畫，我決定先畫枱面隻杯。第一張啲線有少少歪，但已經睇得出個杯耳應該移去邊。我揭過一頁紙，再望清楚一次。今次冇急住擦走晒啲錯位，而係將兩張都留低。擺埋一齊比較，反而容易見到自己有邊度進步，唔會只係望住啲不足。",family:"yue-hobbies-03",length:"short"},{id:"yue-hobbies-03-medium",language:"yue",topic:"hobbies",text:"好耐冇畫畫，我決定先畫枱面隻杯。第一張啲線有少少歪，但已經睇得出個杯耳應該移去邊。我揭過一頁紙，再望清楚一次。今次冇急住擦走晒啲錯位，而係將兩張都留低。擺埋一齊比較，反而容易見到自己有邊度進步，唔會只係望住啲不足。我將第一次嗰張草圖都留低，冇因為線畫得唔準就掉咗。過一星期，將佢同新畫擺埋一齊，變化比淨係睇一張清楚。仲有啲位唔夠自然，但我已經講得出，下次最想練嘅係個杯口，唔係籠統話成張都唔好睇。",family:"yue-hobbies-03",length:"medium"},{id:"yue-hobbies-03-long",language:"yue",topic:"hobbies",text:"好耐冇畫畫，我決定先畫枱面隻杯。第一張啲線有少少歪，但已經睇得出個杯耳應該移去邊。我揭過一頁紙，再望清楚一次。今次冇急住擦走晒啲錯位，而係將兩張都留低。擺埋一齊比較，反而容易見到自己有邊度進步，唔會只係望住啲不足。我將第一次嗰張草圖都留低，冇因為線畫得唔準就掉咗。過一星期，將佢同新畫擺埋一齊，變化比淨係睇一張清楚。仲有啲位唔夠自然，但我已經講得出，下次最想練嘅係個杯口，唔係籠統話成張都唔好睇。再畫時，我換個輪廓簡單啲嘅物品，只用枱面已經有嘅紙同鉛筆。選擇少咗，注意力容易放喺想改善嘅地方。畫完，我喺背面寫日期，再放喺舊草圖旁邊。慢慢儲落嚟幾張紙，記住每次點觀察、點改，包括嗰啲唔太成功嘅嘗試。翻睇時，唔使淨係憑印象判斷有冇進步，亦唔需要張張都好完整先值得留。遇到下一個難畫嘅地方，睇返以前點處理，又會有啲新諗法。",family:"yue-hobbies-03",length:"long"},{id:"yue-hobbies-04",language:"yue",topic:"hobbies",text:"朋友嚟屋企玩，我哋揀咗個規則簡單嘅桌上遊戲。一個人讀說明，其他人就擺好啲卡同棋子。先試玩一輪，大家就明白大概要點做。之後每局都換個位，有時諗咗好耐個計劃突然行唔通，有時隨手揀一步反而有驚喜，大家一路玩一路笑。",family:"yue-hobbies-04",length:"short"},{id:"yue-hobbies-04-medium",language:"yue",topic:"hobbies",text:"朋友嚟屋企玩，我哋揀咗個規則簡單嘅桌上遊戲。一個人讀說明，其他人就擺好啲卡同棋子。先試玩一輪，大家就明白大概要點做。之後每局都換個位，有時諗咗好耐個計劃突然行唔通，有時隨手揀一步反而有驚喜，大家一路玩一路笑。最後一局玩完，我哋睇下枱面同地板有冇漏低零件。有張卡跌咗落坐墊下面，大家就先數清楚數量，再閂個盒。頭先傾得最耐嗰條規則，我哋寫咗句短說明，放喺說明書旁邊，下次打開就容易搵到。",family:"yue-hobbies-04",length:"medium"},{id:"yue-hobbies-04-long",language:"yue",topic:"hobbies",text:"朋友嚟屋企玩，我哋揀咗個規則簡單嘅桌上遊戲。一個人讀說明，其他人就擺好啲卡同棋子。先試玩一輪，大家就明白大概要點做。之後每局都換個位，有時諗咗好耐個計劃突然行唔通，有時隨手揀一步反而有驚喜，大家一路玩一路笑。最後一局玩完，我哋睇下枱面同地板有冇漏低零件。有張卡跌咗落坐墊下面，大家就先數清楚數量，再閂個盒。頭先傾得最耐嗰條規則，我哋寫咗句短說明，放喺說明書旁邊，下次打開就容易搵到。下次再玩，有個新朋友加入。我哋冇一開始就講晒所有規則，而係用第一輪示範，遇到具體情況先答問題。盒入面嗰句說明，亦令大家唔使重新爭論上次未講清楚嗰個位。到第二輪，新朋友已經自己決定到下一步。準備少咗重複，真正要動腦筋嘅選擇反而多咗時間慢慢傾。大家最後換咗座位再玩一局，發現用另一個角度睇張枱，連原本諗住嘅方法都會有啲唔同。",family:"yue-hobbies-04",length:"long"},{id:"yue-nature-01",language:"yue",topic:"nature",text:"每日返工都經過同一棵樹，以前我好少抬頭睇。有朝早，幾塊新葉照住陽光特別鮮明，我先發現啲樹枝已經同上個月唔同。之後每次行過，我都會望一望有咩變化。條路仍然係嗰條路，但多咗件小事可以期待，連季節轉緊都容易察覺啲。",family:"yue-nature-01",length:"short"},{id:"yue-nature-01-medium",language:"yue",topic:"nature",text:"每日返工都經過同一棵樹，以前我好少抬頭睇。有朝早，幾塊新葉照住陽光特別鮮明，我先發現啲樹枝已經同上個月唔同。之後每次行過，我都會望一望有咩變化。條路仍然係嗰條路，但多咗件小事可以期待，連季節轉緊都容易察覺啲。之後我每星期記一次棵樹嘅變化，有時只寫葉嘅顏色，或者樹影落喺路面邊個方向。翻返之前啲記錄，先發現有啲日子睇落冇變，其實慢慢儲落都有分別。季節唔係突然換咗個樣，只係以前自己行得太快，冇停低睇。",family:"yue-nature-01",length:"medium"},{id:"yue-nature-01-long",language:"yue",topic:"nature",text:"每日返工都經過同一棵樹，以前我好少抬頭睇。有朝早，幾塊新葉照住陽光特別鮮明，我先發現啲樹枝已經同上個月唔同。之後每次行過，我都會望一望有咩變化。條路仍然係嗰條路，但多咗件小事可以期待，連季節轉緊都容易察覺啲。之後我每星期記一次棵樹嘅變化，有時只寫葉嘅顏色，或者樹影落喺路面邊個方向。翻返之前啲記錄，先發現有啲日子睇落冇變，其實慢慢儲落都有分別。季節唔係突然換咗個樣，只係以前自己行得太快，冇停低睇。有朝早，有人喺樹旁邊清理跌落嚟嘅樹枝。我等條路通返，留意到隻雀仔喺剩低啲葉之間跳來跳去。如果只係匆匆影張成條街嘅相，大概留唔低呢個細節。我將佢同當日天氣寫入今個星期嘅記錄，再繼續返工。散步冇因此變成一定要交出成果嘅任務，只係熟悉嘅路上，多咗一個肯認真望一眼嘅地方。就算有日冇咩特別，都可以照樣行過，等下一次再睇下有冇新發現。",family:"yue-nature-01",length:"long"},{id:"yue-nature-02",language:"yue",topic:"nature",text:"落完雨嘅公園好靜，條小路有幾個淺水氹。我哋繞住行過，見到隻雀仔喺長櫈旁邊嘅草地搵嘢食。再行前啲，啲雲慢慢散開，池塘上面出現一小片陽光。大家喺岸邊停咗一陣，冇急住攞電話影相，只係聽下周圍啲聲，成個人都放鬆咗。",family:"yue-nature-02",length:"short"},{id:"yue-nature-02-medium",language:"yue",topic:"nature",text:"落完雨嘅公園好靜，條小路有幾個淺水氹。我哋繞住行過，見到隻雀仔喺長櫈旁邊嘅草地搵嘢食。再行前啲，啲雲慢慢散開，池塘上面出現一小片陽光。大家喺岸邊停咗一陣，冇急住攞電話影相，只係聽下周圍啲聲，成個人都放鬆咗。行到公園門口附近，我哋搵到張畀太陽曬乾咗嘅長櫈，坐低望住條路慢慢多人。有個小朋友停喺水氹旁邊，睇住塊浮起嘅樹葉。風向一變，塊葉就慢慢轉，旁邊啲人都跟住靜咗一陣，冇急住叫佢快啲行。",family:"yue-nature-02",length:"medium"},{id:"yue-nature-02-long",language:"yue",topic:"nature",text:"落完雨嘅公園好靜，條小路有幾個淺水氹。我哋繞住行過，見到隻雀仔喺長櫈旁邊嘅草地搵嘢食。再行前啲，啲雲慢慢散開，池塘上面出現一小片陽光。大家喺岸邊停咗一陣，冇急住攞電話影相，只係聽下周圍啲聲，成個人都放鬆咗。行到公園門口附近，我哋搵到張畀太陽曬乾咗嘅長櫈，坐低望住條路慢慢多人。有個小朋友停喺水氹旁邊，睇住塊浮起嘅樹葉。風向一變，塊葉就慢慢轉，旁邊啲人都跟住靜咗一陣，冇急住叫佢快啲行。返屋企時，我哋換另一個出口，發現花圃後面仲有條窄路。行到尾，其實就接返每日都經過嗰條街，只係由呢邊望過去，有少少陌生。大家約好等地下乾返再嚟行一次，冇急住今日就要搵晒所有小路。呢個朝早冇好遠嘅目的地，亦冇排滿行程，但因為肯多停幾分鐘，記低咗幾個以前匆匆經過時睇唔到嘅畫面。返到熟悉嘅街口，連平時普通嘅轉彎都好似有咗另一個方向。",family:"yue-nature-02",length:"long"},{id:"yue-nature-03",language:"yue",topic:"nature",text:"星期日朝早，我哋去咗附近個社區花園。義工先指畀大家睇邊啲路行得，提我哋小心啱啱種落去啲苗。我哋幫手搬空花盆入工具房，再掃乾淨門口幾級樓梯。做完之後坐喺外面抖下，先發現平時匆匆行過嘅地方，原來仲有咁安靜嘅一角。",family:"yue-nature-03",length:"short"},{id:"yue-nature-03-medium",language:"yue",topic:"nature",text:"星期日朝早，我哋去咗附近個社區花園。義工先指畀大家睇邊啲路行得，提我哋小心啱啱種落去啲苗。我哋幫手搬空花盆入工具房，再掃乾淨門口幾級樓梯。做完之後坐喺外面抖下，先發現平時匆匆行過嘅地方，原來仲有咁安靜嘅一角。走之前，我哋問義工下星期仲使唔使人幫手。佢講咗邊啲工作要睇天氣，邊啲可以喺室內做。我哋揀個唔太長嘅時段，寫清楚時間同見面位置，等到時唔使有人放低手頭啲工作，特登出嚟周圍搵我哋。",family:"yue-nature-03",length:"medium"},{id:"yue-nature-03-long",language:"yue",topic:"nature",text:"星期日朝早，我哋去咗附近個社區花園。義工先指畀大家睇邊啲路行得，提我哋小心啱啱種落去啲苗。我哋幫手搬空花盆入工具房，再掃乾淨門口幾級樓梯。做完之後坐喺外面抖下，先發現平時匆匆行過嘅地方，原來仲有咁安靜嘅一角。走之前，我哋問義工下星期仲使唔使人幫手。佢講咗邊啲工作要睇天氣，邊啲可以喺室內做。我哋揀個唔太長嘅時段，寫清楚時間同見面位置，等到時唔使有人放低手頭啲工作，特登出嚟周圍搵我哋。第二次去，落雨改變咗原本嘅安排。大家冇入花圃，而係喺棚下面洗細花盆，再按大小放好。有位義工教我哋睇，邊啲盆已經爛咗，唔適合再用。工作比第一次靜，行來行去亦少啲，但到晏晝，原本亂嘅架已經執好，下一組人直接攞嚟用就得。走之前，我哋講清楚今日做過啲乜，再將工具放返原位。就算天氣同預計唔一樣，仍然有一小部分工作可以好好完成。",family:"yue-nature-03",length:"long"},{id:"yue-nature-04",language:"yue",topic:"nature",text:"差唔多行到山頂，啲風比山腳大咗好多。我哋着返件外套，搵個冇咁當風嘅位坐低。由高處望落去，頭先經過啲田變成一小格一小格嘅顏色。食完午餐，大家睇下時間，就沿住原路慢慢行落山，想趁天色仲光嗰陣返到出發嘅地方。",family:"yue-nature-04",length:"short"},{id:"yue-nature-04-medium",language:"yue",topic:"nature",text:"差唔多行到山頂，啲風比山腳大咗好多。我哋着返件外套，搵個冇咁當風嘅位坐低。由高處望落去，頭先經過啲田變成一小格一小格嘅顏色。食完午餐，大家睇下時間，就沿住原路慢慢行落山，想趁天色仲光嗰陣返到出發嘅地方。行到半山一個轉彎，我哋停低，睇下後面啲人跟上未。日頭條路仲容易認，不過有條樹枝遮住咗部分路牌。大家小心繞過，等行得慢啲嗰幾個到同一個位置，先一齊繼續落斜，冇因為快到終點就趕住走。",family:"yue-nature-04",length:"medium"},{id:"yue-nature-04-long",language:"yue",topic:"nature",text:"差唔多行到山頂，啲風比山腳大咗好多。我哋着返件外套，搵個冇咁當風嘅位坐低。由高處望落去，頭先經過啲田變成一小格一小格嘅顏色。食完午餐，大家睇下時間，就沿住原路慢慢行落山，想趁天色仲光嗰陣返到出發嘅地方。行到半山一個轉彎，我哋停低，睇下後面啲人跟上未。日頭條路仲容易認，不過有條樹枝遮住咗部分路牌。大家小心繞過，等行得慢啲嗰幾個到同一個位置，先一齊繼續落斜，冇因為快到終點就趕住走。返到出發嗰度，我哋檢查背囊，確認水杯同包裝紙全部帶返嚟。有人將實際用時同出門前寫低個安排比較，先發現喺山頂抖嘅時間長過預計。我哋就喺記錄補返呢點，決定下次早少少出發，仍然留夠時間回程。條路冇變成要趕住完成嘅任務，啲具體記錄只係幫下一次安排得從容啲。每個人都用到適合自己嘅速度，落山之後仲有精神坐低傾下，唔係淨係慶幸終於行完。",family:"yue-nature-04",length:"long"}],revision:3};var p=["short","medium","long"],w={short:{en:[40,79],zh:[80,159],yue:[80,159]},medium:{en:[80,139],zh:[160,279],yue:[160,279]},long:{en:[140,220],zh:[280,440],yue:[280,440]}};var W=f.version,A=16,m=f.entries,y=a=>m.find(t=>t.id===a)?.family||a;function O(a,{length:t="short",recent:h=[],random:s=Math.random}={}){if(!p.includes(t))throw new Error("invalid_length");let n=m.filter(i=>i.language===a&&i.length===t);if(!n.length)throw new Error("invalid_language");let o=h.map(y),r=n.filter(i=>!o.includes(i.family)),l=r.length?r[Math.floor(s()*r.length)]:n.sort((i,g)=>o.lastIndexOf(i.family)-o.lastIndexOf(g.family))[0];return{text:l.text,ids:[l.id],passageId:l.id,length:t,topic:l.topic}}function q(a,t=[],h=1200,s=Math.random){let n=m.filter(e=>e.language===a&&e.length==="short"),o=[...new Set(n.map(e=>e.topic))];for(let e=o.length-1;e>0;e--){let d=Math.floor(s()*(e+1));[o[e],o[d]]=[o[d],o[e]]}let r=t.map(y),l=new Set(r),i=o.flatMap(e=>n.filter(d=>d.topic===e&&!l.has(d.family)));i.push(...n.filter(e=>l.has(e.family)).sort((e,d)=>r.lastIndexOf(e.family)-r.lastIndexOf(d.family)));let g=[],u="";for(let e of i)if(u+=(u&&a==="en"?" ":"")+e.text,g.push(e.id),u.length>=h)break;return{text:u,ids:g}}

return module.exports; })();
    // END GENERATED PRACTICE CORPUS

    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    function characters(text) {
      return Array.from(segmenter.segment(text), (part) => part.segment);
    }
    const RECENT_KEY = 'dsh.typing-practice.recent.v1';
    let recentMemory;
    function loadRecent() {
      if (recentMemory) return recentMemory;
      const saved = readStored(RECENT_KEY);
      const result = { version: 1, corpusVersion: PracticeCorpus.CORPUS_VERSION, builtin: {}, local: {} };
      for (const language of LANGUAGES) {
        const known = new Set(PracticeCorpus.entries.filter(entry => entry.language === language).map(entry => entry.id));
        const builtin = saved?.version === 1 && saved.corpusVersion === PracticeCorpus.CORPUS_VERSION ? saved.builtin?.[language] : [];
        const local = saved?.version === 1 ? saved.local?.[language] : [];
        result.builtin[language] = Array.isArray(builtin) ? [...new Set(builtin.filter(id => known.has(id)))].slice(-PracticeCorpus.RECENT_LIMIT) : [];
        result.local[language] = Array.isArray(local) ? [...new Set(local.filter(id => typeof id === 'string' && /^[a-f0-9]{64}$/.test(id)))].slice(-PracticeCorpus.RECENT_LIMIT) : [];
      }
      return recentMemory = result;
    }
    function rememberSession(session) {
      const recent = loadRecent();
      const kind = session.source ? 'local' : 'builtin';
      const ids = session.source ? (session.source.fingerprints || [session.source.fingerprint]).filter(id => /^[a-f0-9]{64}$/.test(id || '')) : session.passageIds;
      if (!ids.length) return;
      recent[kind][session.language] = [...recent[kind][session.language].filter(id => !ids.includes(id)), ...ids].slice(-PracticeCorpus.RECENT_LIMIT);
      // Storage failure only makes deduplication temporary; keep this page usable.
      try { window.localStorage.setItem(RECENT_KEY, JSON.stringify(recent)); } catch { /* Memory still remembers. */ }
    }
    function practiceText(language) {
      return PracticeCorpus.selectPractice(language, loadRecent().builtin[language], TEXT_CHARS);
    }

    // Load only the chosen language. Reuse engines and prepared passages;
    // rejected loads are forgotten so retry is a real attempt.
    const engines = new Map();
    const annotationsCache = new Map();
    function loadAnnotations(language, text) {
      const key = language + ':' + text;
      if (annotationsCache.has(key)) return Promise.resolve(annotationsCache.get(key));
      if (!engines.has(language)) {
        const name = language === 'zh' ? 'pinyin' : 'jyutping';
        engines.set(language, Promise.resolve().then(() => require.async(`./client.${name}.js`)).catch(error => {
          engines.delete(language);
          throw error;
        }));
      }
      return engines.get(language).then(engine => {
        const tokens = engine.annotate(text);
        if (!Array.isArray(tokens) || tokens.map(token => token.char).join('') !== text
          || tokens.length !== characters(text).length) throw new Error('Invalid pronunciation alignment');
        annotationsCache.set(key, tokens);
        if (annotationsCache.size > 24) annotationsCache.delete(annotationsCache.keys().next().value);
        return tokens;
      });
    }

    // ---------- local records ----------

    function recordKey(language, duration, hints = 'off', corpusVersion = PracticeCorpus.CORPUS_VERSION, source = 'builtin') {
      return `${language}:${duration}:${source}:${hints === 'off' ? 'plain' : hints}:${RULES_VERSION}${source === 'local' || corpusVersion === 1 ? '' : ':corpus' + corpusVersion}`;
    }

    function sanitizeBest(stored) {
      if (!stored || typeof stored !== 'object') return {};
      const best = {};
      for (const language of LANGUAGES) for (const duration of DURATIONS) for (const hints of language === 'en' ? ['off'] : HINT_MODES) for (const [source, corpusVersion] of [['builtin', 1], ['builtin', PracticeCorpus.CORPUS_VERSION], ['local', null]]) {
        const key = recordKey(language, duration, hints, corpusVersion, source);
        const entry = stored[key];
        if (!entry || !Number.isFinite(entry.speed) || entry.speed < 0) continue;
        best[key] = {
          speed: Math.round(entry.speed),
          accuracy: Number.isFinite(entry.accuracy) ? Math.max(0, Math.min(1, entry.accuracy)) : 0,
          at: Number.isFinite(entry.at) ? entry.at : 0,
        };
      }
      return best;
    }

    function readStored(key) {
      try { return JSON.parse(window.localStorage.getItem(key) || 'null'); }
      catch { return null; }
    }

    function sanitizeLegacy(stored) {
      const legacy = {};
      for (const duration of DURATIONS) {
        const item = stored?.[duration];
        if (!item || !Number.isFinite(item.wpm) || item.wpm < 0 || !Number.isFinite(item.accuracy)) continue;
        legacy[duration] = { wpm: Math.round(item.wpm), accuracy: Math.max(0, Math.min(1, item.accuracy)), at: Number.isFinite(item.at) ? item.at : 0 };
      }
      return legacy;
    }

    function sanitizeHistory(stored) {
      if (!Array.isArray(stored)) return [];
      const ids = new Set();
      return stored.slice(0, HISTORY_LIMIT).flatMap(item => {
        if (!item || typeof item.id !== 'string' || item.id.length > 100 || !item.id || ids.has(item.id)
          || !LANGUAGES.includes(item.language) || !HINT_MODES.includes(item.hints) || item.language === 'en' && item.hints !== 'off'
          || item.rules !== RULES_VERSION || !['timed', 'passage'].includes(item.mode) || !['builtin', 'local'].includes(item.source)
          || !['completed', 'early'].includes(item.status) || !Number.isFinite(item.accuracy) || item.accuracy < 0 || item.accuracy > 1
          || !['at', 'elapsedMs', 'speed', 'correct', 'wrongKeys', 'keystrokes', 'targetLength'].every(key => Number.isSafeInteger(item[key]) && item[key] >= 0)
          || item.at > 8640000000000000 || item.elapsedMs < 1 || item.targetLength < 1 || item.wrongKeys > item.keystrokes
          || item.correct > item.targetLength || item.correct > item.keystrokes
          || item.mode === 'timed' && (!DURATIONS.includes(item.duration)
            || item.elapsedMs > item.duration * 1000 || item.status === 'completed' && item.elapsedMs !== item.duration * 1000)
          || item.mode === 'timed' && item.corpusVersion != null && ![1, PracticeCorpus.CORPUS_VERSION].includes(item.corpusVersion)
          || item.mode === 'passage' && (item.status !== 'completed' || item.source === 'builtin' &&
            (item.corpusVersion !== PracticeCorpus.CORPUS_VERSION || typeof item.passageId !== 'string'
              || !new RegExp('^' + item.language + '-[a-z]+-\\d{2}(?:-medium|-long)?$').test(item.passageId)))) return [];
        ids.add(item.id);
        // Whitelist fields: never retain text, chat titles, paths or message IDs.
        return [{ id: item.id, language: item.language, hints: item.hints, rules: item.rules,
          corpusVersion: item.source === 'builtin' ? item.corpusVersion ?? 1 : null,
          length: item.mode === 'passage' && PracticeCorpus.TEXT_LENGTHS.includes(item.length) ? item.length : null,
          passageId: item.mode === 'passage' && item.source === 'builtin' ? item.passageId : null,
          mode: item.mode, source: item.source, duration: item.mode === 'timed' ? item.duration : null,
          status: item.status, at: item.at, elapsedMs: item.elapsedMs, speed: item.speed, accuracy: item.accuracy,
          correct: item.correct, wrongKeys: item.wrongKeys, keystrokes: item.keystrokes, targetLength: item.targetLength,
          fingerprint: item.source === 'local' && /^[a-f0-9]{64}$/.test(item.fingerprint || '') ? item.fingerprint : null }];
      });
    }

    function loadRecords() {
      const current = readStored(RECORDS_KEY);
      if (current?.version === 3) return { version: 3, best: sanitizeBest(current.best), legacy: sanitizeLegacy(current.legacy), history: sanitizeHistory(current.history) };
      const previous = readStored(STORE_KEY);
      return { version: 3, best: previous?.version === 2 ? sanitizeBest(previous.best) : {}, legacy: sanitizeLegacy(readStored(LEGACY_STORE_KEY)?.best), history: [] };
    }

    function saveRecords(records) {
      try {
        // One write makes migration, completion and clearing atomic. Old keys
        // remain untouched; a valid v3 (including an empty one) is authoritative.
        window.localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
        return true;
      } catch { return false; }
    }

    function isBetter(result, previous) {
      return !previous || result.speed > previous.speed
        || result.speed === previous.speed && Math.round(result.accuracy * 100) > Math.round(previous.accuracy * 100);
    }

    function historyEntry(session) {
      const result = session.result;
      return { id: session.recordId, language: result.language, hints: result.hints, rules: RULES_VERSION,
        corpusVersion: session.source ? null : PracticeCorpus.CORPUS_VERSION,
        mode: session.mode, source: session.source ? 'local' : 'builtin',
        length: session.mode === 'passage' ? session.length : null, passageId: session.passageId,
        duration: session.mode === 'passage' ? null : result.duration, status: session.mode === 'passage' || result.eligible ? 'completed' : 'early',
        at: result.at, elapsedMs: result.elapsedMs, speed: result.speed, accuracy: result.accuracy,
        correct: result.correct, wrongKeys: result.wrongKeys, keystrokes: result.keystrokes, targetLength: session.target.length,
        fingerprint: session.source && /^[a-f0-9]{64}$/.test(session.source.fingerprint || '') ? session.source.fingerprint : null };
    }

    function samePassageBest(history, entry) {
      if (!passageKey(entry)) return null;
      return history.filter(item => passageKey(item) === passageKey(entry)
        && item.language === entry.language && item.hints === entry.hints && item.rules === entry.rules)
        .reduce((best, item) => isBetter(item, best) ? item : best, null);
    }

    function formatRecordDate(at) {
      if (!at || !Number.isFinite(at) || Math.abs(at) > 8640000000000000) return '—';
      return new Intl.DateTimeFormat(activeLanguage === 'en' ? 'en-US' : 'zh-CN', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
      }).format(new Date(at));
    }

    function exerciseFor(preset) {
      if (DURATIONS.map(String).includes(preset)) return { preset, mode: 'timed', duration: Number(preset), length: 'short' };
      if (PracticeCorpus.TEXT_LENGTHS.includes(preset)) return { preset, mode: 'passage', duration: DEFAULT_DURATION, length: preset };
      return null;
    }

    function loadExercisePreference() {
      const saved = readStored(EXERCISE_KEY);
      if (saved?.version === 2) return exerciseFor(saved.preset) || exerciseFor(String(DEFAULT_DURATION));
      const previous = readStored(LEGACY_EXERCISE_KEY);
      const length = previous?.version === 1 && PracticeCorpus.TEXT_LENGTHS.includes(previous.length) ? previous.length : 'short';
      // The old local source always used passage mode, even without a saved mode.
      return exerciseFor(loadCorpusPreference() === 'local' || previous?.version === 1 && previous.mode === 'passage' ? length : String(DEFAULT_DURATION));
    }

    function passageKey(entry) {
      if (entry.mode !== 'passage') return null;
      return entry.source === 'local' ? entry.fingerprint : entry.passageId ? `builtin:${entry.corpusVersion}:${entry.passageId}` : null;
    }

    function loadCorpusPreference() {
      try {
        const stored = JSON.parse(window.localStorage.getItem(PREFERENCES_KEY) || '{}');
        return stored?.version === 1 && stored.source === 'local' ? 'local' : 'builtin';
      } catch { return 'builtin'; }
    }

    function saveCorpusPreference(source) {
      try {
        window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ version: 1, source }));
        return true;
      } catch { return false; }
    }

    function loadSoundPreference() {
      const saved = readStored(SOUND_KEY);
      return { version: 1, pack: saved?.version === 1 && SOUND_PACKS.includes(saved.pack) ? saved.pack : 'off',
        volume: saved?.version === 1 && Number.isFinite(saved.volume) ? Math.max(0, Math.min(100, Math.round(saved.volume))) : 30 };
    }

    function loadHintPreference() {
      const saved = readStored(HINT_KEY);
      return saved?.version === 1 && HINT_MODES.includes(saved.mode) ? saved.mode : 'current';
    }

    let audioModule;
    function loadAudioModule() {
      if (!audioModule) audioModule = require.async('./client.audio.js').catch(error => { audioModule = null; throw error; });
      return audioModule;
    }

    function loadCursorPreference() {
      const saved = readStored(CURSOR_KEY);
      return { version: 1,
        shape: saved?.version === 1 && CURSOR_SHAPES.includes(saved.shape) ? saved.shape : 'line',
        glow: saved?.version === 1 && typeof saved.glow === 'boolean' ? saved.glow : true,
        blink: saved?.version === 1 && typeof saved.blink === 'boolean' ? saved.blink : false };
    }

    // ---------- session engine ----------

    let nextSessionId = 0;
    function createSession(duration, language = 'en', hints = language === 'en' ? 'off' : 'current', originalText, source = null, exercise = loadExercisePreference(), passageId = null) {
      const mode = exercise.mode;
      const selected = originalText ? { text: originalText, ids: [], passageId }
        : mode === 'passage' ? PracticeCorpus.selectPassage(language, { length: exercise.length, recent: loadRecent().builtin[language] }) : practiceText(language);
      const text = selected.text;
      return {
        id: ++nextSessionId,
        recordId: window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}-${nextSessionId}`,
        language,
        hints,
        source,
        annotations: null,
        annotationState: hints === 'off' ? 'off' : 'loading',
        duration,
        text,
        passageIds: selected.ids, passageId: mode === 'passage' && !source ? selected.passageId : null,
        mode, length: exercise.length,
        target: characters(text),
        typed: '',
        keystrokes: 0,
        wrongKeys: 0,
        startAt: null,
        nowMs: 0,
        result: null,
      };
    }

    function countCorrect(text, typed) {
      text = characters(text);
      typed = characters(typed);
      let correct = 0;
      const length = Math.min(text.length, typed.length);
      for (let i = 0; i < length; i++) {
        if (typed[i] === text[i]) correct += 1;
      }
      return correct;
    }

    function sessionElapsed(session) {
      if (session.result) return session.result.elapsedMs;
      if (session.startAt == null) return 0;
      return Math.max(0, session.nowMs - session.startAt);
    }

    function sessionStats(session) {
      const ms = sessionElapsed(session);
      const correct = countCorrect(session.text, session.typed);
      const accuracy = session.keystrokes > 0
        ? (session.keystrokes - session.wrongKeys) / session.keystrokes
        : 1;
      const divisor = session.language === 'en' ? 5 : 1;
      const speed = ms > 0 ? Math.round((correct / divisor) / (ms / 60000)) : 0;
      return { ms, correct, accuracy, speed };
    }

    function finishSession(session, elapsed) {
      const raw = elapsed != null ? elapsed : sessionElapsed(session);
      const ms = Math.max(1, session.mode === 'passage' ? raw : Math.min(raw, session.duration * 1000));
      const correct = countCorrect(session.text, session.typed);
      const accuracy = session.keystrokes > 0
        ? (session.keystrokes - session.wrongKeys) / session.keystrokes
        : 0;
      return {
        ...session,
        result: {
          speed: Math.round((correct / (session.language === 'en' ? 5 : 1)) / (ms / 60000)),
          language: session.language,
          hints: session.hints,
          eligible: session.mode === 'timed' && ms >= session.duration * 1000,
          accuracy: Math.max(0, Math.min(1, accuracy)),
          correct,
          keystrokes: session.keystrokes,
          wrongKeys: session.wrongKeys,
          duration: session.duration,
          elapsedMs: Math.round(ms),
          at: Date.now(),
        },
      };
    }

    function checkDeadline(session, now) {
      if (session.result) return session;
      if (session.mode === 'timed' && session.startAt != null && now - session.startAt >= session.duration * 1000) {
        return finishSession({ ...session, nowMs: now }, now - session.startAt);
      }
      return session;
    }

    // Reconcile the native buffer, not event.data: compositionend and input may
    // report the same edit. An unchanged buffer is a no-op, while a new identical
    // word is still an insertion. Native selection replacements work as well.
    function reconcileText(session, value, now) {
      session = checkDeadline(session, now);
      if (session.result) return session;
      const before = characters(session.typed);
      const after = characters(value).slice(0, session.target.length);
      let start = 0;
      while (start < before.length && start < after.length && before[start] === after[start]) start++;
      let oldEnd = before.length;
      let newEnd = after.length;
      while (oldEnd > start && newEnd > start && before[oldEnd - 1] === after[newEnd - 1]) { oldEnd--; newEnd--; }
      if (start === oldEnd && start === newEnd) return session;
      const inserted = after.slice(start, newEnd);
      const next = {
        ...session,
        typed: after.join(''),
        keystrokes: session.keystrokes + inserted.length,
        wrongKeys: session.wrongKeys + inserted.filter((char, i) => char !== session.target[start + i]).length,
        startAt: session.startAt == null && inserted.length ? now : session.startAt,
        nowMs: now,
      };
      return after.length >= session.target.length ? finishSession(next) : next;
    }

    // ---------- styles ----------

    const CSS = `
.tp-root {
  position: relative;
  isolation: isolate;
  height: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  -webkit-font-smoothing: antialiased;
}
.tp-root, .tp-root * { box-sizing: border-box; }
.tp-panel-spark { stroke: var(--dsw-alias-brand-primary); }
.tp-scroll { flex: 1; min-height: 0; overflow-y: auto; overflow-x: hidden; scrollbar-gutter: stable both-edges; }
.tp-page {
  width: 100%;
  max-width: 880px;
  min-height: 100%;
  margin: 0 auto;
  padding: 26px 30px max(32px, env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.tp-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.tp-header-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.tp-brand { display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1 1 340px; }
.tp-logo { width: 42px; height: 42px; border-radius: 12px; flex: none; display: grid; place-items: center; background: var(--dsw-alias-bg-layer-2); border: 1px solid var(--dsw-alias-border-l1); color: var(--dsw-alias-brand-primary); pointer-events: none; user-select: none; }
.tp-brandtext { min-width: 0; }
.tp-title {
  margin: 0;
  font-size: 20px;
  line-height: 1.2;
  font-weight: 650;
  letter-spacing: -0.015em;
}
.tp-subtitle {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 3px 12px;
  margin: 4px 0 0;
  font-size: 12.5px;
  color: var(--dsw-alias-label-secondary);
}
.tp-best {
  flex: none;
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 0 12px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.tp-toolbar {
  margin-top: auto;
  padding-top: 24px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.tp-practice-options { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; min-width: 0; }
.tp-seg.tp-practice-controls { display: flex; align-items: stretch; max-width: 100%; gap: 8px; }
.tp-language { display: grid; grid-template-columns: repeat(3, minmax(44px, max-content)); gap: 2px; }
.tp-exercise { display: grid; grid-template-columns: repeat(6, minmax(44px, max-content)); gap: 2px; padding-left: 9px; border-left: 1px solid var(--dsw-alias-border-l1); }
.tp-exercise .tp-seg-btn { position: relative; padding-inline: 12px; white-space: nowrap; }
.tp-exercise .tp-seg-btn:nth-child(4) { margin-left: 8px; }
.tp-exercise .tp-seg-btn:nth-child(4)::before { content: ''; position: absolute; left: -6px; top: 10px; bottom: 10px; border-left: 1px solid var(--dsw-alias-border-l1); }
.tp-seg {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 10px;
}
.tp-seg-btn {
  appearance: none;
  border: 0;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 500;
  min-height: 44px;
  min-width: 44px;
  padding: 0 14px;
  border-radius: 7px;
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease;
}
.tp-seg-btn.active {
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
}
.tp-select { position: relative; display: inline-flex; }
.tp-records-filter select, .tp-sound-field select {
  appearance: none;
  -webkit-appearance: none;
  min-height: 44px;
  max-width: 100%;
  padding: 0 36px 0 12px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  cursor: pointer;
}
.tp-select-chevron { position: absolute; right: 12px; top: 50%; width: 12px; height: 12px; transform: translateY(-50%); pointer-events: none; }
.tp-records-filter select:focus-visible, .tp-sound-field select:focus-visible { outline: 2px solid var(--dsw-alias-label-primary); outline-offset: 3px; }
.tp-annotation-status { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; color: var(--dsw-alias-label-secondary); }
.tp-corpus-controls { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; max-width: 100%; }
.tp-corpus-status { display: grid; min-width: 0; min-height: 36px; align-items: center; text-align: center; font-size: 11.5px; line-height: 18px; color: var(--dsw-alias-label-secondary); }
.tp-corpus-status > *, .tp-instructions > * { grid-area: 1 / 1; margin: 0; overflow-wrap: anywhere; }
.tp-status-size { visibility: hidden; pointer-events: none; user-select: none; }
.tp-corpus-name { font-variant-numeric: tabular-nums; }
.tp-corpus-controls .tp-seg-btn { padding: 0 10px; }
.tp-btn.tp-corpus-next { display: grid; justify-items: center; }
.tp-corpus-next > * { grid-area: 1 / 1; }
.tp-corpus-note { margin: 0; font-size: 12px; color: var(--dsw-alias-label-secondary); overflow-wrap: anywhere; }
.tp-corpus-note:empty { pointer-events: none; }
.tp-stats {
  width: 100%;
  margin: 16px 0 -2px;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}
.tp-stat {
  min-width: 0;
  padding: 11px 0 12px;
  text-align: center;
}
.tp-stat-label {
  font-size: 11.5px;
  color: var(--dsw-alias-label-secondary);
}
.tp-stat-value {
  margin-top: 2px;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 3px;
  font-size: 24px;
  line-height: 1.15;
  font-weight: 650;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}
.tp-stat.accent .tp-stat-value { color: var(--dsw-alias-brand-primary); }
.tp-stat-unit {
  font-size: 11.5px;
  font-weight: 400;
  color: var(--dsw-alias-label-secondary);
}
.tp-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0;
  background: transparent;
  border: 0;
}
.tp-timebar {
  height: 2px;
  border-radius: 999px;
  background: transparent;
  overflow: hidden;
}
.tp-timebar-fill {
  height: 100%;
  border-radius: 999px;
  background: var(--dsw-alias-brand-primary);
  transition: width 120ms linear;
}
.tp-board-wrap { position: relative; cursor: text; }
.tp-card:focus-within .tp-focus-hint { color: var(--dsw-alias-label-primary); text-decoration: underline; text-underline-offset: 3px; }
.tp-seg-btn:focus-visible, .tp-btn:focus-visible {
  outline: 2px solid var(--dsw-alias-label-primary);
  outline-offset: 3px;
}
.tp-viewport {
  --tp-row: 1.85em;
  --tp-viewport-mask: linear-gradient(to bottom, transparent, rgba(0,0,0,.45) calc(.5 * var(--tp-row)),
    #000 var(--tp-row), #000 calc(4 * var(--tp-row)), rgba(0,0,0,.42) calc(5 * var(--tp-row)), transparent calc(6 * var(--tp-row)));
  /* One faded history row, current + two clear rows, then two fading rows. */
  margin-inline: -16px;
  padding-inline: 16px;
  height: calc(6 * var(--tp-row));
  overflow: hidden;
  overflow-anchor: none;
  scroll-behavior: auto;
  -webkit-mask-image: var(--tp-viewport-mask);
  mask-image: var(--tp-viewport-mask);
  font-size: 21px;
  line-height: 1.85;
}
.tp-board {
  /* Lead/trailing room keeps the current row pinned at the start AND end. */
  padding: var(--tp-row) 2px calc(4 * var(--tp-row));
  white-space: pre-wrap;
  overflow-wrap: break-word;
  font-family: var(--tp-font-mono);
  font-size: inherit;
  line-height: inherit;
  letter-spacing: 0.3px;
  user-select: none;
}
.tp-char { color: var(--dsw-alias-label-secondary); }
.tp-char.tp-latin { font-family: var(--tp-font-mono); letter-spacing: 0.3px; }
.tp-char.correct { color: var(--dsw-alias-label-primary); }
.tp-char.wrong {
  color: var(--dsw-alias-state-error-primary);
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}
.tp-root {
  --tp-font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  --tp-cursor-color: var(--dsw-alias-brand-primary-new-colorprimary-new-color, #4176e6);
}
.tp-char.caret { position: relative; }
.tp-char.caret::before {
  content: '';
  position: absolute;
  pointer-events: none;
  box-sizing: border-box;
  left: -1px;
  top: 0;
  width: 3px;
  height: 100%;
  min-height: 1em;
  border-radius: 2px;
  background: var(--tp-cursor-color);
}
.tp-root[data-cursor-shape="underline"] .tp-char.caret::before {
  left: 0; top: auto; bottom: -2px; width: 100%; min-width: .6em; height: 3px; min-height: 0;
}
.tp-root[data-cursor-shape="outline"] .tp-char.caret::before {
  left: -1px; width: calc(100% + 2px); min-width: .6em; background: transparent; border: 2px solid var(--tp-cursor-color); border-radius: 3px;
}
.tp-root[data-cursor-glow="true"] .tp-char.caret::before {
  box-shadow: 0 0 5px color-mix(in srgb, var(--tp-cursor-color) 50%, transparent),
    -6px 0 12px 2px color-mix(in srgb, var(--tp-cursor-color) 22%, transparent),
    6px 0 12px 2px color-mix(in srgb, var(--tp-cursor-color) 22%, transparent);
}
@keyframes tp-cursor-blink { 0%, 45%, 100% { opacity: 1; } 65%, 85% { opacity: .2; } }
.tp-root[data-cursor-blink="true"] .tp-char.caret::before { animation: tp-cursor-blink 1.2s ease-in-out infinite; }
.tp-board-wrap:not(:focus-within) .tp-char.caret::before { opacity: .4; box-shadow: none; animation: none; }
.tp-board-wrap.tp-composing .tp-char.caret::before { animation: none; }
.tp-input {
  position: fixed;
  top: 0;
  left: 0;
  width: 2px;
  height: 24px;
  margin: 0;
  padding: 0;
  border: 0;
  resize: none;
  overflow: hidden;
  pointer-events: none;
  background: transparent;
  color: transparent;
  caret-color: transparent;
  cursor: text;
  font-size: 16px;
  line-height: 24px;
}
/* The blue caret and focus hint show focus; the IME anchor stays invisible. */
.tp-input:focus { outline: none; }
.tp-ime .tp-viewport { --tp-row: 2.7em; line-height: 2.7; }
.tp-ime .tp-board { font-family: inherit; letter-spacing: 0.1em; }
.tp-annotated .tp-board { letter-spacing: 0; }
.tp-ruby { ruby-align: center; margin-inline: 0.12em; line-height: 1; }
.tp-ruby .tp-char { display: inline-block; min-width: 1em; text-align: center; line-height: 1.2; }
.tp-ruby rt {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1;
  color: var(--dsw-alias-label-secondary);
  user-select: none;
}
.tp-ruby rt.tp-reading-hidden { visibility: hidden; }
.tp-composition {
  position: fixed;
  z-index: 2;
  max-width: min(360px, calc(100vw - 24px));
  padding: 1px 4px;
  border-bottom: 2px solid var(--dsw-alias-brand-primary);
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font-size: 14px;
  line-height: 20px;
  overflow-wrap: anywhere;
  pointer-events: none;
}
.tp-save-error { color: var(--dsw-alias-state-error-primary); }
.tp-focus-hint {
  color: var(--dsw-alias-label-secondary);
  font-size: 11.5px;
}
.tp-result {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 14px 0;
}
.tp-result-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
}
.tp-record {
  padding: 1px 8px;
  border: 1px solid var(--dsw-alias-state-success-primary);
  border-radius: 999px;
  color: var(--dsw-alias-state-success-primary);
  font-size: 11px;
  font-weight: 600;
}
.tp-result-grid {
  display: flex;
  gap: 22px;
  flex-wrap: wrap;
}
.tp-comparison { flex-basis: 100%; margin: 0; font-size: 12px; color: var(--dsw-alias-label-secondary); }
.tp-result-item { min-width: 60px; }
.tp-result-label {
  font-size: 11px;
  color: var(--dsw-alias-label-secondary);
}
.tp-result-value {
  font-size: 20px;
  line-height: 1.2;
  font-weight: 650;
  font-variant-numeric: tabular-nums;
}
.tp-actions { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: center; gap: 16px; }
.tp-run-actions { display: flex; align-items: center; justify-self: end; gap: 8px; }
.tp-action { position: relative; display: inline-flex; }
.tp-shortcut-tip { position: absolute; left: 50%; bottom: calc(100% + 8px); z-index: 10; padding: 5px 9px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 6px; background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary); font-size: 11.5px; white-space: nowrap; visibility: hidden; opacity: 0; transform: translate(-50%, 4px); pointer-events: none; transition: opacity 120ms ease-out, transform 120ms ease-out, visibility 120ms; }
.tp-action .tp-btn:focus-visible + .tp-shortcut-tip { visibility: visible; opacity: 1; transform: translate(-50%, 0); transition: none; }
.tp-instructions { display: grid; min-width: 0; flex: 1; font-size: 11.5px; line-height: 18px; }
.tp-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  min-width: 44px;
  padding: 0 14px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font-family: inherit;
  font-size: 12.5px;
  cursor: pointer;
}
.tp-seg-btn, .tp-btn, .tp-input { touch-action: manipulation; }
@media (hover: hover) and (pointer: fine) {
  .tp-seg-btn:hover { color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-2); }
  .tp-btn:hover {
    background: var(--dsw-alias-bg-layer-2);
    border-color: var(--dsw-alias-border-l2);
  }
}
.tp-btn.primary {
  border-color: var(--dsw-alias-brand-primary);
  color: var(--dsw-alias-brand-primary);
  font-weight: 600;
}
.tp-btn:disabled { opacity: .45; cursor: not-allowed; }
.tp-btn.tp-quiet { background: transparent; border-color: transparent; }
@media (hover: hover) and (pointer: fine) {
  .tp-btn.tp-quiet:hover:not(:disabled) { background: var(--dsw-alias-bg-layer-1); border-color: var(--dsw-alias-border-l2); }
  .tp-action:hover .tp-shortcut-tip { visibility: visible; opacity: 1; transform: translate(-50%, 0); }
}
.tp-btn.tp-quiet:active:not(:disabled) { background: var(--dsw-alias-bg-layer-2); }
.tp-toast-layer { position: absolute; inset: 12px 0 auto; height: 0; z-index: 20; display: flex; justify-content: center; pointer-events: none; }
.tp-toast { max-width: min(560px, calc(100% - 28px)); height: fit-content; margin: 0; padding: 10px 16px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 10px; background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary); box-shadow: 0 4px 18px rgb(0 0 0 / .12); font-size: 12.5px; animation: tp-toast-in 220ms cubic-bezier(.32,.72,0,1), tp-toast-out 160ms 2840ms ease-out forwards; }
@keyframes tp-toast-in { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
@keyframes tp-toast-out { to { opacity: 0; transform: translateY(-6px); } }
.tp-records-dialog { width: min(760px, calc(100vw - 32px)); height: min(680px, calc(100vh - 32px)); max-height: calc(100vh - 32px); padding: 0; margin: auto; border: 1px solid var(--dsw-alias-border-l1); border-radius: 14px; color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-base); font: inherit; }
.tp-records-dialog[open] { display: flex; flex-direction: column; }
.tp-records-dialog::backdrop { background: rgb(0 0 0 / .35); }
.tp-records-header, .tp-records-toolbar, .tp-records-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding: 12px 20px; flex: none; }
.tp-records-header h2 { margin: 0; font-size: 18px; }
.tp-btn.tp-dialog-close { width: 44px; height: 44px; padding: 0; flex: none; justify-content: center; border-radius: 10px; }
.tp-dialog-close svg { display: block; width: 24px; height: 24px; pointer-events: none; }
.tp-records-toolbar { padding-top: 0; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.tp-records-body { min-height: 0; flex: 1; overflow-y: auto; overscroll-behavior: contain; padding: 0 20px; }
.tp-records-footer { border-top: 1px solid var(--dsw-alias-border-l1); }
.tp-records-footer p { margin: 0; flex: 1 1 240px; color: var(--dsw-alias-label-secondary); font-size: 12px; }
.tp-record-list { padding: 0; margin: 0; list-style: none; }
.tp-record-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 12px; padding: 16px 0; border-bottom: 1px solid var(--dsw-alias-border-l1); font-variant-numeric: tabular-nums; }
.tp-record-row:last-child { border-bottom: 0; }
.tp-record-title { margin: 0; font-weight: 500; }
.tp-record-meta, .tp-record-detail { margin: 5px 0 0; color: var(--dsw-alias-label-secondary); font-size: 12px; overflow-wrap: anywhere; }
.tp-record-score { text-align: right; }
.tp-record-speed { font-size: 21px; font-weight: 600; }
.tp-record-unit { margin-left: 4px; font-size: 11.5px; color: var(--dsw-alias-label-secondary); }
.tp-record-link { min-height: 44px; padding: 0; margin: 0; background: transparent; border: 0; color: var(--dsw-alias-label-primary); font: inherit; font-size: 12px; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
.tp-record-link:focus-visible { outline: 2px solid var(--dsw-alias-label-primary); outline-offset: 3px; }
.tp-record-link:disabled { opacity: .45; cursor: not-allowed; }
.tp-records-context { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 10px; }
.tp-records-empty { padding: 48px 16px; text-align: center; color: var(--dsw-alias-label-secondary); }
.tp-records-legacy { margin: 22px 0 0; font-size: 13px; font-weight: 500; color: var(--dsw-alias-label-secondary); }
.tp-clear-confirm { padding: 32px 0; max-width: 480px; }
.tp-clear-confirm h3 { margin-top: 0; }
.tp-clear-confirm p { color: var(--dsw-alias-label-secondary); }
.tp-clear-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 24px; }
.tp-settings-dialog { width: min(520px, calc(100vw - 32px)); height: fit-content; }
.tp-settings-content { min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 4px 20px 24px; display: grid; gap: 12px; }
.tp-settings-section { min-width: 0; }
.tp-settings-section + .tp-settings-section, .tp-settings-note { border-top: 1px solid var(--dsw-alias-border-l1); padding-top: 12px; }
.tp-settings-section h3 { margin: 0 0 12px; font-size: 13px; font-weight: 650; }
.tp-settings-note { margin: 0; color: var(--dsw-alias-label-secondary); font-size: 12px; line-height: 1.7; }
.tp-sound-body { display: grid; gap: 12px; min-width: 0; }
.tp-sound-field { display: grid; grid-template-columns: 100px minmax(0, 1fr); align-items: center; gap: 16px; margin: 0; font-size: 13px; min-width: 0; }
.tp-sound-field .tp-select, .tp-sound-field select { width: 100%; min-width: 0; }
.tp-sound-picker { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px; align-items: center; }
.tp-sound-volume { display: flex; align-items: center; gap: 16px; }
.tp-sound-volume input { flex: 1; min-width: 0; min-height: 44px; margin: 0; accent-color: var(--dsw-alias-label-primary); }
.tp-sound-volume output { width: 4ch; text-align: right; font-variant-numeric: tabular-nums; }
.tp-sound-status { display: grid; margin: 0; color: var(--dsw-alias-label-secondary); font-size: 12px; line-height: 18px; }
.tp-hint-status[data-empty="true"], .tp-cursor-status[data-empty="true"] { display: none; }
.tp-sound-status > span { grid-area: 1 / 1; }
.tp-sound-credit { font-size: 11px; color: var(--dsw-alias-label-secondary); text-underline-offset: 3px; }
.tp-cursor-preview { display: flex; justify-content: center; align-items: center; min-height: 60px; margin: 0; border-radius: 8px; background: var(--dsw-alias-bg-layer-2); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 26px; line-height: 1.25; }
.tp-cursor-preview-text { white-space: pre; }
.tp-cursor-toggles { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
.tp-cursor-toggle { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 44px; font-size: 13px; cursor: pointer; }
.tp-cursor-toggle input { appearance: none; flex: none; position: relative; width: 36px; height: 22px; margin: 0; border: 1px solid var(--dsw-alias-border-l1); border-radius: 999px; background: var(--dsw-alias-bg-layer-3); cursor: pointer; }
.tp-cursor-toggle input::before { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: var(--dsw-alias-label-primary); transition: transform 150ms ease-out; }
.tp-cursor-toggle input:checked { background: var(--dsw-alias-label-primary); }
.tp-cursor-toggle input:checked::before { background: var(--dsw-alias-bg-base); transform: translateX(14px); }
.tp-cursor-toggle input:focus-visible { outline: 2px solid var(--dsw-alias-label-primary); outline-offset: 3px; }
.tp-foot {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 11.5px;
  color: var(--dsw-alias-label-secondary);
}
@media (max-width: 720px) {
  .tp-page { padding: 18px 14px max(32px, env(safe-area-inset-bottom)); }
  .tp-title { font-size: 18px; }
  .tp-stats { gap: 8px; }
  .tp-stat-value { font-size: 22px; }
  .tp-viewport { font-size: 18px; }
  .tp-records-header, .tp-records-toolbar, .tp-records-footer { padding-left: 14px; padding-right: 14px; }
  .tp-records-body { padding: 0 14px; }
}
@media (max-width: 680px) {
  .tp-practice-options { width: 100%; }
  .tp-seg.tp-practice-controls { flex-direction: column; width: 100%; gap: 3px; }
  .tp-language { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .tp-exercise { grid-template-columns: repeat(3, minmax(0, 1fr)); padding: 3px 0 0; border-left: 0; border-top: 1px solid var(--dsw-alias-border-l1); }
  .tp-exercise .tp-seg-btn:nth-child(4) { margin-left: 0; }
  .tp-exercise .tp-seg-btn:nth-child(4)::before { content: none; }
}
@media (max-width: 680px) {
  .tp-actions { grid-template-columns: minmax(0, 1fr) auto; gap: 8px 12px; }
  .tp-instructions { grid-column: 1; grid-row: 1; }
  .tp-run-actions { grid-column: 2; grid-row: 1; }
  .tp-corpus-status { grid-column: 1 / -1; grid-row: 2; }
}
@media (max-width: 480px) {
  .tp-actions { grid-template-columns: minmax(0, 1fr); }
  .tp-instructions { grid-column: 1; grid-row: 1; }
  .tp-corpus-status { grid-column: 1; grid-row: 2; min-height: 18px; }
  .tp-run-actions { grid-column: 1; grid-row: 3; margin-top: 36px; }
  .tp-settings-content { padding-inline: 14px; }
  .tp-sound-field { grid-template-columns: minmax(0, 1fr); gap: 6px; }
  .tp-sound-picker { align-items: end; }
  .tp-cursor-toggles { gap: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .tp-seg-btn, .tp-timebar-fill { transition: none; }
  .tp-root[data-cursor-blink] .tp-char.caret::before { animation: none; }
  .tp-cursor-toggle input::before { transition: none; }
  .tp-shortcut-tip { transition: none; transform: translate(-50%, 0); }
  .tp-toast { animation: none; }
}
`;

    // ---------- board ----------

    function revealCaret(viewport) {
      if (!viewport) return;
      const caret = viewport.querySelector('[data-input-anchor]');
      const first = viewport.querySelector('.tp-char');
      if (!caret || !first) return;
      const lineHeight = parseFloat(window.getComputedStyle(viewport).lineHeight);
      if (!Number.isFinite(lineHeight) || lineHeight <= 0) return;
      // Align every new row immediately, including backtracking and the last
      // row. The board's padding reserves one history row and four future rows.
      // Rounding ignores mixed-script glyph/reading offsets within one line.
      const row = Math.max(0, Math.round((caret.getBoundingClientRect().top - first.getBoundingClientRect().top) / lineHeight));
      const offset = row * lineHeight;
      if (Math.abs(viewport.scrollTop - offset) > .5) viewport.scrollTop = offset;
    }

    function revealInputRegion(viewport) {
      const caret = viewport?.querySelector('[data-input-anchor]');
      if (!caret) return;
      const host = (viewport.closest?.('.tp-scroll') || viewport.closest?.('.tp-root'))?.getBoundingClientRect();
      const top = Math.max(12, host?.top ?? 0);
      const bottom = Math.min(window.innerHeight - 12, host?.bottom ?? window.innerHeight);
      const region = viewport.getBoundingClientRect();
      // Reveal the six-row region once on focus/resize if a small host clips
      // it. During ordinary typing only revealCaret moves the inner text.
      const fits = region.bottom - region.top <= bottom - top;
      const rect = fits ? region : caret.getBoundingClientRect();
      if (rect.top < top || rect.bottom > bottom) {
        viewport.parentElement.scrollIntoView({ block: fits ? 'nearest' : 'center' });
      }
    }

    function positionInput(viewport, input, preview) {
      if (!viewport || !input) return;
      const anchor = viewport.querySelector('[data-input-anchor]');
      if (!anchor) return;
      const bounds = viewport.getBoundingClientRect();
      const rect = anchor.getBoundingClientRect();
      const left = Math.max(12, Math.min(rect.left, bounds.right - 4, window.innerWidth - 16));
      const top = Math.max(12, Math.min(rect.top, bounds.bottom - 24, window.innerHeight - 28));
      input.style.left = `${left}px`;
      input.style.top = `${top}px`;
      if (preview) {
        preview.style.left = `${Math.min(left, Math.max(12, window.innerWidth - 160))}px`;
        preview.style.top = `${Math.min(top + rect.height + 2, window.innerHeight - 48)}px`;
      }
    }

    const TextBoard = React.memo(function TextBoard({ text, typed, caretIndex, finished, annotations, hints }) {
      const nodes = [];
      const target = characters(text);
      const entered = characters(typed);
      for (let i = 0; i <= target.length; i++) {
        const ch = target[i] || '\u200b';
        // Latin text, digits and ASCII punctuation use the same metrics in all
        // languages; Han characters and their ruby readings keep their fonts.
        let className = 'tp-char' + (/^(?:[\x20-\x7e]|\p{Script=Latin}\p{M}*)$/u.test(ch) ? ' tp-latin' : '');
        if (i < entered.length) {
          className += entered[i] === ch ? ' correct' : ' wrong';
        }
        if (i === caretIndex && !finished) className += ' caret';
        const character = h('span', { className, key: i, 'data-input-anchor': i === caretIndex ? '' : undefined }, ch);
        const token = annotations && annotations[i];
        if (hints !== 'off' && token && token.reading) {
          const visible = hints === 'all' || (caretIndex >= token.wordStart && caretIndex < token.wordEnd);
          nodes.push(h('ruby', { className: 'tp-ruby', key: i }, character,
            h('rt', { className: visible ? 'tp-reading' : 'tp-reading tp-reading-hidden', 'aria-hidden': !visible }, token.reading),
          ));
        } else nodes.push(character);
      }
      return h('div', { className: 'tp-board' }, nodes);
    });

    function Stat({ label, value, unit, accent, description }) {
      return h('div', { className: accent ? 'tp-stat accent' : 'tp-stat', title: description },
        h('div', { className: 'tp-stat-label' }, label),
        h('div', { className: 'tp-stat-value' },
          String(value),
          unit ? h('span', { className: 'tp-stat-unit' }, unit) : null,
        ),
      );
    }

    function ResultItem({ label, value }) {
      return h('div', { className: 'tp-result-item' },
        h('div', { className: 'tp-result-label' }, label),
        h('div', { className: 'tp-result-value' }, String(value)),
      );
    }

    // ---------- sidebar icon ----------

    function PanelIcon({ size = 20, active }) {
      const edge = size || 20;
      return h('svg', {
        width: edge,
        height: edge,
        viewBox: '0 0 24 24',
        fill: 'none',
        'aria-hidden': true,
        focusable: false,
        style: { display: 'block', opacity: active ? 1 : 0.85 },
      },
        h('rect', {
          x: 2.6, y: 5.4, width: 18.8, height: 13.2, rx: 3,
          stroke: 'currentColor', strokeWidth: 1.6,
        }),
        h('path', {
          d: 'M6.2 9.4v1.2M9.4 9.4v1.2M12.6 9.4v1.2M15.8 9.4v1.2M6.2 12.6v1.2M9.4 12.6v1.2M12.6 12.6v1.2M15.8 12.6v1.2',
          stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round',
        }),
        h('path', {
          d: 'M7.6 16.1h8.8',
          stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round',
        }),
        h('path', {
          className: 'tp-panel-spark',
          d: 'M4.2 2.9 2.8 1.7M6.8 2.2V.9',
          strokeWidth: 1.4, strokeLinecap: 'round',
        }),
      );
    }

    // ---------- page ----------

    function useLocaleVersion() {
      const [, setVersion] = React.useState(0);
      React.useEffect(() => {
        const service = localeService;
        if (!service || typeof service.subscribe !== 'function') return undefined;
        let dispose = null;
        try {
          dispose = service.subscribe(() => {
            activeLanguage = detectLanguage(service);
            setVersion((version) => version + 1);
          });
        } catch {
          return undefined;
        }
        return () => {
          if (typeof dispose === 'function') dispose();
        };
      }, []);
    }

    function TypingPage() {
      useLocaleVersion();
      const [session, setSession] = React.useState(() => createSession(loadExercisePreference().duration));
      React.useEffect(() => { rememberSession(session); }, [session.id]);
      const [records, setRecords] = React.useState(loadRecords);
      const best = records.best;
      const legacyBest = records.legacy;
      const [isRecord, setIsRecord] = React.useState(false);
      const [comparison, setComparison] = React.useState(null);
      const [recordsOpen, setRecordsOpen] = React.useState(false);
      const [recordsView, setRecordsView] = React.useState('recent');
      const [recordsLanguage, setRecordsLanguage] = React.useState('all');
      const [recordsPassage, setRecordsPassage] = React.useState(null);
      const [clearConfirm, setClearConfirm] = React.useState(false);
      const [clearError, setClearError] = React.useState(false);
      const recordsDialogRef = React.useRef(null);
      const recordsButtonRef = React.useRef(null);
      const recordsCloseRef = React.useRef(null);
      const recordsShowAllRef = React.useRef(null);
      const clearCancelRef = React.useRef(null);
      const clearButtonRef = React.useRef(null);
      const [soundPreference, setSoundPreference] = React.useState(loadSoundPreference);
      const soundPreferenceRef = React.useRef(soundPreference);
      const [settingsOpen, setSettingsOpen] = React.useState(false);
      const [soundStatus, setSoundStatus] = React.useState('idle');
      const [soundSaveError, setSoundSaveError] = React.useState(false);
      const settingsDialogRef = React.useRef(null);
      const settingsButtonRef = React.useRef(null);
      const settingsCloseRef = React.useRef(null);
      const audioRef = React.useRef({ context: null, player: null, pack: null, preparing: null, epoch: 0, disposed: false, status: 'idle' });
      const [cursorPreference, setCursorPreference] = React.useState(loadCursorPreference);
      const [cursorSaveError, setCursorSaveError] = React.useState(false);
      const [focused, setFocused] = React.useState(false);
      const [saveError, setSaveError] = React.useState(false);
      const [hintPreference, setHintPreference] = React.useState(loadHintPreference);
      const [hintSaveError, setHintSaveError] = React.useState(false);
      const [annotationAttempt, setAnnotationAttempt] = React.useState(0);
      const [corpusBusy, setCorpusBusy] = React.useState(false);
      const [toast, setToast] = React.useState(null);
      const toastSequence = React.useRef(0);
      const [isApple] = React.useState(() => /Mac|iPhone|iPad|iPod/i.test(window.navigator?.userAgentData?.platform || window.navigator?.platform || ''));
      React.useEffect(() => {
        if (!toast) return undefined;
        const timer = window.setTimeout(() => setToast(null), 3000);
        return () => window.clearTimeout(timer);
      }, [toast]);
      const [corpusPreference, setCorpusPreference] = React.useState(loadCorpusPreference);
      const [corpusPreferenceError, setCorpusPreferenceError] = React.useState(false);
      const [exercisePreference, setExercisePreference] = React.useState(loadExercisePreference);
      const [exerciseSaveError, setExerciseSaveError] = React.useState(false);
      React.useEffect(() => {
        try { window.localStorage.setItem(EXERCISE_KEY, JSON.stringify({ version: 2, preset: exercisePreference.preset })); setExerciseSaveError(false); }
        catch { setExerciseSaveError(true); }
      }, [exercisePreference.preset]);
      const corpusRequest = React.useRef(null);
      const [caretIndex, setCaretIndex] = React.useState(0);
      const [composition, setComposition] = React.useState({ active: false, text: '' });
      const compositionRef = React.useRef({ active: false, anchor: 0 });
      const inputRef = React.useRef(null);
      const previewRef = React.useRef(null);
      const viewportRef = React.useRef(null);
      const sessionRef = React.useRef(session);
      const focusAfterRestart = React.useRef(false);
      const recordsRef = React.useRef(records);
      const handledResultRef = React.useRef(null);

      function updateSession(update) {
        const next = update(sessionRef.current);
        sessionRef.current = next;
        setSession(next);
        return next;
      }

      function position() {
        positionInput(viewportRef.current, inputRef.current, previewRef.current);
      }

      React.useLayoutEffect(() => {
        const dialog = recordsDialogRef.current;
        if (!dialog) return;
        if (recordsOpen && !dialog.open) { dialog.showModal(); recordsCloseRef.current?.focus(); }
        else if (!recordsOpen && dialog.open) { dialog.close(); recordsButtonRef.current?.focus({ preventScroll: true }); }
      }, [recordsOpen]);

      React.useEffect(() => {
        if (clearConfirm) clearCancelRef.current?.focus();
      }, [clearConfirm]);

      React.useLayoutEffect(() => {
        const dialog = settingsDialogRef.current;
        if (!dialog) return;
        if (settingsOpen && !dialog.open) {
          dialog.showModal();
          (dialog.querySelector?.('select') || settingsCloseRef.current)?.focus();
        } else if (!settingsOpen && dialog.open) { dialog.close(); settingsButtonRef.current?.focus({ preventScroll: true }); }
      }, [settingsOpen]);

      function stopSound() {
        audioRef.current.epoch++;
        audioRef.current.player?.stop();
      }

      function audioStatus(status) {
        if (audioRef.current.disposed) return;
        audioRef.current.status = status;
        setSoundStatus(status);
      }

      async function prepareSound(preview = false) {
        const state = audioRef.current;
        const settings = soundPreferenceRef.current;
        if (state.disposed || settings.pack === 'off' || !settings.volume) return false;
        const epoch = state.epoch;
        let context;
        try {
          // Construct/resume synchronously in the click, focus or key gesture.
          if (!state.context) {
            const Audio = window.AudioContext || window.webkitAudioContext;
            if (!Audio) throw new Error('Web Audio unavailable');
            state.context = new Audio({ latencyHint: 'interactive' });
          }
          context = state.context;
          const resumed = context.state === 'running' ? Promise.resolve() : context.resume();
          // Handle rejection immediately, even while the local chunk is loading.
          const resumeResult = Promise.resolve(resumed).then(() => true, () => false);
          if (!state.player) {
            audioStatus('loading');
            const module = await loadAudioModule();
            if (state.disposed || state.context !== context) return false;
            if (!state.player) state.player = module.createAudioPlayer(context, module.samples, status => {
              if (state.context === context) audioStatus(status);
            });
          }
          if (state.disposed || state.context !== context || settings.pack !== soundPreferenceRef.current.pack) return false;
          state.player.setVolume(soundPreferenceRef.current.volume);
          if (state.pack !== settings.pack || state.status === 'error') {
            state.pack = settings.pack;
            state.preparing = state.player.select(settings.pack);
          }
          const ready = await state.preparing;
          const resumedOk = await resumeResult;
          if (state.disposed || state.context !== context || settings.pack !== soundPreferenceRef.current.pack) return false;
          if (!resumedOk || context.state !== 'running') { audioStatus('error'); return false; }
          if (preview && ready && epoch === state.epoch && !document.hidden) return state.player.preview();
          return Boolean(ready);
        } catch { if (!context || state.context === context) audioStatus('error'); return false; }
      }

      function changeSound(patch) {
        const next = { ...soundPreferenceRef.current, ...patch };
        if (!SOUND_PACKS.includes(next.pack) || !Number.isFinite(next.volume)) return;
        next.volume = Math.max(0, Math.min(100, Math.round(next.volume)));
        soundPreferenceRef.current = next; setSoundPreference(next);
        stopSound();
        try { window.localStorage.setItem(SOUND_KEY, JSON.stringify(next)); setSoundSaveError(false); }
        catch { setSoundSaveError(true); }
        const state = audioRef.current;
        state.player?.setVolume(next.volume);
        if (next.pack === 'off') {
          state.pack = 'off'; state.player?.select('off'); audioStatus('idle');
        } else if (next.volume) void prepareSound();
      }

      function playKeySound(event, input) {
        const current = sessionRef.current;
        const state = audioRef.current;
        if (document.hidden || document.activeElement !== event.currentTarget || current.result || !inputReady()
          || current.mode === 'timed' && current.startAt != null && performance.now() - current.startAt >= current.duration * 1000
          || event.repeat || input.repeat || event.ctrlKey || event.metaKey || event.altKey
          || soundPreferenceRef.current.pack === 'off' || !soundPreferenceRef.current.volume) return;
        const key = event.key;
        const composing = compositionRef.current.active || input.isComposing || event.isComposing || input.keyCode === 229;
        if (!(key?.length === 1 || ['Backspace', 'Delete', 'Process', 'Unidentified'].includes(key) || key === 'Enter' && composing)) return;
        const kind = key === ' ' || input.code === 'Space' ? 'space' : key === 'Backspace' || key === 'Delete' ? 'backspace' : key === 'Enter' ? 'enter' : 'generic';
        if (state.player && state.context.state === 'running' && state.status === 'ready' && state.pack === soundPreferenceRef.current.pack) state.player.play(kind);
        else if (state.status !== 'error') void prepareSound(); // Drop unready keystrokes, never replay a burst.
      }

      React.useEffect(() => {
        const state = audioRef.current;
        state.disposed = false;
        const hidden = () => { if (document.hidden) stopSound(); };
        document.addEventListener('visibilitychange', hidden);
        window.addEventListener('blur', stopSound);
        return () => {
          state.disposed = true; stopSound();
          document.removeEventListener('visibilitychange', hidden);
          window.removeEventListener('blur', stopSound);
          if (state.player) state.player.dispose();
          else if (state.context) { try { Promise.resolve(state.context.close()).catch(() => {}); } catch { /* Already closed. */ } }
          state.player = null; state.context = null; state.pack = null;
        };
      }, []);

      React.useLayoutEffect(() => {
        if (viewportRef.current) viewportRef.current.scrollTop = 0;
        if (focusAfterRestart.current) {
          focusAfterRestart.current = false;
          focusInput();
        }
      }, [session.id]);

      React.useLayoutEffect(() => {
        revealCaret(viewportRef.current);
        position();
      }, [session.id, session.typed, session.annotations, caretIndex, composition.text]);

      React.useEffect(() => {
        if (session.hints === 'off') return undefined;
        let cancelled = false;
        const id = session.id;
        loadAnnotations(session.language, session.text).then(annotations => {
          if (cancelled || sessionRef.current.id !== id) return;
          updateSession(previous => ({ ...previous, annotations, annotationState: 'ready' }));
        }).catch(() => {
          if (cancelled || sessionRef.current.id !== id) return;
          updateSession(previous => ({ ...previous, annotationState: 'error' }));
        });
        return () => { cancelled = true; };
      }, [session.id, annotationAttempt]);

      React.useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return undefined;
        const resize = () => {
          revealCaret(viewport);
          if (document.activeElement === inputRef.current) {
            revealInputRegion(viewport);
          }
          position();
        };
        const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
        if (observer) observer.observe(viewport);
        window.addEventListener('scroll', position, true);
        window.addEventListener('resize', resize);
        return () => {
          if (observer) observer.disconnect();
          window.removeEventListener('scroll', position, true);
          window.removeEventListener('resize', resize);
        };
      }, []);

      React.useEffect(() => {
        if (session.startAt == null || session.result) return undefined;
        const id = window.setInterval(() => {
          updateSession((previous) => {
            if (previous.startAt == null || previous.result) return previous;
            const now = performance.now();
            const elapsed = now - previous.startAt;
            if (previous.mode === 'timed' && elapsed >= previous.duration * 1000) {
              return finishSession({ ...previous, nowMs: now }, elapsed);
            }
            return { ...previous, nowMs: now };
          });
        }, 100);
        return () => window.clearInterval(id);
      }, [session.startAt, session.result]);

      React.useEffect(() => {
        const result = session.result;
        if (!result) {
          handledResultRef.current = null;
          return;
        }
        if (handledResultRef.current === result) return;
        handledResultRef.current = result;
        stopSound();
        const entry = historyEntry(session);
        const previous = recordsRef.current;
        const key = recordKey(result.language, result.duration, result.hints, entry.corpusVersion, entry.source);
        const current = result.eligible ? previous.best[key] : entry.mode === 'passage' ? samePassageBest(previous.history, entry) : null;
        const better = isBetter(result, current);
        setComparison(result.eligible || entry.mode === 'passage' ? { previous: current || null, mode: entry.mode } : null);
        setIsRecord(result.eligible ? better : entry.mode === 'passage' && Boolean(current) && better);
        const next = {
          ...previous,
          history: [entry, ...previous.history.filter(item => item.id !== entry.id)].slice(0, HISTORY_LIMIT),
          best: result.eligible && better ? { ...previous.best, [key]: { speed: result.speed, accuracy: result.accuracy, at: result.at } } : previous.best,
        };
        recordsRef.current = next;
        setRecords(next);
        setSaveError(!saveRecords(next));
      }, [session.result]);

      function openRecords() {
        const current = sessionRef.current;
        if (current.startAt != null && !current.result || compositionRef.current.active) return;
        stopSound();
        cancelCorpus();
        setRecordsPassage(null);
        setClearConfirm(false); setClearError(false); setRecordsOpen(true);
      }

      function closeRecords() {
        setClearConfirm(false); setClearError(false); setRecordsOpen(false);
      }

      React.useLayoutEffect(() => {
        if (recordsPassage) recordsShowAllRef.current?.focus();
      }, [recordsPassage]);

      function clearRecords() {
        const empty = { version: 3, best: {}, legacy: {}, history: [] };
        if (!saveRecords(empty)) { setClearError(true); return; }
        recordsRef.current = empty; setRecords(empty);
        setSaveError(false); setIsRecord(false); setComparison(null);
        setRecordsPassage(null); setClearConfirm(false); setClearError(false);
        recordsCloseRef.current?.focus();
      }

      React.useEffect(() => () => { corpusRequest.current?.abort(); corpusRequest.current = null; }, []);

      // A remembered local source also applies when the page is reopened or
      // the practice language changes, until a failed selection falls back.
      React.useEffect(() => {
        if (corpusPreference === 'local') nextPassage(false);
      }, [corpusPreference, session.language, session.mode, session.length, session.duration]);

      function changeCorpusPreference(source) {
        if (!['builtin', 'local'].includes(source) || source === corpusPreference) return;
        restart(session.duration, false, session.language, session.hints, null, null);
        setCorpusPreference(source);
        setCorpusPreferenceError(!saveCorpusPreference(source));
      }

      function changeExercise(preset) {
        const next = exerciseFor(preset);
        if (!next || next.preset === exercisePreference.preset) return;
        setExercisePreference(next);
        restart(next.duration, false, session.language, session.hints, null, null, next);
      }

      function exerciseKeyDown(event, index) {
        const presets = [...DURATIONS.map(String), ...PracticeCorpus.TEXT_LENGTHS];
        const keys = { ArrowRight: (index + 1) % presets.length, ArrowDown: (index + 1) % presets.length,
          ArrowLeft: (index + presets.length - 1) % presets.length, ArrowUp: (index + presets.length - 1) % presets.length,
          Home: 0, End: presets.length - 1 };
        if (!Object.hasOwn(keys, event.key)) return;
        event.preventDefault();
        event.currentTarget.parentElement.querySelectorAll('[role="radio"]')[keys[event.key]].focus();
        changeExercise(presets[keys[event.key]]);
      }

      function cancelCorpus() {
        corpusRequest.current?.abort(); corpusRequest.current = null;
        setCorpusBusy(false); setToast(null);
      }

      async function nextPassage(focus = true) {
        if (corpusRequest.current) { cancelCorpus(); return; }
        if (corpusPreference === 'builtin') {
          restart(session.duration, focus, session.language, session.hints, null, null);
          return;
        }
        const controller = new AbortController();
        corpusRequest.current = controller;
        const current = sessionRef.current;
        setCorpusBusy(true); setToast(null);
        let timeout;
        const deadline = new Promise((_, reject) => {
          timeout = setTimeout(() => { controller.abort(); reject(new Error('timeout')); }, 12000);
        });
        let candidate = null;
        let fallback = 'corpusEmpty';
        try {
          const params = new URLSearchParams({ language: current.language, mode: current.mode, length: current.length });
          for (const fingerprint of current.source?.fingerprints || [current.source?.fingerprint].filter(Boolean)) params.append('exclude', fingerprint);
          for (const fingerprint of loadRecent().local[current.language]) params.append('recent', fingerprint);
          // Desktop owns an authenticated carrier; relative global fetch there
          // addresses the static dsh-app page rather than its Host API.
          const transport = window.__DSH_TRANSPORT__;
          const send = transport?.fetch ? transport.fetch.bind(transport) : fetch;
          const body = await Promise.race([deadline, (async () => {
            const response = await send('/api/typing-practice/recent?' + params, { signal: controller.signal, cache: 'no-store' });
            if (!response.ok) throw new Error('unavailable');
            return response.json();
          })()]);
          const item = body.candidate;
          if (item && item.language === current.language && typeof item.text === 'string' && item.text.length > 0
            && (current.mode === 'timed' ? item.mode === 'timed' && item.text.length >= TEXT_CHARS
              && Array.isArray(item.source?.fingerprints) && item.source.fingerprints.length > 0 && item.source.fingerprints.length <= PracticeCorpus.RECENT_LIMIT
              && item.source.fingerprints.every(id => typeof id === 'string' && /^[a-f0-9]{64}$/.test(id))
              : item.mode !== 'timed' && (item.length == null ? current.length === 'short' : item.length === current.length))
            && item.text.length <= 3000 && (current.mode === 'timed' ? /^[a-f0-9]{64}$/.test(item.source?.fingerprint || '') : item.source?.sessionId)) candidate = item;
          if (!candidate && !['empty', 'limited', 'insufficient'].includes(body.reason)) fallback = 'corpusUnavailable';
        } catch { fallback = 'corpusUnavailable'; }
        finally { clearTimeout(timeout); }
        if (corpusRequest.current !== controller || sessionRef.current.id !== current.id) return;
        corpusRequest.current = null;
        setCorpusBusy(false);
        if (candidate) {
          restart(current.duration, focus, current.language, current.hints, candidate.text, candidate.source);
        } else {
          restart(current.duration, focus, current.language, current.hints, null, null);
          setCorpusPreference('builtin');
          setCorpusPreferenceError(!saveCorpusPreference('builtin'));
          setToast({ message: fallback, id: ++toastSequence.current });
        }
      }

      function restart(nextDuration, focus = false, language = session.language, hints = language === 'en' ? 'off' : hintPreference, originalText, source = language === session.language ? session.source : null,
        exercise = exercisePreference) {
        stopSound();
        cancelCorpus();
        const duration = nextDuration || session.duration;
        // Change the epoch before blurring. Some IMEs commit on blur; that
        // commit belongs to the old input node and must not enter the new run.
        const preserve = language === session.language && exercise.mode === session.mode && exercise.length === session.length;
        const text = originalText === null ? undefined : originalText || (source || preserve && session.mode === 'passage' ? session.text : undefined);
        const passageId = !source && text === session.text ? session.passageId : null;
        updateSession(() => createSession(duration, language, hints, text, source, exercise, passageId));
        if (inputRef.current) inputRef.current.blur();
        compositionRef.current = { active: false, anchor: 0 };
        setComposition({ active: false, text: '' });
        setCaretIndex(0);
        setIsRecord(false);
        setComparison(null);
        setSaveError(false);
        focusAfterRestart.current = focus;
      }

      function currentEvent() {
        return session.id === sessionRef.current.id;
      }

      function nativeEvent(event) { return event.nativeEvent || event; }

      function restartCurrent() {
        const current = sessionRef.current;
        restart(current.duration, true, current.language, current.hints, current.text, current.source);
      }

      function handlePracticeShortcut(event) {
        const next = event.key?.toLowerCase() === 'r' && !event.shiftKey && !event.altKey
          && (isApple ? event.metaKey && !event.ctrlKey : event.ctrlKey && !event.metaKey);
        const reset = event.key === 'Escape' && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
        if ((!next && !reset) || event.defaultPrevented) return;
        // Keep native candidate/select Escape and modal dismissal intact. A
        // matching reload chord is suppressed here even when no action is safe.
        if (next) event.preventDefault();
        const input = nativeEvent(event);
        if (recordsOpen || settingsOpen || event.target?.closest?.('dialog, select')
          || compositionRef.current.active || input.isComposing || event.isComposing || input.keyCode === 229) return;
        event.preventDefault(); event.stopPropagation();
        if (event.repeat || input.repeat) return;
        if (next) void nextPassage();
        else restartCurrent();
      }

      function inputReady() {
        return ['off', 'ready'].includes(sessionRef.current.annotationState);
      }

      function startComposition(text) {
        if (text) updateSession((previous) => {
          const now = performance.now();
          const checked = checkDeadline(previous, now);
          return checked.result || checked.startAt != null ? checked
            : { ...checked, startAt: now, nowMs: now };
        });
        setComposition({ active: true, text });
      }

      function handleCompositionStart(event) {
        if (!currentEvent() || sessionRef.current.result || !inputReady()) return;
        compositionRef.current = { active: true, anchor: caretIndex };
        startComposition(event.data || '');
      }

      function handleCompositionUpdate(event) {
        if (!currentEvent()) return;
        if (!compositionRef.current.active) return;
        startComposition(event.data || '');
      }

      function updateCaret(element) {
        if (!element || compositionRef.current.active) return;
        const end = element.selectionEnd == null ? element.value.length : element.selectionEnd;
        setCaretIndex(characters(element.value.slice(0, end)).length);
      }

      function acceptBuffer(element) {
        if (!inputReady()) {
          element.value = sessionRef.current.typed;
          return;
        }
        const now = performance.now();
        const next = updateSession((previous) => reconcileText(previous, element.value, now));
        if (element.value !== next.typed) element.value = next.typed;
        updateCaret(element);
      }

      function handleCompositionEnd(event) {
        if (!currentEvent() || !compositionRef.current.active) return;
        compositionRef.current.active = false;
        setComposition({ active: false, text: '' });
        // The native buffer already contains the confirmed text (or the
        // restored pre-composition text after cancellation). Do not guess a
        // candidate from the target text or append event.data a second time.
        acceptBuffer(event.currentTarget);
      }

      function handleInput(event) {
        if (!currentEvent()) return;
        if (!inputReady()) { event.currentTarget.value = sessionRef.current.typed; return; }
        const input = nativeEvent(event);
        if (input.isComposing || compositionRef.current.active) {
          if (!compositionRef.current.active) compositionRef.current = { active: true, anchor: caretIndex };
          startComposition(input.data || '');
          return;
        }
        if (['insertFromPaste', 'insertFromDrop', 'insertFromYank'].includes(input.inputType)) {
          event.currentTarget.value = sessionRef.current.typed;
          updateCaret(event.currentTarget);
          return;
        }
        acceptBuffer(event.currentTarget);
      }

      function handleKeyDown(event) {
        if (!currentEvent()) return;
        if (event.key === 'Tab') return;
        if (!inputReady()) { event.preventDefault(); return; }
        const input = nativeEvent(event);
        playKeySound(event, input);
        // React's keyboard event and the browser's native event can disagree
        // at the edges of a composition. Let the IME own candidate keys.
        if (compositionRef.current.active || input.isComposing || event.isComposing || input.keyCode === 229) return;
        const checked = updateSession((previous) => checkDeadline(previous, performance.now()));
        if (checked.result || event.key === 'Enter') event.preventDefault();
      }

      function focusInput() {
        const element = inputRef.current;
        if (element) element.focus({ preventScroll: true });
      }

      function blockEvent(event) {
        event.preventDefault();
      }

      function renderRecordScore(speed, accuracy, language) {
        return h('div', { className: 'tp-record-score' },
          h('span', { className: 'tp-record-speed' }, speed),
          h('span', { className: 'tp-record-unit' }, t(language === 'en' ? 'statsWpm' : 'statsCpm')),
          h('p', { className: 'tp-record-meta' }, t('statsAccuracy') + ' ' + Math.round(accuracy * 100) + '%'));
      }

      function openSettings() {
        const current = sessionRef.current;
        if (current.startAt != null && !current.result || compositionRef.current.active) return;
        cancelCorpus(); stopSound(); setSettingsOpen(true);
      }

      function closeSettings() { stopSound(); setSettingsOpen(false); }

      function renderDialogClose(label, ref, onClick) {
        return h('button', { className: 'tp-btn tp-quiet tp-dialog-close', type: 'button', ref, onClick, 'aria-label': label },
          h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8,
            strokeLinecap: 'round', 'aria-hidden': true, focusable: false },
            h('path', { d: 'M5 5 19 19M19 5 5 19' })));
      }

      function renderSettings() {
        const props = { className: 'tp-records-dialog tp-settings-dialog', ref: settingsDialogRef, onClose: closeSettings };
        if (!settingsOpen) return h('dialog', props);
        return h('dialog', { ...props, 'aria-labelledby': 'tp-settings-title',
          onCancel: event => { event.preventDefault(); closeSettings(); }, onKeyDown: event => event.stopPropagation() },
          h('div', { className: 'tp-records-header' }, h('h2', { id: 'tp-settings-title' }, t('settings')),
            renderDialogClose(t('settingsClose'), settingsCloseRef, closeSettings)),
          h('div', { className: 'tp-settings-content' },
            [['cursor', renderCursor], ['annotations', renderAnnotations], ['sound', renderSound]].map(([section, render]) =>
              h('section', { key: section, className: 'tp-settings-section', 'aria-labelledby': 'tp-settings-' + section },
                h('h3', { id: 'tp-settings-' + section }, t(section)), render())),
            h('p', { className: 'tp-settings-note' }, t('settingsLocalTextNote'))));
      }

      function renderAnnotations() {
        return h('div', { className: 'tp-sound-body' },
          h('label', { className: 'tp-sound-field' },
            h('span', null, t('hintDisplay')),
            h('span', { className: 'tp-select' }, h('select', {
              value: hintPreference, 'aria-label': t('hintDisplay'), title: session.language === 'en' ? undefined : t('hintChange'),
              onChange: event => {
                const hints = event.currentTarget.value;
                if (!HINT_MODES.includes(hints) || hints === hintPreference && !hintSaveError) return;
                setHintPreference(hints);
                try { window.localStorage.setItem(HINT_KEY, JSON.stringify({ version: 1, mode: hints })); setHintSaveError(false); }
                catch { setHintSaveError(true); }
                if (session.language !== 'en' && hints !== session.hints) restart(session.duration, false, session.language, hints, session.text);
              },
            }, HINT_MODES.map(mode => h('option', { key: mode, value: mode }, t('hint_' + mode)))),
            h('svg', { className: 'tp-select-chevron', viewBox: '0 0 12 12', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false },
              h('path', { d: 'M3 4.5 6 7.5 9 4.5' })))),
          h('div', { className: 'tp-sound-status tp-hint-status', 'data-empty': !hintSaveError },
            h('span', { className: 'tp-status-size', 'aria-hidden': true }, t('hintSaveError')),
            h('span', { role: 'status' }, hintSaveError ? t('hintSaveError') : '')));
      }

      function changeCursor(patch) {
        const next = { ...cursorPreference, ...patch };
        if (!CURSOR_SHAPES.includes(next.shape) || typeof next.glow !== 'boolean' || typeof next.blink !== 'boolean') return;
        setCursorPreference(next);
        try { window.localStorage.setItem(CURSOR_KEY, JSON.stringify(next)); setCursorSaveError(false); }
        catch { setCursorSaveError(true); }
      }

      function renderCursor() {
        return h('div', { className: 'tp-sound-body' },
            h('div', { className: 'tp-cursor-preview', role: 'img', 'aria-label': t('cursorPreview') },
              h('span', { className: 'tp-cursor-preview-text', 'aria-hidden': true }, 'Aa ', h('span', { className: 'tp-char caret' }, '中'), '文')),
            h('label', { className: 'tp-sound-field' }, h('span', null, t('cursorShape')),
              h('span', { className: 'tp-select' }, h('select', { value: cursorPreference.shape, 'aria-label': t('cursorShape'), onChange: event => changeCursor({ shape: event.currentTarget.value }) },
                CURSOR_SHAPES.map(shape => h('option', { key: shape, value: shape }, t('cursor_' + shape)))),
                h('svg', { className: 'tp-select-chevron', viewBox: '0 0 12 12', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false }, h('path', { d: 'M3 4.5 6 7.5 9 4.5' })))),
            h('div', { className: 'tp-cursor-toggles' }, ['glow', 'blink'].map(option => h('label', { className: 'tp-cursor-toggle', key: option },
              h('span', null, t(option === 'glow' ? 'cursorGlow' : 'cursorBlink')),
              h('input', { type: 'checkbox', role: 'switch', checked: cursorPreference[option], onChange: event => changeCursor({ [option]: event.currentTarget.checked }) })))),
            h('div', { className: 'tp-sound-status tp-cursor-status', 'data-empty': !cursorSaveError },
              h('span', { className: 'tp-status-size', 'aria-hidden': true }, t('cursorSaveError')),
              h('span', { role: 'status' }, cursorSaveError ? t('cursorSaveError') : '')));
      }

      function renderSound() {
        return h('div', { className: 'tp-sound-body' },
          h('div', { className: 'tp-sound-picker' },
            h('label', { className: 'tp-sound-field' }, h('span', null, t('soundPack')),
              h('span', { className: 'tp-select' }, h('select', { value: soundPreference.pack, 'aria-label': t('soundPack'), onChange: event => changeSound({ pack: event.currentTarget.value }) },
                SOUND_PACKS.map(pack => h('option', { key: pack, value: pack }, t('sound_' + pack)))),
                h('svg', { className: 'tp-select-chevron', viewBox: '0 0 12 12', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false }, h('path', { d: 'M3 4.5 6 7.5 9 4.5' })))),
            h('button', { className: 'tp-btn', type: 'button', disabled: soundPreference.pack === 'off' || !soundPreference.volume,
              onClick: () => { stopSound(); void prepareSound(true); } }, t('soundPreview'))),
            h('label', { className: 'tp-sound-field' }, h('span', null, t('soundVolume')),
              h('span', { className: 'tp-sound-volume' }, h('input', { type: 'range', min: 0, max: 100, step: 5, value: soundPreference.volume,
                'aria-valuetext': soundPreference.volume + '%', onChange: event => changeSound({ volume: Number(event.currentTarget.value) }) }),
              h('output', { 'aria-hidden': true }, soundPreference.volume + '%'))),
            h('div', { className: 'tp-sound-status tp-audio-status' },
              h('span', { className: 'tp-status-size', 'aria-hidden': true }, t('soundLoading')),
              h('span', { role: 'status' }, soundSaveError ? t('soundSaveError') : soundStatus === 'loading' ? t('soundLoading') : soundStatus === 'error' ? t('soundError') : '')),
            h('a', { className: 'tp-sound-credit', href: 'https://github.com/tplai/kbsim', target: '_blank', rel: 'noreferrer' }, t('soundCredit')),
          );
      }

      function renderRecords() {
        // Keep history rendering off the keystroke path while the dialog is closed.
        if (!recordsOpen) return h('dialog', { className: 'tp-records-dialog', ref: recordsDialogRef, onClose: closeRecords });
        const history = records.history.filter(item => (recordsLanguage === 'all' || item.language === recordsLanguage)
          && (!recordsPassage || passageKey(item) === recordsPassage));
        const bestRows = Object.entries(best).filter(([key]) => recordsLanguage === 'all' || key.startsWith(recordsLanguage + ':')).sort(([a], [b]) => a.localeCompare(b));
        const legacyRows = ['all', 'en'].includes(recordsLanguage) ? Object.entries(legacyBest) : [];
        const hasRecords = records.history.length || Object.keys(best).length || Object.keys(legacyBest).length;
        return h('dialog', { className: 'tp-records-dialog', ref: recordsDialogRef,
          'aria-labelledby': 'tp-records-title', 'aria-describedby': 'tp-records-limit',
          onCancel: event => {
            event.preventDefault();
            if (clearConfirm) { setClearConfirm(false); setClearError(false); recordsCloseRef.current?.focus(); }
            else closeRecords();
          },
          onClose: closeRecords,
          onKeyDown: event => event.stopPropagation(),
        },
          h('div', { className: 'tp-records-header' },
            h('h2', { id: 'tp-records-title' }, t('recordsTitle')),
            renderDialogClose(t('recordsClose'), recordsCloseRef, closeRecords)),
          !clearConfirm ? h('div', { className: 'tp-records-toolbar' },
            h('div', { className: 'tp-seg', role: 'group', 'aria-label': t('recordsTitle') },
              ['recent', 'best'].map(view => h('button', { type: 'button', key: view,
                className: 'tp-seg-btn' + (recordsView === view ? ' active' : ''), 'aria-pressed': recordsView === view,
                onClick: () => { setRecordsView(view); setRecordsPassage(null); },
              }, t(view === 'recent' ? 'recordsRecent' : 'recordsBest')))),
            h('span', { className: 'tp-select tp-records-filter' },
              h('select', { value: recordsLanguage, 'aria-label': t('recordsLanguage'), onChange: event => {
                const language = event.currentTarget.value;
                if (language === 'all' || LANGUAGES.includes(language)) { setRecordsLanguage(language); setRecordsPassage(null); }
              } }, ['all', ...LANGUAGES].map(language => h('option', { key: language, value: language }, t(language === 'all' ? 'recordsAll' : 'language_' + language)))),
              h('svg', { className: 'tp-select-chevron', viewBox: '0 0 12 12', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false }, h('path', { d: 'M3 4.5 6 7.5 9 4.5' }))),
          ) : null,
          h('div', { className: 'tp-records-body' },
            clearConfirm ? h('div', { className: 'tp-clear-confirm' },
              h('h3', null, t('recordsClearTitle')),
              h('p', null, t('recordsClearBody')),
              clearError ? h('p', { className: 'tp-save-error', role: 'alert' }, t('recordsClearError')) : null,
              h('div', { className: 'tp-clear-actions' },
                h('button', { className: 'tp-btn', type: 'button', ref: clearCancelRef, onClick: () => {
                  setClearConfirm(false); setClearError(false); recordsCloseRef.current?.focus();
                } }, t('recordsCancel')),
                h('button', { className: 'tp-btn', type: 'button', onClick: clearRecords }, t('recordsClearConfirm'))),
            ) : recordsView === 'recent' ? h('div', null,
              recordsPassage ? h('div', { className: 'tp-records-context' }, h('span', null, t('recordsSameTitle')),
                h('button', { className: 'tp-record-link', type: 'button', ref: recordsShowAllRef, onClick: () => {
                  setRecordsPassage(null); recordsCloseRef.current?.focus();
                } }, t('recordsShowAll'))) : null,
              history.length ? h('ol', { className: 'tp-record-list' }, history.map(item => h('li', { className: 'tp-record-row', key: item.id },
                h('div', null,
                  h('p', { className: 'tp-record-title' }, t('language_' + item.language) + ' · ' + t(item.source === 'local' ? 'corpusLocal' : item.corpusVersion === 1 ? 'recordsOldCorpus' : 'corpusBuiltin')),
                  h('p', { className: 'tp-record-meta' },
                    (item.mode === 'timed' ? t('recordsTimed', { n: item.duration }) : t('corpusCount', { n: item.targetLength }))
                    + (item.length ? ' · ' + t('length_' + item.length) : '') + ' · ' + t('recordsHints', { mode: t('hint_' + item.hints) }) + ' · ' + t(item.status === 'early' ? 'recordsEarly' : 'recordsCompleted')),
                  h('p', { className: 'tp-record-detail' }, t('recordsDetails', { seconds: (item.elapsedMs / 1000).toFixed(1), correct: item.correct, errors: item.wrongKeys })),
                  h('p', { className: 'tp-record-meta' }, formatRecordDate(item.at)),
                  passageKey(item) && !recordsPassage ? h('button', { type: 'button', className: 'tp-record-link', onClick: () => setRecordsPassage(passageKey(item)) }, t('recordsSame')) : null,
                ), renderRecordScore(item.speed, item.accuracy, item.language),
              ))) : h('p', { className: 'tp-records-empty' }, t('recordsEmpty')),
            ) : h('div', null,
              bestRows.length ? h('ul', { className: 'tp-record-list' }, bestRows.map(([key, item]) => {
                const [language, duration, source, hints] = key.split(':');
                return h('li', { className: 'tp-record-row', key }, h('div', null,
                  h('p', { className: 'tp-record-title' }, t('language_' + language) + ' · ' + t('recordsTimed', { n: duration }) + ' · ' + t(source === 'local' ? 'corpusLocal' : 'corpusBuiltin')),
                  h('p', { className: 'tp-record-meta' }, t('recordsHints', { mode: t('hint_' + (hints === 'plain' ? 'off' : hints)) }) + (source === 'local' || key.endsWith(':corpus' + PracticeCorpus.CORPUS_VERSION) ? '' : ' · ' + t('recordsOldCorpus'))),
                  h('p', { className: 'tp-record-meta' }, formatRecordDate(item.at))), renderRecordScore(item.speed, item.accuracy, language));
              })) : h('p', { className: 'tp-records-empty' }, t('recordsBestEmpty')),
              legacyRows.length ? h('div', null, h('h3', { className: 'tp-records-legacy' }, t('recordsLegacy')),
                h('ul', { className: 'tp-record-list' }, legacyRows.map(([duration, item]) => h('li', { className: 'tp-record-row', key: duration },
                  h('div', null, h('p', { className: 'tp-record-title' }, t('language_en') + ' · ' + t('recordsTimed', { n: duration })),
                    h('p', { className: 'tp-record-meta' }, formatRecordDate(item.at))), renderRecordScore(item.wpm, item.accuracy, 'en'))))) : null,
            ),
          ),
          h('div', { className: 'tp-records-footer' },
            h('p', { id: 'tp-records-limit' }, t('recordsLimit')),
            !clearConfirm ? h('button', { className: 'tp-record-link', type: 'button', ref: clearButtonRef, disabled: !hasRecords,
              onClick: () => { setClearError(false); setClearConfirm(true); },
            }, t('recordsClear')) : null),
        );
      }

      const stats = sessionStats(session);
      const result = session.result;
      const shownSpeed = result ? result.speed : stats.speed;
      const isIme = session.language !== 'en';
      const speedUnit = t(isIme ? 'statsCpm' : 'statsWpm');
      const shownAccuracy = Math.round((result ? result.accuracy : stats.accuracy) * 100);
      const remaining = Math.max(0, Math.ceil((session.duration * 1000 - stats.ms) / 1000));
      const progress = Math.max(0, Math.min(1, session.mode === 'passage' ? characters(session.typed).length / session.target.length : stats.ms / (session.duration * 1000)));
      const bestForDuration = best[recordKey(session.language, session.duration, session.hints, PracticeCorpus.CORPUS_VERSION, session.source ? 'local' : 'builtin')] || null;
      const legacy = !isIme && !session.source && legacyBest[session.duration];
      const isPassage = session.mode === 'passage';
      const running = session.startAt != null && !result || composition.active;

      return h('div', { className: 'tp-root' + (isIme ? ' tp-ime' : '') + (session.hints !== 'off' ? ' tp-annotated' : ''),
        onKeyDownCapture: handlePracticeShortcut,
        'data-cursor-shape': cursorPreference.shape, 'data-cursor-glow': String(cursorPreference.glow), 'data-cursor-blink': String(cursorPreference.blink) },
        h('div', { className: 'tp-toast-layer', role: 'status', 'aria-live': 'polite', 'aria-atomic': true },
          toast ? h('p', { className: 'tp-toast', key: toast.id }, t(toast.message)) : null),
        h('div', { className: 'tp-scroll' },
        h('div', { className: 'tp-page' },
          h('header', { className: 'tp-header' },
            h('div', { className: 'tp-brand' },
              h('div', { className: 'tp-logo', 'aria-hidden': true }, h(PanelIcon, { size: 28, active: true })),
              h('div', { className: 'tp-brandtext' },
                h('h1', { className: 'tp-title' }, t('panelTitle')),
                h('p', { className: 'tp-subtitle' }, h('span', null, t('panelSubtitle')),
                  h('span', { className: 'tp-privacy-note' }, t('corpusFooter')))),
            ),
            h('div', { className: 'tp-header-actions' },
              h('div', { className: 'tp-best', style: { visibility: isPassage ? 'hidden' : 'visible' } },
              isPassage ? t('corpusPassage') : bestForDuration
                ? t('bestValue', { speed: bestForDuration.speed, unit: speedUnit, acc: Math.round(bestForDuration.accuracy * 100) })
                : legacy && Number.isFinite(legacy.wpm) && Number.isFinite(legacy.accuracy)
                  ? t('legacyBestValue', { speed: legacy.wpm, acc: Math.round(legacy.accuracy * 100) }) : t('bestNone'),
              ),
              h('button', { className: 'tp-btn tp-quiet', type: 'button', ref: recordsButtonRef, onClick: openRecords,
                disabled: running, title: running ? t('recordsRunning') : undefined, 'aria-haspopup': 'dialog',
              }, t('records')),
              h('button', { className: 'tp-btn tp-quiet', type: 'button', ref: settingsButtonRef, disabled: running,
                title: running ? t('settingsRunning') : undefined, 'aria-haspopup': 'dialog', onClick: openSettings }, t('settings')),
            ),
          ),
          h('div', { className: 'tp-stats', role: 'group', 'aria-label': t('liveStats') },
            h(Stat, { label: speedUnit, value: shownSpeed, accent: true, description: isIme ? t('cpmTip') : undefined }),
            h(Stat, { label: t('statsAccuracy'), value: shownAccuracy, unit: t('unitPercent') }),
            h(Stat, { label: t('statsErrors'), value: result ? result.wrongKeys : session.wrongKeys }),
            h(Stat, { label: t(isPassage ? 'corpusElapsed' : 'statsRemaining'), value: isPassage ? Math.floor(stats.ms / 1000) : remaining, unit: t('unitSeconds') }),
          ),
          h('div', { className: 'tp-card' },
            h('div', {
              className: 'tp-timebar',
              role: 'progressbar',
              'aria-label': t('timebarLabel'),
              'aria-valuemin': 0,
              'aria-valuemax': 100,
              'aria-valuenow': Math.round(progress * 100),
            },
              h('div', { className: 'tp-timebar-fill', style: { width: (progress * 100).toFixed(1) + '%' } }),
            ),
            h('div', { className: 'tp-board-wrap' + (composition.active ? ' tp-composing' : ''), onClick: focusInput },
              h('div', { className: 'tp-viewport', ref: viewportRef, tabIndex: -1 },
                h(TextBoard, {
                  text: session.text,
                  typed: session.typed,
                  caretIndex: composition.active ? compositionRef.current.anchor : caretIndex,
                  finished: Boolean(result),
                  annotations: session.annotations,
                  hints: session.hints,
                }),
              ),
              h('textarea', {
                key: session.id,
                ref: inputRef,
                className: 'tp-input',
                'aria-label': t('inputLabel'),
                'aria-describedby': 'tp-start-hint',
                readOnly: !inputReady() || Boolean(result) && !composition.active,
                wrap: 'off',
                autoComplete: 'off',
                autoCorrect: 'off',
                autoCapitalize: 'off',
                spellCheck: false,
                onKeyDown: handleKeyDown,
                onPaste: blockEvent,
                onDrop: blockEvent,
                onInput: handleInput,
                onCompositionStart: handleCompositionStart,
                onCompositionUpdate: handleCompositionUpdate,
                onCompositionEnd: handleCompositionEnd,
                onSelect: (event) => { if (currentEvent()) updateCaret(event.currentTarget); },
                onFocus: (event) => {
                  setFocused(true);
                  void prepareSound();
                  revealCaret(viewportRef.current);
                  revealInputRegion(viewportRef.current);
                  position();
                },
                onBlur: () => { setFocused(false); stopSound(); },
              }),
              composition.active && composition.text ? h('div', {
                className: 'tp-composition', ref: previewRef, 'aria-hidden': true,
              }, composition.text) : null,
            ),
            result ? h('div', { className: 'tp-result', role: 'status', 'aria-live': 'polite' },
              h('div', { className: 'tp-result-title' },
                h('span', null, isPassage ? t('corpusCompleted', { seconds: (result.elapsedMs / 1000).toFixed(1) }) : result.eligible ? t('resultTitle') : t('resultEarly', { seconds: (result.elapsedMs / 1000).toFixed(1) })),
                isRecord ? h('span', { className: 'tp-record' }, t(isPassage ? 'newPassageRecord' : 'newRecordBadge')) : null,
              ),
              h('div', { className: 'tp-result-grid' },
                h(ResultItem, { label: speedUnit, value: result.speed }),
                h(ResultItem, { label: t('resultAccuracy'), value: Math.round(result.accuracy * 100) + '%' }),
                h(ResultItem, { label: t('resultCorrect'), value: result.correct }),
                h(ResultItem, { label: t('resultErrors'), value: result.wrongKeys }),
              ),
              comparison ? h('p', { className: 'tp-comparison' }, comparison.previous
                ? t(comparison.mode === 'passage' ? 'comparePassage' : 'compareTimed', {
                  speed: comparison.previous.speed, unit: speedUnit, acc: Math.round(comparison.previous.accuracy * 100),
                  delta: (result.speed > comparison.previous.speed ? '+' : '') + (result.speed - comparison.previous.speed),
                }) : t(comparison.mode === 'passage' ? 'compareFirstPassage' : 'compareFirst')) : null,
            ) : null,
            h('div', { className: 'tp-actions' },
              h('div', { className: 'tp-instructions' },
                ['focusHint', 'restartHint', 'restartHintIme', 'hintLoading'].map(key => h('span', {
                  key, className: 'tp-status-size', 'aria-hidden': true,
                }, t(key))),
                h('span', { className: 'tp-focus-hint', id: 'tp-start-hint',
                  style: { visibility: result || !inputReady() || session.startAt != null ? 'hidden' : 'visible' },
                }, t(focused ? (isIme ? 'restartHintIme' : 'restartHint') : 'focusHint')),
                !inputReady() ? h('div', { className: 'tp-annotation-status', role: 'status' },
                  h('span', null, t(session.annotationState === 'error' ? 'hintError' : 'hintLoading')),
                  session.annotationState === 'error' ? h('button', {
                    className: 'tp-btn', type: 'button',
                    onClick: () => {
                      updateSession(previous => ({ ...previous, annotationState: 'loading' }));
                      setAnnotationAttempt(attempt => attempt + 1);
                    },
                  }, t('hintRetry')) : null,
                ) : null,
              ),
              h('div', { className: 'tp-corpus-status' },
                h('span', { className: 'tp-status-size', 'aria-hidden': true }, t('corpusLoading')),
                h('span', { className: 'tp-corpus-name', title: session.source?.title || undefined,
                  style: { visibility: corpusBusy ? 'hidden' : 'visible' } },
                  (session.source ? t('corpusRecent') : t('corpusBuiltin')) + ' · ' + t('corpusCount', { n: session.target.length })),
                h('p', { className: 'tp-corpus-note', role: 'status', 'aria-atomic': true }, corpusBusy ? t('corpusLoading') : '')),
              h('div', { className: 'tp-run-actions' },
                h('span', { className: 'tp-action' },
                  h('button', { type: 'button', className: 'tp-btn tp-quiet tp-corpus-next', onClick: () => nextPassage(),
                    'aria-label': t(corpusBusy ? 'corpusCancel' : 'corpusNext'), 'aria-describedby': 'tp-next-shortcut',
                    'aria-keyshortcuts': isApple ? 'Meta+R' : 'Control+R' },
                    h('span', null, t(corpusBusy ? 'corpusCancel' : 'corpusNext')),
                    h('span', { className: 'tp-status-size', 'aria-hidden': true }, t('corpusNext')),
                    h('span', { className: 'tp-status-size', 'aria-hidden': true }, t('corpusCancel'))),
                  h('span', { className: 'tp-shortcut-tip', id: 'tp-next-shortcut', role: 'tooltip' }, isApple ? '⌘ R' : 'Ctrl+R')),
                h('span', { className: 'tp-action' },
                  h('button', { type: 'button', className: 'tp-btn tp-quiet tp-restart', onClick: restartCurrent,
                    'aria-label': t('restartRun'), 'aria-describedby': 'tp-restart-shortcut', 'aria-keyshortcuts': 'Escape' }, t('restartRun')),
                  h('span', { className: 'tp-shortcut-tip', id: 'tp-restart-shortcut', role: 'tooltip' }, 'Esc'))),
            ),
          ),
          h('div', { className: 'tp-toolbar' },
            h('div', { className: 'tp-practice-options' },
            h('div', { className: 'tp-seg tp-practice-controls' },
              h('div', { className: 'tp-language', role: 'group', 'aria-label': t('languageLabel') },
                LANGUAGES.map((language) => h('button', {
                  key: language,
                  type: 'button',
                  className: 'tp-seg-btn' + (language === session.language ? ' active' : ''),
                  'aria-pressed': language === session.language,
                  onClick: () => restart(session.duration, false, language),
                }, t('language_' + language))),
              ),
              h('div', { className: 'tp-exercise', role: 'radiogroup', 'aria-label': t('exerciseLabel') },
                [...DURATIONS.map(String), ...PracticeCorpus.TEXT_LENGTHS].map((preset, index) => h('button', {
                  key: preset, type: 'button', role: 'radio',
                  className: 'tp-seg-btn' + (preset === exercisePreference.preset ? ' active' : ''),
                  'aria-checked': preset === exercisePreference.preset, tabIndex: preset === exercisePreference.preset ? 0 : -1,
                  onKeyDown: event => exerciseKeyDown(event, index), onClick: () => changeExercise(preset),
                }, PracticeCorpus.TEXT_LENGTHS.includes(preset) ? t('length_' + preset) : t('durationOption', { n: preset }))))),
            ),
            h('div', { className: 'tp-corpus-controls' },
              h('div', { className: 'tp-seg', role: 'group', 'aria-label': t('corpusSource') },
                ['builtin', 'local'].map(source => h('button', {
                  key: source, type: 'button',
                  className: 'tp-seg-btn' + (source === corpusPreference ? ' active' : ''),
                  'aria-pressed': source === corpusPreference,
                  onClick: () => changeCorpusPreference(source),
                }, t(source === 'builtin' ? 'corpusBuiltin' : 'corpusLocal'))))),
          ),
          exerciseSaveError || corpusPreferenceError || saveError ? h('div', { className: 'tp-foot' },
            exerciseSaveError ? h('span', { className: 'tp-corpus-note tp-preference-error', role: 'status' }, t('exerciseSaveError')) : null,
            corpusPreferenceError ? h('span', { className: 'tp-corpus-note tp-preference-error', role: 'status' }, t('corpusPreferenceError')) : null,
            saveError ? h('span', { className: 'tp-save-error', role: 'status' }, t('storageError')) : null,
          ) : null,
          renderRecords(),
          renderSettings(),
        )),
      );
    }

    // ---------- plugin ----------

    return {
      inject: ['slots'],
      apply(ctx) {
        const slots = ctx.get('slots');
        if (!slots) return;

        const locale = ctx.get('locale');
        if (locale) {
          localeService = locale;
          activeLanguage = detectLanguage(locale);
          try {
            const disposeLocale = locale.register(NS, dictionaries);
            if (typeof disposeLocale === 'function') ctx.effect(() => disposeLocale);
          } catch {
            // keep the built-in dictionary when the locale service rejects it
          }
          try {
            const bound = locale.bind(NS);
            if (typeof bound === 'function') {
              const fallback = (key) => (dictionaries[activeLanguage] || zh)[key] ?? key;
              t = (key, vars) => {
                let text;
                try {
                  text = bound(key);
                } catch {
                  text = undefined;
                }
                if (!text || text === key) text = fallback(key);
                return interpolate(text, vars);
              };
            }
          } catch {
            // fall back to the built-in dictionary
          }
        }

        ctx.effect(() => {
          const style = document.createElement('style');
          style.setAttribute('data-typing-practice-style', '');
          style.textContent = CSS;
          document.head.appendChild(style);
          return () => style.remove();
        });

        slots.inject('sidebar.panellist', () => slots.register({
          name: 'sidebar.panellist',
          id: 'typing-practice',
          order: 15,
          label: () => t('panelLabel'),
          locale: NS,
        }, PanelIcon));

        slots.inject('main', () => slots.register({
          name: 'main',
          key: 'typing-practice',
        }, TypingPage));
      },
    };
  },
});
