/**
 * app.js
 * Ponto de entrada: alterna entre as abas "Fluxograma" e "Horários".
 */

document.addEventListener("DOMContentLoaded", () => {
  const abas = document.querySelectorAll(".aba-botao");
  const paineis = {
    fluxograma: document.getElementById("painel-fluxograma"),
    horarios: document.getElementById("painel-horarios"),
    ofertadas: document.getElementById("painel-ofertadas"),
  };

  Fluxograma.init(paineis.fluxograma);
  Horarios.init(paineis.horarios);
  OfertadasDemat.init(paineis.ofertadas);

  abas.forEach((btn) => {
    btn.addEventListener("click", () => {
      abas.forEach((b) => b.classList.remove("ativo"));
      btn.classList.add("ativo");
      Object.values(paineis).forEach((p) => p.classList.remove("painel-ativo"));
      paineis[btn.dataset.aba].classList.add("painel-ativo");
    });
  });

  document.addEventListener("progresso:atualizado", () => {
    // no futuro: sincronizar progresso com um backend aqui
  });

  const btnLimpar = document.getElementById("btn-limpar-dados");
  btnLimpar.addEventListener("click", () => {
    if (confirm("Isso vai apagar seu progresso e horários salvos neste navegador. Continuar?")) {
      Estado.limparTudo();
      location.reload();
    }
  });
});
