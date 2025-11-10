// src/data/projects.js
// Dados dos projetos exibidos no grid de "Projetos".

export const projects = [
  {
    id: "pf-recrutamento",
    title: "PF Recrutamento — Ecossistema (API + Bot + Site)",
    desc: "Automação completa de recrutamento com sync de cargos, histórico, painel e API pública.",
    badges: ["Node.js", "Discord.js", "Express", "SQLite"],
    stats: { users: "1k+", servers: "1", uptime: "24/7" },
    href: "#",
  },
  {
    id: "bots-telegram",
    title: "Bots Telegram — Assinaturas & Pagamentos",
    desc: "Fluxo de compra com QR, validação automática, convites temporários e gestão de assinaturas.",
    badges: ["Telegraf", "Better-SQLite3", "Cron"],
    stats: { vendas: "300+", aprovacoes: "instant", convites: "1 uso / 30min" },
    href: "#",
  },
  {
    id: "shield-hierarquia",
    title: "Shield — Bot de Hierarquia & Tickets",
    desc: "Patentes automáticas (praças), tickets com permissões dinâmicas, staff lock e logs.",
    badges: ["Discord.js", "Perms avançadas", "PM2"],
    stats: { tickets: "500+", staff: "ágil", erros: "0 críticos" },
    href: "#",
  },
  {
    id: "gestao-financas",
    title: "Gestão de Finanças — Dashboard & Automação",
    desc: "Controle de entradas/saídas, metas, categorias e relatórios com automações (import CSV).",
    badges: ["React", "Node", "SQLite", "Cron"],
    stats: { meses: "12+", metas: "on track", relatórios: "PDF/CSV" },
    href: "#",
  },
  {
    id: "sistema-vacinas-cpp",
    title: "Sistema de Vacinas (C++) — Trabalho Acadêmico",
    desc: "Cadastro de vacinas, pessoas e carteiras; busca/consulta por nome, modelo e lote.",
    badges: ["C++", "Arquivos/DB", "CLI"],
    stats: { registros: "500+", consistência: "alta" },
    href: "#",
  },
];
