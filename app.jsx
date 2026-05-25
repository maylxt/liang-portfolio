/* global React, ReactDOM, Hero, About, PortraitSection, VisionSection, EffectsSection, ContactSection, CaseCard, InlineCaseCorner, CursorGlow */
const { useEffect } = React;

const PROD_CONFIG = {
  theme: "editorial",
  mode: "dark",
  accent: "#ff5a2e",
  compareMode: "fade",
  cursorGlow: true,
};

/* ─── Asset bindings ──────────────────────────────────────── */
const HERO_VIDEO  = "assets/hero-0512.mp4";
const HERO_POSTER = "assets/doc-02.jpg";

/* 5 before/after pieces for the AI Portrait rail */
const PORTRAIT_ITEMS = [
  {
    before: "assets/portrait-lighting-before.png",
    after: "assets/portrait-lighting-after.png",
    label: "光影重塑",
    en: "RELIGHT",
    sliderAuto: true,
  },
  {
    before: "assets/portrait-inpaint-before.png?v=20260515",
    after: "assets/portrait-inpaint-after.png?v=20260515",
    label: "局部重绘",
    en: "INPAINT",
    sliderAuto: true,
  },
  {
    before: "assets/portrait-magic-before.png",
    after: "assets/portrait-magic-after.png",
    label: "魔法编辑",
    en: "MAGIC · EDIT",
    sliderAuto: true,
  },
  {
    before: "assets/portrait-outfit-before.png",
    after: "assets/portrait-outfit-after.png",
    label: "AI 换装",
    en: "OUTFIT",
    sliderAuto: true,
  },
  {
    before: "assets/portrait-outpaint-before.png",
    after: "assets/portrait-outpaint-after.png",
    label: "智能扩图",
    en: "OUTPAINT",
    sliderAuto: true,
    coverPos: "center top",
  },
];

/* 5 AI Vision pieces — single horizontal row */
const VISION_ITEMS = [
  { img: "assets/vision-01-carnival.jpg",         title: "年度嘉年华主视觉", sub: "SKETCH → CLAY → RENDER",           imgPos: "center top" },
  { img: "assets/vision-02-checkin.jpg",          title: "打卡海报系列",     sub: "旅拍 · 音乐 · 影视 · 直播",       imgPos: "center center" },
  { img: "assets/vision-03-daily-life.jpg",       title: "日常生活打卡",     sub: "DAILY LIFE CHECK-IN",             imgPos: "center center" },
  { img: "assets/vision-04-poster.jpg",           title: "竖版活动海报",     sub: "VERTICAL POSTER · UI",            imgPos: "center top" },
  { img: "assets/vision-05-wonderful-night.jpg", title: "Wonderful Night",  sub: "LANDSCAPE KV · 2026",             imgPos: "center top" },
];

