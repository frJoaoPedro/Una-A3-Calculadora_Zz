// ===== TEMA CLARO/ESCURO (aplica logo no começo) =====
const TEMA = "soe_tema";
const aplicaTema = (t) => { document.documentElement.dataset.tema = t; };
aplicaTema(localStorage.getItem(TEMA) || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

// SOE System BETA - um script pra todas as páginas. Dados ficam no localStorage.
const K = "soe_db2", S = "soe_sessao";
const $ = (s) => document.querySelector(s);
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmt = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const em = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return fmt(d); };

function seed() {
  return {
    users: [{ nome: "Aluno Teste", email: "aluno@email.com", senha: "1234", curso: "Ciência da Computação", inst: "Una" }],
    disc: [
      { id: 1, nome: "Matemática Computacional", cor: "#4ade3a", prof: "" },
      { id: 2, nome: "Engenharia de Software", cor: "#2dd4bf", prof: "" },
      { id: 3, nome: "Projeto e Eng. de Software", cor: "#a3e635", prof: "" },
      { id: 4, nome: "Programação OO (Java)", cor: "#34d399", prof: "" },
      { id: 5, nome: "Banco de Dados", cor: "#86efac", prof: "" }
    ],
    ativ: [
      { id: 1, tipo: "Tarefa", titulo: "Exercícios de herança em Java", disc: 4, prazo: em(1), feito: false },
      { id: 2, tipo: "Tarefa", titulo: "Lista de funções", disc: 1, prazo: em(2), feito: false },
      { id: 3, tipo: "Trabalho", titulo: "Entrega do Canvas A3", disc: 3, prazo: em(3), feito: false },
      { id: 4, tipo: "Tarefa", titulo: "Modelagem ER", disc: 5, prazo: em(5), feito: false },
      { id: 5, tipo: "Prova", titulo: "Prova de Mat. Computacional", disc: 1, prazo: em(6), feito: false },
      { id: 6, tipo: "Trabalho", titulo: "Relatório de requisitos", disc: 2, prazo: em(9), feito: false },
      { id: 7, tipo: "Tarefa", titulo: "Lista de conjuntos", disc: 1, prazo: em(-2), feito: true },
      { id: 8, tipo: "Tarefa", titulo: "Diagrama de classes UML", disc: 2, prazo: em(-4), feito: true }
    ],
    blocos: [
      { dia: 0, turno: 2, tipo: "aula", disc: 1 }, { dia: 1, turno: 2, tipo: "aula", disc: 2 }, { dia: 2, turno: 2, tipo: "aula", disc: 3 },
      { dia: 3, turno: 2, tipo: "aula", disc: 4 }, { dia: 4, turno: 2, tipo: "aula", disc: 5 },
      { dia: 0, turno: 0, tipo: "estudo", disc: 1 }, { dia: 2, turno: 0, tipo: "estudo", disc: 4 }, { dia: 4, turno: 0, tipo: "prova", disc: 1 }
    ]
  };
}
let db = JSON.parse(localStorage.getItem(K) || "null") || seed();
const salvar = () => localStorage.setItem(K, JSON.stringify(db));
salvar();

const pagina = document.body.dataset.p;
const user = db.users.find((u) => u.email === localStorage.getItem(S));
if (!["login", "cadastro", "erro"].includes(pagina) && !user) location.replace("index.html");

const discNome = (id) => (db.disc.find((d) => d.id == id) || { nome: "(removida)" }).nome;
const opcoesDisc = () => db.disc.map((d) => `<option value="${d.id}">${esc(d.nome)}</option>`).join("");
const barra = (p, cor) => `<div class="barra"><div class="barra-cheia" style="width:${p}%;background:${cor || "var(--destaque)"}"></div></div>`;
const pct = (lista) => (lista.length ? Math.round((lista.filter((a) => a.feito).length / lista.length) * 100) : 0);
const dataBR = (s) => s.split("-").reverse().join("/");

function prazo(a) {
  if (a.feito) return ["Feito", "feito"];
  const n = Math.round((new Date(a.prazo + "T00:00") - new Date(fmt(new Date()) + "T00:00")) / 864e5);
  return [n < 0 ? "Atrasada" : n === 0 ? "Hoje" : n === 1 ? "Amanhã" : n + " dias", n <= 1 ? "urgente" : n <= 5 ? "medio" : "longe"];
}
const pendentes = () => db.ativ.filter((a) => !a.feito).sort((a, b) => a.prazo.localeCompare(b.prazo));

