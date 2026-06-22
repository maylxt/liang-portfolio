/* global React */
const { useEffect, useRef, useState } = React;

/* ============================================================
   CursorGlow — accent dot + smooth lag ring (hover / press states)
   ============================================================ */
function CursorGlow() {
  useEffect(() => {
    if (matchMedia("(pointer: coarse)").matches) return;

    const ring = document.createElement("div");ring.className = "art-cursor ring";
    const dot = document.createElement("div");dot.className = "art-cursor dot";
    document.body.append(ring, dot);
    document.documentElement.classList.add("has-art-cursor");

    let tx = -100,ty = -100; // target (real pointer)
    let rx = -100,ry = -100; // ring (lagging)
    let active = false;

    const onMove = (e) => {
      tx = e.clientX;ty = e.clientY;
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;
      if (!active) { rx = tx; ry = ty; active = true; }
    };
    const onDown = () => document.documentElement.classList.add("art-cursor-press");
    const onUp = () => document.documentElement.classList.remove("art-cursor-press");
    const onOver = (e) => {
      const t = e.target;
      if (t && t.closest && t.closest('a, button, [role="button"], .liquid-glass, .cmp, .contact-row, .skill-pill, .menu a, input, textarea')) {
        document.documentElement.classList.add("art-cursor-hot");
      } else {
        document.documentElement.classList.remove("art-cursor-hot");
      }
    };

    let raf;
    const tick = () => {
      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointerover", onOver, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointerover", onOver);
      ring.remove();
      dot.remove();
      document.documentElement.classList.remove("has-art-cursor", "art-cursor-hot", "art-cursor-press");
    };
  }, []);
  return null;
}
window.CursorGlow = CursorGlow;

/* ============================================================
   HERO — looping video + canvas-particle text overlay
   ============================================================ */
function ParticleHeadline({ text = "LIANG XIAOTING", subtext = "AI EFFECT DESIGNER" }) {
  const cvsRef = useRef(null);

  useEffect(() => {
    const cvs = cvsRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    let raf,particles = [],pointer = { x: -9999, y: -9999, active: false };

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0,H = 0;

    const seed = () => {
      W = cvs.clientWidth;H = cvs.clientHeight;
      cvs.width = W * dpr;cvs.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // sample the headline text shape into a particle field
      const off = document.createElement("canvas");
      off.width = W;off.height = H;
      const octx = off.getContext("2d");
      octx.fillStyle = "#fff";
      octx.textBaseline = "middle";
      octx.textAlign = "center";

      const big = Math.max(48, Math.min(180, W * 0.10));
      octx.font = `600 ${big}px "Instrument Serif", "Songti SC", serif`;
      octx.fillText(text, W / 2, H / 2 - big * 0.15);
      const small = Math.max(11, Math.min(18, W * 0.012));
      octx.font = `500 ${small}px "JetBrains Mono", monospace`;
      octx.fillStyle = "#fff";
      octx.fillText(subtext, W / 2, H / 2 + big * 0.55);

      const data = octx.getImageData(0, 0, W, H).data;
      const step = Math.max(3, Math.round(W / 460));
      const arr = [];
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          const a = data[(y * W + x) * 4 + 3];
          if (a > 128) {
            arr.push({
              ox: x + (Math.random() - 0.5) * 0.6,
              oy: y + (Math.random() - 0.5) * 0.6,
              x: x + (Math.random() - 0.5) * W * 0.6,
              y: y + (Math.random() - 0.5) * H * 0.6,
              vx: 0, vy: 0,
              size: 0.7 + Math.random() * 1.2,
              alpha: 0.45 + Math.random() * 0.45
            });
          }
        }
      }
      particles = arr;
    };

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        let dx = p.ox - p.x;
        let dy = p.oy - p.y;
        p.vx = (p.vx + dx * 0.012) * 0.84;
        p.vy = (p.vy + dy * 0.012) * 0.84;

        // gentle repel from pointer
        if (pointer.active) {
          const rx = p.x - pointer.x;
          const ry = p.y - pointer.y;
          const d2 = rx * rx + ry * ry;
          if (d2 < 14000) {
            const f = (1 - d2 / 14000) * 1.8;
            p.vx += rx / Math.sqrt(d2 + 1) * f;
            p.vy += ry / Math.sqrt(d2 + 1) * f;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const onResize = () => seed();
    const onMove = (e) => {
      const r = cvs.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = true;
    };
    const onLeave = () => {pointer.active = false;pointer.x = -9999;pointer.y = -9999;};

    seed();
    tick();
    window.addEventListener("resize", onResize);
    cvs.addEventListener("pointermove", onMove);
    cvs.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      cvs.removeEventListener("pointermove", onMove);
      cvs.removeEventListener("pointerleave", onLeave);
    };
  }, [text, subtext]);

  return <canvas ref={cvsRef} className="hero-particles" aria-hidden />;
}

