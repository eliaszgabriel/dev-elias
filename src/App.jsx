import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
// =============== Variants (fade-up + stagger) ===============
const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: "easeOut" },
  },
};
const stagger = {
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

// =============== Hook: seção ativa via IntersectionObserver ===============
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0] ?? null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // pega a seção mais “visível” no momento
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      {
        threshold: [0.2, 0.5, 0.8],
        // ativa quando o centro da seção entra no viewport
        rootMargin: "-20% 0px -55% 0px",
      }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ids]);

  return active;
}

// =============== Hook: scrollY (para mostrar o botão Top) ===============
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => setY(window.scrollY || window.pageYOffset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return y;
}

// =============== Hook: travar o scroll do body quando o menu abre ===============
function useBodyLock(locked) {
  useEffect(() => {
    const body = document.body;
    if (!body) return;
    const prev = body.style.overflow;
    if (locked) body.style.overflow = "hidden";
    else body.style.overflow = prev || "";
    return () => {
      body.style.overflow = prev || "";
    };
  }, [locked]);
}

/**
 * dev.elias — Hero + Divider + Projetos + Sobre + Contato
 * JS puro (Tailwind v4)
 */
export default function App() {
  // observa as seções para destacar no menu
  const active = useActiveSection(["projetos", "skills", "sobre", "contato"]);
  1;
  const y = useScrollY();

  return (
    <div className="min-h-screen w-full bg-black text-zinc-100 antialiased overflow-hidden relative scroll-smooth">
      <TechLinesBackground />
      <Header active={active} />

      <main className="relative z-10 px-6 pt-24 pb-16 md:pt-32">
        {/* HERO */}
        <div className="flex items-center justify-center">
          <Hero />
        </div>

        {/* DIVISÃO */}
        <SectionDivider />

        {/* PROJETOS */}
        <ProjectsSection />
        <SkillsSection />

        {/* SOBRE */}
        <AboutSection />

        {/* CONTATO */}
        <ContactSection />
      </main>

      <ScrollTopButton visible={y > 320} />
      <Footer />
    </div>
  );
}

