/* global React */
const { useState, useEffect, useRef } = React;

/* ============================================================
   AI Vision — 5-up horizontal row with overlay info
   + Xiaohongshu CTA strip
   ============================================================ */
const XHS_URL = "https://www.xiaohongshu.com/user/profile/5aebdcee4eacab19e4f586b4";

function formatVideoTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function VisionFeaturedVideo({ video }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const onTimeUpdate = () => setProgress(el.currentTime);
    const onLoadedMetadata = () => setDuration(el.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    el.volume = volume;
    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("loadedmetadata", onLoadedMetadata);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);

    return () => {
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("loadedmetadata", onLoadedMetadata);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
    };
  }, [volume]);

  const handleInitialPlay = () => {
    const el = videoRef.current;
    if (!el) return;
    setStarted(true);
    el.play().catch(() => {});
  };

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  };

  const handleSeek = (e) => {
    const el = videoRef.current;
    const t = parseFloat(e.target.value);
    if (!el || !Number.isFinite(t)) return;
    el.currentTime = t;
    setProgress(t);
  };

  const handleVolume = (e) => {
    const el = videoRef.current;
    const v = parseFloat(e.target.value);
    if (!el || !Number.isFinite(v)) return;
    el.volume = v;
    el.muted = v === 0;
    setVolume(v);
    setMuted(v === 0);
  };

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.muted || el.volume === 0) {
      const next = volume > 0 ? volume : 0.85;
      el.muted = false;
      el.volume = next;
      setVolume(next);
      setMuted(false);
    } else {
      el.muted = true;
      setMuted(true);
    }
  };

  return (
    <article className="vision-featured-video">
      <div className={`vision-featured-video__player${started ? " is-started" : ""}${isPlaying ? " is-playing" : ""}`}>
        <video
          ref={videoRef}
          className="vision-featured-video__media"
          src={video.src}
          poster={video.poster}
          playsInline
          preload="metadata"
          disablePictureInPicture
          controlsList="nodownload noplaybackrate noremoteplayback"
        />
        {!isPlaying && (
          <button
            type="button"
            className="vision-featured-video__play"
            onClick={started ? togglePlay : handleInitialPlay}
            aria-label={started ? "继续播放" : `播放 ${video.title}`}>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden>
              <path d="M8 5.14v13.72L19 12 8 5.14Z" />
            </svg>
          </button>
        )}
        {started && (
          <div className="vision-featured-video__bar">
            <button
              type="button"
              className="vision-featured-video__ctl"
              onClick={togglePlay}
              aria-label={isPlaying ? "暂停" : "播放"}>
              {isPlaying ? (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
                  <path d="M7 5h3v14H7V5Zm7 0h3v14h-3V5Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
                  <path d="M8 5.14v13.72L19 12 8 5.14Z" />
                </svg>
              )}
            </button>
            <label className="vision-featured-video__scrub">
              <span className="sr-only">播放进度</span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={Math.min(progress, duration || 0)}
                onChange={handleSeek}
              />
            </label>
            <span className="vision-featured-video__time">
              {formatVideoTime(progress)} / {formatVideoTime(duration)}
            </span>
            <button
              type="button"
              className="vision-featured-video__ctl"
              onClick={toggleMute}
              aria-label={muted ? "取消静音" : "静音"}>
              {muted || volume === 0 ? (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
                  <path d="M11 5 6 9H3v6h3l5 4V5Zm9.59 3.41L18.17 8.83 16 11l2.17 2.17-1.41 1.42L14.59 12.4 12.41 14.6l1.42 1.41L16 13.83l2.17 2.17 1.42-1.41L17.41 12l2.18-2.17-1.42-1.42Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
                  <path d="M11 5 6 9H3v6h3l5 4V5Zm4.5 7c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03ZM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77Z" />
                </svg>
              )}
            </button>
            <label className="vision-featured-video__volume-wrap">
              <span className="sr-only">音量</span>
              <input
                type="range"
                className="vision-featured-video__volume"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={handleVolume}
              />
            </label>
          </div>
        )}
      </div>
      <div className="vision-featured-video__meta">
        <span className="vision-featured-video__tag">VIDEO · AIGC</span>
        <h3 className="vision-featured-video__title">{video.title}</h3>
        <p className="vision-featured-video__duration">时长 · {video.duration}</p>
        <p className="vision-featured-video__desc">{video.desc}</p>
      </div>
    </article>
  );
}

