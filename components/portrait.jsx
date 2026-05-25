/* global React */
const { useState, useRef, useCallback, useEffect } = React;

/* ============================================================
   CompareCard — supports 4 transition modes
     mode: "fade" | "hover" | "slider" | "wipe"
     sliderAuto: vertical split + handle; auto-sweeps split when
       pointer is outside; on hover, mouse X scrubs + drag works
   ============================================================ */
function CompareCard({ before, after, label, en, idx, total, mode, sliderAuto, coverPos }) {
  const ref = useRef(null);
  const [split, setSplit] = useState(50);
  const [hover, setHover] = useState(false);
  const [autoOn, setAutoOn] = useState(true);
  const draggingRef = useRef(false);

  const isSlider = mode === "slider" || sliderAuto;

  // Auto sweep: first card (sliderAuto), or fade / wipe cards
  useEffect(() => {
    if (sliderAuto) {
      let t = (idx % 5) * (Math.PI / 4);
      let raf;
      const tick = () => {
        if (autoOn) {
          t += 0.01;
          const v = 50 + Math.sin(t) * 46;
          setSplit(Math.max(4, Math.min(96, v)));
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }
    if (mode !== "fade" && mode !== "wipe") return;
    let t = (idx % 5) * (Math.PI / 4);
    let raf;
    const tick = () => {
      if (autoOn) {
        t += 0.012;
        const v = 50 + Math.sin(t) * 50;
        setSplit(Math.max(0, Math.min(100, v)));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [sliderAuto, mode, idx, autoOn]);

  const updateFromX = useCallback((clientX) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setSplit(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const onDown = (e) => {
    if (!isSlider) return;
    draggingRef.current = true;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    updateFromX(x);
    const onMove = (ev) => updateFromX(ev.touches ? ev.touches[0].clientX : ev.clientX);
    const onUp = () => {
      draggingRef.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);
  };

  const onPointerMove = (e) => {
    if (!sliderAuto || !hover || draggingRef.current) return;
    if (e.pointerType === "mouse" || e.pointerType === "pen") updateFromX(e.clientX);
  };

  const splitPct = split + "%";
  let afterStyle = {};
  if (isSlider) {
    afterStyle = { clipPath: `inset(0 0 0 ${splitPct})` };
  } else if (mode === "wipe") {
    afterStyle = { clipPath: `inset(${100 - split}% 0 0 0)` };
  } else if (mode === "fade") {
    afterStyle = { opacity: hover ? 1 : split / 100 };
  } else if (mode === "hover") {
    afterStyle = { opacity: hover ? 1 : 0 };
  }

  const cmpModeClass = sliderAuto ? "slider" : mode;

  return (
    <div
      className={"cmp cmp-" + cmpModeClass + (sliderAuto ? " cmp-slider-auto" : "")}
      ref={ref}
      style={{ "--split": splitPct }}
      onMouseDown={onDown}
      onTouchStart={onDown}
      onPointerMove={onPointerMove}
      onPointerEnter={() => { setHover(true); setAutoOn(false); }}
      onPointerLeave={() => { setHover(false); setAutoOn(true); }}>
      <div
        className="layer before"
        style={{
          backgroundImage: `url(${before})`,
          backgroundPosition: coverPos || "center",
        }}
      />
      <div
        className="layer after"
        style={{
          backgroundImage: `url(${after})`,
          backgroundPosition: coverPos || "center",
          ...afterStyle,
        }}
      />
      {isSlider && <div className="handle" />}
      <div className="lab lhs">BEFORE</div>
      <div className="lab rhs">AFTER</div>
      <div className="cmp-bottom">
        <div className="cmp-label">
          <h4>{label}</h4>
          <div className="en">{en}</div>
        </div>
        <div className="cmp-num">
          {String(idx + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}

function PortraitSection({ items, mode }) {
  return (
    <section className="section" id="portrait" data-screen-label="03 AI Portrait">
      <div className="wrap" style={{ position: "relative" }}>
        <div className="bg-word">PORTRAIT</div>
        <div className="section-head">
          <div className="lhs">
            <span className="eyebrow">02 / 作品 · 重点</span>
            <h2>
              <span className="acc">AI 人像</span>效果<br />
              <span style={{ fontWeight: 300, color: "var(--fg-muted)" }}>· before / after</span>
            </h2>
            <span className="en">RELIGHT · INPAINT · MAGIC EDIT · OUTFIT · OUTPAINT</span>
          </div>
          <div className="rhs">
            <p className="portrait-rhs-lede">
              主要负责AI特效人像相关效果的落地与优化：针对换装、魔法编辑、光影重塑、智能扩图、AI 修图、局部重绘等功能进行效果测评、参数调优与问题修复， 顺利推动 AI 人像能力在像塑工具中落地。像塑工具Prompt 体系的建设，输出并优化 system prompt，AI修图LORA训练数据图处理以及光影重塑促产与UGC的迭代。较好的提升了 AI 的规模量级，提升了较高的投稿量。
            </p>
          </div>
        </div>

        <div className="portrait-rail">
          {items.map((it, i) => (
            <CompareCard
              key={i + "-" + it.before + "-" + it.after + "-" + mode + (it.sliderAuto ? "-sa" : "")}
              idx={i}
              total={items.length}
              before={it.before}
              after={it.after}
              label={it.label}
              en={it.en}
              mode={mode}
              sliderAuto={!!it.sliderAuto}
              coverPos={it.coverPos}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

window.PortraitSection = PortraitSection;
