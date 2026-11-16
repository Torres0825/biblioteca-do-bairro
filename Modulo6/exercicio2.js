console.log("=======================EXERCICIO 2=======================");

function mostrarLivros(livros) {
lista.replaceChildren();
for (const l of livros) {
const item = document.createElement("li");
item.textContent = `${l.titulo} — ${l.autor} (${l.ano})`;
if (!l.disponivel) {
item.classList.add("indisponivel");
item.append(" · emprestado");
}
lista.append(item);
}
const n = livros.filter(l => l.disponivel).length;
resumo.textContent = `${livros.length} livros, ${n} disponíveis`;
}
