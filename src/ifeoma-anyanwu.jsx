import { useState, useEffect, useRef } from "react";
import { useForm, ValidationError } from "@formspree/react";

/* ─── Design tokens ─────────────────────────────────────── */
const T = {
  bg: "#FAFAF9",
  bgAlt: "#F4F4F2",
  bgDark: "#0F172A",
  ink: "#0F172A",
  inkMid: "#374151",
  muted: "#6B7280",
  border: "#E5E7EB",
  borderDark: "#1E293B",
  accent: "#4F46E5",        // indigo — used sparingly
  accentSoft: "#EEF2FF",
};

/* ─── Hooks ─────────────────────────────────────────────── */
function useInView(opts = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: opts.threshold ?? 0.12 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
}

/* ─── Micro-components ───────────────────────────────────── */
function Reveal({ children, delay = 0, className = "", style = {} }) {
  const [ref, v] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: v ? 1 : 0,
      transform: v ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

function Tag({ children }) {
  return (
    <span style={{
      display: "inline-block",
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: T.muted,
      padding: "5px 14px",
      border: `1px solid rgba(229,231,235,0.95)`,
      borderRadius: 999,
      background: "rgba(255,255,255,0.65)",
    }}>{children}</span>
  );
}

function Btn({ children, variant = "primary", onClick, href }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 6,
    fontSize: 13, fontWeight: 500, letterSpacing: "0.01em",
    padding: "9px 20px", borderRadius: 6,
    cursor: "pointer", textDecoration: "none",
    transition: "all 0.18s ease",
    border: "none",
  };
  const styles = {
    primary: { background: T.ink, color: "#fff" },
    ghost: { background: "transparent", color: T.ink, border: `1px solid ${T.border}` },
    accent: { background: T.accent, color: "#fff" },
  };

  const interactiveProps = {
    style: { ...base, ...styles[variant] },
    onMouseEnter: e => {
      if (variant === "primary") e.currentTarget.style.background = "#1e293b";
      if (variant === "ghost") e.currentTarget.style.borderColor = "#9CA3AF";
      if (variant === "accent") e.currentTarget.style.background = "#4338CA";
    },
    onMouseLeave: e => {
      if (variant === "primary") e.currentTarget.style.background = T.ink;
      if (variant === "ghost") e.currentTarget.style.borderColor = T.border;
      if (variant === "accent") e.currentTarget.style.background = T.accent;
    },
  };

  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <a
        href={href}
        {...interactiveProps}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} {...interactiveProps}>
      {children}
    </button>
  );
}

function Divider() {
  return <hr style={{ border: "none", borderTop: `1px solid ${T.border}`, margin: 0 }} />;
}

function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted, marginBottom: 32 }}>
      {children}
    </p>
  );
}

