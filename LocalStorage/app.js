/**
 * Biblioteca com Memória — app principal
 * Usa as soluções dos exercícios 03, 07, 08, 09, 10 e 11
 */

/* ---------- Catálogo simulado ---------- */
const CATALOGO = [
  { titulo: "Os Maias", autor: "Eça de Queirós" },
  { titulo: "Mensagem", autor: "Fernando Pessoa" },
  { titulo: "Os Lusíadas", autor: "Luís de Camões" },
  { titulo: "Ensaio sobre a Cegueira", autor: "José Saramago" },
  { titulo: "Memorial do Convento", autor: "José Saramago" },
  { titulo: "A Cidade e as Serras", autor: "Eça de Queirós" },
  { titulo: "Livro do Desassossego", autor: "Fernando Pessoa" },
  { titulo: "Amor de Perdição", autor: "Camilo Castelo Branco" },
  { titulo: "A Ilustre Casa de Ramires", autor: "Eça de Queirós" },
  { titulo: "O Ano da Morte de Ricardo Reis", autor: "José Saramago" },
];

/* ---------- Preferências: tema (ex. 07) ---------- */
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

/* ---------- Preferências: tamanho de letra ---------- */
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

/* ---------- Contador de visitas (ex. 03) ---------- */
const contadorEl = document.getElementById("contador-visitas");
if (contadorEl) {
  const visitas = Number(localStorage.getItem("biblioteca:visitas")) + 1;
  localStorage.setItem("biblioteca:visitas", String(visitas));
  contadorEl.textContent = `É a ${visitas}.ª vez que nos visitas.`;
}

/* ---------- Aviso por visita — sessionStorage (ex. 09) ---------- */
const faixa = document.getElementById("faixa-aviso");
const fecharFaixa = document.getElementById("fechar-faixa");
const CHAVE_AVISO = "biblioteca:aviso-fechado";

if (faixa && fecharFaixa) {
  if (sessionStorage.getItem(CHAVE_AVISO) !== "sim") {
    faixa.hidden = false;
  }
  fecharFaixa.addEventListener("click", () => {
    faixa.hidden = true;
    sessionStorage.setItem(CHAVE_AVISO, "sim");
  });
}

/* ---------- Lista de leitura (ex. 08 + ordem) ---------- */
const listaEl = document.getElementById("lista-leitura");
const listaVazia = document.getElementById("lista-vazia");
const formLeitura = document.getElementById("form-leitura");
const campoLivro = document.getElementById("campo-livro");

let leitura = ler("biblioteca:leitura", []);

function mostrar(lista) {
  if (!listaEl) return;
  listaEl.innerHTML = "";
  if (listaVazia) listaVazia.hidden = lista.length > 0;

  lista.forEach((item, i) => {
    const li = document.createElement("li");
    li.dataset.indice = String(i);

    const titulo = document.createElement("span");
    titulo.className = "titulo" + (item.lido ? " lido" : "");
    titulo.textContent = item.titulo;
    titulo.title = "Clique para marcar como lido/não lido";

    const mover = document.createElement("div");
    mover.className = "mover";
    const btnUp = document.createElement("button");
    btnUp.type = "button";
    btnUp.dataset.acao = "cima";
    btnUp.textContent = "↑";
    btnUp.title = "Subir";
    btnUp.disabled = i === 0;
    const btnDown = document.createElement("button");
    btnDown.type = "button";
    btnDown.dataset.acao = "baixo";
    btnDown.textContent = "↓";
    btnDown.title = "Descer";
    btnDown.disabled = i === lista.length - 1;
    mover.append(btnUp, btnDown);

    const btnRemover = document.createElement("button");
    btnRemover.type = "button";
    btnRemover.dataset.acao = "remover";
    btnRemover.textContent = "Remover";

    li.append(titulo, mover, btnRemover);
    listaEl.append(li);
  });
}

function atualizar() {
  guardar("biblioteca:leitura", leitura);
  mostrar(leitura);
}

if (listaEl) {
  listaEl.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button");
    const li = evento.target.closest("li");
    if (!li) return;
    const i = Number(li.dataset.indice);

    if (!botao) {
      // clique no título → marcar lido
      leitura[i].lido = !leitura[i].lido;
    } else if (botao.dataset.acao === "remover") {
      leitura.splice(i, 1);
    } else if (botao.dataset.acao === "cima" && i > 0) {
      [leitura[i - 1], leitura[i]] = [leitura[i], leitura[i - 1]];
    } else if (botao.dataset.acao === "baixo" && i < leitura.length - 1) {
      [leitura[i], leitura[i + 1]] = [leitura[i + 1], leitura[i]];
    } else {
      return;
    }
    atualizar();
  });
}

