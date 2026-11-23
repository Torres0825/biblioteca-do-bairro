// ==========================================
// 1. MENU ACESSÍVEL E MODO ESCURO (Ex. 09)
// ==========================================
const botaoMenu = document.querySelector("#abrir-menu");
const menu = document.querySelector("#menu-principal");
const botaoTema = document.querySelector("#alternar-tema");

botaoMenu.addEventListener("click", () => {
  const aberto = menu.classList.toggle("aberto");
  botaoMenu.setAttribute("aria-expanded", aberto);
});

botaoTema.addEventListener("click", () => {
  document.body.classList.toggle("escuro");
});

document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape" && menu.classList.contains("aberto")) {
    menu.classList.remove("aberto");
    botaoMenu.setAttribute("aria-expanded", "false");
    botaoMenu.focus();
  }
});

// ==========================================
// 2. LIVRO EM DESTAQUE & RESERVA (Ex. 05, 06, 07)
// ==========================================
const destaque = document.querySelector("#destaque");
const botaoReservar = destaque.querySelector(".reservar");

destaque.querySelector("h3").textContent = "Mensagem";
const capa = destaque.querySelector(".capa");
capa.alt = "Capa de Mensagem, de Fernando Pessoa";
destaque.querySelector(".mais").href = "#catalogo-secao";

const estadoDestaque = destaque.dataset.estado;
destaque.querySelector(".estado-texto").textContent = `Estado atual: ${estadoDestaque}`;

if (estadoDestaque === "emprestado") {
  const [ano, mes, dia] = destaque.dataset.devolucao.split("-");
  botaoReservar.textContent = `Disponível a ${dia}/${mes}`;
  botaoReservar.disabled = true;
} else {
  botaoReservar.addEventListener("click", () => {
    botaoReservar.textContent = "Reservado";
    botaoReservar.disabled = true;
  });
}

// ==========================================
// 3. CATÁLOGO COM <TEMPLATE> E PESQUISA EM DIRETO (Ex. 11, 15)
// ==========================================
const livrosCatalogo = [
  { titulo: "Os Maias", autor: "Eça de Queirós", ano: 1888, emprestado: false },
  { titulo: "Mensagem", autor: "Fernando Pessoa", ano: 1934, emprestado: true },
  { titulo: "Memorial do Convento", autor: "José Saramago", ano: 1982, emprestado: false },
  { titulo: "A Sibila", autor: "Agustina Bessa-Luís", ano: 1954, emprestado: true },
  { titulo: "O Principezinho", autor: "Antoine de Saint-Exupéry", ano: 1943, emprestado: false },
  { titulo: "Ensaio sobre a Cegueira", autor: "José Saramago", ano: 1995, emprestado: false }
];

const tplLivro = document.querySelector("#tpl-livro");
const listaCatalogo = document.querySelector("#catalogo");
const estadoPesquisa = document.querySelector("#estado-pesquisa");
const campoPesquisa = document.querySelector("#pesquisa");

const fragmento = document.createDocumentFragment();
for (const livro of livrosCatalogo) {
  const clone = tplLivro.content.cloneNode(true);
  const li = clone.querySelector(".livro-card");

  clone.querySelector(".titulo").textContent = livro.titulo;
  clone.querySelector(".autor").textContent = `${livro.autor} (${livro.ano})`;

  if (livro.emprestado) {
    li.classList.add("emprestado");
    clone.querySelector(".badge-emprestado").hidden = false;
  }
  fragmento.append(clone);
}
listaCatalogo.append(fragmento);

const cartoesLivros = [...listaCatalogo.querySelectorAll(".livro-card")];
estadoPesquisa.textContent = `${cartoesLivros.length} livros disponíveis no catálogo`;

campoPesquisa.addEventListener("input", () => {
  const termo = campoPesquisa.value.trim().toLowerCase();
  let visiveis = 0;

  for (const li of cartoesLivros) {
    const titulo = li.querySelector(".titulo").textContent.toLowerCase();
    const autor = li.querySelector(".autor").textContent.toLowerCase();
    const corresponde = titulo.includes(termo) || autor.includes(termo);

    li.hidden = !corresponde;
    if (corresponde) visiveis++;
  }

  estadoPesquisa.textContent = `${visiveis} livros encontrados`;
});

campoPesquisa.addEventListener("keydown", (evento) => {
  if (evento.key !== "Escape") return;
  campoPesquisa.value = "";
  campoPesquisa.dispatchEvent(new Event("input"));
});

// ==========================================
// 4. LISTA DE LEITURA 2.0 COM DELEGAÇÃO (Ex. 12, 13)
// ==========================================
const listaLeitura = document.querySelector("#lista-leitura");
const campoNovoLivro = document.querySelector("#novo-livro");
const botaoAdicionar = document.querySelector("#adicionar-livro");
const botaoLimpar = document.querySelector("#limpar-lista");
const contadorLeitura = document.querySelector("#contador-leitura");

