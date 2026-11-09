function calcularCoima(dias) {
return dias > 15 ? (dias - 15) * 0.5 : 0;
}
function formatarEuros(valor) {
return valor.toFixed(2).replace(".", ",") + " €";
}
function mensagemCoima(dias) {
const coima = calcularCoima(dias);
if (coima === 0) return "Sem multa";
return `Multa a pagar: ${formatarEuros(coima)}`;
}
console.log(mensagemCoima(10)); 
console.log(mensagemCoima(22)); 