/* ======================= Hamburger (animado) ======================= */
function Hamburger({ open }) {
  return (
    <span className="relative block h-5 w-5" aria-hidden>
      <span
        className={`absolute left-0 top-1 block h-[2px] w-full bg-current transition-transform ${
          open ? "translate-y-2 rotate-45" : ""
        }`}
      />
      <span
        className={`absolute left-0 top-1/2 block h-[2px] w-full bg-current transition-opacity -translate-y-1/2 ${
          open ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`absolute left-0 bottom-1 block h-[2px] w-full bg-current transition-transform ${
          open ? "-translate-y-2 -rotate-45" : ""
        }`}
      />
    </span>
  );
}

/* ======================= Header ======================= */
function Header({ active }) {
  const [open, setOpen] = useState(false);

  const linkBase =
    "relative transition hover:text-white after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1 after:h-[2px] after:w-0 after:bg-cyan-400 after:transition-all after:duration-300";
  const linkActive = "text-white after:w-6";
  const linkHover = "hover:after:w-6";

  // fecha o menu ao navegar
  function closeAndScroll() {
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-20 w-full bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-black/30 border-b border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogoMark />
          <span className="tracking-[0.22em] text-sm md:text-base font-semibold text-zinc-200">
            ELIAS GABRIEL
          </span>
        </div>

        {/* Desktop */}
        <nav
          aria-label="Navegação principal"
          className="hidden md:flex items-center gap-6 text-sm text-zinc-300"
        >
          <a
            href="#projetos"
            className={`${linkBase} ${linkHover} ${active === "projetos" ? linkActive : ""}`}
          >
            Projetos
          </a>
          <a
            href="#sobre"
            className={`${linkBase} ${linkHover} ${active === "sobre" ? linkActive : ""}`}
          >
            Sobre
          </a>
          <a
            href="#contato"
            className={`${linkBase} ${linkHover} ${active === "contato" ? linkActive : ""}`}
          >
            Contato
          </a>
        </nav>

        {/* Mobile button */}
        <button
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-drawer"
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-white/10 text-zinc-200 hover:bg-white/5 transition"
          onClick={() => setOpen((v) => !v)}
        >
          <Hamburger open={open} />
        </button>
      </div>

      {/* Drawer mobile */}
      <MobileMenu open={open} onClose={() => setOpen(false)}>
        <a
          href="#projetos"
          onClick={closeAndScroll}
          className={`block px-5 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition ${
            active === "projetos" ? "text-white" : "text-zinc-300"
          }`}
        >
          Projetos
        </a>
        <a
          href="#skills"
          onClick={closeAndScroll}
          className={`block px-5 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition ${
            active === "skills" ? "text-white" : "text-zinc-300"
          }`}
        >
          Skills
        </a>

        <a
          href="#sobre"
          onClick={closeAndScroll}
          className={`block px-5 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition ${
            active === "sobre" ? "text-white" : "text-zinc-300"
          }`}
        >
          Sobre
        </a>
        <a
          href="#contato"
          onClick={closeAndScroll}
          className={`block px-5 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition ${
            active === "contato" ? "text-white" : "text-zinc-300"
          }`}
        >
          Contato
        </a>
      </MobileMenu>
    </header>
  );
}

/* ======================= Mobile Menu ======================= */
function MobileMenu({ open, onClose, children }) {
  useBodyLock(open);

  // fecha com ESC e clique fora
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          aria-hidden={!open}
          className="md:hidden fixed inset-0 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.button
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Fechar menu"
          />

          {/* Drawer */}
          <motion.div
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            className="absolute right-0 top-0 h-full w-[78%] max-w-xs bg-zinc-950/95 border-l border-white/10 p-5 flex flex-col gap-3"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <LogoMark />
                <span className="text-sm font-semibold tracking-[0.22em] text-zinc-200">MENU</span>
              </div>
              <button
                aria-label="Fechar menu"
                onClick={onClose}
                className="h-9 w-9 grid place-items-center rounded-lg border border-white/10 text-zinc-300 hover:bg-white/5"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5">
                  <path
                    d="M6 6l12 12M18 6l-12 12"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-2 flex flex-col gap-2">{children}</div>

            <div className="mt-auto pt-4 text-[11px] text-zinc-500">
              © {new Date().getFullYear()} Elias Gabriel
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ======================== Hero ======================== */
function Hero() {
  return (
    <motion.section
      className="mx-auto max-w-5xl text-center relative"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Glow suave atrás do título */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-start justify-center">
        <div className="mt-24 h-[42rem] w-[42rem] rounded-full blur-3xl opacity-30 bg-[radial-gradient(circle_at_center,theme(colors.cyan.500)_0%,transparent_60%)]" />
      </div>

      <motion.h1
        variants={fadeUp}
        className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-zinc-100"
      >
        ELIAS GABRIEL
      </motion.h1>

      <motion.p variants={fadeUp} className="mt-4 text-zinc-300 text-lg md:text-xl">
        UI & Software Builder
      </motion.p>

      <motion.p
        variants={fadeUp}
        className="mt-4 text-zinc-300/90 max-w-3xl mx-auto text-base md:text-lg"
      >
        Construindo soluções digitais com eficiência e visão.
      </motion.p>

      <motion.div variants={fadeUp} className="mt-10 flex items-center justify-center gap-4">
        <GlassButton href="#projetos" label="Ver Projetos" />
        <NeonOutlineButton href="#contato" label="Contato" />
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="mt-14 flex items-center justify-center gap-2 text-xs text-zinc-400"
      >
        <span>role para ver mais</span>
        <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
      </motion.div>
    </motion.section>
  );
}

/* ===================== Divider ======================== */
function SectionDivider() {
  return (
    <div className="relative mx-auto my-14 md:my-16 max-w-5xl">
      <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
      <span className="absolute left-1/2 -translate-x-1/2 -top-1.5 h-3 w-3 rounded-full bg-cyan-400/90 animate-pulse shadow-[0_0_18px_rgba(34,211,238,0.9)]" />
    </div>
  );
}

/* ======================= Skills / Stack ======================= */
function SkillsSection() {
  const [active, setActive] = useState("Todas");
  const categories = ["Todas", ...skills.map((g) => g.title)];
  const visible = active === "Todas" ? skills : skills.filter((g) => g.title === active);

  return (
    <motion.section
      id="skills"
      className="relative z-10 py-20 md:py-28 scroll-mt-24 md:scroll-mt-32"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      variants={stagger}
    >
      {/* véu/gradiente p/ contraste */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="h-full w-full bg-black/20 backdrop-blur-[1px]" />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <motion.div variants={fadeUp} className="text-center">
          <div className="text-cyan-300/80 text-xs tracking-[0.28em] uppercase">SKILLS & STACK</div>
          <h2 className="mt-2 text-2xl md:text-4xl font-semibold text-zinc-100">
            Ferramentas que uso no dia a dia.
          </h2>
          <p className="mt-3 text-zinc-400 max-w-2xl mx-auto">
            Foco em entregar rápido, com código limpo e microinterações que fazem diferença.
          </p>
        </motion.div>

        {/* filtros */}
        <motion.div
          variants={fadeUp}
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
          role="tablist"
          aria-label="Filtrar categorias de skills"
        >
          {categories.map((name) => {
            const selected = active === name;
            return (
              <button
                key={name}
                role="tab"
                aria-selected={selected}
                aria-pressed={selected}
                onClick={() => setActive(name)}
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs border transition ${
                  selected
                    ? "bg-cyan-500/15 border-cyan-400/40 text-cyan-200"
                    : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    selected ? "bg-cyan-400" : "bg-zinc-400/70"
                  }`}
                />
                {name}
              </button>
            );
          })}
        </motion.div>

        {/* grid de categorias visíveis */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((group, idx) => (
            <SkillCategory key={group.title} group={group} index={idx} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function SkillCategory({ group, index }) {
  // Stagger local para os pills
  const list = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.05, delayChildren: 0.05 },
    },
  };
  return (
    <motion.div
      variants={fadeUp}
      transition={{ delay: 0.04 * index, duration: 0.55, ease: "easeOut" }}
      className="relative group rounded-2xl p-5 bg-white/[0.04] border border-white/10 backdrop-blur-md hover:bg-white/[0.06] transition overflow-hidden"
    >
      <span className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition [background:radial-gradient(160px_110px_at_20%_0%,rgba(34,211,238,0.14),transparent)]" />
      <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-cyan-500/10 blur-2xl" />

      <h3 className="text-zinc-100 font-medium text-lg">{group.title}</h3>

      <motion.div className="mt-4 flex flex-wrap gap-2" variants={list}>
        {group.items.map((name) => (
          <SkillPill key={name} label={name} />
        ))}
      </motion.div>
    </motion.div>
  );
}

