/**
 * Funções de armazenamento — soluções do módulo 3 e 6
 * Todas as chaves usam o prefixo "biblioteca:"
 */

function ler(chave, porOmissao) {
  try {
    const texto = localStorage.getItem(chave);
    if (texto === null) return porOmissao;
    return JSON.parse(texto);
  } catch {
    return porOmissao; // texto estragado ou armazenamento bloqueado
  }
}

function guardar(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
    return true;
  } catch (erro) {
    // QuotaExceededError ou SecurityError (armazenamento bloqueado)
    console.warn("Não foi possível guardar:", erro.name);
    return false;
  }
}

function apagarChave(chave) {
  try {
    localStorage.removeItem(chave);
  } catch {
    // silencioso
  }
}

/** Lista todas as chaves com o prefixo biblioteca: */
function listarChavesBiblioteca() {
  const chaves = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const chave = localStorage.key(i);
      if (chave && chave.startsWith("biblioteca:")) {
        chaves.push(chave);
      }
    }
  } catch {
    // armazenamento bloqueado
  }
  return chaves.sort();
}