function Container({ children, style = {}, wide = false }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: wide ? 1320 : 1200,
        margin: "0 auto",
        padding: "0 40px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Nav ───────────────────────────────────────────────── */
function Nav({ scrolled }) {
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      height: 72,
      background: scrolled ? "rgba(250,250,249,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? `1px solid ${T.border}` : "1px solid transparent",
      transition: "all 0.3s ease",
    }}>
      <Container wide>
        <div style={{
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}>
          <span onClick={() => scrollTo("hero")} style={{ cursor: "pointer", fontWeight: 600, fontSize: 15, letterSpacing: "-0.01em", color: T.ink }}>
            Ifeoma O. Anyanwu
          </span>

          <div className="center-links" style={{ display: "flex", gap: 32, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            {[["Work", "work"], ["BuildNest", "buildnest"], ["Thinking", "thinking"], ["About", "about"]].map(([label, id]) => (
              <span key={id} onClick={() => scrollTo(id)} style={{
                fontSize: 13, color: T.muted, cursor: "pointer", fontWeight: 400,
                transition: "color 0.15s"
              }}
                onMouseEnter={e => e.currentTarget.style.color = T.ink}
                onMouseLeave={e => e.currentTarget.style.color = T.muted}
              >{label}</span>
            ))}
          </div>

          <Btn variant="ghost" onClick={() => scrollTo("contact")}>Get in touch</Btn>
        </div>
      </Container>
    </nav>
  );
}

/* ─── Hero ──────────────────────────────────────────────── */
function Hero() {
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "120px 0 80px", position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}>
        <div className="hero-glow hero-glow-1" style={{
          position: "absolute",
          top: "10%",
          left: "-8%",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79,70,229,0.16) 0%, rgba(79,70,229,0) 70%)",
          filter: "blur(8px)",
        }} />
        <div className="hero-glow hero-glow-2" style={{
          position: "absolute",
          right: "4%",
          top: "16%",
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(15,23,42,0.10) 0%, rgba(15,23,42,0) 72%)",
          filter: "blur(10px)",
        }} />
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(79,70,229,0.025) 100%)",
        }} />
      </div>
      <Container wide style={{ width: "100%" }}>
        <div className="hero-shell" style={{ position: "relative", zIndex: 1, maxWidth: 1120, margin: "0 auto" }}>          
          <Reveal className="hero-copy" style={{ willChange: "transform, opacity", textAlign: "left", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            {/* Status badge */}
            <div style={{ marginBottom: 22 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontSize: 12, color: T.muted,
                padding: "5px 12px",
                border: `1px solid ${T.border}`,
                borderRadius: 20,
                background: T.bg,
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", display: "inline-block" }} />
                Open to select collaborations
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: "clamp(46px, 6.6vw, 84px)",
              fontWeight: 700,
              lineHeight: 0.97,
              letterSpacing: "-0.06em",
              color: T.ink,
              maxWidth: 860,
              marginBottom: 28,
              textWrap: "balance",
            }}>
              I design clarity for{" "}products,
              <br />
              teams, and the people building them.
            </h1>

            <p style={{
              fontSize: "clamp(18px, 1.9vw, 21px)",
              color: T.muted,
              lineHeight: 1.72,
              maxWidth: 680,
              marginBottom: 32,
              fontWeight: 400,
              textWrap: "pretty",
            }}>
              Product designer, founder, and systems thinker focused on turning complexity
              into thoughtful products, stronger decisions, and more structured ways to build.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "flex-start", marginBottom: 36 }}>
              <Btn variant="primary" onClick={() => scrollTo("work")}>Explore work</Btn>
              <Btn variant="ghost" onClick={() => scrollTo("contact")}>Get in touch</Btn>
            </div>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 10,
              color: T.muted,
              fontSize: 12,
              letterSpacing: "0.02em",
            }}>
              <span>8+ years in product design</span>
              <span aria-hidden="true" style={{ width: 4, height: 4, borderRadius: "50%", background: "#CBD5E1", display: "inline-block" }} />
              <span>Founder, BuildNest AI</span>
              <span aria-hidden="true" style={{ width: 4, height: 4, borderRadius: "50%", background: "#CBD5E1", display: "inline-block" }} />
              <span>Designing for clarity, systems, and thoughtful execution</span>
            </div>
          </Reveal>
        </div>

        {/* Metrics strip */}
        <div className="metrics" style={{
          display: "flex", gap: 0,
          marginTop: 72,
          borderTop: `1px solid ${T.border}`,
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${T.border}`,
          borderRadius: 20,
          boxShadow: "0 20px 60px rgba(15, 23, 42, 0.05)",
          padding: "26px 32px 0",
        }}>
          {[
            ["8+", "Years shaping digital products"],
            ["Multi-sector", "Fintech, SaaS, travel, and media"],
            ["Now building", "BuildNest AI Operating Partner"],
          ].map(([num, label], i) => (
            <div key={i} style={{
              flex: 1,
              borderRight: i < 2 ? `1px solid ${T.border}` : "none",
              paddingRight: 28, paddingLeft: i > 0 ? 28 : 0,
              minHeight: 84,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}>
              <p style={{ fontSize: 21, fontWeight: 700, letterSpacing: "-0.03em", color: T.ink, marginBottom: 6 }}>{num}</p>
              <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6 }}>{label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ─── BuildNest ─────────────────────────────────────────── */
function BuildNest() {
  return (
    <section id="buildnest" style={{ background: T.bgDark, padding: "100px 0" }}>
      <Container wide>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: T.accent }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#64748B" }}>
              Current Venture
            </span>
          </div>
        </Reveal>

        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
          {/* Left */}
          <div>
            <Reveal delay={0.05}>
              <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, letterSpacing: "-0.035em", color: "#F8FAFC", lineHeight: 1.12, marginBottom: 20 }}>
                BuildNest AI<br />Operating Partner
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.75, marginBottom: 36, maxWidth: 460 }}>
                BuildNest is an AI operating partner for founders and teams — designed to turn scattered ideas,
                decisions, and workflows into clearer product direction and execution.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Btn variant="accent" href="https://buildneststudio.com">Explore BuildNest</Btn>
                  <a href="#contact" style={{
                    display: "inline-flex", alignItems: "center",
                    fontSize: 13, fontWeight: 500, color: "#94A3B8",
                    padding: "9px 20px", border: "1px solid #1E293B", borderRadius: 6,
                    textDecoration: "none", transition: "border-color 0.18s, color 0.18s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.color = "#F8FAFC"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#1E293B"; e.currentTarget.style.color = "#94A3B8"; }}
                  >Discuss a collaboration</a>
                </div>
            </Reveal>
          </div>

          {/* Right — pillars */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
                {
                  n: "01",
                  title: "Clarity before momentum",
                  body: "Most teams move fast without enough alignment. BuildNest helps surface what matters before more work piles up.",
                },
                {
                  n: "02",
                  title: "Structure for better decisions",
                  body: "From product thinking to team visibility, the system helps teams move with more coherence and less dependency on individuals.",
                },
                {
                  n: "03",
                  title: "AI that supports real work",
                  body: "Not AI for novelty. AI placed where it improves thinking, reveals gaps, and helps teams act with more confidence.",
                },
              ].map((p, i) => (
              <Reveal key={i} delay={0.1 + i * 0.08}>
                <div style={{
                  borderTop: `1px solid ${T.borderDark}`,
                  padding: "28px 0",
                  display: "grid", gridTemplateColumns: "40px 1fr", gap: 20,
                }}>
                  <span style={{ fontSize: 11, color: T.accent, fontWeight: 600, letterSpacing: "0.05em", paddingTop: 3 }}>{p.n}</span>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#F1F5F9", marginBottom: 8 }}>{p.title}</p>
                    <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.65 }}>{p.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Mock product UI strip */}
        <Reveal delay={0.25}>
          <div style={{
            marginTop: 60,
            border: `1px solid ${T.borderDark}`,
            borderRadius: 10,
            overflow: "hidden",
            background: "#0A0F1E",
          }}>
            {/* Window chrome */}
            <div style={{ padding: "12px 20px", borderBottom: `1px solid ${T.borderDark}`, display: "flex", alignItems: "center", gap: 8 }}>
              {["#EF4444","#F59E0B","#22C55E"].map(c => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
              ))}
              <div style={{ flex: 1, marginLeft: 12, height: 20, background: "#1E293B", borderRadius: 4, maxWidth: 260, display: "flex", alignItems: "center", paddingLeft: 10 }}>
                <span style={{ fontSize: 10, color: "#475569" }}>buildnest.ai / workspace</span>
              </div>
            </div>
            {/* Mock content */}
            <div style={{ padding: "28px 28px 28px", display: "grid", gridTemplateColumns: "180px 1fr", gap: 24, minHeight: 160 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {["Product Brief", "Discovery", "Decisions", "Roadmap", "System Design"].map((item, i) => (
                  <div key={item} style={{
                    fontSize: 12, color: i === 0 ? "#F8FAFC" : "#475569",
                    padding: "6px 10px", borderRadius: 4,
                    background: i === 0 ? "#1E293B" : "transparent",
                    cursor: "default",
                  }}>{item}</div>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ height: 12, background: "#1E293B", borderRadius: 3, width: "60%" }} />
                <div style={{ height: 8, background: "#0F172A", borderRadius: 3, width: "90%" }} />
                <div style={{ height: 8, background: "#0F172A", borderRadius: 3, width: "75%" }} />
                <div style={{ height: 8, background: "#0F172A", borderRadius: 3, width: "82%" }} />
                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  {["Clarity", "Structure", "Execution"].map(tag => (
                    <span key={tag} style={{ fontSize: 10, padding: "3px 8px", border: "1px solid #1E293B", borderRadius: 4, color: "#475569" }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ─── How I Contribute ──────────────────────────────────── */
function Contribute() {
  const items = [
  {
    title: "Product Design",
    desc: "Designing thoughtful digital products from concept to execution, with strong attention to user clarity and business direction.",
  },
  {
    title: "Systems & Design Foundations",
    desc: "Building scalable design systems, interaction patterns, and product structures that support consistency as teams grow.",
  },
  {
    title: "Product Thinking & Decision Support",
    desc: "Helping founders and teams make better product decisions through clearer framing, prioritization, and system-level thinking.",
  },
  {
    title: "AI-Enabled Product Exploration",
    desc: "Exploring how AI can support workflows, communication, and decision-making in ways that feel useful, grounded, and human.",
  },
];

  return (
    <section id="work" style={{ padding: "100px 0" }}>
      <Container>
        <Reveal><SectionLabel>How I Contribute</SectionLabel></Reveal>
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80 }}>
          <Reveal delay={0.05}>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, letterSpacing: "-0.03em", color: T.ink, lineHeight: 1.2 }}>
              How I think,
              <br />
              design, and contribute.
            </h2>
          </Reveal>
          <div>
            {items.map((item, i) => (
              <Reveal key={i} delay={0.08 + i * 0.07}>
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr auto",
                  alignItems: "center",
                  padding: "24px 0",
                  borderBottom: `1px solid ${T.border}`,
                  cursor: "default",
                  transition: "padding-left 0.2s",
                  gap: 40,
                }}
                  onMouseEnter={e => e.currentTarget.style.paddingLeft = "8px"}
                  onMouseLeave={e => e.currentTarget.style.paddingLeft = "0"}
                >
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 600, color: T.ink, marginBottom: 5 }}>{item.title}</p>
                    <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16" style={{ color: T.muted, flexShrink: 0 }}>
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ─── Working On ────────────────────────────────────────── */
function WorkingOn() {
  const cols = [
        {
          label: "Product & Design",
          title: "Selected Work",
          desc: "A curated body of work across product design, systems thinking, and decision-focused user experiences.",
          cta: "View portfolio →",
          href: "https://ifeomaokocha.notion.site/Ifeoma-O-Anyanwu-2b3a6a0d49ba80feb7c3fcd55c45d3f2?pvs=74",
        },
        {
          label: "Book",
          title: "Design Once, Sell Forever",
          desc: "A practical guide for designers who want to turn existing work into scalable digital products and more repeatable income.",
          cta: "Explore the book →",
          href: "https://selar.com/1125x12h37",
        },
        {
          label: "Venture",
          title: "BuildNest AI",
          desc: "An AI operating partner designed to help founders and teams build with more clarity, alignment, and structure.",
          cta: "Explore BuildNest →",
          href: "https://buildneststudio.com",
        },
        {
          label: "Writing",
          title: "Ask a Tech Mama",
          desc: "Writing and reflection on design, technology, growth, identity, and what it means to build with depth.",
          cta: "Read on LinkedIn →",
          href: "https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7392679189499330560",
        },
      ];

  return (
    <section style={{ padding: "120px 0", background: "linear-gradient(to bottom, #F4F4F2 0%, #F8F8F6 100%)", position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute",
          top: "14%",
          left: "-8%",
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79,70,229,0.07) 0%, rgba(79,70,229,0) 72%)",
          filter: "blur(10px)",
        }} />
        <div style={{
          position: "absolute",
          right: "-6%",
          bottom: "8%",
          width: 240,
          height: 240,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(15,23,42,0.05) 0%, rgba(15,23,42,0) 72%)",
          filter: "blur(12px)",
        }} />
      </div>
      <Container style={{ position: "relative", zIndex: 1 }}>
        <Reveal><SectionLabel>What I'm Working On</SectionLabel></Reveal>
        <div className="three-col working-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 28, alignItems: "stretch" }}>          {cols.map((col, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div style={{
                background: "rgba(250,250,249,0.88)",
                border: `1px solid rgba(229,231,235,0.95)`,
                borderRadius: 18,
                padding: "36px 32px",
                minHeight: 340,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(15,23,42,0.035)",
                backdropFilter: "blur(10px)",
                transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 22px 50px rgba(15,23,42,0.08)";
                  e.currentTarget.style.borderColor = "rgba(79,70,229,0.22)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(15,23,42,0.035)";
                  e.currentTarget.style.borderColor = "rgba(229,231,235,0.95)";
                }}
              >
                <div aria-hidden="true" style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: "linear-gradient(90deg, rgba(79,70,229,0.9) 0%, rgba(79,70,229,0.16) 55%, rgba(79,70,229,0) 100%)",
                }} />
                <div style={{ marginBottom: 18 }}>
                  <Tag>{col.label}</Tag>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", color: T.ink, margin: "0 0 14px", lineHeight: 1.1 }}>{col.title}</h3>
                <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.8, flex: 1, maxWidth: 320 }}>{col.desc}</p>
                <a href={col.href} target={col.href.startsWith("http") ? "_blank" : undefined} rel={col.href.startsWith("http") ? "noreferrer" : undefined} style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 28,
                  fontSize: 14,
                  fontWeight: 600,
                  color: T.accent,
                  textDecoration: "none",
                  letterSpacing: "0.01em",
                }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                >{col.cta}</a>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ─── Thinking ──────────────────────────────────────────── */
function Thinking() {
  const quotes = [
  "Clarity is not a luxury. It changes how teams build.",
  "The best products solve confusion before they add features.",
  "Systems shape behavior, whether you design for that or not.",
  "AI is most useful when it strengthens human thinking, not replaces it.",
];

  return (
    <section id="thinking" style={{ padding: "100px 0" }}>
      <Container>
        <Reveal><SectionLabel>Thinking</SectionLabel></Reveal>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {quotes.map((q, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div style={{
                padding: "36px 0",
                borderTop: i === 0 ? `1px solid ${T.border}` : "none",
                borderBottom: `1px solid ${T.border}`,
                display: "flex",
                alignItems: "center",
                gap: 32,
              }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: T.accent, minWidth: 24, letterSpacing: "0.05em" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p style={{
                  fontSize: "clamp(22px, 3vw, 34px)",
                  fontWeight: 600,
                  letterSpacing: "-0.025em",
                  color: T.ink,
                  lineHeight: 1.25,
                }}>{q}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ─── Writing ───────────────────────────────────────────── */
function Writing() {
  const articles = [
  {
    tag: "Gentle Beginnings",
    title: "From Seeing to Trying: Your First Gentle Prototype",
    excerpt: "A reflection on taking small, honest steps into something new — and how gentle experimentation can become a real beginning.",
    href: "https://www.linkedin.com/pulse/from-seeing-trying-your-first-gentle-prototype-ifeoma-o-anyanwu-nbcte/?trackingId=IXVm49kOQzKK9O4JaT9NNw%3D%3D",
  },
  {
    tag: "Learning in Public",
    title: "Module 1: Finding Your Footing in Tech Through Design",
    excerpt: "A grounded look at starting in tech through design, learning how to find your place, and building confidence one step at a time.",
    href: "https://www.linkedin.com/pulse/module-1-finding-your-footing-tech-through-design-ifeoma-o-anyanwu-bhuhe/?trackingId=xHu78qqdSvCTHwgv%2B8NYyg%3D%3D",
  },
  {
    tag: "Perspective & Growth",
    title: "What You See Is What You Believe",
    excerpt: "A thoughtful piece on exposure, possibility, and how what we repeatedly see can expand or limit what we believe is possible for ourselves.",
    href: "https://www.linkedin.com/pulse/what-you-see-believe-ifeoma-o-anyanwu-imytf/?trackingId=vCj5JC6YQQ%2BS2SSLsbln7A%3D%3D",
  },
];

  return (
    <section style={{ padding: "120px 0", background: "linear-gradient(to bottom, #FAFAF9 0%, #F4F4F2 100%)", position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute",
          top: "10%",
          right: "-7%",
          width: 240,
          height: 240,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79,70,229,0.06) 0%, rgba(79,70,229,0) 72%)",
          filter: "blur(12px)",
        }} />
        <div style={{
          position: "absolute",
          left: "-6%",
          bottom: "12%",
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(15,23,42,0.045) 0%, rgba(15,23,42,0) 72%)",
          filter: "blur(14px)",
        }} />
      </div>

      <Container style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, marginBottom: 40 }}>
          <Reveal><SectionLabel>Selected Writing — Ask a Tech Mama</SectionLabel></Reveal>
          <Reveal delay={0.05}>
            <a
              href="https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7392679189499330560"
              style={{
                fontSize: 13,
                color: T.muted,
                textDecoration: "none",
                paddingBottom: 4,
                borderBottom: "1px solid transparent",
                transition: "color 0.18s ease, border-color 0.18s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = T.ink;
                e.currentTarget.style.borderColor = T.border;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = T.muted;
                e.currentTarget.style.borderColor = "transparent";
              }}
              target="_blank"
              rel="noreferrer"
            >
              All articles →
            </a>
          </Reveal>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {articles.map((a, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <a
                className="writing-card-link"
                href={a.href}
                style={{ textDecoration: "none" }}
                target="_blank"
                rel="noreferrer"
              >
                <div
                  className="writing-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "140px 1fr auto",
                    alignItems: "center",
                    gap: 32,
                    padding: "28px 28px",
                    border: `1px solid rgba(229,231,235,0.95)`,
                    borderRadius: 18,
                    background: "rgba(250,250,249,0.82)",
                    boxShadow: "0 10px 30px rgba(15,23,42,0.03)",
                    backdropFilter: "blur(8px)",
                    transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease, padding-left 0.18s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 20px 44px rgba(15,23,42,0.07)";
                    e.currentTarget.style.borderColor = "rgba(79,70,229,0.2)";
                    const arrow = e.currentTarget.querySelector("svg");
                    if (arrow) {
                      arrow.style.transform = "translateX(4px)";
                      arrow.style.color = T.ink;
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(15,23,42,0.03)";
                    e.currentTarget.style.borderColor = "rgba(229,231,235,0.95)";
                    const arrow = e.currentTarget.querySelector("svg");
                    if (arrow) {
                      arrow.style.transform = "translateX(0)";
                      arrow.style.color = T.muted;
                    }
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: "linear-gradient(90deg, rgba(79,70,229,0.82) 0%, rgba(79,70,229,0.14) 48%, rgba(79,70,229,0) 100%)",
                    }}
                  />
                  <div style={{ alignSelf: "start" }}>
                    <Tag>{a.tag}</Tag>
                  </div>
                  <div>
                    <p style={{ fontSize: 17, fontWeight: 600, color: T.ink, marginBottom: 8, letterSpacing: "-0.02em", lineHeight: 1.35 }}>
                      {a.title}
                    </p>
                    <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.75, maxWidth: 760 }}>
                      {a.excerpt}
                    </p>
                  </div>
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 16 16"
                    style={{ color: T.muted, flexShrink: 0, transition: "transform 0.18s ease, color 0.18s ease" }}
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ─── About ─────────────────────────────────────────────── */
function About() {
  return (
    <section id="about" style={{ padding: "100px 0" }}>
      <Container>
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80, alignItems: "start" }}>
        <Reveal>
          <SectionLabel>About</SectionLabel>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: T.bgAlt, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: T.accent }}>IO</span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p style={{ fontSize: "clamp(18px, 2.2vw, 24px)", fontWeight: 600, letterSpacing: "-0.025em", color: T.ink, lineHeight: 1.45, marginBottom: 24 }}>
            I’m a Product Designer with over eight years of experience shaping digital products across fintech, SaaS, travel, and media.
          </p>
          <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.75, marginBottom: 16 }}>
            My work sits at the intersection of product clarity, systems thinking, and thoughtful execution. Over time, I’ve become increasingly drawn to the structure beneath the interface — how teams make decisions, how products stay coherent as they grow, and how better systems can reduce noise and unlock momentum.
          </p>
          <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.75 }}>
            That thinking now informs both my client work and BuildNest, the venture I’m building to help founders and teams operate with more clarity. I also write through Ask a Tech Mama, where I explore design, technology, ambition, and identity with honesty and depth, and created <em>Design Once, Sell Forever</em>, a practical guide for designers turning existing work into scalable digital products.
          </p>
        </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* ─── Contact ───────────────────────────────────────────── */
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [state, handleSubmit] = useForm("xaqaobnw");
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (state.succeeded) {
      setSent(true);
      setForm({ name: "", email: "", message: "" });
      setFormError("");
    }
  }, [state.succeeded]);

  return (
    <section
      id="contact"
      style={{
        padding: "120px 0",
        background: "linear-gradient(to bottom, #F4F4F2 0%, #FAFAF9 100%)",
        borderTop: `1px solid ${T.border}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "-7%",
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(79,70,229,0.06) 0%, rgba(79,70,229,0) 72%)",
            filter: "blur(14px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "-6%",
            bottom: "8%",
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(15,23,42,0.04) 0%, rgba(15,23,42,0) 72%)",
            filter: "blur(14px)",
          }}
        />
      </div>

      <Container style={{ position: "relative", zIndex: 1 }}>
        <div
          className="two-col contact-grid"
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "0.9fr 1.1fr",
            gap: 88,
            alignItems: "start",
          }}
        >
          <Reveal>
            <SectionLabel>Contact</SectionLabel>

            <div style={{ marginBottom: 22 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12,
                  color: T.muted,
                  padding: "5px 12px",
                  border: `1px solid ${T.border}`,
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.72)",
                  boxShadow: "0 10px 30px rgba(15,23,42,0.03)",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: T.accent,
                    display: "inline-block",
                  }}
                />
                Available for select collaborations
              </span>
            </div>

            <h2
              style={{
                fontSize: "clamp(36px, 5vw, 68px)",
                fontWeight: 700,
                letterSpacing: "-0.05em",
                color: T.ink,
                lineHeight: 0.98,
                marginBottom: 26,
                maxWidth: 520,
              }}
            >
              Let’s build with more clarity.
            </h2>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[
                { label: "LinkedIn", href: "https://www.linkedin.com/in/ifeomaokocha" },
                { label: "GitHub", href: "https://github.com/DebbyIfy" }
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  style={{
                    fontSize: 12,
                    color: T.muted,
                    textDecoration: "none",
                    letterSpacing: "0.04em",
                    padding: "8px 12px",
                    border: `1px solid ${T.border}`,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.62)",
                    transition: "color 0.18s ease, border-color 0.18s ease, background 0.18s ease",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = T.ink;
                    e.currentTarget.style.borderColor = "rgba(79,70,229,0.22)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.88)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = T.muted;
                    e.currentTarget.style.borderColor = T.border;
                    e.currentTarget.style.background = "rgba(255,255,255,0.62)";
                  }}
                  target="_blank"
                  rel="noreferrer"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div
              style={{
                background: "rgba(255,255,255,0.78)",
                border: `1px solid rgba(229,231,235,0.95)`,
                borderRadius: 22,
                padding: "34px 32px",
                boxShadow: "0 18px 48px rgba(15,23,42,0.05)",
                backdropFilter: "blur(12px)",
                alignSelf: sent ? "start" : "stretch",
              }}
            >
              <div style={{ position: "relative", minHeight: sent ? "auto" : 320, display: "flex", flexDirection: "column" }}>                
                <div
                  style={{
                    position: sent ? "absolute" : "relative",
                    inset: sent ? 0 : "auto",
                    width: "100%",
                    opacity: sent ? 0 : 1,
                    transform: sent ? "translateY(10px)" : "translateY(0)",
                    pointerEvents: sent ? "none" : "auto",
                    transition: "opacity 0.35s ease, transform 0.35s ease",
                  }}
                >
                  <form
                    onSubmit={async e => {
                      e.preventDefault();
                      if (state.submitting) return;
                      setFormError("");
                      if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
                        setFormError("Please complete your name, email, and message.");
                        return;
                      }
                      try {
                        await handleSubmit(e);
                      } catch (err) {
                        setFormError("Something went wrong. Please try again.");
                      }
                    }}
                    style={{ display: "flex", flexDirection: "column", gap: 22 }}
                  >
                    <input
                      name="_gotcha"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      style={{ display: "none" }}
                      aria-hidden="true"
                    />


                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: 12,
                          fontWeight: 600,
                          color: T.muted,
                          marginBottom: 10,
                          letterSpacing: "0.05em",
                        }}
                      >
                        Name
                      </label>
                      <input
                        name="name"
                        autoComplete="name"
                        type="text"
                        required
                        placeholder="Your name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "14px 16px",
                          border: `1px solid rgba(229,231,235,0.95)`,
                          borderRadius: 12,
                          fontSize: 15,
                          color: T.ink,
                          background: "rgba(250,250,249,0.88)",
                          outline: "none",
                          fontFamily: "inherit",
                          transition: "border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",
                        }}
                        onFocus={e => {
                          e.currentTarget.style.borderColor = T.accent;
                          e.currentTarget.style.boxShadow = "0 0 0 4px rgba(79,70,229,0.08)";
                          e.currentTarget.style.background = "#FFFFFF";
                        }}
                        onBlur={e => {
                          e.currentTarget.style.borderColor = "rgba(229,231,235,0.95)";
                          e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.style.background = "rgba(250,250,249,0.88)";
                        }}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: 12,
                          fontWeight: 600,
                          color: T.muted,
                          marginBottom: 10,
                          letterSpacing: "0.05em",
                        }}
                      >
                        Email
                      </label>
                      <input
                        name="email"
                        autoComplete="email"
                        type="email"
                        required
                        placeholder="you@company.com"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "14px 16px",
                          border: `1px solid rgba(229,231,235,0.95)`,
                          borderRadius: 12,
                          fontSize: 15,
                          color: T.ink,
                          background: "rgba(250,250,249,0.88)",
                          outline: "none",
                          fontFamily: "inherit",
                          transition: "border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",
                        }}
                        onFocus={e => {
                          e.currentTarget.style.borderColor = T.accent;
                          e.currentTarget.style.boxShadow = "0 0 0 4px rgba(79,70,229,0.08)";
                          e.currentTarget.style.background = "#FFFFFF";
                        }}
                        onBlur={e => {
                          e.currentTarget.style.borderColor = "rgba(229,231,235,0.95)";
                          e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.style.background = "rgba(250,250,249,0.88)";
                        }}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: 12,
                          fontWeight: 600,
                          color: T.muted,
                          marginBottom: 10,
                          letterSpacing: "0.05em",
                        }}
                      >
                        Message
                      </label>
                      <textarea
                        name="message"
                        autoComplete="off"
                        required
                        placeholder="What are you working on?"
                        rows={4}
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "14px 16px",
                          border: `1px solid rgba(229,231,235,0.95)`,
                          borderRadius: 12,
                          fontSize: 15,
                          color: T.ink,
                          background: "rgba(250,250,249,0.88)",
                          outline: "none",
                          resize: "vertical",
                          minHeight: 140,
                          fontFamily: "inherit",
                          transition: "border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",
                        }}
                        onFocus={e => {
                          e.currentTarget.style.borderColor = T.accent;
                          e.currentTarget.style.boxShadow = "0 0 0 4px rgba(79,70,229,0.08)";
                          e.currentTarget.style.background = "#FFFFFF";
                        }}
                        onBlur={e => {
                          e.currentTarget.style.borderColor = "rgba(229,231,235,0.95)";
                          e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.style.background = "rgba(250,250,249,0.88)";
                        }}
                      />
                    </div>

                    {formError ? (
                      <p style={{ fontSize: 13, color: "#B91C1C", lineHeight: 1.6 }}>{formError}</p>
                    ) : null}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ fontSize: 13, color: "#B91C1C", lineHeight: 1.6 }}>
                        <ValidationError prefix="Email" field="email" errors={state.errors} />
                      </div>
                      <div style={{ fontSize: 13, color: "#B91C1C", lineHeight: 1.6 }}>
                        <ValidationError prefix="Message" field="message" errors={state.errors} />
                      </div>
                    </div>

                    <div style={{ paddingTop: 8 }}>
                      <button
                        type="submit"
                        disabled={state.submitting}
                        aria-busy={state.submitting}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          minWidth: 150,
                          fontSize: 13,
                          fontWeight: 500,
                          letterSpacing: "0.01em",
                          padding: "10px 20px",
                          borderRadius: 6,
                          cursor: state.submitting ? "wait" : "pointer",
                          transition: "all 0.18s ease",
                          border: "none",
                          background: state.submitting ? "#334155" : T.ink,
                          color: "#fff",
                          opacity: state.submitting ? 0.92 : 1,
                        }}
                        onMouseEnter={e => {
                          if (!state.submitting) e.currentTarget.style.background = "#1e293b";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = state.submitting ? "#334155" : T.ink;
                        }}
                      >
                        {state.submitting ? (
                          <>
                            <span
                              aria-hidden="true"
                              style={{
                                width: 14,
                                height: 14,
                                borderRadius: "50%",
                                border: "2px solid rgba(255,255,255,0.35)",
                                borderTopColor: "#fff",
                                display: "inline-block",
                                animation: "spin 0.8s linear infinite",
                              }}
                            />
                            Sending...
                          </>
                        ) : (
                          "Send message"
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                <div
                  style={{
                    position: sent ? "relative" : "absolute",
                    inset: sent ? "auto" : 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    minHeight: sent ? "auto" : 320,
                    paddingTop: sent ? 0 : 40,
                    gap: 10,
                    opacity: sent ? 1 : 0,
                    transform: sent ? "translateY(0)" : "translateY(12px)",
                    pointerEvents: sent ? "auto" : "none",
                    transition: "opacity 0.35s ease, transform 0.35s ease",
                  }}
                >
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(79,70,229,0.08)",
                    border: "1px solid rgba(79,70,229,0.12)",
                    marginBottom: 8,
                    boxShadow: "0 10px 24px rgba(79,70,229,0.08)",
                  }}>
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12.5l4.2 4.2L19 7.5" stroke={T.accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p style={{ fontSize: 28, fontWeight: 700, color: T.ink, letterSpacing: "-0.04em", lineHeight: 1.05 }}>Message sent.</p>
                  <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.75, maxWidth: 420 }}>Thanks for reaching out. I’ll get back to you soon.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSent(false);
                      setFormError("");
                    }}
                    style={{
                      marginTop: 16,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13,
                      fontWeight: 500,
                      letterSpacing: "0.01em",
                      padding: "9px 16px",
                      borderRadius: 999,
                      cursor: "pointer",
                      transition: "all 0.18s ease",
                      border: `1px solid ${T.border}`,
                      background: "rgba(255,255,255,0.7)",
                      color: T.ink,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "rgba(79,70,229,0.22)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.92)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = T.border;
                      e.currentTarget.style.background = "rgba(255,255,255,0.7)";
                    }}
                  >
                    Send another
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* ─── Footer ────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{
      borderTop: `1px solid ${T.border}`,
      padding: "28px 0",
    }}>
      <Container wide>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 12,
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>Ifeoma O. Anyanwu</span>
          <span style={{ fontSize: 12, color: T.muted }}>© 2026 · Product Designer, Founder & Systems Thinker</span>
          <div style={{ display: "flex", gap: 24 }}>
            {[
              { label: "LinkedIn", href: "https://www.linkedin.com/in/ifeomaokocha" },
              { label: "Book", href: "https://selar.com/1125x12h37" },
              { label: "BuildNest AI", href: "https://buildneststudio.com" },
              { label: "Newsletter", href: "https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7392679189499330560" }
            ].map(l => (
              <a key={l.label} href={l.href} style={{ fontSize: 12, color: T.muted, textDecoration: "none" }}
                onMouseEnter={e => e.currentTarget.style.color = T.ink}
                onMouseLeave={e => e.currentTarget.style.color = T.muted}
                target={"_blank"}
                rel={"noreferrer"}
              >{l.label}</a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", toggle);
    return () => window.removeEventListener("scroll", toggle);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollTop}
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        width: 44,
        height: 44,
        borderRadius: "50%",
        border: `1px solid ${T.border}`,
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s ease",
        zIndex: 300,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 14px 34px rgba(15,23,42,0.18)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 30px rgba(15,23,42,0.12)";
      }}
    >
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path
          d="M6 15l6-6 6 6"
          stroke={T.ink}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

