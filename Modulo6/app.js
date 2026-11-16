
let catalogo = [];

const lista = document.getElementById("lista-livros");
const pesquisa = document.getElementById("pesquisa");
const botaoFiltro = document.getElementById("botao-filtro");
const botaoTema = document.getElementById("botao-tema");


// EXERCICIO 1 - Mostrar todos os livros

function mostrarLivros(livros) {

    lista.innerHTML = "";

    for (const l of livros) {

        const item = document.createElement("li");

        const informacao = document.createElement("span");

        informacao.textContent =
            `${l.titulo} — ${l.autor} (${l.ano})`;

        item.append(informacao);

        const estado = document.createElement("span");

        if (l.disponivel) {
            estado.textContent = " · Disponível";
            estado.classList.add("disponivel");
        } else {
            estado.textContent = " · Emprestado";
            estado.classList.add("indisponivel");
        }

        item.append(estado);

        const botao = document.createElement("button");

        botao.textContent = "Emprestar";
        botao.disabled = !l.disponivel;

        botao.addEventListener("click", function() {

            const resultado = emprestar(l.titulo);

            document.getElementById("mensagem").textContent = resultado;

            atualizar();

        });

        item.append(botao);

        lista.append(item);
    }
}


// EXERCICIO 2 - Contar livros disponíveis

function contarDisponiveis() {

    return catalogo.filter(l => l.disponivel).length;

}


// EXERCICIO 3 - Encontrar o livro mais antigo

function encontrarAntigo() {

    let antigo = catalogo[0];

    for (const l of catalogo) {

        if (l.ano < antigo.ano) {
            antigo = l;
        }

    }

    return antigo;

}


// EXERCICIO 4 - Emprestar livros

function emprestar(titulo) {

    const livro = catalogo.find(l => l.titulo === titulo);

    if (!livro) return "Livro não encontrado.";

    if (!livro.disponivel) return "Já está emprestado.";

    livro.disponivel = false;

    return "Livro emprestado com sucesso!";

}


// EXERCICIO 7 - Atualizar a biblioteca

function atualizarBiblioteca() {

    mostrarLivros(catalogo);

    const n = contarDisponiveis();

    document.getElementById("resumo").textContent =
        `${catalogo.length} livros, ${n} disponíveis`;

    if (catalogo.length > 0) {

        const antigo = encontrarAntigo();

        document.getElementById("livro-antigo").textContent =
            `O livro mais antigo é: ${antigo.titulo} (${antigo.ano})`;

    }

}


// EXERCICIO 8 - Pesquisa e filtro de livros

let soDisponiveis = false;

function atualizar() {

    const texto = pesquisa.value.trim().toLowerCase();

    let res = catalogo.filter(l =>
        l.titulo.toLowerCase().includes(texto)
    );

    if (soDisponiveis) {
        res = res.filter(l => l.disponivel);
    }

    mostrarLivros(res);

    if (!res.length) {
        lista.textContent = "Nenhum livro encontrado.";
    }

    const n = contarDisponiveis();

    document.getElementById("resumo").textContent =
        `${catalogo.length} livros, ${n} disponíveis`;

    if (catalogo.length > 0) {

        const antigo = encontrarAntigo();

        document.getElementById("livro-antigo").textContent =
            `O livro mais antigo é: ${antigo.titulo} (${antigo.ano})`;

    }

}


// Pesquisa automática

pesquisa.addEventListener("input", atualizar);


// Filtro de livros disponíveis

botaoFiltro.addEventListener("click", () => {

    soDisponiveis = !soDisponiveis;

    if (soDisponiveis) {
        botaoFiltro.textContent = "Mostrar todos os livros";
    } else {
        botaoFiltro.textContent = "Mostrar apenas disponíveis";
    }

    atualizar();

});


async function carregarLivros() {

    try {

        const resposta = await fetch("livros.json");

        if (!resposta.ok) {
            throw new Error("Erro ao carregar o ficheiro JSON");
        }

        catalogo = await resposta.json();

        atualizar();

    } catch (erro) {

        lista.textContent = "Erro ao carregar o catálogo.";

        console.error(erro);

    }

}

carregarLivros();


const tema = localStorage.getItem("tema");

document.body.classList.toggle("escuro", tema === "escuro");

botaoTema.addEventListener("click", () => {

    const escuro = document.body.classList.toggle("escuro");

    localStorage.setItem("tema", escuro ? "escuro" : "claro");

});