function Hero({ videoSrc, posterSrc }) {
  const videoRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onCanPlay = () => setLoaded(true);
    v.addEventListener("loadeddata", onCanPlay);
    v.play().catch(() => {});
    return () => v.removeEventListener("loadeddata", onCanPlay);
  }, []);

  return (
    <header className="hero" id="hero" data-screen-label="01 Hero">
      <div className="hero-video-fallback" aria-hidden />

      <video
        ref={videoRef}
        className="hero-video"
        autoPlay loop muted playsInline preload="auto"
        poster={posterSrc}
        aria-hidden
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.9s ease" }}>
        <source src={videoSrc} type="video/mp4" />
      </video>

      <div className="hero-vignette" aria-hidden />

      <nav className="hero-nav">
        <div className="logo animate-fade-rise">
          Liang Xiaoting<sup>®</sup>
        </div>
        <div className="menu animate-fade-rise-delay">
          <a href="#hero" className="active">Home</a>
          <a href="#about">关于我</a>
          <a href="#portrait">作品</a>
          <a href="#contact">联系</a>
        </div>
        <a
          className="liquid-glass btn-pill sm animate-fade-rise-delay-2 hero-cta-download nav"
          href="assets/resume-liangxiaoting-13522341227.pdf"
          download="梁小婷-13522341227-Resume.pdf"
          target="_blank"
          rel="noopener">
          <svg className="dl-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 4v12" />
            <path d="m6 11 6 6 6-6" />
            <path d="M5 20h14" />
          </svg>
          <span>下载简历</span>
        </a>
      </nav>

      <section className="hero-copy hero-copy-cn" style={{ height: "447px" }}>
        <span className="hero-eyebrow animate-fade-rise" style={{ letterSpacing: "4.4px", height: "0px" }}>
          <i className="dot" /> PORTFOLIO · 2026
        </span>
        <h1 className="hero-bigtitle animate-fade-rise-delay">
          <span className="hb-row hb-row-1" style={{ textAlign: "center", fontFamily: "Verdana", fontWeight: "600", width: "717px", fontSize: "58px", opacity: "0.85", letterSpacing: "-1.5px", lineHeight: "1.05", height: "125px" }}>Douyin Effects & AIGC Effects Design <em></em></span>
          <span className="hb-div" aria-hidden style={{ lineHeight: "0", width: "0px" }}>—</span>
          <span className="hb-row hb-row-2"></span>
        </h1>
        <p className="sub sub-lead animate-fade-rise-delay-2" style={{ margin: "-19.7812px 0px 0px", fontSize: "15px", width: "540px", height: "143px" }}>
          我是<strong>梁小婷</strong> — 字节跳动 <strong style={{ fontWeight: "500" }}>AI 效果设计师</strong>。
          七年专注于抖音特效与 AIGC 效果，
          <br />把短暂的灵感，变成数百万人沉浸的体验。
          <span className="sub-en" style={{ width: "508px", letterSpacing: "0.8px", fontSize: "10px", height: "1px" }}>AI EFFECT DESIGNER @ BYTEDANCE · 7 YRS · BEIJING</span>
        </p>
      </section>

      <div className="hero-strip">
        <div><span className="dot" />Available for full-time opportunities · 寻职中</div>
        <div className="scroll">SCROLL ↓</div>
      </div>
    </header>);
}

/* ============================================================
   ABOUT — bio + timeline + skills
   ============================================================ */
const TIMELINE = [
{ y: "2024 — 至今", role: "AI 效果设计师", org: "字节跳动 · 抖音" },
{ y: "2019 — 2024", role: "特效设计师", org: "字节跳动 · 抖音 / 生服" },
{ y: "2017 — 2019", role: "视觉设计师", org: "互联网 · 视觉团队" }];


const SKILL_GROUPS = [
{ k: "AIGC", l: "AIGC 工具",
  items: ["ComfyUI", "即梦", "Lovart", "Liblib", "Cursor"] },
{ k: "ML", l: "模型与方法",
  items: ["LoRA 训练", "Prompt 体系", "工作流"] },
{ k: "VFX", l: "传统设计",
  items: ["PS", "C4D / 建模渲染", "AE/二维动画", "Figma", "玩法配置"] }];


const STATS = [
  { n: "7", u: "yrs", l: "字节任职" },
  { n: "北京", l: "base" },
  { n: "硕士", l: "学历" },
];


function About() {
  return (
    <section className="about" id="about" data-screen-label="02 About">
      <div className="wrap" style={{ position: "relative" }}>
        <div className="bg-word">ABOUT</div>

        <header className="about-head">
          <div className="about-utility">
            <span className="eyebrow">01 / ABOUT ME</span>
          </div>
          <h2 className="about-title">
            <span className="acc">关于我</span> · 经历
          </h2>
          <ul className="about-stats about-stats--mini about-stats--row">
            {STATS.map((s) =>
              <li className="stat" key={s.n + "-" + s.l}>
                <div className="stat-n">
                  <span>{s.n}</span>
                  {s.u ? <em>{s.u}</em> : null}
                </div>
                <div className="stat-l">{s.l}</div>
              </li>
            )}
          </ul>
        </header>

        <div className="about-lede">
          <p>
            于字节任职<strong>七年</strong>。前五年担任特效设计师，
            最近两年转向 <strong className="acc">AI 效果设计</strong>——
            在 AIGC 工具、Prompt 体系与、效果评测与 LoRA 训练里，
            把短暂的灵感变成可量产的创作工艺。
          </p>
          <p className="about-en-text" lang="en">
            Seven years spanning AE / animation, VFX, and AIGC pipelines —
            from motion craft and compositing to prompt systems, LoRA training,
            and creator tools shipped to millions.
          </p>
        </div>

        <div className="about-cols">
          <div className="timeline timeline-compact">
            <div className="tl-label">Timeline · 履历</div>
            {TIMELINE.map((t, i) =>
              <div className="t-row" key={i}>
                <div className="t-year">{t.y}</div>
                <div className="t-body">
                  <h5>{t.role}</h5>
                  <div className="t-org">{t.org}</div>
                </div>
              </div>
            )}
          </div>

          <div className="skill-marquee skill-groups">
            <div className="tl-label">Toolkit · 工具栈</div>
            {SKILL_GROUPS.map((g) =>
              <div className="skill-group" key={g.k}>
                <div className="skill-group-head">
                  <span className="skill-group-k">{g.k}</span>
                  <span className="skill-group-l">{g.l}</span>
                </div>
                <div className="skill-row-pills">
                  {g.items.map((s) => <span key={s} className="skill-pill">{s}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);
}

window.Hero = Hero;
window.About = About;