if (formLeitura && campoLivro) {
  formLeitura.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const titulo = campoLivro.value.trim();
    if (!titulo) return;
    leitura.push({ titulo, lido: false });
    campoLivro.value = "";
    atualizar();
  });
}

/* ---------- Rascunho de sugestão (módulo 4) ---------- */
const formSugestao = document.getElementById("form-sugestao");
const textoSugestao = document.getElementById("texto-sugestao");
const estadoRascunho = document.getElementById("estado-rascunho");
const CHAVE_RASCUNHO = "biblioteca:rascunho";

if (textoSugestao) {
  textoSugestao.value = localStorage.getItem(CHAVE_RASCUNHO) ?? "";
  if (estadoRascunho && textoSugestao.value) {
    estadoRascunho.hidden = false;
  }

  textoSugestao.addEventListener("input", () => {
    localStorage.setItem(CHAVE_RASCUNHO, textoSugestao.value);
    if (estadoRascunho) {
      estadoRascunho.hidden = !textoSugestao.value;
    }
  });
}

if (formSugestao) {
  formSugestao.addEventListener("submit", (evento) => {
    evento.preventDefault();
    // Simula envio
    alert("Sugestão enviada. Obrigado!");
    textoSugestao.value = "";
    localStorage.removeItem(CHAVE_RASCUNHO);
    if (estadoRascunho) estadoRascunho.hidden = true;
  });
}

/* ---------- Últimas pesquisas (ex. 11) ---------- */
const CHAVE_PESQUISAS = "biblioteca:pesquisas";
const SETE_DIAS = 7 * 24 * 60 * 60 * 1000;
const formPesquisa = document.getElementById("form-pesquisa");
const campoPesquisa = document.getElementById("campo-pesquisa");
const listaPesquisas = document.getElementById("lista-pesquisas");
const blocoPesquisas = document.getElementById("ultimas-pesquisas");
const resultadosEl = document.getElementById("resultados-pesquisa");

function lerPesquisas() {
  const caixa = ler(CHAVE_PESQUISAS, null);
  if (!caixa || caixa.versao !== 1) return [];
  if (Date.now() - caixa.guardadoEm > SETE_DIAS) return [];
  return caixa.dados ?? [];
}

function registarPesquisa(termo) {
  const antigas = lerPesquisas().filter((t) => t !== termo);
  const dados = [termo, ...antigas].slice(0, 5);
  guardar(CHAVE_PESQUISAS, {
    versao: 1,
    guardadoEm: Date.now(),
    dados,
  });
}

function mostrarPesquisas() {
  if (!listaPesquisas || !blocoPesquisas) return;
  const termos = lerPesquisas();
  listaPesquisas.innerHTML = "";
  if (termos.length === 0) {
    blocoPesquisas.hidden = true;
    return;
  }
  blocoPesquisas.hidden = false;
  termos.forEach((termo) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = termo;
    btn.addEventListener("click", () => {
      campoPesquisa.value = termo;
      executarPesquisa(termo);
    });
    li.append(btn);
    listaPesquisas.append(li);
  });
}

function executarPesquisa(termo) {
  const q = termo.toLowerCase();
  const encontrados = CATALOGO.filter(
    (l) =>
      l.titulo.toLowerCase().includes(q) ||
      l.autor.toLowerCase().includes(q)
  );
  if (!resultadosEl) return;
  if (encontrados.length === 0) {
    resultadosEl.innerHTML = "<p>Nenhum livro encontrado.</p>";
    return;
  }
  resultadosEl.innerHTML = encontrados
    .map(
      (l) =>
        `<div class="livro"><strong>${l.titulo}</strong> <span class="autor">— ${l.autor}</span></div>`
    )
    .join("");
}

if (formPesquisa && campoPesquisa) {
  formPesquisa.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const termo = campoPesquisa.value.trim();
    if (!termo) return;
    registarPesquisa(termo);
    mostrarPesquisas();
    executarPesquisa(termo);
  });
}

/* ---------- Sincronização entre separadores (ex. 10) ---------- */
window.addEventListener("storage", (evento) => {
  if (evento.key === "biblioteca:leitura") {
    leitura = JSON.parse(evento.newValue ?? "[]");
    mostrar(leitura);
  }
  if (evento.key === "biblioteca:tema" || evento.key === null) {
    aplicarTema();
  }
  if (evento.key === "biblioteca:tamanho" || evento.key === null) {
    aplicarTamanho();
  }
  if (evento.key === CHAVE_PESQUISAS || evento.key === null) {
    mostrarPesquisas();
  }
});

/* ---------- Arranque ---------- */
aplicarTema();
aplicarTamanho();
mostrar(leitura);
mostrarPesquisas();