function atualizarContadorLeitura() {
  const total = listaLeitura.children.length;
  contadorLeitura.textContent = total === 1 ? "1 livro" : `${total} livros`;
}

function criarItemLeitura(titulo) {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.className = "item-titulo";
  span.textContent = titulo;

  const divAcoes = document.createElement("div");
  divAcoes.className = "item-acoes";

  const botoes = [
    { acao: "subir", texto: "↑", label: "Subir livro" },
    { acao: "descer", texto: "↓", label: "Descer livro" },
    { acao: "remover", texto: "✕", label: "Remover livro" }
  ];

  for (const info of botoes) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.acao = info.acao;
    btn.textContent = info.texto;
    btn.setAttribute("aria-label", info.label);
    divAcoes.append(btn);
  }

  li.append(span, divAcoes);
  listaLeitura.append(li);
  atualizarContadorLeitura();
}

botaoAdicionar.addEventListener("click", () => {
  const titulo = campoNovoLivro.value.trim();
  if (!titulo) return;

  criarItemLeitura(titulo);
  campoNovoLivro.value = "";
  campoNovoLivro.focus();
});

campoNovoLivro.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") {
    evento.preventDefault();
    botaoAdicionar.click();
  }
});

// Adicionar diretamente a partir do catálogo
listaCatalogo.addEventListener("click", (evento) => {
  const botao = evento.target.closest(".btn-adicionar-lista");
  if (!botao) return;

  const titulo = botao.closest(".livro-card").querySelector(".titulo").textContent;
  criarItemLeitura(titulo);
  botao.textContent = "✓ Adicionado";
  botao.disabled = true;
});

// Delegação única na lista de leitura
listaLeitura.addEventListener("click", (evento) => {
  const li = evento.target.closest("li");
  if (!li) return;

  const botao = evento.target.closest("button");
  if (!botao) {
    li.classList.toggle("lido");
    return;
  }

  const acao = botao.dataset.acao;
  if (acao === "remover") li.remove();
  if (acao === "subir") li.previousElementSibling?.before(li);
  if (acao === "descer") li.nextElementSibling?.after(li);

  atualizarContadorLeitura();
});

botaoLimpar.addEventListener("click", () => {
  listaLeitura.replaceChildren();
  atualizarContadorLeitura();
});

atualizarContadorLeitura();

// ==========================================
// 5. PROGRESSO DE LEITURA & COR DE DESTAQUE (Ex. 10)
// ==========================================
const rangeProgresso = document.querySelector("#progresso-range");
const barraProgresso = document.querySelector(".progresso");
const textoPercentagem = document.querySelector("#percentagem-texto");
const seletorCor = document.querySelector("#cor-destaque");

rangeProgresso.addEventListener("input", () => {
  const valor = Number(rangeProgresso.value);
  barraProgresso.style.width = `${valor}%`;
  textoPercentagem.textContent = `${valor}% lido`;
  barraProgresso.classList.toggle("completo", valor === 100);
});

seletorCor.addEventListener("input", (evento) => {
  document.documentElement.style.setProperty("--cor-destaque", evento.target.value);
});

// ==========================================
// 6. INSCRIÇÃO NO CLUBE DE LEITURA (Ex. 14)
// ==========================================
const formClube = document.querySelector("#form-clube");
const resumoInscricao = document.querySelector("#resumo-inscricao");

formClube.elements.nome.addEventListener("input", (evento) => {
  const partes = evento.target.value.trim().split(/\s+/);
  const mensagemErro = partes.length < 2 ? "Escreve nome e apelido." : "";
  evento.target.setCustomValidity(mensagemErro);
});

formClube.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const dados = new FormData(formClube);
  const primeiroNome = dados.get("nome").trim().split(/\s+/)[0];
  const clubeEscolhido = dados.get("clube");

  resumoInscricao.textContent = `Obrigado, ${primeiroNome}! Inscrição no clube ${clubeEscolhido}.`;
  formClube.reset();
  formClube.elements.nome.focus();
});

// ==========================================
// 7. CAIXA DE SUGESTÕES COM CONTADOR (Ex. 07)
// ==========================================
const formSugestao = document.querySelector("#form-sugestao");
const textoSugestao = document.querySelector("#texto-sugestao");
const contadorCaracteres = document.querySelector("#contador-caracteres");
const feedbackSugestao = document.querySelector("#feedback-sugestao");

textoSugestao.addEventListener("input", () => {
  const n = textoSugestao.value.length;
  contadorCaracteres.textContent = `${n}/200`;
  contadorCaracteres.style.color = n > 180 ? "#B91C1C" : "";
});

formSugestao.addEventListener("submit", (evento) => {
  evento.preventDefault();
  if (!textoSugestao.value.trim()) return;

  feedbackSugestao.textContent = "Sugestão registada com sucesso! Obrigado pela tua contribuição.";
  formSugestao.reset();
  contadorCaracteres.textContent = "0/200";
  contadorCaracteres.style.color = "";
});