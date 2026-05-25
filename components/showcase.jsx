/* global React */
const { useState, useEffect, useRef } = React;

/* ============================================================
   AI Vision — 5-up horizontal row with overlay info
   + Xiaohongshu CTA strip
   ============================================================ */
const XHS_URL = "https://www.xiaohongshu.com/user/profile/5aebdcee4eacab19e4f586b4";

function VisionSection({ items }) {
  return (
    <section className="section vision-section" id="vision" data-screen-label="04 AI Vision"
      style={{ background: "var(--bg-elev)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="wrap" style={{ position: "relative" }}>
        <div className="bg-word">VISION</div>
        <div className="section-head">
          <div className="lhs">
            <span className="eyebrow">03 / 作品</span>
            <h2>
              <span className="vision-title">
                <span className="acc">AI 视觉</span>探索
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

        <a href={XHS_URL} target="_blank" rel="noopener" className="xhs-strip">
          <span className="xhs-strip-label">
            <span className="xhs-dot" />
            更多 AI 视觉探索 · ON XIAOHONGSHU
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