/* Effects — 4 sub-modules under the same section */
const EFFECT_GROUPS = [
  {
    id: "minigame",
    title: "抖音特效小游戏",
    titleAccent: "小游戏",
    en: "AUDIO-DRIVEN · MINI GAMES",
    desc: "独立负责多款人脸识别技术与趣味玩法结合的轻互动小游戏的全流程设计与实现。涵盖创意概念输出、视觉 UI 体系搭建、玩法交互逻辑梳理、动效设计制作、3D 建模及美妆滤镜参数调优等环节。",
    layout: "minigame-row",
    items: [
      { src: "assets/fx-minigame-row-01.png?v=20260520", title: "日常专项", sub: "DAILY SPECIAL" },
      { src: "assets/fx-minigame-row-02.png?v=20260520", title: "节日专项", sub: "FESTIVAL SPECIAL", tag: "S 级" },
      { src: "assets/fx-minigame-row-03.png?v=20260520", title: "日常专项", sub: "DAILY SPECIAL" },
    ],
  },
  {
    id: "douyin",
    title: "抖音特效道具",
    titleAccent: "道具",
    en: "DOUYIN · VIRAL EFFECTS",
    desc: "独立负责抖音特效道具从创意构思到上线发布的全流程设计与制作，主导创意概念生成与视觉风格定义，完成特效道具的 UI 界面设计、交互逻辑梳理、2D/3D 动效制作、三维模型构建与材质渲染，精通美妆滤镜参数调试与效果优化，熟练使用特效制作工具进行工程配置与性能调优，确保特效道具的创意表现力、用户体验与技术可行性的完美平衡。",
    layout: "rail5",
    items: [
      { src: "assets/fx-douyin-01.gif?v=20260518b", title: "好运发生",     sub: "GOOD LUCK" },
      { src: "assets/fx-douyin-02.gif?v=20260518b", title: "体感游戏",     sub: "MOTION · GAME" },
      { src: "assets/fx-douyin-03.gif?v=20260518b", title: "5格拼图",      sub: "5 · GRID PUZZLE" },
      { src: "assets/fx-douyin-04.gif?v=20260518b", title: "猜成语",       sub: "IDIOM · GUESS" },
      { src: "assets/fx-douyin-05.gif?v=20260518b", title: "绕口令",       sub: "TONGUE · TWISTER" },
      { src: "assets/fx-douyin-06.gif?v=20260518b", title: "贪吃蛇",       sub: "SNAKE · GAME" },
      { src: "assets/fx-douyin-07.gif?v=20260518b", title: "美妆解锁",     sub: "MAKEUP · UNLOCK" },
      { src: "assets/fx-douyin-08.gif?v=20260518b", title: "消灭大菠萝",   sub: "PINEAPPLE" },
      { src: "assets/fx-douyin-09.gif?v=20260518b", title: "嘟嘴搭桥",     sub: "MOUTH · BRIDGE" },
      { src: "assets/fx-douyin-10.gif?v=20260518b", title: "小猴爬树",     sub: "MONKEY · CLIMB" },
    ],
  },
  {
    id: "stickers",
    title: "信息化贴纸",
    titleAccent: "贴纸",
    en: "INFOGRAPHIC · STICKERS",
    desc: "以自驱式创意为核心，负责信息化贴纸的主题策划、视觉设计与动效实现。主动挖掘用户需求与热点趋势，快速响应市场变化，产出多款爆款贴纸。",
    layout: "stk-2col",
    items: [
      { src: "assets/fx-stickers-07.gif?v=20260518", title: "信息化贴纸", sub: "STICKER · 01" },
      { src: "assets/fx-stickers-08.gif?v=20260518", title: "信息化贴纸", sub: "STICKER · 02" },
      { src: "assets/fx-stickers-09.png?v=20260518", title: "信息化贴纸", sub: "STICKER · 03" },
    ],
  },
  {
    id: "ops",
    title: "抖音运营活动设计",
    titleAccent: "运营活动",
    en: "OPS · CAMPAIGN DESIGN",
    desc: "负责\"团圆家乡年\"春节活动组队任务模块的视觉 UI 与玩法设计，以\"人格化\"为核心打造叠起小牛舞狮趣味形式，最终显著提升了用户参与度，组队成功率超预期，拉新拉活数据表现亮眼，获得了业务侧的一致好评。",
    layout: "ops-duo",
    items: [
      { src: "assets/fx-ops-01.png", title: "2021年春节项目", sub: "SPRING FESTIVAL · 2021" },
      { src: "assets/fx-ops-02.png", title: "组队任务模块", sub: "TEAM-UP · MODULE" },
    ],
  },
];

