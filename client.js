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
    const SOUND_KEY = 'dsh.typing-practice.sound.v1';
    const SOUND_PACKS = ['off', 'mxblue', 'mxbrown', 'cream', 'holypanda'];
    const CURSOR_KEY = 'dsh.typing-practice.cursor.v1';
    const CURSOR_SHAPES = ['line', 'underline', 'outline'];
    const LANGUAGES = ['en', 'zh', 'yue'];
    const HINT_MODES = ['off', 'current', 'all'];
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
      footerTip: '输入错误可退格修正；最佳成绩只保存在本机浏览器。',
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
      footerTip: 'Backspace fixes mistakes; best scores stay in this browser.',
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
var s=Object.defineProperty;var w=Object.getOwnPropertyDescriptor;var m=Object.getOwnPropertyNames;var f=Object.prototype.hasOwnProperty;var y=(a,t)=>{for(var i in t)s(a,i,{get:t[i],enumerable:!0})},b=(a,t,i,h)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of m(t))!f.call(a,n)&&n!==i&&s(a,n,{get:()=>t[n],enumerable:!(h=w(t,n))||h.enumerable});return a};var x=a=>b(s({},"__esModule",{value:!0}),a);var T={};y(T,{CORPUS_VERSION:()=>v,RECENT_LIMIT:()=>I,entries:()=>p,selectPractice:()=>z});module.exports=x(T);var l={version:2,license:"MIT",provenance:{kind:"original",description:"Written for typing-practice. No third-party passages or user conversations are included."},entries:[{id:"en-travel-01",language:"en",topic:"travel",text:"The bus stop was quieter than usual when we arrived. A notice said that the next bus would leave in ten minutes, so we waited under the shelter. My friend checked the route while I looked for our tickets. When the bus came, we found two seats by the window and watched the town wake up."},{id:"en-travel-02",language:"en",topic:"travel",text:"We reached the station early enough to buy breakfast before the train left. The bakery near the entrance had just opened, and the bread was still warm. We carried our bags to the platform and checked the departure board. There was no need to rush, so we ate slowly and talked about the journey ahead."},{id:"en-travel-03",language:"en",topic:"travel",text:`The rain stopped just before we left the museum. "Let's walk back," my sister said, pointing to a quiet street beside the river. We passed a small bookshop and stopped to look through the window. By the time we reached our hotel, the clouds had cleared and the evening light was reflected on the water.`},{id:"en-travel-04",language:"en",topic:"travel",text:"Before setting out for the coast, we checked the weather and packed a light jacket. The path from the village was easy to follow, with signs at each turning. We paused at a bench overlooking the sea and shared some fruit. After a short rest, we continued at a steady pace and reached the beach before noon."},{id:"en-food-01",language:"en",topic:"food",text:"I wrote a short shopping list before leaving for the market. We already had rice and eggs at home, but we needed vegetables for dinner. At the first stall, I chose a few tomatoes and asked for a paper bag. Buying only what we needed made the journey home lighter and left less food to waste."},{id:"en-food-02",language:"en",topic:"food",text:"Making soup became easier once I prepared everything before turning on the stove. I washed the vegetables, cut them into small pieces, and placed a bowl nearby for the peelings. While the soup cooked, I cleared the table and set out two spoons. Soon the kitchen was tidy again, and we could sit down to eat."},{id:"en-food-03",language:"en",topic:"food",text:"Our friends brought different dishes to lunch, so nobody had to prepare the whole meal. I made a salad while another guest warmed the bread. We put everything in the middle of the table and passed the bowls around. The conversation lasted much longer than the meal, and we agreed to meet again the following month."},{id:"en-food-04",language:"en",topic:"food",text:`A new cafe opened near the library last week. On Saturday morning, I stopped there after returning a book and chose a table away from the door. The owner asked whether the music was too loud. "It's fine here," I replied, then opened my notebook and wrote down a few ideas while waiting for breakfast.`},{id:"en-work-01",language:"en",topic:"work",text:"Before starting the next task, I read through yesterday's notes. One question was still unanswered, so I added it to the meeting agenda instead of guessing. When the team arrived, we settled that point first and divided the remaining work. Everyone left with a clear next step, and the afternoon passed without another long meeting."},{id:"en-work-02",language:"en",topic:"work",text:"The shared folder had become difficult to use because several files had almost identical names. We agreed on a simple naming rule and moved the older copies into an archive. I tested the arrangement by looking for a report from last month. Finding it quickly showed that the new structure was worth keeping."},{id:"en-work-03",language:"en",topic:"work",text:"I was about to send the document when I noticed that one date did not match the schedule. Rather than changing it from memory, I checked the original note and corrected both places. A final reading took only a few minutes. After sending the file, I recorded the change so that the next person would understand it."},{id:"en-work-04",language:"en",topic:"work",text:"A large task felt more manageable after we divided it into smaller parts. We began with the section that had the fewest unknowns and used it to check our approach. The first attempt revealed a missing step, which we added to the plan. Progress was slower that morning, but the remaining work became much clearer."},{id:"en-learning-01",language:"en",topic:"learning",text:"I keep a small notebook beside me when learning something new. Instead of copying every sentence, I write down the main idea and one example that makes sense to me. At the end of the day, I try to explain the idea without looking. Any part I cannot explain becomes a question for the next session."},{id:"en-learning-02",language:"en",topic:"learning",text:"The first exercise looked simple, but I made the same mistake twice. I stopped, compared my answer with the instructions, and found that I had skipped a small detail. On the next attempt, I worked more slowly and checked each step. Getting it right helped more than finishing quickly with the same error."},{id:"en-learning-03",language:"en",topic:"learning",text:"Our study group meets in the library once a week. Each person brings one question and takes a turn explaining how they approached it. Sometimes a clear example helps more than a long explanation. Before leaving, we choose a small task to try on our own and discuss the results at the next meeting."},{id:"en-learning-04",language:"en",topic:"learning",text:"I wanted to practise a little every day, so I chose a time that already fitted my routine. After breakfast, I spent ten minutes reviewing a short lesson before opening other apps. Some days were easier than others, but the small sessions added up. Keeping the task simple made it easier to return the following morning."},{id:"en-reading-01",language:"en",topic:"reading",text:"The book I borrowed had a map printed inside the front cover. At first I skipped it, but later I found myself turning back to follow the characters' journey. The place names began to feel familiar after a few chapters. I read more slowly than usual and enjoyed noticing how each scene connected to the next."},{id:"en-reading-02",language:"en",topic:"reading",text:"At the library, a display of staff recommendations caught my attention. I picked up a short book about a subject I knew little about and read the opening page. The writing was clear enough to draw me in without a long introduction. I borrowed it along with the novel I had originally come to find."},{id:"en-reading-03",language:"en",topic:"reading",text:"A friend and I decided to read the same story over the weekend. When we met on Monday, we discovered that we had noticed completely different details. One conversation that I barely remembered had changed her view of the ending. Talking about the story made me want to read that part again with more care."},{id:"en-reading-04",language:"en",topic:"reading",text:"I used to leave bookmarks in several unfinished books at once. This month, I chose one to keep beside my chair and put the others back on the shelf. Reading a few pages each evening made the story easier to follow. When I reached the end, I wrote a short note about the part I liked best."},{id:"en-home-01",language:"en",topic:"home",text:"The light by my desk was too far from the page, so I moved the lamp before starting work. I also cleared away a stack of old papers and left only the things I needed. The room itself had not changed much, but the desk felt easier to use. I could find a pen without moving everything else."},{id:"en-home-02",language:"en",topic:"home",text:"We set aside a rainy afternoon to sort the cupboard in the hall. Empty boxes went into one pile, useful things into another, and items to give away into a third. A missing scarf turned up behind an old bag. By the end, there was enough room to close the door without pushing anything inside."},{id:"en-home-03",language:"en",topic:"home",text:"A small plant on the windowsill began leaning towards the light. I turned its pot a little and moved the books that were shading one side. Over the next few days, I paid closer attention to the leaves and the soil. Looking after that one corner made me notice more about the room around it."},{id:"en-home-04",language:"en",topic:"home",text:"Before going to bed, I put my keys and bag in the same place near the door. I checked what I would need in the morning and filled a bottle with water. The routine took only a moment, but it saved a search through the house the next day. I left home with time to spare."},{id:"en-hobbies-01",language:"en",topic:"hobbies",text:"I took my camera on a walk without planning to visit anywhere special. At the corner of our street, sunlight fell across an old wall and made a pattern of shadows. I waited for a person to pass, then took a photograph. The picture reminded me that familiar places can look different when I slow down."},{id:"en-hobbies-02",language:"en",topic:"hobbies",text:"Our local team practised passing before playing a short game. We began close together, then moved farther apart once everyone found a comfortable rhythm. A few passes went wide, but we collected the ball and tried again. By the end of the session, the quieter players were asking for the ball more often."},{id:"en-hobbies-03",language:"en",topic:"hobbies",text:"I had not drawn for years, so I began with a cup on the kitchen table. The first sketch looked uneven, but I could see where the handle needed to move. I tried again on a fresh page and noticed more of the shape. Keeping both drawings helped me see a small improvement instead of only the mistakes."},{id:"en-hobbies-04",language:"en",topic:"hobbies",text:"We chose a simple board game for an evening with friends. One person read the rules aloud while the rest of us set out the pieces. After a practice round, everyone understood what to do. We played several short games, changed seats between rounds, and laughed when a plan failed in an unexpected way."},{id:"en-nature-01",language:"en",topic:"nature",text:"On the way to work, I passed the same tree every morning without paying much attention. One day, a few new leaves caught the light above the pavement. I began looking up as I walked past and noticed the branches changing over the following weeks. A familiar route became a little more interesting."},{id:"en-nature-02",language:"en",topic:"nature",text:"The park was quiet after the rain, with small puddles along the path. We walked around them and watched a bird searching the grass near a bench. Farther ahead, the clouds opened enough for sunlight to reach the pond. We stayed there for a few minutes before continuing our walk towards the gate."},{id:"en-nature-03",language:"en",topic:"nature",text:"We visited the community garden on a cool Sunday morning. A volunteer showed us where the paths ended and asked us to stay clear of the young plants. We helped carry empty pots to a shed and swept the steps near the entrance. Before leaving, we sat outside and enjoyed the quieter part of the morning."},{id:"en-nature-04",language:"en",topic:"nature",text:"The wind became stronger as we climbed the last part of the hill. At the top, we put on our jackets and found a sheltered place to rest. The fields below looked smaller than we expected from the path. We ate our lunch, checked the time, and started down while there was still plenty of daylight."},{id:"zh-travel-01",language:"zh",topic:"travel",text:"早上出门时，我发现公交站比平时安静。站牌显示下一班车还有一会儿才到，于是我走到雨棚下，把车票和水杯放进容易拿到的位置。车来了以后，我找到一个靠窗的座位，看着街边的店铺陆续开门，原本有些匆忙的心情也慢慢平静下来。"},{id:"zh-travel-02",language:"zh",topic:"travel",text:"我们提前到了车站，先看清站台的位置，再去附近的小店买早餐。刚出炉的面包还有一点烫，大家便坐在长椅上慢慢吃。等到广播提醒检票，我们收好包装，把行李提到身边。这次没有一路奔跑，出发前反而多了一点聊天的时间。"},{id:"zh-travel-03",language:"zh",topic:"travel",text:"走出展馆时，雨刚好停了。朋友看了看地图，说：“不如沿着河边走回去吧。”我们挑了一条安静的小路，经过书店时又停下来看看橱窗。虽然比坐车多花了一些时间，却发现了几家以前没有留意过的小店，也聊完了一个有趣的话题。"},{id:"zh-travel-04",language:"zh",topic:"travel",text:"周末去海边之前，我们先查看天气，再把外套、饮水和简单的午餐装好。村口的路牌很清楚，每到一个岔路口，大家都会停下来确认方向。走到能看见海面的长椅旁，我们休息了一会儿。后面的路不远，慢慢走也能在中午之前到达。"},{id:"zh-food-01",language:"zh",topic:"food",text:"去菜市场之前，我先打开冰箱，看清家里还剩下什么。米饭和鸡蛋已经够了，只需要再买几样新鲜蔬菜。摊主帮我把番茄装进纸袋，我又挑了一小把青菜。按照清单买东西，提回家的袋子轻了不少，也不用担心买得太多吃不完。"},{id:"zh-food-02",language:"zh",topic:"food",text:"准备晚饭时，我先洗好蔬菜，把需要的碗和调料放在手边，再打开炉子。汤煮起来以后，正好可以收拾案板，把果皮和菜叶分开装好。等家人回到家，桌上已经摆好碗筷。厨房没有堆满东西，吃完饭后的清理也比以前轻松一些。"},{id:"zh-food-03",language:"zh",topic:"food",text:"朋友们约好一起吃午饭，每个人负责带一道菜。我准备凉拌蔬菜，另一个朋友带来刚烤好的面包。大家把盘子放在桌子中间，边吃边聊最近的生活。饭菜很快吃完了，谈话却一直没有停，最后又一起商量下次见面时可以做些什么。"},{id:"zh-food-04",language:"zh",topic:"food",text:"图书馆旁边新开了一家小店，我还完书后进去坐了一会儿。店主问音乐会不会太响，我说：“这个位置刚刚好。”等早餐的时候，我打开随身带着的本子，把路上想到的事情记下来。窗外有人慢慢走过，店里的气氛也让人放松下来。"},{id:"zh-work-01",language:"zh",topic:"work",text:"开始今天的工作之前，我先读了一遍昨天留下的笔记。其中有一个问题还没有确认，我便把它写进会议提纲，没有凭印象继续往下做。大家到齐后，先把这个问题说清楚，再分配后面的任务。每个人都知道下一步要做什么，下午少了许多来回询问。"},{id:"zh-work-02",language:"zh",topic:"work",text:"共享文件夹里的几个文件名称太相似，找一份旧报告经常要打开好几次。我们商量了一套简单的命名方法，把不再使用的副本移到归档目录。整理完成后，我试着寻找上个月的记录，很快就找到了。以后保存文件时，多写清楚一点，大家都能少花一些时间。"},{id:"zh-work-03",language:"zh",topic:"work",text:"准备发送文档时，我发现其中一个日期和日程表对不上。我没有直接凭记忆修改，而是找到最初的记录，确认以后再把两处内容一起改好。发送前又从头检查了一遍，并在说明里写清这次调整。多花几分钟核对，可以让接手的人少一些疑惑。"},{id:"zh-work-04",language:"zh",topic:"work",text:"一项任务看起来很大，我们先把它拆成几个小部分，再挑最清楚的一部分开始。第一次尝试就发现少考虑了一个步骤，于是及时补进计划。那天上午完成的内容不多，但后面的安排变得明确了。大家也更容易判断哪些事情可以同时进行，哪些需要先等结果。"},{id:"zh-learning-01",language:"zh",topic:"learning",text:"学习新内容时，我会在旁边放一本小笔记本。不是把每句话都抄下来，而是记住主要意思，再写一个自己能够解释的例子。当天结束前，我试着合上书重新说一遍。说不清楚的地方就留下一个问题，等下一次学习时再有针对性地查找答案。"},{id:"zh-learning-02",language:"zh",topic:"learning",text:"一道练习看起来很简单，我却连续两次做错了同一个地方。停下来重新阅读要求后，才发现自己漏看了一个细节。第三次尝试时，我放慢速度，每做完一步就检查一下。虽然用的时间更多，但终于明白了出错的原因，也知道下次应该注意什么。"},{id:"zh-learning-03",language:"zh",topic:"learning",text:"我们每周在图书馆碰面一次，每个人带来一个学习中遇到的问题。轮到自己时，先说明已经尝试过哪些办法，再请其他人补充。有时一个具体的例子，比很长的解释更容易理解。离开之前，大家各自选一件小事继续练习，下次再交流新的发现。"},{id:"zh-learning-04",language:"zh",topic:"learning",text:"我想养成每天练习的习惯，便把时间安排在早餐之后。先用十分钟复习一小段内容，再打开其他应用处理事情。有些早晨状态不错，有些早晨只能完成最基本的部分。因为任务不大，即使前一天比较忙，第二天也容易重新开始，不必一直等到有整块空闲。"},{id:"zh-reading-01",language:"zh",topic:"reading",text:"借来的书在封面内侧印着一张地图，刚开始我没有仔细看。读到后面，人物走过的地点越来越多，我便翻回去对照路线。几个陌生的地名渐渐熟悉起来，不同章节之间的联系也清楚了。这次读得比平时慢，却注意到了许多原本可能忽略的细节。"},{id:"zh-reading-02",language:"zh",topic:"reading",text:"图书馆入口摆着一排工作人员推荐的书，其中一本讲的是我不太熟悉的话题。我随手翻开第一页，发现文字很清楚，不需要先知道很多背景也能读下去。最后，除了原本打算借的小说，我还把这本书带回了家，准备每天看上一小段。"},{id:"zh-reading-03",language:"zh",topic:"reading",text:"我和朋友约好在周末读完同一篇故事。星期一见面时，才发现我们注意到的地方完全不同。我几乎没有印象的一段对话，竟然改变了他对结尾的理解。听完他的解释，我又把那几页翻出来读了一遍。一本书没有变，读过之后的感受却多了一层。"},{id:"zh-reading-04",language:"zh",topic:"reading",text:"以前我常常同时翻看好几本书，每一本都停在不同的地方。这个月，我只选一本放在椅子旁边，其余的先收回书架。每天晚上读几页，故事反而更容易接得上。读完以后，我在本子里记下最喜欢的一段情节，也写了一个还想继续思考的问题。"},{id:"zh-home-01",language:"zh",topic:"home",text:"书桌上的台灯离书本太远，晚上看东西有些费力。我先调整灯的位置，再收起桌面上用不到的旧纸，只留下本子和一支笔。房间没有大幅改变，桌子却方便了许多。需要记录事情时，不必先搬开一堆杂物，收工以后也能很快整理回原来的样子。"},{id:"zh-home-02",language:"zh",topic:"home",text:"下雨的下午，我们决定整理门口的柜子。空盒子放在一边，还会用到的东西重新分类，准备送人的物品另外装袋。一条找了很久的围巾，原来压在旧背包后面。整理结束后，柜门终于可以轻松关上，常用的雨伞和购物袋也都有了固定的位置。"},{id:"zh-home-03",language:"zh",topic:"home",text:"窗台上的小植物一直朝着有光的方向倾斜。我把花盆轻轻转了一个方向，又移开挡在旁边的几本书。接下来的几天，我留意叶子的变化，也看看泥土是不是太干。照顾这一小块地方以后，我开始注意到一天里不同时间的光线，房间也显得更有生气。"},{id:"zh-home-04",language:"zh",topic:"home",text:"睡觉之前，我把钥匙和背包放到门口固定的位置，再看看第二天出门需要带什么。水杯装好，借来的书也提前放进包里。这些事情只花了一点时间，却省去了早晨翻找的麻烦。起床后可以从容吃完早餐，不必一边穿鞋，一边回想还有什么没有拿。"},{id:"zh-hobbies-01",language:"zh",topic:"hobbies",text:"周末散步时，我带上相机，却没有特意安排要去哪里。走到熟悉的街角，阳光刚好照在一面旧墙上，树枝的影子形成了有趣的图案。我等路人走过以后拍了一张照片。原来不一定要去很远的地方，放慢脚步，也能在日常路线里发现新的画面。"},{id:"zh-hobbies-02",language:"zh",topic:"hobbies",text:"球队练习开始时，我们先站得近一些，轮流把球传给旁边的人。等大家找到节奏，再慢慢拉开距离。有几次传球偏了，捡回来重新试就好。练习结束前又踢了一场短比赛，平时不太主动的队友也开始举手要球，场上的配合比刚来时自然了不少。"},{id:"zh-hobbies-03",language:"zh",topic:"hobbies",text:"很久没有画画，我决定先画桌上的一只杯子。第一张的线条有些歪，但已经能看出杯柄应该往哪里调整。我换了一页纸，再仔细观察一次。这次没有急着擦掉所有错误，而是把两张画都留下来。放在一起比较，反而更容易发现自己进步的地方。"},{id:"zh-hobbies-04",language:"zh",topic:"hobbies",text:"朋友来家里做客时，我们选了一个规则简单的桌面游戏。一个人负责读说明，其他人把卡片和棋子摆好。先试着玩了一轮，大家就明白了基本方法。后面每一局都换个座位，有时精心准备的计划突然落空，也有时一次随手的选择带来了意外的结果。"},{id:"zh-nature-01",language:"zh",topic:"nature",text:"每天上班都会经过同一棵树，以前我很少抬头看。一天早晨，几片新叶在阳光下特别明亮，我才发现枝头已经和上个月不同。后来每次路过，我都会留意一下它的变化。走的仍然是熟悉的路线，却多了一件可以期待的小事，也更容易察觉季节正在慢慢改变。"},{id:"zh-nature-02",language:"zh",topic:"nature",text:"雨后的公园很安静，小路上留下几处浅浅的水洼。我们绕着走过去，看见一只小鸟在长椅旁的草地里寻找食物。再往前走，云层渐渐散开，池塘上出现了一小片阳光。大家在岸边停留了一会儿，没有急着拍照，只是听着周围重新响起的声音。"},{id:"zh-nature-03",language:"zh",topic:"nature",text:"星期天早上，我们去了附近的社区花园。志愿者先指给大家看可以走的路，提醒我们留意刚种下的小苗。我们帮忙把空花盆搬进工具棚，又扫干净入口的台阶。做完事情后，坐在外面的椅子上休息，才发现平时匆忙经过的地方，其实还有这样安静的一角。"},{id:"zh-nature-04",language:"zh",topic:"nature",text:"快走到山顶时，风比山脚下大了不少。我们穿好外套，找了一个背风的地方坐下。从高处看，刚才经过的田地变成了一小块一小块的颜色。吃完午餐，大家检查了一下时间，就沿着原路慢慢下山，希望在天色还亮的时候回到出发的地方。"},{id:"yue-travel-01",language:"yue",topic:"travel",text:"今朝去到巴士站，等車嘅人比平時少。站牌話下一班車仲有一陣先到，我就行入雨棚，將車票同水樽放喺容易攞到嘅位置。架車嚟咗之後，我搵到個靠窗位坐低，睇住街邊啲舖頭逐間開門。唔使一路趕，成個朝早都好似輕鬆咗啲。"},{id:"yue-travel-02",language:"yue",topic:"travel",text:"我哋早咗到車站，先睇清楚月台喺邊，再去附近買早餐。啱啱出爐嘅麵包仲有啲熱，大家就坐喺長櫈慢慢食。聽到廣播叫人入閘，先收好個袋同手上啲嘢。今次唔使一落車就跑，出發之前反而有時間傾下今日想去邊幾個地方。"},{id:"yue-travel-03",language:"yue",topic:"travel",text:"行出展館嗰陣，場雨啱啱停。朋友睇咗眼地圖，話：“不如沿住河邊行返去啦。”我哋揀咗條靜啲嘅路，經過書店又停低睇下櫥窗。雖然比搭車花多咗少少時間，但沿途見到幾間以前冇留意過嘅小店，仲傾埋個未講完嘅話題。"},{id:"yue-travel-04",language:"yue",topic:"travel",text:"週末去海邊之前，我哋先睇天氣，再執好外套、水同簡單午餐。村口啲路牌幾清楚，每到一個路口，大家都會停低對下方向。行到張望到海嘅長櫈，就坐低抖一陣。後面條路唔算遠，唔使急急腳，慢慢行都可以喺中午之前去到。"},{id:"yue-food-01",language:"yue",topic:"food",text:"去街市之前，我先打開雪櫃，睇下屋企仲有啲乜。米同雞蛋都夠，只係要買幾樣新鮮菜。檔主幫我將番茄裝入紙袋，我再揀咗一小棵菜。照住張清單買，拎返屋企個袋輕咗好多，亦都唔使食飯嗰陣先諗起有啲餸買多咗未煮。"},{id:"yue-food-02",language:"yue",topic:"food",text:"準備晚飯嗰陣，我先洗好啲菜，將碗同調味料放喺手邊，之後先開火。煲湯嗰段時間，啱啱可以執下砧板，分開裝好果皮同菜葉。等屋企人返到嚟，張枱已經擺好碗筷。廚房冇堆到周圍都係嘢，食完飯要收拾都冇咁頭痛。"},{id:"yue-food-03",language:"yue",topic:"food",text:"朋友約埋一齊食晏，每個人帶一道餸，唔使一個人煮晒。我整咗碟涼拌菜，另一個朋友就帶嚟啱啱焗好嘅麵包。大家將啲碟放喺枱中間，邊食邊傾近況。食物好快食完，話題就一直冇停，最後仲約定下次見面可以一齊試煮新菜式。"},{id:"yue-food-04",language:"yue",topic:"food",text:"圖書館隔籬開咗間小店，我還完書就入去坐陣。老闆問音樂會唔會太嘈，我話：“坐呢度啱啱好。”等早餐嗰陣，我攞出隨身個簿，記低頭先行路諗到嘅幾件事。窗外有人慢慢行過，舖頭入面又唔多人，食完早餐先走都唔覺得趕。"},{id:"yue-work-01",language:"yue",topic:"work",text:"開工之前，我先睇返尋日留低啲筆記。有一個問題仲未問清楚，我就加落開會張清單，冇靠估繼續做。等大家到齊，先講清楚呢件事，再分配後面啲工作。每個人都知道下一步要做乜，下午少咗好多來回問嘢嘅時間，做起上嚟順手咗。"},{id:"yue-work-02",language:"yue",topic:"work",text:"共用資料夾入面有幾份文件個名太似，搵一份舊報告成日要開幾次。我哋商量好一套簡單嘅改名方法，將唔再用嘅副本搬去另一個位置。執完之後，我試住搵上個月份記錄，好快就搵到。以後存檔嗰陣寫清楚少少，大家都可以慳返啲時間。"},{id:"yue-work-03",language:"yue",topic:"work",text:"準備寄份文件出去嗰陣，我發現有個日期同日程表對唔上。我冇憑印象改，而係搵返最初嗰份記錄，問清楚先一次過改好兩個位置。寄出之前再由頭睇多次，仲寫低今次改咗乜。花多少少時間核對，接手嗰個人就唔使再估來估去。"},{id:"yue-work-04",language:"yue",topic:"work",text:"有項工作睇落好多，我哋先拆開幾個細部分，再揀最清楚嗰部分開始。試做第一次，就發現原來漏咗一個步驟，於是即刻加返落計劃。嗰朝完成嘅嘢唔算多，但後面點做清楚咗。大家亦都容易分到邊啲可以同時做，邊啲要等前面有結果先繼續。"},{id:"yue-learning-01",language:"yue",topic:"learning",text:"學新嘢嗰陣，我會放本細簿喺旁邊。唔係每句都抄低，而係記住個重點，再寫一個自己講得明嘅例子。到一日完結之前，我試下合埋本書，重新講一次。講唔清楚嘅地方就留低個問題，等下次學習時再搵答案，唔使由頭亂咁睇過。"},{id:"yue-learning-02",language:"yue",topic:"learning",text:"有道練習睇落好簡單，我偏偏連續兩次都錯喺同一個位。停低再睇清楚要求，先發現自己漏咗一個細節。第三次試嘅時候，我放慢啲，每做完一步就對一對。雖然用多咗時間，但終於知點解會錯，下次再遇到同類問題，心入面都有個底。"},{id:"yue-learning-03",language:"yue",topic:"learning",text:"我哋每個星期喺圖書館見一次，每人帶一個學習時遇到嘅問題。輪到自己，就先講試過邊幾個方法，再請其他人補充。有時一個貼近日常嘅例子，比講一大段道理容易明。走之前，大家各自揀一件小事返去練，下次見面再傾有咩新發現。"},{id:"yue-learning-04",language:"yue",topic:"learning",text:"我想養成每日練習嘅習慣，就將時間放喺早餐之後。先用十分鐘溫習一小段內容，再開其他程式做嘢。有啲朝早精神好，有啲就只做到最基本嗰部分。因為每次唔使做太多，就算前一日忙到冇空，第二朝都容易再開始，唔使等到放假先算。"},{id:"yue-reading-01",language:"yue",topic:"reading",text:"借返嚟本書喺封面入面印咗張地圖，開頭我冇點睇。讀到後面，人物去過嘅地方越嚟越多，我先翻返前面對下條路線。幾個陌生地名慢慢熟悉咗，唔同章節之間嘅關係都清楚啲。今次讀得慢過平時，但留意到好多本來可能睇漏嘅細節。"},{id:"yue-reading-02",language:"yue",topic:"reading",text:"圖書館門口擺咗一排職員推薦嘅書，其中一本講嘅題目我唔係好熟。我隨手揭開第一頁，發現寫得幾清楚，唔使預先識好多背景都睇得明。最後，除咗原本想借嗰本小說，我仲帶埋呢本返屋企，諗住每日睇少少，試下接觸平時少睇嘅內容。"},{id:"yue-reading-03",language:"yue",topic:"reading",text:"我同朋友約好週末睇完同一篇故事。星期一見面，先發現大家留意嘅地方完全唔同。有段對話我幾乎冇印象，佢就話嗰段令佢對個結尾有另一種理解。聽完之後，我又翻返嗰幾頁再睇。故事本身冇變，但有人一齊傾，真係會見到多啲嘢。"},{id:"yue-reading-04",language:"yue",topic:"reading",text:"以前我成日同時揭幾本書，每一本都停喺唔同位置。今個月，我只揀一本放喺張櫈旁邊，其餘先放返上書架。每晚睇幾頁，反而容易記得前面講過乜。睇完之後，我喺簿入面寫低最鍾意嗰段情節，仲記咗一個想搵人一齊討論嘅問題。"},{id:"yue-home-01",language:"yue",topic:"home",text:"書枱盞燈離本書太遠，夜晚睇嘢有啲辛苦。我先移一移盞燈，再收起枱面唔用嗰啲舊紙，只留低個簿同一支筆。間房冇大執過，但張枱好用咗好多。想記低啲嘢時，唔使先搬開成堆雜物，做完嘢又可以好快執返齊，第二日攞嚟用都方便。"},{id:"yue-home-02",language:"yue",topic:"home",text:"落雨嗰個下午，我哋決定執下門口個櫃。空盒放一邊，仲會用嘅嘢重新分類，打算送人嗰啲就另外裝袋。搵咗好耐條頸巾，原來壓喺個舊背囊後面。執完之後，櫃門終於唔使大力推先閂到，平時用開把遮同購物袋亦都有咗固定位置。"},{id:"yue-home-03",language:"yue",topic:"home",text:"窗邊盆小植物成日向住有光嗰邊斜。我輕輕轉咗少少個盆，再移開旁邊擋住光嗰幾本書。之後幾日，我留意啲葉有冇變，亦都摸下啲泥會唔會太乾。照顧住呢個小角落，先發現原來朝早同下午照入屋嘅光好唔同，間房都好似有生氣咗。"},{id:"yue-home-04",language:"yue",topic:"home",text:"瞓覺之前，我將鎖匙同背囊放喺門口固定個位，再諗下聽朝出門要帶啲乜。水樽裝好，借返嚟本書都預先放入袋。呢幾件事花唔到好多時間，但第二朝就唔使周圍搵。起身之後可以慢慢食早餐，唔使一邊着鞋，一邊諗仲有邊樣嘢未攞。"},{id:"yue-hobbies-01",language:"yue",topic:"hobbies",text:"週末行街嗰陣，我帶埋相機，但冇特登安排去邊。行到平時經過嘅街角，陽光啱啱照住幅舊牆，樹枝啲影砌出幾靚嘅圖案。我等個路人行過先影咗一張。原來唔一定要去好遠，行慢少少，喺熟悉嘅地方都可以搵到以前冇留意嘅畫面。"},{id:"yue-hobbies-02",language:"yue",topic:"hobbies",text:"球隊開始練波，我哋先企近啲，輪流傳個波畀旁邊嘅隊友。等大家搵到節奏，再慢慢拉開距離。有幾次傳歪咗，執返個波再試就得。練習完之前踢咗場短比賽，平時冇咁主動嘅隊友都開始舉手要波，場上啲配合比啱到嗰陣自然咗好多。"},{id:"yue-hobbies-03",language:"yue",topic:"hobbies",text:"好耐冇畫畫，我決定先畫枱面隻杯。第一張啲線有少少歪，但已經睇得出個杯耳應該移去邊。我揭過一頁紙，再望清楚一次。今次冇急住擦走晒啲錯位，而係將兩張都留低。擺埋一齊比較，反而容易見到自己有邊度進步，唔會只係望住啲不足。"},{id:"yue-hobbies-04",language:"yue",topic:"hobbies",text:"朋友嚟屋企玩，我哋揀咗個規則簡單嘅桌上遊戲。一個人讀說明，其他人就擺好啲卡同棋子。先試玩一輪，大家就明白大概要點做。之後每局都換個位，有時諗咗好耐個計劃突然行唔通，有時隨手揀一步反而有驚喜，大家一路玩一路笑。"},{id:"yue-nature-01",language:"yue",topic:"nature",text:"每日返工都經過同一棵樹，以前我好少抬頭睇。有朝早，幾塊新葉照住陽光特別鮮明，我先發現啲樹枝已經同上個月唔同。之後每次行過，我都會望一望有咩變化。條路仍然係嗰條路，但多咗件小事可以期待，連季節轉緊都容易察覺啲。"},{id:"yue-nature-02",language:"yue",topic:"nature",text:"落完雨嘅公園好靜，條小路有幾個淺水氹。我哋繞住行過，見到隻雀仔喺長櫈旁邊嘅草地搵嘢食。再行前啲，啲雲慢慢散開，池塘上面出現一小片陽光。大家喺岸邊停咗一陣，冇急住攞電話影相，只係聽下周圍啲聲，成個人都放鬆咗。"},{id:"yue-nature-03",language:"yue",topic:"nature",text:"星期日朝早，我哋去咗附近個社區花園。義工先指畀大家睇邊啲路行得，提我哋小心啱啱種落去啲苗。我哋幫手搬空花盆入工具房，再掃乾淨門口幾級樓梯。做完之後坐喺外面抖下，先發現平時匆匆行過嘅地方，原來仲有咁安靜嘅一角。"},{id:"yue-nature-04",language:"yue",topic:"nature",text:"差唔多行到山頂，啲風比山腳大咗好多。我哋着返件外套，搵個冇咁當風嘅位坐低。由高處望落去，頭先經過啲田變成一小格一小格嘅顏色。食完午餐，大家睇下時間，就沿住原路慢慢行落山，想趁天色仲光嗰陣返到出發嘅地方。"}]};var v=l.version,I=16,p=l.entries;function z(a,t=[],i=1200,h=Math.random){let n=p.filter(e=>e.language===a),r=[...new Set(n.map(e=>e.topic))];for(let e=r.length-1;e>0;e--){let o=Math.floor(h()*(e+1));[r[e],r[o]]=[r[o],r[e]]}let g=new Set(t),u=r.flatMap(e=>n.filter(o=>o.topic===e&&!g.has(o.id)));u.push(...n.filter(e=>g.has(e.id)).sort((e,o)=>t.indexOf(e.id)-t.indexOf(o.id)));let c=[],d="";for(let e of u)if(d+=(d&&a==="en"?" ":"")+e.text,c.push(e.id),d.length>=i)break;return{text:d,ids:c}}

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
      const ids = session.source ? [session.source.fingerprint].filter(id => /^[a-f0-9]{64}$/.test(id || '')) : session.passageIds;
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

    function recordKey(language, duration, hints = 'off', corpusVersion = PracticeCorpus.CORPUS_VERSION) {
      return `${language}:${duration}:builtin:${hints === 'off' ? 'plain' : hints}:${RULES_VERSION}${corpusVersion === 1 ? '' : ':corpus' + corpusVersion}`;
    }

    function sanitizeBest(stored) {
      if (!stored || typeof stored !== 'object') return {};
      const best = {};
      for (const language of LANGUAGES) for (const duration of DURATIONS) for (const hints of language === 'en' ? ['off'] : HINT_MODES) for (const corpusVersion of [1, PracticeCorpus.CORPUS_VERSION]) {
        const key = recordKey(language, duration, hints, corpusVersion);
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
          || item.rules !== RULES_VERSION || !['timed', 'passage'].includes(item.mode)
          || !['completed', 'early'].includes(item.status) || !Number.isFinite(item.accuracy) || item.accuracy < 0 || item.accuracy > 1
          || !['at', 'elapsedMs', 'speed', 'correct', 'wrongKeys', 'keystrokes', 'targetLength'].every(key => Number.isSafeInteger(item[key]) && item[key] >= 0)
          || item.at > 8640000000000000 || item.elapsedMs < 1 || item.targetLength < 1 || item.wrongKeys > item.keystrokes
          || item.correct > item.targetLength || item.correct > item.keystrokes
          || item.mode === 'timed' && (item.source !== 'builtin' || !DURATIONS.includes(item.duration)
            || item.elapsedMs > item.duration * 1000 || item.status === 'completed' && item.elapsedMs !== item.duration * 1000)
          || item.mode === 'timed' && item.corpusVersion != null && ![1, PracticeCorpus.CORPUS_VERSION].includes(item.corpusVersion)
          || item.mode === 'passage' && (item.source !== 'local' || item.status !== 'completed')) return [];
        ids.add(item.id);
        // Whitelist fields: never retain text, chat titles, paths or message IDs.
        return [{ id: item.id, language: item.language, hints: item.hints, rules: item.rules,
          corpusVersion: item.mode === 'timed' ? item.corpusVersion ?? 1 : null,
          mode: item.mode, source: item.source, duration: item.mode === 'timed' ? item.duration : null,
          status: item.status, at: item.at, elapsedMs: item.elapsedMs, speed: item.speed, accuracy: item.accuracy,
          correct: item.correct, wrongKeys: item.wrongKeys, keystrokes: item.keystrokes, targetLength: item.targetLength,
          fingerprint: item.mode === 'passage' && /^[a-f0-9]{64}$/.test(item.fingerprint || '') ? item.fingerprint : null }];
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
        mode: session.source ? 'passage' : 'timed', source: session.source ? 'local' : 'builtin',
        duration: session.source ? null : result.duration, status: session.source || result.eligible ? 'completed' : 'early',
        at: result.at, elapsedMs: result.elapsedMs, speed: result.speed, accuracy: result.accuracy,
        correct: result.correct, wrongKeys: result.wrongKeys, keystrokes: result.keystrokes, targetLength: session.target.length,
        fingerprint: session.source && /^[a-f0-9]{64}$/.test(session.source.fingerprint || '') ? session.source.fingerprint : null };
    }

    function samePassageBest(history, entry) {
      if (!entry.fingerprint) return null;
      return history.filter(item => item.mode === 'passage' && item.fingerprint === entry.fingerprint
        && item.language === entry.language && item.hints === entry.hints && item.rules === entry.rules)
        .reduce((best, item) => isBetter(item, best) ? item : best, null);
    }

    function formatRecordDate(at) {
      if (!at || !Number.isFinite(at) || Math.abs(at) > 8640000000000000) return '—';
      return new Intl.DateTimeFormat(activeLanguage === 'en' ? 'en-US' : 'zh-CN', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
      }).format(new Date(at));
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
    function createSession(duration, language = 'en', hints = language === 'en' ? 'off' : 'current', originalText, source = null) {
      const selected = originalText ? { text: originalText, ids: [] } : practiceText(language);
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
        passageIds: selected.ids,
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
      const ms = Math.max(1, session.source ? raw : Math.min(raw, session.duration * 1000));
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
          eligible: !session.source && ms >= session.duration * 1000,
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
      if (!session.source && session.startAt != null && now - session.startAt >= session.duration * 1000) {
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
  height: 100%;
  min-height: 100%;
  overflow-y: auto;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  -webkit-font-smoothing: antialiased;
}
.tp-root, .tp-root * { box-sizing: border-box; }
.tp-panel-spark { stroke: var(--dsw-alias-brand-primary); }
.tp-page {
  max-width: 880px;
  margin: 0 auto;
  padding: 26px 30px 56px;
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
.tp-title {
  margin: 0;
  font-size: 20px;
  line-height: 1.2;
  font-weight: 650;
  letter-spacing: -0.015em;
}
.tp-subtitle {
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
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  flex-wrap: wrap;
}
.tp-duration-slot { display: grid; }
.tp-duration-slot > * { grid-area: 1 / 1; }
.tp-passage-mode { display: flex; align-items: center; padding: 0 14px; color: var(--dsw-alias-label-secondary); font-size: 12.5px; }
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
.tp-hint-control { display: inline-flex; align-items: center; gap: 8px; color: var(--dsw-alias-label-secondary); }
.tp-select { position: relative; display: inline-flex; }
.tp-hint-control select, .tp-records-filter select, .tp-sound-field select {
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
.tp-hint-control select:focus-visible, .tp-records-filter select:focus-visible, .tp-sound-field select:focus-visible { outline: 2px solid var(--dsw-alias-label-primary); outline-offset: 3px; }
.tp-annotation-status { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; color: var(--dsw-alias-label-secondary); }
.tp-corpus-bar { display: flex; gap: 8px 12px; flex-wrap: wrap; align-items: center; }
.tp-corpus-status { display: grid; flex: 1 1 260px; min-width: 0; min-height: 36px; align-items: center; font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-secondary); }
.tp-corpus-status > *, .tp-instructions > * { grid-area: 1 / 1; margin: 0; overflow-wrap: anywhere; }
.tp-status-size { visibility: hidden; pointer-events: none; user-select: none; }
.tp-corpus-name { font-variant-numeric: tabular-nums; }
.tp-corpus-controls { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-left: auto; }
.tp-corpus-controls .tp-seg-btn { padding: 0 10px; }
.tp-btn.tp-corpus-next { display: grid; justify-items: center; }
.tp-corpus-next > * { grid-area: 1 / 1; }
.tp-corpus-note { margin: 0; font-size: 12px; color: var(--dsw-alias-label-secondary); overflow-wrap: anywhere; }
.tp-corpus-note:empty { pointer-events: none; }
.tp-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}
.tp-stat {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 12px;
  padding: 10px 14px 11px;
}
.tp-stat-label {
  font-size: 11.5px;
  color: var(--dsw-alias-label-secondary);
}
.tp-stat-value {
  margin-top: 2px;
  display: flex;
  align-items: baseline;
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
  gap: 14px;
  padding: 20px 22px 18px;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 14px;
}
.tp-timebar {
  height: 3px;
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
  overflow: hidden;
}
.tp-timebar-fill {
  height: 100%;
  border-radius: 999px;
  background: var(--dsw-alias-brand-primary);
  transition: width 120ms linear;
}
.tp-board-wrap {
  position: relative;
  border-radius: 10px;
  cursor: text;
}
.tp-board-wrap:focus-within, .tp-seg-btn:focus-visible, .tp-btn:focus-visible {
  outline: 2px solid var(--dsw-alias-label-primary);
  outline-offset: 3px;
}
.tp-viewport {
  /* Extend the clipping boundary without changing text width or line breaks. */
  margin-inline: -16px;
  padding-inline: 16px;
  height: calc(4 * 1.85em + 4px);
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  font-size: 21px;
  line-height: 1.85;
}
.tp-board {
  padding: 2px;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: inherit;
  line-height: inherit;
  letter-spacing: 0.3px;
  user-select: none;
}
.tp-char { color: var(--dsw-alias-label-secondary); }
.tp-char.correct { color: var(--dsw-alias-label-primary); }
.tp-char.wrong {
  color: var(--dsw-alias-state-error-primary);
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}
.tp-root { --tp-cursor-color: var(--dsw-alias-brand-primary-new-colorprimary-new-color, #4176e6); }
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
/* The visible board provides the focus ring; the IME anchor must stay invisible. */
.tp-input:focus { outline: none; }
.tp-ime .tp-viewport { height: calc(3 * 2.7em + 4px); line-height: 2.7; }
.tp-ime .tp-board { font-family: inherit; letter-spacing: 0.1em; }
.tp-annotated .tp-board { padding-top: 12px; letter-spacing: 0; }
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
  padding: 13px 15px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 12px;
  background: var(--dsw-alias-bg-layer-2);
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
.tp-actions { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
.tp-instructions { display: grid; min-width: 0; flex: 1; font-size: 11.5px; line-height: 18px; }
.tp-actions > .tp-btn { flex: none; }
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
.tp-records-dialog { width: min(760px, calc(100vw - 32px)); height: min(680px, calc(100vh - 32px)); max-height: calc(100vh - 32px); padding: 0; margin: auto; border: 1px solid var(--dsw-alias-border-l1); border-radius: 14px; color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-base); font: inherit; }
.tp-records-dialog[open] { display: flex; flex-direction: column; }
.tp-records-dialog::backdrop { background: rgb(0 0 0 / .35); }
.tp-records-header, .tp-records-toolbar, .tp-records-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding: 12px 20px; flex: none; }
.tp-records-header h2 { margin: 0; font-size: 18px; }
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
.tp-sound-dialog, .tp-cursor-dialog { width: min(440px, calc(100vw - 32px)); height: fit-content; }
.tp-sound-body { padding: 4px 20px 20px; overflow-y: auto; }
.tp-sound-field { display: grid; gap: 8px; margin-bottom: 18px; font-size: 13px; }
.tp-sound-field .tp-select, .tp-sound-field select { width: 100%; min-width: 0; }
.tp-sound-volume { display: flex; align-items: center; gap: 16px; }
.tp-sound-volume input { flex: 1; min-width: 0; min-height: 44px; margin: 0; accent-color: var(--dsw-alias-label-primary); }
.tp-sound-volume output { width: 4ch; text-align: right; font-variant-numeric: tabular-nums; }
.tp-sound-status { display: grid; margin: 10px 0; color: var(--dsw-alias-label-secondary); font-size: 12px; line-height: 18px; }
.tp-sound-status > span { grid-area: 1 / 1; }
.tp-sound-credit { font-size: 11px; color: var(--dsw-alias-label-secondary); text-underline-offset: 3px; }
.tp-cursor-preview { display: flex; justify-content: center; align-items: center; min-height: 92px; margin: 0 0 18px; border-radius: 8px; background: var(--dsw-alias-bg-layer-2); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 26px; line-height: 1.25; }
.tp-cursor-preview-text { white-space: pre; }
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
  .tp-page { padding: 18px 14px 44px; }
  .tp-title { font-size: 18px; }
  .tp-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .tp-viewport { font-size: 18px; }
  .tp-corpus-controls { order: -1; }
  .tp-corpus-status { min-height: 18px; }
  .tp-records-header, .tp-records-toolbar, .tp-records-footer { padding-left: 14px; padding-right: 14px; }
  .tp-records-body { padding: 0 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .tp-seg-btn, .tp-timebar-fill { transition: none; }
  .tp-root[data-cursor-blink] .tp-char.caret::before { animation: none; }
  .tp-cursor-toggle input::before { transition: none; }
}
`;

    // ---------- board ----------

    function revealCaret(viewport) {
      if (!viewport) return;
      const caret = viewport.querySelector('.tp-char.caret');
      if (!caret) return;
      const bounds = viewport.getBoundingClientRect();
      const cursor = caret.getBoundingClientRect();
      const lineHeight = parseFloat(window.getComputedStyle(viewport).lineHeight);
      const top = cursor.top - bounds.top - viewport.clientTop;
      const bottom = cursor.bottom - bounds.top - viewport.clientTop;
      // Keep a line of context above and below the cursor; scroll only this
      // viewport so typing never moves the page or the surrounding DSH shell.
      if (top < lineHeight || bottom > viewport.clientHeight - lineHeight) {
        const first = viewport.querySelector('.tp-char').getBoundingClientRect();
        const row = Math.round((cursor.top - first.top) / lineHeight);
        viewport.scrollTop = Math.max(0, (row - 1) * lineHeight);
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
        let className = 'tp-char';
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
      const [session, setSession] = React.useState(() => createSession(DEFAULT_DURATION));
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
      const [soundOpen, setSoundOpen] = React.useState(false);
      const [soundStatus, setSoundStatus] = React.useState('idle');
      const [soundSaveError, setSoundSaveError] = React.useState(false);
      const soundDialogRef = React.useRef(null);
      const soundButtonRef = React.useRef(null);
      const soundCloseRef = React.useRef(null);
      const audioRef = React.useRef({ context: null, player: null, pack: null, preparing: null, epoch: 0, disposed: false, status: 'idle' });
      const [cursorPreference, setCursorPreference] = React.useState(loadCursorPreference);
      const [cursorOpen, setCursorOpen] = React.useState(false);
      const [cursorSaveError, setCursorSaveError] = React.useState(false);
      const cursorDialogRef = React.useRef(null);
      const cursorButtonRef = React.useRef(null);
      const cursorCloseRef = React.useRef(null);
      const [focused, setFocused] = React.useState(false);
      const [saveError, setSaveError] = React.useState(false);
      const [hintPreference, setHintPreference] = React.useState('current');
      const [annotationAttempt, setAnnotationAttempt] = React.useState(0);
      const [corpusBusy, setCorpusBusy] = React.useState(false);
      const [corpusMessage, setCorpusMessage] = React.useState('');
      const [corpusPreference, setCorpusPreference] = React.useState(loadCorpusPreference);
      const [corpusPreferenceError, setCorpusPreferenceError] = React.useState(false);
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
        const dialog = soundDialogRef.current;
        if (!dialog) return;
        if (soundOpen && !dialog.open) { dialog.showModal(); soundCloseRef.current?.focus(); }
        else if (!soundOpen && dialog.open) { dialog.close(); soundButtonRef.current?.focus({ preventScroll: true }); }
      }, [soundOpen]);

      React.useLayoutEffect(() => {
        const dialog = cursorDialogRef.current;
        if (!dialog) return;
        if (cursorOpen && !dialog.open) { dialog.showModal(); cursorCloseRef.current?.focus(); }
        else if (!cursorOpen && dialog.open) { dialog.close(); cursorButtonRef.current?.focus({ preventScroll: true }); }
      }, [cursorOpen]);

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
          || !current.source && current.startAt != null && performance.now() - current.startAt >= current.duration * 1000
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
            viewport.parentElement.scrollIntoView({ block: 'nearest' });
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
            if (!previous.source && elapsed >= previous.duration * 1000) {
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
        const key = recordKey(result.language, result.duration, result.hints);
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
      // the practice language changes. Fallback never changes this preference.
      React.useEffect(() => {
        if (corpusPreference === 'local') nextPassage(false);
      }, [corpusPreference, session.language]);

      function changeCorpusPreference(source) {
        if (!['builtin', 'local'].includes(source) || source === corpusPreference) return;
        restart(session.duration, false, session.language, session.hints, undefined, null);
        setCorpusPreference(source);
        setCorpusPreferenceError(!saveCorpusPreference(source));
      }

      function cancelCorpus() {
        corpusRequest.current?.abort(); corpusRequest.current = null;
        setCorpusBusy(false); setCorpusMessage('');
      }

      async function nextPassage(focus = true) {
        if (corpusRequest.current) { cancelCorpus(); return; }
        if (corpusPreference === 'builtin') {
          restart(session.duration, focus, session.language, session.hints, undefined, null);
          return;
        }
        const controller = new AbortController();
        corpusRequest.current = controller;
        const current = sessionRef.current;
        setCorpusBusy(true); setCorpusMessage('');
        let timeout;
        const deadline = new Promise((_, reject) => {
          timeout = setTimeout(() => { controller.abort(); reject(new Error('timeout')); }, 12000);
        });
        let candidate = null;
        let fallback = 'corpusEmpty';
        try {
          const params = new URLSearchParams({ language: current.language, exclude: current.source?.fingerprint || '' });
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
            && item.text.length <= 3000 && item.source?.sessionId) candidate = item;
          if (!candidate && !['empty', 'limited'].includes(body.reason)) fallback = 'corpusUnavailable';
        } catch { fallback = 'corpusUnavailable'; }
        finally { clearTimeout(timeout); }
        if (corpusRequest.current !== controller || sessionRef.current.id !== current.id) return;
        corpusRequest.current = null;
        setCorpusBusy(false);
        if (candidate) {
          restart(current.duration, focus, current.language, current.hints, candidate.text, candidate.source);
        } else {
          restart(current.duration, focus, current.language, current.hints, undefined, null);
          setCorpusMessage(fallback);
        }
      }

      function restart(nextDuration, focus = false, language = session.language, hints = language === 'en' ? 'off' : hintPreference, originalText, source = language === session.language ? session.source : null) {
        stopSound();
        cancelCorpus();
        const duration = nextDuration || session.duration;
        // Change the epoch before blurring. Some IMEs commit on blur; that
        // commit belongs to the old input node and must not enter the new run.
        updateSession(() => createSession(duration, language, hints, originalText || (source ? session.text : undefined), source));
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

      function closeSound() { stopSound(); setSoundOpen(false); }

      function changeCursor(patch) {
        const next = { ...cursorPreference, ...patch };
        if (!CURSOR_SHAPES.includes(next.shape) || typeof next.glow !== 'boolean' || typeof next.blink !== 'boolean') return;
        setCursorPreference(next);
        try { window.localStorage.setItem(CURSOR_KEY, JSON.stringify(next)); setCursorSaveError(false); }
        catch { setCursorSaveError(true); }
      }

      function renderCursor() {
        const close = () => setCursorOpen(false);
        const props = { className: 'tp-records-dialog tp-cursor-dialog', ref: cursorDialogRef, onClose: close };
        if (!cursorOpen) return h('dialog', props);
        return h('dialog', { ...props, 'aria-labelledby': 'tp-cursor-title',
          onCancel: event => { event.preventDefault(); close(); }, onKeyDown: event => event.stopPropagation() },
          h('div', { className: 'tp-records-header' }, h('h2', { id: 'tp-cursor-title' }, t('cursorTitle')),
            h('button', { className: 'tp-btn', type: 'button', ref: cursorCloseRef, onClick: close, 'aria-label': t('cursorClose') }, '×')),
          h('div', { className: 'tp-sound-body' },
            h('div', { className: 'tp-cursor-preview', role: 'img', 'aria-label': t('cursorPreview') },
              h('span', { className: 'tp-cursor-preview-text', 'aria-hidden': true }, 'Aa ', h('span', { className: 'tp-char caret' }, '中'), '文')),
            h('label', { className: 'tp-sound-field' }, h('span', null, t('cursorShape')),
              h('span', { className: 'tp-select' }, h('select', { value: cursorPreference.shape, 'aria-label': t('cursorShape'), onChange: event => changeCursor({ shape: event.currentTarget.value }) },
                CURSOR_SHAPES.map(shape => h('option', { key: shape, value: shape }, t('cursor_' + shape)))),
                h('svg', { className: 'tp-select-chevron', viewBox: '0 0 12 12', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false }, h('path', { d: 'M3 4.5 6 7.5 9 4.5' })))),
            ['glow', 'blink'].map(option => h('label', { className: 'tp-cursor-toggle', key: option },
              h('span', null, t(option === 'glow' ? 'cursorGlow' : 'cursorBlink')),
              h('input', { type: 'checkbox', role: 'switch', checked: cursorPreference[option], onChange: event => changeCursor({ [option]: event.currentTarget.checked }) }))),
            h('div', { className: 'tp-sound-status' },
              h('span', { className: 'tp-status-size', 'aria-hidden': true }, t('cursorSaveError')),
              h('span', { role: 'status' }, cursorSaveError ? t('cursorSaveError') : ''))));
      }

      function renderSound() {
        const props = { className: 'tp-records-dialog tp-sound-dialog', ref: soundDialogRef, onClose: closeSound };
        if (!soundOpen) return h('dialog', props);
        return h('dialog', { ...props, 'aria-labelledby': 'tp-sound-title',
          onCancel: event => { event.preventDefault(); closeSound(); }, onKeyDown: event => event.stopPropagation() },
          h('div', { className: 'tp-records-header' }, h('h2', { id: 'tp-sound-title' }, t('soundTitle')),
            h('button', { className: 'tp-btn', type: 'button', ref: soundCloseRef, onClick: closeSound, 'aria-label': t('soundClose') }, '×')),
          h('div', { className: 'tp-sound-body' },
            h('label', { className: 'tp-sound-field' }, h('span', null, t('soundPack')),
              h('span', { className: 'tp-select' }, h('select', { value: soundPreference.pack, 'aria-label': t('soundPack'), onChange: event => changeSound({ pack: event.currentTarget.value }) },
                SOUND_PACKS.map(pack => h('option', { key: pack, value: pack }, t('sound_' + pack)))),
                h('svg', { className: 'tp-select-chevron', viewBox: '0 0 12 12', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false }, h('path', { d: 'M3 4.5 6 7.5 9 4.5' })))),
            h('label', { className: 'tp-sound-field' }, h('span', null, t('soundVolume')),
              h('span', { className: 'tp-sound-volume' }, h('input', { type: 'range', min: 0, max: 100, step: 5, value: soundPreference.volume,
                'aria-valuetext': soundPreference.volume + '%', onChange: event => changeSound({ volume: Number(event.currentTarget.value) }) }),
              h('output', { 'aria-hidden': true }, soundPreference.volume + '%'))),
            h('button', { className: 'tp-btn', type: 'button', disabled: soundPreference.pack === 'off' || !soundPreference.volume,
              onClick: () => { stopSound(); void prepareSound(true); } }, t('soundPreview')),
            h('div', { className: 'tp-sound-status' },
              ['soundLoading', 'soundError', 'soundSaveError'].map(key => h('span', { className: 'tp-status-size', 'aria-hidden': true, key }, t(key))),
              h('span', { role: 'status' }, soundSaveError ? t('soundSaveError') : soundStatus === 'loading' ? t('soundLoading') : soundStatus === 'error' ? t('soundError') : '')),
            h('a', { className: 'tp-sound-credit', href: 'https://github.com/tplai/kbsim', target: '_blank', rel: 'noreferrer' }, t('soundCredit')),
          ));
      }

      function renderRecords() {
        // Keep history rendering off the keystroke path while the dialog is closed.
        if (!recordsOpen) return h('dialog', { className: 'tp-records-dialog', ref: recordsDialogRef, onClose: closeRecords });
        const history = records.history.filter(item => (recordsLanguage === 'all' || item.language === recordsLanguage)
          && (!recordsPassage || item.fingerprint === recordsPassage));
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
            h('button', { className: 'tp-btn', type: 'button', ref: recordsCloseRef, onClick: closeRecords, 'aria-label': t('recordsClose') }, '×')),
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
                    + ' · ' + t('recordsHints', { mode: t('hint_' + item.hints) }) + ' · ' + t(item.status === 'early' ? 'recordsEarly' : 'recordsCompleted')),
                  h('p', { className: 'tp-record-detail' }, t('recordsDetails', { seconds: (item.elapsedMs / 1000).toFixed(1), correct: item.correct, errors: item.wrongKeys })),
                  h('p', { className: 'tp-record-meta' }, formatRecordDate(item.at)),
                  item.fingerprint && !recordsPassage ? h('button', { type: 'button', className: 'tp-record-link', onClick: () => setRecordsPassage(item.fingerprint) }, t('recordsSame')) : null,
                ), renderRecordScore(item.speed, item.accuracy, item.language),
              ))) : h('p', { className: 'tp-records-empty' }, t('recordsEmpty')),
            ) : h('div', null,
              bestRows.length ? h('ul', { className: 'tp-record-list' }, bestRows.map(([key, item]) => {
                const [language, duration, , hints] = key.split(':');
                return h('li', { className: 'tp-record-row', key }, h('div', null,
                  h('p', { className: 'tp-record-title' }, t('language_' + language) + ' · ' + t('recordsTimed', { n: duration })),
                  h('p', { className: 'tp-record-meta' }, t('recordsHints', { mode: t('hint_' + (hints === 'plain' ? 'off' : hints)) }) + (key.endsWith(':corpus' + PracticeCorpus.CORPUS_VERSION) ? '' : ' · ' + t('recordsOldCorpus'))),
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
      const progress = Math.max(0, Math.min(1, session.source ? characters(session.typed).length / session.target.length : stats.ms / (session.duration * 1000)));
      const bestForDuration = best[recordKey(session.language, session.duration, session.hints)] || null;
      const legacy = !isIme && legacyBest[session.duration];
      const running = session.startAt != null && !result || composition.active;

      return h('div', { className: 'tp-root' + (isIme ? ' tp-ime' : '') + (session.hints !== 'off' ? ' tp-annotated' : ''),
        'data-cursor-shape': cursorPreference.shape, 'data-cursor-glow': String(cursorPreference.glow), 'data-cursor-blink': String(cursorPreference.blink) },
        h('div', { className: 'tp-page' },
          h('header', { className: 'tp-header' },
            h('div', null,
              h('h1', { className: 'tp-title' }, t('panelTitle')),
              h('p', { className: 'tp-subtitle' }, t('panelSubtitle')),
            ),
            h('div', { className: 'tp-header-actions' },
              h('div', { className: 'tp-best', style: { visibility: session.source ? 'hidden' : 'visible' } },
              session.source ? t('corpusPassage') : bestForDuration
                ? t('bestValue', { speed: bestForDuration.speed, unit: speedUnit, acc: Math.round(bestForDuration.accuracy * 100) })
                : legacy && Number.isFinite(legacy.wpm) && Number.isFinite(legacy.accuracy)
                  ? t('legacyBestValue', { speed: legacy.wpm, acc: Math.round(legacy.accuracy * 100) }) : t('bestNone'),
              ),
              h('button', { className: 'tp-btn', type: 'button', ref: recordsButtonRef, onClick: openRecords,
                disabled: running, title: running ? t('recordsRunning') : undefined, 'aria-haspopup': 'dialog',
              }, t('records')),
              h('button', { className: 'tp-btn', type: 'button', ref: soundButtonRef, disabled: running,
                title: running ? t('soundRunning') : undefined, 'aria-haspopup': 'dialog', onClick: () => {
                  const current = sessionRef.current;
                  if (current.startAt != null && !current.result || compositionRef.current.active) return;
                  cancelCorpus(); stopSound(); setSoundOpen(true);
                } }, t('sound')),
              h('button', { className: 'tp-btn', type: 'button', ref: cursorButtonRef, disabled: running,
                title: running ? t('cursorRunning') : undefined, 'aria-haspopup': 'dialog', onClick: () => {
                  const current = sessionRef.current;
                  if (current.startAt != null && !current.result || compositionRef.current.active) return;
                  cancelCorpus(); stopSound(); setCursorOpen(true);
                } }, t('cursor')),
            ),
          ),
          h('div', { className: 'tp-corpus-bar' },
            h('div', { className: 'tp-corpus-status' },
              // Invisible size guides keep translated/wrapped status text from
              // moving the controls or practice area when a request settles.
              ['corpusLoading', 'corpusEmpty', 'corpusUnavailable'].map(key => h('span', {
                key, className: 'tp-status-size', 'aria-hidden': true,
              }, t(key))),
              h('span', { className: 'tp-corpus-name', title: session.source?.title || undefined,
                style: { visibility: corpusBusy || corpusMessage ? 'hidden' : 'visible' },
              }, session.source ? t('corpusRecent') + ' · ' + t('corpusCount', { n: session.target.length }) : ''),
              h('p', { className: 'tp-corpus-note', role: 'status', 'aria-atomic': true }, corpusBusy || corpusMessage ? t(corpusBusy ? 'corpusLoading' : corpusMessage) : ''),
            ),
            h('div', { className: 'tp-corpus-controls' },
              h('div', { className: 'tp-seg', role: 'group', 'aria-label': t('corpusSource') },
                ['builtin', 'local'].map(source => h('button', {
                  key: source, type: 'button',
                  className: 'tp-seg-btn' + (source === corpusPreference ? ' active' : ''),
                  'aria-pressed': source === corpusPreference,
                  onClick: () => changeCorpusPreference(source),
                }, t(source === 'builtin' ? 'corpusBuiltin' : 'corpusLocal')))),
              h('button', { type: 'button', className: 'tp-btn tp-corpus-next', onClick: () => nextPassage() },
                h('span', null, t(corpusBusy ? 'corpusCancel' : 'corpusNext')),
                h('span', { className: 'tp-status-size', 'aria-hidden': true }, t('corpusNext')),
                h('span', { className: 'tp-status-size', 'aria-hidden': true }, t('corpusCancel')),
              ))),
          h('div', { className: 'tp-toolbar' },
            h('div', { className: 'tp-seg', role: 'group', 'aria-label': t('languageLabel') },
              LANGUAGES.map((language) => h('button', {
                key: language,
                type: 'button',
                className: 'tp-seg-btn' + (language === session.language ? ' active' : ''),
                'aria-pressed': language === session.language,
                onClick: () => restart(session.duration, false, language),
              }, t('language_' + language))),
            ),
            h('div', { className: 'tp-duration-slot' },
              h('div', { className: 'tp-seg', role: 'group', 'aria-label': t('durationLabel'),
                'aria-hidden': Boolean(session.source), style: { visibility: session.source ? 'hidden' : 'visible' },
              },
              DURATIONS.map((duration) => h('button', {
                key: duration,
                type: 'button',
                className: 'tp-seg-btn' + (duration === session.duration ? ' active' : ''),
                'aria-pressed': duration === session.duration,
                disabled: Boolean(session.source),
                onClick: () => restart(duration),
              }, t('durationOption', { n: duration }))),
              ),
              session.source ? h('span', { className: 'tp-passage-mode' }, t('corpusPassage')) : null,
            ),
            isIme ? h('label', { className: 'tp-hint-control' },
              h('span', null, t('hint_' + session.language)),
              h('span', { className: 'tp-select' }, h('select', {
                value: session.hints,
                'aria-label': t('hint_' + session.language),
                title: t('hintChange'),
                onChange: event => {
                  const hints = event.currentTarget.value;
                  if (!HINT_MODES.includes(hints) || hints === session.hints) return;
                  setHintPreference(hints);
                  restart(session.duration, false, session.language, hints, session.text);
                },
              }, HINT_MODES.map(mode => h('option', { key: mode, value: mode }, t('hint_' + mode)))),
                h('svg', { className: 'tp-select-chevron', viewBox: '0 0 12 12', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false },
                  h('path', { d: 'M3 4.5 6 7.5 9 4.5' })),
              ),
            ) : null,
          ),
          h('div', { className: 'tp-stats' },
            h(Stat, { label: speedUnit, value: shownSpeed, accent: true, description: isIme ? t('cpmTip') : undefined }),
            h(Stat, { label: t('statsAccuracy'), value: shownAccuracy, unit: t('unitPercent') }),
            h(Stat, { label: t('statsErrors'), value: result ? result.wrongKeys : session.wrongKeys }),
            h(Stat, { label: t(session.source ? 'corpusElapsed' : 'statsRemaining'), value: session.source ? Math.floor(stats.ms / 1000) : remaining, unit: t('unitSeconds') }),
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
                  event.currentTarget.parentElement.scrollIntoView({ block: 'nearest' });
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
                h('span', null, session.source ? t('corpusCompleted', { seconds: (result.elapsedMs / 1000).toFixed(1) }) : result.eligible ? t('resultTitle') : t('resultEarly', { seconds: (result.elapsedMs / 1000).toFixed(1) })),
                isRecord ? h('span', { className: 'tp-record' }, t(session.source ? 'newPassageRecord' : 'newRecordBadge')) : null,
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
                  style: { visibility: result || !inputReady() ? 'hidden' : 'visible' },
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
              h('button', {
                type: 'button',
                className: 'tp-btn primary',
                onClick: () => restart(session.duration, true),
              }, t(result ? 'restart' : 'restartRun')),
            ),
          ),
          h('div', { className: 'tp-foot' },
            h('span', null, t(session.source ? 'corpusFooter' : 'footerTip')),
            corpusPreferenceError ? h('span', { className: 'tp-corpus-note tp-preference-error', role: 'status' }, t('corpusPreferenceError')) : null,
            saveError ? h('span', { className: 'tp-save-error', role: 'status' }, t('storageError')) : null,
          ),
          renderRecords(),
          renderSound(),
          renderCursor(),
        ),
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