function SkillPill({ label }) {
  const pillVar = {
    hidden: { opacity: 0, scale: 0.9, y: 4, filter: "blur(2px)" },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.35, ease: "easeOut" },
    },
  };
  return (
    <motion.span
      variants={pillVar}
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] tracking-wide bg-white/5 text-zinc-300 border border-white/10"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/80" aria-hidden />
      {label}
    </motion.span>
  );
}

/* ===================== Projetos ======================= */
function ProjectsSection() {
  return (
    <section id="projetos" className="relative z-10 py-20 md:py-28 scroll-mt-24 md:scroll-mt-32">
      {/* veil para contraste */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="h-full w-full bg-black/20 backdrop-blur-[1px]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <SectionHeader
              kicker="PROJETOS EM DESTAQUE"
              title="Soluções reais, resultados claros."
              subtitle="Seleção do que já está rodando em produção — com foco em automação e UX."
            />
          </motion.div>
        </motion.div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, idx) => (
            <ProjectCard key={p.id} project={p} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ kicker, title, subtitle }) {
  return (
    <div className="text-center">
      <div className="text-cyan-300/80 text-xs tracking-[0.28em] uppercase">{kicker}</div>
      <h2 className="mt-2 text-2xl md:text-4xl font-semibold text-zinc-100">{title}</h2>
      <p className="mt-3 text-zinc-400 max-w-2xl mx-auto">{subtitle}</p>
    </div>
  );
}

function ProjectCard({ project, index }) {
  const { title, desc, badges, stats, href } = project;

  function onMove(e) {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <motion.a
      href={href}
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.05 * index, ease: "easeOut" }}
      className="relative group rounded-2xl p-5 bg-white/[0.04] border border-white/10 backdrop-blur-md hover:bg-white/[0.06] transition overflow-hidden"
    >
      {/* glow que segue o mouse */}
      <span className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition [background:radial-gradient(140px_90px_at_var(--mx,50%)_var(--my,50%),rgba(34,211,238,0.18),transparent)]" />

      {/* blob sutil */}
      <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-cyan-500/10 blur-2xl" />

      <h3 className="text-zinc-100 font-medium text-lg">{title}</h3>
      <p className="mt-2 text-zinc-400 text-sm leading-relaxed">{desc}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {badges.map((b) => (
          <span
            key={b}
            className="rounded-full px-2.5 py-1 text-[11px] tracking-wide bg-white/5 text-zinc-300 border border-white/10"
          >
            {b}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400">
          {stats?.users && <Stat label="Usuários" value={stats.users} />}
          {stats?.servers && <Stat label="Servidores" value={stats.servers} />}
          {stats?.uptime && <Stat label="Uptime" value={stats.uptime} />}
          {stats?.vendas && <Stat label="Vendas" value={stats.vendas} />}
          {stats?.aprovacoes && <Stat label="Aprovações" value={stats.aprovacoes} />}
          {stats?.convites && <Stat label="Convites" value={stats.convites} />}
          {stats?.staff && <Stat label="Staff" value={stats.staff} />}
          {stats?.erros && <Stat label="Erros" value={stats.erros} />}
        </div>

        <span className="text-cyan-300 text-xs font-semibold opacity-0 group-hover:opacity-100 transition">
          Ver detalhes →
        </span>
      </div>
    </motion.a>
  );
}

function Stat({ label, value }) {
  return (
    <span className="flex items-center gap-1">
      <span className="text-zinc-300">{value}</span>
      <span className="text-zinc-500">{label}</span>
    </span>
  );
}

/* ======================== Sobre ======================= */
function AboutSection() {
  return (
    <motion.section
      id="sobre"
      className="relative z-10 py-24 md:py-32 scroll-mt-24 md:scroll-mt-32"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={stagger}
    >
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-semibold text-zinc-100">
          Sobre mim
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-4 text-zinc-400 leading-relaxed">
          Dev focado em automação e UX. Entrego sistemas enxutos, bem pensados e fáceis de operar.
          Stack favorita: Node/Express/Discord.js/SQLite no back; UI clean com microinterações no
          front.
        </motion.p>
      </div>
    </motion.section>
  );
}

/* ======================= Contato ====================== */
function ContactSection() {
  return (
    <motion.section
      id="contato"
      className="relative z-10 py-24 md:py-32 scroll-mt-24 md:scroll-mt-32"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={stagger}
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-semibold text-zinc-100">
          Contato
        </motion.h2>

        <motion.p variants={fadeUp} className="mt-4 text-zinc-400">
          Quer lançar algo comigo? Me chama e a gente desenha a solução certa pro seu caso.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex items-center justify-center gap-4 md:gap-6 flex-wrap"
        >
          {/* E-mail */}
          <a
            href="mailto:eliasgabrielfelicio@hotmail.com"
            aria-label="Enviar e-mail para eliasgabrielfelicio@hotmail.com"
            className="group inline-flex items-center gap-2 h-10 rounded-2xl px-4 border border-white/10 bg-black/60 backdrop-blur-sm hover:bg-black/70 text-sm transition"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-cyan-300 group-hover:text-cyan-200 transition"
            >
              <path
                d="M3.5 7A1.5 1.5 0 0 1 5 5.5h14A1.5 1.5 0 0 1 20.5 7v10A1.5 1.5 0 0 1 19 18.5H5A1.5 1.5 0 0 1 3.5 17V7Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M4 7l8 5 8-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-cyan-300 group-hover:text-cyan-200 transition leading-none">
              eliasgabrielfelicio@hotmail.com
            </span>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/5541996828242?text=Oi%20Elias!%20Vim%20do%20site%20e%20quero%20falar%20sobre%20um%20projeto."
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir conversa no WhatsApp"
            className="group inline-flex items-center gap-2 h-10 rounded-2xl px-4 border border-white/10 bg-black/60 backdrop-blur-sm hover:bg-black/70 text-sm transition"
          >
            {/* Ícone WhatsApp limpo */}
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5 text-green-400 group-hover:text-green-300 transition"
            >
              <path
                fill="currentColor"
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.967-.94 1.165-.173.199-.347.223-.644.075-.297-.15-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.654-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.207-.242-.579-.487-.501-.67-.51-.173-.008-.372-.01-.571-.01a1.1 1.1 0 0 0-.797.372c-.273.297-1.04 1.017-1.04 2.479 0 1.461 1.065 2.875 1.213 3.074.149.198 2.097 3.2 5.086 4.487.711.306 1.265.489 1.697.626.713.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.124-.273-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.36-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.234c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.887 9.884M20.52 3.484A11.815 11.815 0 0 0 12.051 0C5.495 0 .16 5.334.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.88 11.88 0 0 0 5.712 1.459h.005c6.556 0 11.891-5.335 11.893-11.893a11.82 11.82 0 0 0-3.395-8.428"
              />
            </svg>

            <span className="text-green-300 group-hover:text-green-200 transition leading-none">
              WhatsApp
            </span>
          </a>

          {/* Discord */}
          <a
            href="https://discord.com/users/5142679396"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir perfil no Discord"
            className="group inline-flex items-center gap-2 h-10 rounded-2xl px-4 border border-white/10 bg-black/60 backdrop-blur-sm hover:bg-black/70 text-sm transition"
          >
            {/* Ícone Discord limpo */}
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300 transition"
            >
              <path
                fill="currentColor"
                d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.08.08 0 0 0-.084.041c-.211.375-.444.864-.608 1.249-1.844-.276-3.68-.276-5.486 0-.164-.393-.405-.874-.617-1.249a.08.08 0 0 0-.084-.041 19.736 19.736 0 0 0-4.885 1.515.074.074 0 0 0-.032.028C.533 8.206-.32 12.016.099 15.783a.086.086 0 0 0 .032.057c2.052 1.507 4.041 2.422 5.992 3.029a.085.085 0 0 0 .093-.029c.461-.63.873-1.295 1.226-1.994a.084.084 0 0 0-.046-.114 13.15 13.15 0 0 1-1.872-.892.084.084 0 0 1-.008-.136c.126-.094.252-.192.372-.291a.08.08 0 0 1 .083-.012c3.927 1.793 8.18 1.793 12.061 0a.08.08 0 0 1 .083.012c.12.099.246.198.372.291a.084.084 0 0 1-.006.136c-.598.351-1.22.645-1.872.892a.083.083 0 0 0-.046.114c.36.698.772 1.362 1.226 1.994a.085.085 0 0 0 .093.029c1.961-.606 3.95-1.522 6.002-3.029a.084.084 0 0 0 .031-.056c.5-4.176-.838-7.943-3.549-11.387a.073.073 0 0 0-.032-.028ZM8.02 13.273c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.175 1.095 2.157 2.419 0 1.334-.955 2.419-2.157 2.419Zm7.975 0c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.175 1.095 2.157 2.419 0 1.334-.947 2.419-2.157 2.419Z"
              />
            </svg>

            <span className="text-indigo-300 group-hover:text-indigo-200 transition leading-none">
              Discord
            </span>
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
}

/* ============= Botões usados no Hero ================= */
function GlassButton({ href, label }) {
  return (
    <a
      href={href}
      className="relative inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-medium text-zinc-100 backdrop-blur-md bg-white/5 border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset] hover:bg-white/7 transition"
    >
      <span className="absolute -inset-px rounded-2xl opacity-0 hover:opacity-100 transition [background:radial-gradient(120px_80px_at_center,rgba(34,211,238,0.25),transparent)]" />
      <span className="relative">{label}</span>
    </a>
  );
}

function NeonOutlineButton({ href, label }) {
  return (
    <a
      href={href}
      className="group relative inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold text-cyan-300"
    >
      <span className="absolute inset-0 rounded-2xl [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude] p-[1px] bg-[conic-gradient(from_0deg,theme(colors.cyan.500),theme(colors.cyan.300),theme(colors.cyan.500))] animate-[spin_6s_linear_infinite]" />
      <span className="relative rounded-2xl bg-black px-6 py-3">{label}</span>
    </a>
  );
}

/* ====================== Scroll To Top ====================== */
function ScrollTopButton({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          aria-label="Voltar ao topo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-30 h-11 w-11 rounded-xl border border-white/10 bg-white/10 backdrop-blur hover:bg-white/20 text-zinc-100"
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 16 }}
          transition={{ duration: 0.18 }}
        >
          <svg viewBox="0 0 24 24" className="mx-auto h-5 w-5">
            <path
              d="M12 5l-6 6m6-6 6 6M12 5v14"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ======================= Footer ======================= */
function Footer() {
  return (
    <footer className="relative z-10">
      <div className="mx-auto max-w-7xl px-6 py-16 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} Elias Gabriel — feito com foco, café e código.
      </div>
    </footer>
  );
}

/* ====================== LogoMark ====================== */
function LogoMark() {
  return (
    <div className="relative h-6 w-6 grid place-items-center">
      <span className="absolute inset-0 rounded-lg bg-cyan-500/20 blur" />
      <svg viewBox="0 0 24 24" className="relative h-6 w-6 text-cyan-400">
        <path d="M4 7.5L12 3l8 4.5v9L12 21l-8-4.5v-9Z" fill="currentColor" opacity="0.15" />
        <path
          d="M12 5.5l5.5 3.1v6.8L12 18.5l-5.5-3.1V8.6L12 5.5Z"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
        />
      </svg>
    </div>
  );
}

/* =================== Background tech ================== */
function TechLinesBackground() {
  const ref = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return; // respeita usuários que preferem menos movimento
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [prefersReduced]);

  const gridTransform = prefersReduced
    ? undefined
    : `translate3d(${mouse.x * 6}px, ${mouse.y * 6}px, 0)`;
  const linesTransform = prefersReduced
    ? undefined
    : `translate3d(${mouse.x * -4}px, ${mouse.y * -4}px, 0)`;
  const linesOpacity = prefersReduced ? 0.15 : 0.3;

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-0">
      {/* Layer 1: grade sutil */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #6ee7e7 0 1px, transparent 1px 120px), repeating-linear-gradient(0deg, #6ee7e7 0 1px, transparent 1px 120px)",
          transform: gridTransform,
        }}
      />

      {/* Layer 2: linhas diagonais de luz (SVG) */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          mixBlendMode: "screen",
          opacity: linesOpacity,
          transform: linesTransform,
        }}
      >
        <defs>
          <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(34,211,238,0)" />
            <stop offset="50%" stopColor="rgba(34,211,238,0.8)" />
            <stop offset="100%" stopColor="rgba(34,211,238,0)" />
          </linearGradient>
        </defs>
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1={-10}
            y1={i * 10}
            x2={110}
            y2={i * 10 - 30}
            stroke="url(#glow)"
            strokeWidth={0.5}
          />
        ))}
      </svg>

      {/* Layer 3: vinheta sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.5))]" />
    </div>
  );
}
