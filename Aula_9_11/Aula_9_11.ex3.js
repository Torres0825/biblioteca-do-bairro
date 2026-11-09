const dia = "Segunda";
const hora = 11;
let aberta;
if (dia === "domingo") {
aberta = false;
} else if (dia === "Segunda") {
aberta = hora >= 10 && hora < 13;
} else {
aberta = hora >= 9 && hora < 19;
}
console.log(aberta ? "Aberta" : "Fechada");