/* ─── Root ──────────────────────────────────────────────── */
export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Sora', system-ui, sans-serif; background: #FAFAF9; color: #0F172A; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #FAFAF9; }
        ::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 2px; }
        .hero-grid { display: grid; }
        .hero-shell::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: min(680px, 82vw);
          height: min(680px, 82vw);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(79,70,229,0.055) 0%, rgba(79,70,229,0.018) 38%, rgba(79,70,229,0) 72%);
          filter: blur(10px);
          z-index: -1;
          pointer-events: none;
        }
        .hero-copy { animation: heroFloat 7s ease-in-out infinite; }
        .hero-glow-1 { animation: glowDriftOne 12s ease-in-out infinite; }
        .hero-glow-2 { animation: glowDriftTwo 14s ease-in-out infinite; }

        @keyframes heroFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @keyframes glowDriftOne {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(18px, -12px, 0) scale(1.04); }
        }

        @keyframes glowDriftTwo {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-16px, 14px, 0) scale(1.05); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 1024px) {
          .three-col { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 24px !important; }
          .working-grid { gap: 22px !important; }
        }
        @media (max-width: 768px) {
          .hero-copy, .hero-glow-1, .hero-glow-2 { animation: none !important; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .two-col { grid-template-columns: 1fr !important; gap: 40px !important; }
          .three-col { grid-template-columns: 1fr !important; }
          .metrics > div { padding-left: 0 !important; padding-right: 0 !important; border-right: none !important; border-bottom: 1px solid #E5E7EB; padding-bottom: 20px !important; }
          .metrics > div:last-child { border-bottom: none !important; padding-bottom: 0 !important; }
          .writing-row { grid-template-columns: 1fr !important; gap: 18px !important; padding: 24px 22px !important; }
          .writing-card-link { display: block; }
          nav .center-links { display: none !important; }
          .hero-shell { max-width: 100% !important; }
          .hero-copy { text-align: left !important; align-items: flex-start !important; }
          .hero-copy h1 { font-size: clamp(40px, 12vw, 58px) !important; line-height: 1.02 !important; }
          .hero-copy p { max-width: 100% !important; }
          .hero-copy > div { justify-content: flex-start !important; }
          .working-grid > div > div { min-height: auto !important; padding: 28px 24px !important; }
          .contact-grid { gap: 40px !important; }
          .contact-grid h2 { max-width: 100% !important; }
        }
      `}</style>
      <Nav scrolled={scrolled} />
      <main>
        <Hero />
        <Divider />
        <BuildNest />
        <Divider />
        <Contribute />
        <Divider />
        <WorkingOn />
        <Divider />
        <Thinking />
        <Divider />
        <Writing />
        <Divider />
        <About />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