function VisionSection({ items, video }) {
  return (
    <section className="section vision-section" id="vision" data-screen-label="04 AIGC"
      style={{ background: "var(--bg-elev)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="wrap" style={{ position: "relative" }}>
        <div className="bg-word">AIGC</div>
        <div className="section-head">
          <div className="lhs">
            <span className="eyebrow">03 / 作品</span>
            <h2>
              <span className="vision-title">
                <span className="acc">AIGC</span>探索
              </span>
              <br />
              <span className="vision-subline">个人 AIGC 实验场</span>
            </h2>
            <span className="en">VERTICAL POSTER · BRAND VISUAL · IP DESIGN · 3D CARTOON</span>
          </div>
          <div className="rhs">
            通过系统化 AIGC 方法论的深度应用，建立<strong>可复用、可迭代、可优化</strong>的
            AI 生成标准流程，将传统创作模式升级为「AI 辅助 + 人工精调」的高效体系。
            <br /><br />
            <a href={XHS_URL} target="_blank" rel="noopener" className="xhs-inline">
              <span className="xhs-dot" /> 完整作品 → 小红书 @梁小婷
            </a>
          </div>
        </div>

        {video ? (
          <div className="vision-block vision-block--video">
            <header className="vision-block-head">
              <span className="vision-block-num">A · VIDEO</span>
              <h3 className="vision-block-title"><span className="acc">AI 视频</span></h3>
              <span className="vision-block-en">AIGC SHORT FILM · MOTION VISUAL</span>
              <span className="vision-block-rule" aria-hidden />
            </header>
            <VisionFeaturedVideo video={video} />
          </div>
        ) : null}

        <div className="vision-block vision-block--visual">
          <header className="vision-block-head">
            <span className="vision-block-num">B · VISUAL</span>
            <h3 className="vision-block-title"><span className="acc">AI 视觉</span></h3>
            <span className="vision-block-en">VERTICAL POSTER · BRAND KV · IP DESIGN</span>
            <span className="vision-block-rule" aria-hidden />
          </header>
          <div className="vision-row-wrap">
          <div className="vision-row" role="list">
            {items.map((it, i) => (
            <article
              key={i}
              role="listitem"
              className="vision-row__card"
            >
              <div
                className="vision-row__img"
                style={{
                  backgroundImage: `url(${it.img})`,
                  ...(it.imgPos ? { backgroundPosition: it.imgPos } : {}),
                }}
              />
              <div className="vision-row__shade" aria-hidden />
              <div className="vision-row__info">
                <span className="vision-row__num">V · {String(i + 1).padStart(2, "0")}</span>
                <h4 className="vision-row__title">{it.title}</h4>
                <p className="vision-row__sub">{it.sub}</p>
              </div>
            </article>
          ))}
          </div>
          </div>
        </div>

        <a href={XHS_URL} target="_blank" rel="noopener" className="xhs-strip">
          <span className="xhs-strip-label">
            <span className="xhs-dot" />
            更多 AIGC 探索 · ON XIAOHONGSHU
          </span>
          <span className="xhs-strip-url">@梁小婷 · xiaohongshu.com/user/profile</span>
          <span className="xhs-strip-arrow">↗</span>
        </a>
      </div>
    </section>
  );
}

/* ============================================================
   EFFECTS — 4 grouped sub-modules
     · minigame  (3 row composites, minigame-row)
     · douyin    (10 items, 5×2 rail — portrait-style cards)
     · stickers  (3 items, wide 16:9)
     · ops       (3 items, trio)
   ============================================================ */
function FxGroupTitle({ title, accent }) {
  if (!accent) return title;
  const i = title.indexOf(accent);
  if (i === -1) return title;
  return (
    <>
      {title.slice(0, i)}
      <span className="acc">{accent}</span>
      {title.slice(i + accent.length)}
    </>
  );
}

function EffectGroup({ group, gi }) {
  const { id, title, titleAccent, en, desc, layout, items } = group;

  return (
    <div className={"fx-group fx-" + layout} id={"fx-" + id}>
      <header className="fx-group-head">
        <div className="fx-group-num">FX · GROUP {String(gi + 1).padStart(2, "0")}</div>
        <h3><FxGroupTitle title={title} accent={titleAccent} /></h3>
        <div className="en">{en}</div>
        <p className="lede">{desc}</p>
        <i className="rule" />
      </header>

      {layout === "minigame-row" ? (
        <div className="fx-grid grid-minigame-row">
          {items.map((it, i) => (
            <div className="fx layout-minigame-row" key={i}>
              <img className="fx-media-img" src={it.src} alt={it.title} loading="lazy" />
              {it.tag && <div className="live ghost">{it.tag}</div>}
              <div className="info">
                <h5>{it.title}</h5>
                {it.sub && <div className="sub">{it.sub}</div>}
              </div>
            </div>
          ))}
        </div>
      ) : layout === "rail5" ? (
        <div className="portrait-rail fx-douyin-rail">
          {items.map((it, i) => (
            <div className="cmp cmp-media" key={i + "-" + it.src}>
              <img className="cmp-media-img" src={it.src} alt={it.title} loading="lazy" />
              <div className="cmp-tag-s">{it.tag || "S 级"}</div>
              <div className="cmp-bottom">
                <div className="cmp-label">
                  <h4>{it.title}</h4>
                  {it.sub && <div className="en">{it.sub}</div>}
                </div>
                <div className="cmp-num">
                  {String(i + 1).padStart(2, "0")}/{String(items.length).padStart(2, "0")}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={"fx-grid grid-" + layout}>
          {items.map((it, i) => (
            <div className={"fx " + ("layout-" + layout)} key={i}>
              {layout === "stk-2col" ? (
                <img className="fx-media-img" src={it.src} alt={it.title} loading="lazy" />
              ) : (
                <div className="img" style={{ backgroundImage: `url(${it.src})` }} />
              )}
              <div className="num">FX · {String(i + 1).padStart(2, "0")}</div>
              {it.live && <div className="live">{it.tag || "LIVE"}</div>}
              {!it.live && it.tag && <div className="live ghost">{it.tag}</div>}
              <div className="info">
                <h5>{it.title}</h5>
                {it.sub && <div className="sub">{it.sub}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EffectsSection({ groups, inlineCaseAfter = {} }) {
  return (
    <section className="section" id="fx" data-screen-label="05 Effects">
      <div className="wrap" style={{ position: "relative" }}>
        <div className="bg-word">EFFECTS</div>
        <div className="section-head">
          <div className="lhs">
            <span className="eyebrow">04 / 作品 · 传统特效</span>
            <h2>
              抖音<span className="acc">特效</span>玩法<br/>
              <span className="fx-subline">
                爆款特效·<span className="fx-subline-years">2019-2024</span>
              </span>
            </h2>
            <span className="en">MINI GAMES · DOUYIN FX · INFOGRAPHIC STICKERS · CAMPAIGN OPS</span>
          </div>
          <div className="rhs">
            核心负责抖音特效玩法的创意策划与视觉设计全链路，覆盖互动特效道具、轻量特效小游戏及平台级运营活动。独立主导从创意生成、交互逻辑、视觉动画到工具配置上线的完整流程，以数据为导向打造高参与度玩法，有效提升平台用户活跃度、UGC 投稿量与播放量，成功产出多款 S 级爆款特效。
          </div>
        </div>

        <div className="fx-groups">
          {groups.map((g, i) => (
            <React.Fragment key={g.id}>
              <EffectGroup group={g} gi={i} />
              {inlineCaseAfter[g.id] && (
                <div className="fx-inline-case">
                  <window.InlineCaseCorner label={inlineCaseAfter[g.id].cornerLabel} />
                  <window.CaseCard c={inlineCaseAfter[g.id]} idx={0} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

window.VisionSection = VisionSection;
window.EffectsSection = EffectsSection;
