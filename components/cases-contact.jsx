/* global React */

/* ============================================================
   Project deep-dive cases (AI 光影基地 / 生服春节)
   ============================================================ */
function InlineCaseCorner({ label }) {
  if (!label) return null;
  const m = String(label).match(/^(.+?)\s*[|｜]\s*(.+)$/);
  if (m) {
    return (
      <div className="inline-case-corner">
        <span className="inline-case-corner-main">{m[1].trim()}</span>
        <span className="inline-case-corner-sep"> | </span>
        <span className="inline-case-corner-sub">{m[2].trim()}</span>
      </div>
    );
  }
  return <div className="inline-case-corner">{label}</div>;
}

function CaseCard({ c, idx }) {
  return (
    <article className="deepcase deepcase-h" id={c.id} data-idx={c.idx}>
      <div className="deepcase-cover">
        {c.coverContain ? (
          <img className="cover-img cover-img-el" src={c.cover} alt={c.title} loading="eager" />
        ) : (
          <div className="cover-img" style={{ backgroundImage: `url(${c.cover})` }} />
        )}
        <div className="cover-mask" />
        <div className="cover-meta">
          <div className="cover-idx">{c.idx} · {c.year}</div>
          <div className="cover-tag">{c.tag}</div>
        </div>
        <div className="cover-bottom">
          <h3>{c.title}</h3>
          <div className="cover-sub">{c.subtitle}</div>
        </div>
      </div>

      <div className="deepcase-body">
        <div className="dc-top">
          <div className="dc-block dc-intro-block">
            <span className="dc-key">01 / 项目介绍</span>
            <div className="dc-val intro">
              {c.intro.split("\n").map((line, i) => <p key={i}>{line}</p>)}
            </div>
          </div>
          <div className="dc-meta-col">
            <div className="dc-block">
              <span className="dc-key">02 / 我的角色</span>
              <div className="dc-val"><strong>{c.role}</strong></div>
            </div>
            <div className="dc-block">
              <span className="dc-key">03 / 时间周期</span>
              <div className="dc-val"><strong>{c.duration}</strong></div>
            </div>
            <div className="dc-block">
              <span className="dc-key">04 / 技术栈</span>
              <div className="dc-val"><span className="stack">{c.stack}</span></div>
            </div>
          </div>
        </div>

        {c.flowDiagram && (
          <div className="dc-flow-diagram">
            <img src={c.flowDiagram} alt="玩法流程示意" loading="lazy" />
          </div>
        )}

        {c.gallery && c.gallery.length > 0 && (
          <div className="dc-gallery" role="list">
            {c.gallery.map((item, i) => (
              <div className="dc-gallery-item" key={i} role="listitem">
                {item.type === "video" ? (
                  <video
                    className="dc-gallery-media"
                    src={item.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <img className="dc-gallery-media" src={item.src} alt="" loading="lazy" />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="dc-bottom dc-bottom-split">
          <span className="dc-key dc-key-work">05 / 工作内容</span>
          <span className="dc-key dc-key-outcomes">06 / 项目收益</span>
          <ul className="dc-list dc-list-work">
            {c.work.map((w, i) =>
              <li key={i}>
                <span className="dc-list-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="dc-list-text">{w}</span>
              </li>
            )}
          </ul>
          <div className="dc-stats dc-stats-outcomes">
            {c.outcomes.map((o, i) =>
              <div className="dc-stat" key={i}>
                <div className="k">{o.k}</div>
                <div className="v">{o.v}</div>
              </div>
            )}
          </div>
        </div>

        {c.footerVideo && (
          <div className="dc-footer-video-block">
            <div className="dc-footer-video">
              <video
                className="dc-footer-video-media"
                src={c.footerVideo}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
              />
            </div>
            {c.footerVideoCaption && (
              <p className="dc-footer-video-caption">{c.footerVideoCaption}</p>
            )}
          </div>
        )}
      </div>
    </article>);

}

function CasesSection({ cases }) {
  return (
    <section className="section cases-section" id="cases" data-screen-label="06 Project Cases">
      <div className="wrap" style={{ position: "relative" }}>
        <div className="bg-word">CASES</div>
        <div className="section-head">
          <div className="lhs">
            <span className="eyebrow">05 / 项目详情</span>
            <h2>
              重点项目<span className="acc"> Case Study</span>
            </h2>
            <span className="en">DEEP DIVE · TWO LANDMARK PROJECTS</span>
          </div>
          <div className="rhs">
            两个最具代表性的项目深度拆解 —— 项目背景 · 我的角色 · 工作内容 · 数据收益，
            完整还原从立项到上线的全流程思考。
          </div>
        </div>

        <div className="deepcase-stack">
          {cases.map((c, i) => <CaseCard key={c.id} c={c} idx={i} />)}
        </div>
      </div>
    </section>);

}

/* ============================================================
   Contact
   ============================================================ */
function ContactSection() {
  const rows = [
  { num: "01", label: "WeChat", value: "微信号：lxt529057285", href: null },
  { num: "02", label: "Phone", value: "电话：13522341227", href: "tel:+8613522341227" },
  { num: "03", label: "Email", value: "邮箱：529057285@qq.com", href: "mailto:529057285@qq.com" },
  { num: "04", label: "Xiaohongshu", value: "@梁小婷 · 完整 AI 视觉作品", href: "https://www.xiaohongshu.com/user/profile/5aebdcee4eacab19e4f586b4" }];

  return (
    <section className="contact" id="contact" data-screen-label="07 Contact">
      <div className="wrap" style={{ position: "relative" }}>
        <div className="bg-word">CONTACT</div>
        <div className="section-head contact-head">
          <div className="lhs">
            <span className="eyebrow">05 / Get in touch</span>
            <h2>
              一起聊聊<br />
              <span className="acc" style={{ fontStyle: "italic" }}>下个项目</span>?
            </h2>
            <span className="en">WECHAT · PHONE · EMAIL · XIAOHONGSHU</span>
          </div>
          <div className="rhs">
            目前开放<strong>合作 · 接案 · 全职</strong>机会。
            如果你正在寻找一位 AI 效果 / 视觉设计师，欢迎随时联系。
            <br /><br />
            Currently available for collaborations, freelance and full-time roles.
          </div>
        </div>

        <div className="contact-list">
          {rows.map((r, i) => {
            const Row = r.href ? "a" : "div";
            return (
              <Row className="contact-row" key={i} href={r.href || undefined}
              target={r.href ? "_blank" : undefined} rel={r.href ? "noopener" : undefined}>
                <div className="num">— {r.num}</div>
                <div className="label">{r.label}</div>
                <div className="value">{r.value}</div>
                <div className="arrow">↗</div>
              </Row>);

          })}
        </div>

        <div className="footer">
          <div>© 2026 LIANG XIAOTING — DESIGNED BY HER, BUILT WITH CARE</div>
          <div>v0.2 · IA REFRESH</div>
        </div>
      </div>
    </section>);

}

window.CaseCard = CaseCard;
window.InlineCaseCorner = InlineCaseCorner;
window.CasesSection = CasesSection;
window.ContactSection = ContactSection;