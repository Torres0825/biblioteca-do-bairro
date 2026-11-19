/**
 * Página «Os meus dados»
 * Mostra tudo o que o site guardou e permite apagar
 */

const listaDados = document.getElementById("lista-dados");
const botaoApagarTudo = document.getElementById("apagar-tudo");

/* Preferências de tema e tamanho (iguais às da página principal) */
const botaoTema = document.getElementById("botao-tema");
const seguirSistema = document.getElementById("seguir-sistema");

function aplicarTema() {
  const guardado = localStorage.getItem("biblioteca:tema");
  const sistema = matchMedia("(prefers-color-scheme: dark)").matches;
  const escuro = guardado ? guardado === "escuro" : sistema;
  document.body.classList.toggle("escuro", escuro);
  if (botaoTema) botaoTema.setAttribute("aria-pressed", String(escuro));
}

if (botaoTema) {
  botaoTema.addEventListener("click", () => {
    const escuro = !document.body.classList.contains("escuro");
    localStorage.setItem("biblioteca:tema", escuro ? "escuro" : "claro");
    aplicarTema();
  });
}

if (seguirSistema) {
  seguirSistema.addEventListener("click", () => {
    localStorage.removeItem("biblioteca:tema");
    aplicarTema();
  });
}

const TAMANHOS = ["letra-pequena", "letra-media", "letra-grande", "letra-extra"];
const botaoMenor = document.getElementById("letra-menor");
const botaoMaior = document.getElementById("letra-maior");

function aplicarTamanho() {
  const atual = ler("biblioteca:tamanho", "letra-media");
  TAMANHOS.forEach((c) => document.body.classList.remove(c));
  document.body.classList.add(atual);
}

function mudarTamanho(delta) {
  let idx = TAMANHOS.indexOf(ler("biblioteca:tamanho", "letra-media"));
  if (idx < 0) idx = 1;
  idx = Math.max(0, Math.min(TAMANHOS.length - 1, idx + delta));
  guardar("biblioteca:tamanho", TAMANHOS[idx]);
  aplicarTamanho();
}

if (botaoMenor) botaoMenor.addEventListener("click", () => mudarTamanho(-1));
if (botaoMaior) botaoMaior.addEventListener("click", () => mudarTamanho(1));

/* ---------- Listar e apagar dados ---------- */
const DESCRICOES = {
  "biblioteca:tema": "Preferência de tema (claro/escuro)",
  "biblioteca:tamanho": "Tamanho de letra",
  "biblioteca:leitura": "Lista de leitura",
  "biblioteca:rascunho": "Rascunho da sugestão de livro",
  "biblioteca:pesquisas": "Últimas pesquisas (com validade de 7 dias)",
  "biblioteca:visitas": "Contador de visitas",
  "biblioteca:aviso-fechado": "Aviso fechado nesta visita (sessionStorage — não aparece aqui)",
};

function formatarValor(chave, textoBruto) {
  try {
    const parsed = JSON.parse(textoBruto);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return textoBruto;
  }
}

function renderizar() {
  if (!listaDados) return;
  const chaves = listarChavesBiblioteca();

  // Também mostrar chaves simples (tema e visitas são strings puras)
  const todas = new Set(chaves);
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("biblioteca:")) todas.add(k);
    }
  } catch {
    // bloqueado
  }

  const lista = Array.from(todas).sort();

  if (lista.length === 0) {
    listaDados.innerHTML =
      '<p class="vazio-dados">Nenhum dado guardado neste browser.</p>';
    return;
  }

  listaDados.innerHTML = "";
  lista.forEach((chave) => {
    let valorBruto = "";
    try {
      valorBruto = localStorage.getItem(chave) ?? "";
    } catch {
      valorBruto = "(inacessível)";
    }

    const item = document.createElement("div");
    item.className = "item-dado";

    const desc = DESCRICOES[chave] ? ` — ${DESCRICOES[chave]}` : "";
    item.innerHTML = `
      <div class="chave">${chave}${desc}</div>
      <div class="valor">${escapeHtml(formatarValor(chave, valorBruto))}</div>
      <div class="acoes">
        <button type="button" data-chave="${escapeAttr(chave)}">Apagar esta chave</button>
      </div>
    `;
    listaDados.append(item);
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(str) {
  return String(str).replace(/"/g, "&quot;");
}

if (listaDados) {
  listaDados.addEventListener("click", (evento) => {
    const btn = evento.target.closest("button[data-chave]");
    if (!btn) return;
    const chave = btn.dataset.chave;
    if (confirm(`Apagar «${chave}»?`)) {
      apagarChave(chave);
      renderizar();
    }
  });
}

if (botaoApagarTudo) {
  botaoApagarTudo.addEventListener("click", () => {
    if (
      !confirm(
        "Apagar TODOS os dados deste site neste browser?\nEsta ação não pode ser desfeita."
      )
    ) {
      return;
    }
    const chaves = listarChavesBiblioteca();
    // Incluir também as que não são JSON (tema, visitas…)
    try {
      const extras = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith("biblioteca:")) extras.push(k);
      }
      extras.forEach((k) => localStorage.removeItem(k));
    } catch {
      chaves.forEach(apagarChave);
    }
    // Também limpar sessionStorage do aviso
    try {
      sessionStorage.removeItem("biblioteca:aviso-fechado");
    } catch {
      // ok
    }
    renderizar();
    aplicarTema();
    aplicarTamanho();
  });
}

/* Sincronizar se outro separador apagar */
window.addEventListener("storage", () => {
  renderizar();
  aplicarTema();
  aplicarTamanho();
});

/* Arranque */
aplicarTema();
aplicarTamanho();
renderizar();
