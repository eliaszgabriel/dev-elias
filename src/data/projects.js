// src/data/projects.js
// Dados dos projetos exibidos no grid de "Projetos".
// Mantenha descritivo e conciso; imagens/links podem ser adicionados depois.

export const projects = [
  {
    id: "pf-recrutamento",
    title: "PF Recrutamento — Ecosistema (API + Bot + Site)",
    desc: "Automação completa de recrutamento com sincronização de cargos, histórico, painel e API pública.",
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
    desc: "Set automático de patentes de praças, tickets com permissões dinâmicas, staff lock e logs.",
    badges: ["Discord.js", "Perms avançadas", "PM2"],
    stats: { tickets: "500+", staff: "ágil", erros: "0 críticos" },
    href: "#",
  },

  // ======== Novos projetos ========

  {
    id: "gestao-financeira",
    title: "Gestão Financeira — Dashboard & Automação",
    desc: "Controle de receitas/despesas, categorias, relatórios mensais e automações de fechamento com export (CSV/JSON).",
    badges: ["React", "Node.js", "SQLite", "Cron"],
    stats: { meses: "12+", relatorios: "mensais", automacoes: "fechamento" },
    href: "#",
  },
  {
    id: "vacinas-cpp",
    title: "Vacinas — Sistema Acadêmico em C++",
    desc: "Cadastro de pessoas e vacinas, consulta por modelo/lote, persistência em banco de dados e relatórios básicos.",
    badges: ["C++", "CLI", "CRUD", "SQLite/Arquivos"],
    stats: { registros: "100+", consultas: "instant", modo: "offline" },
    href: "#",
  },
];