/* Two deep-dive cases */
const CASE_DEEP = [
  {
    id: "case-ai-lighting",
    cornerLabel: "光影重塑 | Detail",
    idx: "C / 01",
    year: "2025",
    tag: "AIGC · 像塑工具",
    title: "AI光影重塑",
    subtitle: "RELIGHT· AI 人像能力工具化落地",
    cover: "assets/case-ai-lighting-cover.png",
    coverContain: true,
    intro:
      "「AI 光影重塑」是字节 AIGC 像塑工具中的核心能力之一，提供一键重塑人像光影、风格化打光、电影感氛围光等玩法。\n参与电影单特效多维度参数调优与效果验证，包括加速LORA、主体扩图等参数测试与优化。推进光影重塑工具三端上线验收及创意方案输出，定期产出多款节日热点 AI 效果。",
    role: "AI 效果设计师",
    duration: "2025 · 持续迭代中",
    stack: "ComfyUI · LoRA · 即梦 · Nano Banana · 像塑",
    work: [
      "完成电影大片单特效全链路优化：针对换背景、加速 LORA 功能开展参数测试与效果调优；为解决大头效果劣化问题，新增主体扩图功能并完成场景外扩、人脸占比阈值的多维度测试验证",
      "完成电影特效配套工作落地：输出用户图 DEMO 完成效果测评，参与电影主题效果关键词产出，完成多场景 PGC 预埋效果测试",
      "推进节日热点及主题效果量产上线：围绕中秋节完成多款 AI 特效效果促产；制定光影重塑效果广场更新计划，完成并上线多款主题效果",
      "落地光影重塑工具化建设：完成工具默认参数的测试与迭代优化；推进工作流、移动端、电脑端三端效果验收，保障工具顺利上线",
      "做好光影重塑项目支撑与创意储备：根据上线需求定期完成玩法脑暴并输出多款创意方案，丰富特效玩法方向",
    ],
    outcomes: [
      { k: "特效与模板", v: "9.38 万款" },
      { k: "总投稿量",   v: "5,383 万" },
      { k: "总 VV",      v: "199.6 亿" },
      { k: "Diffusion 模型", v: "投稿 / 消费 TOP 1" },
    ],
  },
  {
    id: "case-spring",
    cornerLabel: "春节送礼项目 | Detail",
    idx: "C / 02",
    year: "2024",
    tag: "节日营销 · AR 特效",
    title: "生服春节送礼特效",
    subtitle: "Spring Festival · 团购券转赠的 AR 玩法",
    cover: "assets/case-spring-cover.png?v=20260519",
    coverContain: true,
    intro:
      "围绕抖音生活服务团购券「转赠」能力，为 2024 龙年春节定制的 AR 送礼特效。\n作为特效项目 POC 及设计owner，全程负责项目从 0 到 1 落地。独立完成 90% 以上核心生产环节：包括前期创意策划、玩法交互逻辑定义、视觉概念与角色动态设定、3D 资产制作、效果渲染调试、像塑平台参数配置及后续特效延展优化，确保项目按时高质量上线。",
    role: "项目 POC · 特效设计全流程",
    duration: "2024 · 春节档（约 6 周）",
    stack: "C4D · OC 渲染 · 像塑 · AR 玩法配置",
    flowDiagram: "assets/case-spring-flow.png",
    gallery: [
      { type: "image", src: "assets/case-spring-01.png" },
      { type: "image", src: "assets/case-spring-02.png" },
      { type: "image", src: "assets/case-spring-03.png" },
      { type: "video", src: "assets/case-spring-04.mp4" },
      { type: "video", src: "assets/case-spring-05.mp4" },
    ],
    work: [
      "主导特效项目前期创意策划，参与头脑风暴输出创意方案，梳理特效玩法规则与用户交互逻辑，为后续制作提供清晰的技术与设计指引。",
      "负责特效视觉体系搭建，独立完成概念草图绘制、角色形象设计及动态姿势规划，统一项目视觉风格并输出标准化设计规范。",
      "承担特效核心制作工作，完成 3D 模型搭建、材质贴图制作与效果渲染调试，优化模型面数与渲染性能，确保视觉效果与技术可行性平衡。",
      "负责特效最终落地与延展开发，完成像塑平台上机配置、参数调试与兼容性测试，基于核心特效开发多场景适配的延展版本。",
      "跟进特效项目全流程进度，协调跨部门资源解决制作与上线过程中的问题，保障项目按时高质量交付与顺利上线。",
    ],
    outcomes: [
      { k: "核销转化", v: "节日档显著正增量" },
      { k: "日常投稿", v: "用户主动二创可观" },
    ],
    footerVideo: "assets/case-spring-06.mp4",
    footerVideoCaption:
      "设计紧扣 2024 龙年春节节点，将醒狮与龙的传统符号相融，以 Q 版比例搭配星光瞳仁打造萌系质感，既降低了用户互动门槛，又精准传递节庆氛围。铜钱纹、金饰的细节点缀，更暗合了春节赠礼、开运纳福的场景核心诉求。",
  },
];

/* ─── App ─────────────────────────────────────────────────── */
function InlineCase({ c }) {
  return (
    <section className="section inline-case" id={c.id} data-screen-label={"Case \u00b7 " + c.title}>
      <div className="wrap inline-case-inner">
        <InlineCaseCorner label={c.cornerLabel} />
        <CaseCard c={c} idx={0} />
      </div>
    </section>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", PROD_CONFIG.theme);
    document.documentElement.setAttribute("data-mode", PROD_CONFIG.mode);
    document.documentElement.style.setProperty("--accent", PROD_CONFIG.accent);
  }, []);

  // smooth-scroll for in-page anchors
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest("a[href^='#']");
      if (!a) return;
      const id = a.getAttribute("href").slice(1);
      const el = id && document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 24, behavior: "smooth" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      {PROD_CONFIG.cursorGlow && <CursorGlow />}

      <Hero videoSrc={HERO_VIDEO} posterSrc={HERO_POSTER} />
      <About />
      <PortraitSection items={PORTRAIT_ITEMS} mode={PROD_CONFIG.compareMode} />
      <InlineCase c={CASE_DEEP[0]} />
      <VisionSection items={VISION_ITEMS} />
      <EffectsSection groups={EFFECT_GROUPS} inlineCaseAfter={{ douyin: CASE_DEEP[1] }} />
      <ContactSection />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("app")).render(<App />);