const P = {
  // ===== LOGIN (RF01) =====
  login() {
    $("#form-login").addEventListener("submit", (e) => {
      e.preventDefault();
      const email = $("#login-email").value.trim().toLowerCase(), senha = $("#login-senha").value;
      const u = db.users.find((x) => x.email === email && x.senha === senha);
      if (u) { localStorage.setItem(S, u.email); location.href = "menu.html"; }
      else location.href = "erro.html";
    });
  },
  // ===== CADASTRO (RF01) =====
  cadastro() {
    const aviso = $("#aviso");
    $("#form-cadastro").addEventListener("submit", (e) => {
      e.preventDefault();
      const v = (id) => $(id).value.trim();
      const email = v("#c-email").toLowerCase(), senha = $("#c-senha").value;
      let erro = "";
      if (senha.length < 4) erro = "A senha precisa de pelo menos 4 caracteres.";
      else if (senha !== $("#c-senha2").value) erro = "As senhas não são iguais.";
      else if (db.users.some((u) => u.email === email)) erro = "Esse e-mail já está cadastrado. Volte e entre.";
      aviso.hidden = !erro; aviso.textContent = "⚠ " + erro;
      if (erro) return;
      db.users.push({ nome: v("#c-nome"), email, senha, curso: v("#c-curso"), inst: v("#c-inst") });
      salvar(); alert("Cadastro salvo! Agora é só entrar."); location.href = "index.html";
    });
  },
  // ===== MENU (home) =====
  menu() {
    document.querySelector("[data-sair]").addEventListener("click", () => localStorage.removeItem(S));
    const p = pendentes(), total = pct(db.ativ);
    const corDe = (id) => (db.disc.find((d) => d.id == id) || {}).cor || "#4ade3a";
    $("#titulo").textContent = "Olá, " + user.nome.split(" ")[0] + " 👋";
    $("#resumo").innerHTML = `<small>Progresso do período</small><div class="topo"><span class="grande-n">${total}%</span><small>${p.length} pendente(s)<br>${p.filter((a) => a.tipo === "Prova").length} prova(s)</small></div>${barra(total)}<a class="link-centro" href="progresso.html">Ver progresso completo</a>`;
    $("#proximas").innerHTML = p.slice(0, 3).map((a) => `<div class="cartao" style="border-left-color:${corDe(a.disc)}"><div class="topo"><div>${esc(a.titulo)}<small>${esc(discNome(a.disc))} - ${dataBR(a.prazo)}</small></div><em class="selo ${prazo(a)[1]}">${prazo(a)[0]}</em></div></div>`).join("") || '<p class="vazio">Sem pendências. Aproveita! 🎉</p>';
    $("#materias").innerHTML = db.disc.map((d) => { const n = pct(db.ativ.filter((a) => a.disc == d.id)); return `<div class="cartao" style="border-left-color:${d.cor}"><div class="topo"><strong>${esc(d.nome)}</strong><small>${n}%</small></div>${barra(n, d.cor)}</div>`; }).join("") || '<p class="vazio">Sem matérias ainda.</p>';
  },
  // ===== DISCIPLINAS (RF02, RF05) =====
  disciplinas() {
    const lista = $("#lista");
    const desenha = () => {
      lista.innerHTML = db.disc.length ? db.disc.map((d) => {
        const as = db.ativ.filter((a) => a.disc == d.id);
        return `<div class="cartao" style="border-left-color:${d.cor}"><div class="topo"><strong>${esc(d.nome)}</strong><button class="x" data-del="${d.id}" aria-label="Remover ${esc(d.nome)}">✕</button></div>
        <small>${d.prof ? "Prof. " + esc(d.prof) + " - " : ""}${as.filter((a) => a.feito).length}/${as.length} atividades concluídas</small>${barra(pct(as), d.cor)}</div>`;
      }).join("") : '<p class="vazio">Nenhuma disciplina ainda. Adiciona a primeira abaixo.</p>';
    };
    lista.addEventListener("click", (e) => {
      const id = e.target.dataset.del; if (!id) return;
      if (!confirm("Remover a disciplina e as atividades/horários dela?")) return;
      db.disc = db.disc.filter((d) => d.id != id); db.ativ = db.ativ.filter((a) => a.disc != id); db.blocos = db.blocos.filter((b) => b.disc != id);
      salvar(); desenha();
    });
    $("#form-disc").addEventListener("submit", (e) => {
      e.preventDefault();
      db.disc.push({ id: Date.now(), nome: $("#d-nome").value.trim(), cor: $("#d-cor").value, prof: $("#d-prof").value.trim() });
      salvar(); e.target.reset(); desenha();
    });
    desenha();
  },
  // ===== NOVA ATIVIDADE (RF03, RF07) =====
  atividade() {
    $("#a-disc").innerHTML = db.disc.length ? opcoesDisc() : "<option value=''>Cadastre uma disciplina antes</option>";
    $("#a-prazo").min = fmt(new Date());
    $("#form-atividade").addEventListener("submit", (e) => {
      e.preventDefault();
      if (!db.disc.length) return alert("Cadastre uma disciplina primeiro.");
      db.ativ.push({ id: Date.now(), tipo: $("#a-tipo").value, titulo: $("#a-titulo").value.trim(), disc: +$("#a-disc").value, prazo: $("#a-prazo").value, feito: false });
      salvar(); location.href = "tarefas.html";
    });
  },
  // ===== TAREFAS: concluir (RF04), filtrar (RF09), apagar =====
  tarefas() {
    let filtro = "todas";
    const ul = $("#lista");
    const desenha = () => {
      const itens = [...db.ativ].sort((a, b) => a.feito - b.feito || a.prazo.localeCompare(b.prazo))
        .filter((a) => filtro === "todas" || (filtro === "pendentes" ? !a.feito : a.feito));
      ul.innerHTML = itens.length ? itens.map((a) => {
        const [txt, cls] = prazo(a);
        return `<li data-id="${a.id}" data-status="${a.feito ? "feito" : "pendente"}"><span>${esc(a.titulo)}<small>${a.tipo} - ${esc(discNome(a.disc))} - ${dataBR(a.prazo)}</small></span>
        <div class="acoes"><em class="selo ${cls}">${txt}</em><button class="x" data-del="${a.id}" aria-label="Apagar">✕</button></div></li>`;
      }).join("") : '<p class="vazio">Nada por aqui nesse filtro.</p>';
    };
    ul.addEventListener("click", (e) => {
      const del = e.target.dataset.del, li = e.target.closest("li");
      if (del) { if (confirm("Apagar essa atividade?")) { db.ativ = db.ativ.filter((a) => a.id != del); salvar(); desenha(); } return; }
      if (!li) return;
      const a = db.ativ.find((x) => x.id == li.dataset.id); a.feito = !a.feito; salvar(); desenha();
    });
    $("#filtros").addEventListener("click", (e) => {
      if (!e.target.dataset.f) return;
      filtro = e.target.dataset.f;
      document.querySelectorAll("#filtros button").forEach((b) => b.classList.toggle("ativo", b === e.target));
      desenha();
    });
    desenha();
  },
  // ===== HORÁRIOS (RF06) =====
  horarios() {
    const dias = ["Seg", "Ter", "Qua", "Qui", "Sex"], turnos = ["M", "T", "N"], g = $("#grade");
    $("#h-disc").innerHTML = opcoesDisc();
    const desenha = () => {
      g.innerHTML = "<thead><tr><th></th>" + dias.map((d) => `<th>${d}</th>`).join("") + "</tr></thead><tbody>" +
        turnos.map((t, ti) => `<tr><th>${t}</th>` + dias.map((_, di) => {
          const b = db.blocos.find((x) => x.dia == di && x.turno == ti);
          return b ? `<td class="${b.tipo}" data-d="${di}" data-t="${ti}" title="Toque pra remover">${b.tipo === "prova" ? "Prova" : esc(discNome(b.disc).slice(0, 6))}</td>` : "<td></td>";
        }).join("") + "</tr>").join("") + "</tbody>";
    };
    g.addEventListener("click", (e) => {
      const td = e.target.closest("td[data-d]"); if (!td) return;
      if (!confirm("Remover esse bloco?")) return;
      db.blocos = db.blocos.filter((b) => !(b.dia == td.dataset.d && b.turno == td.dataset.t)); salvar(); desenha();
    });
    $("#form-bloco").addEventListener("submit", (e) => {
      e.preventDefault();
      if (!db.disc.length) return alert("Cadastre uma disciplina primeiro.");
      const dia = +$("#h-dia").value, turno = +$("#h-turno").value;
      db.blocos = db.blocos.filter((b) => !(b.dia === dia && b.turno === turno));
      db.blocos.push({ dia, turno, tipo: $("#h-tipo").value, disc: +$("#h-disc").value }); salvar(); desenha();
    });
    desenha();
  },
  // ===== PROGRESSO (RF08) + exportar =====
  progresso() {
    const p = pendentes(), total = pct(db.ativ);
    $("#numeros").innerHTML = [[db.disc.length, "Disciplinas"], [p.length, "Pendentes"], [p.filter((a) => a.tipo === "Prova").length, "Provas"], [total + "%", "Concluído"]].map(([n, t]) => `<div><b>${n}</b>${t}</div>`).join("");
    $("#geral").innerHTML = barra(total);
    $("#por-disc").innerHTML = db.disc.map((d) => `<div class="cartao" style="border-left-color:${d.cor}"><strong>${esc(d.nome)}</strong> <small>${pct(db.ativ.filter((a) => a.disc == d.id))}%</small>${barra(pct(db.ativ.filter((a) => a.disc == d.id)), d.cor)}</div>`).join("");
    $("#proximas").innerHTML = p.slice(0, 3).map((a) => `<div class="cartao">${esc(a.titulo)} <small>${esc(discNome(a.disc))} - ${dataBR(a.prazo)} (${prazo(a)[0]})</small></div>`).join("") || '<p class="vazio">Sem pendências.</p>';
    $("#btn-exportar").addEventListener("click", () => {
      const txt = `SOE System - Resumo de ${user.nome}\nGerado em ${dataBR(fmt(new Date()))}\n\nConcluído: ${total}%\n\nDisciplinas:\n` +
        db.disc.map((d) => `- ${d.nome}: ${pct(db.ativ.filter((a) => a.disc == d.id))}%`).join("\n") +
        "\n\nPendentes:\n" + (p.map((a) => `- ${a.titulo} (${a.tipo}, ${discNome(a.disc)}) até ${dataBR(a.prazo)}`).join("\n") || "- nenhuma");
      const link = document.createElement("a");
      link.href = URL.createObjectURL(new Blob([txt], { type: "text/plain" })); link.download = "resumo-soe.txt"; link.click();
    });
    $("#btn-imprimir").addEventListener("click", () => window.print());
  }
};
if (P[pagina]) P[pagina]();

