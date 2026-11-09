const livros = ["Os Maias", "Mensagem", "A Sibila",
"Os Lusíadas", "Aparição"];
livros.push("Memorial do Convento", "Ensaio sobre a Cegueira");
console.log(livros.length); // 7
livros.forEach((titulo, i) => {
console.log(`${i + 1}. ${titulo}`);
});
const longos = livros.filter(t => t.length > 10);
const maiusculas = livros.map(t => t.toUpperCase());
console.log(longos, maiusculas);