// ===== EXTRAS DE TODAS AS PÁGINAS: bolhas, tema, sair, abas =====
const semLogin = ["login", "cadastro", "erro"].includes(pagina);

const bolhas = document.createElement("div");
bolhas.className = "bolhas";
bolhas.setAttribute("aria-hidden", "true");
for (let i = 0; i < 22; i++) {
  const b = document.createElement("span"), t = 10 + Math.random() * 44;
  b.className = "bolha";
  b.style.cssText = `width:${t}px;height:${t}px;left:${Math.random() * 100}%;--bal:${Math.round(Math.random() * 60 - 30)}px;--y:${Math.round(Math.random() * 90)}vh;animation-duration:${(9 + Math.random() * 10).toFixed(1)}s;animation-delay:-${(Math.random() * 18).toFixed(1)}s`;
  bolhas.appendChild(b);
}
document.body.prepend(bolhas);

const grupo = document.createElement("div");
grupo.className = "topo-grupo";
const btnTema = document.createElement("button");
btnTema.type = "button";
btnTema.className = "icone";
const syncTema = () => {
  const escuro = document.documentElement.dataset.tema === "dark";
  btnTema.textContent = escuro ? "☀️" : "🌙";
  btnTema.setAttribute("aria-label", escuro ? "Ativar modo claro" : "Ativar modo escuro");
};
btnTema.addEventListener("click", () => {
  const novo = document.documentElement.dataset.tema === "dark" ? "light" : "dark";
  localStorage.setItem(TEMA, novo); aplicaTema(novo); syncTema();
});
syncTema();
grupo.append(btnTema);
if (user && !semLogin) {
  const sair = document.createElement("a");
  sair.className = "icone"; sair.href = "index.html"; sair.textContent = "🚪"; sair.title = "Sair";
  sair.setAttribute("aria-label", "Sair");
  sair.addEventListener("click", () => localStorage.removeItem(S));
  grupo.append(sair);
}
const topo = $(".barra-topo");
if (topo) topo.append(grupo); else { grupo.classList.add("fixo"); document.body.append(grupo); }

if (user && !semLogin) {
  document.body.classList.add("interna");
  const abas = [["menu", "🏠", "Início"], ["disciplinas", "📚", "Matérias"], ["atividade", "➕", "Nova"], ["tarefas", "✅", "Tarefas"], ["horarios", "⏰", "Horários"]];
  const nav = document.createElement("nav");
  nav.className = "abas";
  nav.innerHTML = abas.map(([p, i, t]) => {
    const ativa = p === pagina || (p === "menu" && pagina === "progresso");
    return `<a href="${p}.html" class="${p === "atividade" ? "fab " : ""}${ativa ? "on" : ""}"><span>${i}</span>${t}</a>`;
  }).join("");
  document.body.appendChild(nav);
}
