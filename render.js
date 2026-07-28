/**
 * render.js
 * Renderização do Fluxograma interativo (grid de períodos x disciplinas).
 */

const Fluxograma = (() => {
  let elementoRaiz = null;
  let concluidas = new Set();
  let codigoSelecionado = null; // disciplina clicada, para destacar cadeia de pré-requisitos

  function init(root) {
    elementoRaiz = root;
    concluidas = Estado.carregarConcluidas();
    render();
  }

  function ancestrais(codigo, visitados = new Set()) {
    const d = buscarDisciplina(codigo);
    if (!d) return visitados;
    const reqs = [...(d.prereq || []), ...(d.coRequisito || [])];
    reqs.forEach((cod) => {
      if (!visitados.has(cod)) {
        visitados.add(cod);
        ancestrais(cod, visitados);
      }
    });
    return visitados;
  }

  function descendentes(codigo, visitados = new Set()) {
    listarDependentes(codigo).forEach((d) => {
      if (!visitados.has(d.codigo)) {
        visitados.add(d.codigo);
        descendentes(d.codigo, visitados);
      }
    });
    return visitados;
  }

  function onClicarCard(codigo, ev) {
    if (ev.target.closest(".check-concluida")) return; // checkbox trata separado
    codigoSelecionado = codigoSelecionado === codigo ? null : codigo;
    render();
  }

  function onToggleConcluida(codigo) {
    concluidas = Estado.alternarConcluida(codigo);
    render();
    document.dispatchEvent(new CustomEvent("progresso:atualizado"));
  }

  function classeCard(disciplina) {
    const classes = ["card-disciplina", `depto-${disciplina.depto || "outros"}`];
    if (concluidas.has(disciplina.codigo)) classes.push("concluida");
    if (!concluidas.has(disciplina.codigo) && prereqsAtendidos(disciplina, concluidas)) {
      classes.push("disponivel");
    }
    if (codigoSelecionado) {
      if (disciplina.codigo === codigoSelecionado) classes.push("selecionada");
      else if (ancestrais(codigoSelecionado).has(disciplina.codigo)) classes.push("eh-prerequisito");
      else if (descendentes(codigoSelecionado).has(disciplina.codigo)) classes.push("eh-dependente");
      else classes.push("esmaecida");
    }
    return classes.join(" ");
  }

  function htmlCard(disciplina) {
    const reqTexto = [
      ...(disciplina.prereq || []),
      ...((disciplina.coRequisito || []).map((c) => `#${c}`)),
    ].join(", ");
    return `
      <div class="${classeCard(disciplina)}" data-codigo="${disciplina.codigo}" title="${disciplina.nome}">
        <div class="card-topo">
          <label class="check-concluida" title="Marcar como concluída">
            <input type="checkbox" ${concluidas.has(disciplina.codigo) ? "checked" : ""} data-codigo="${disciplina.codigo}" />
          </label>
          <span class="card-creditos">${disciplina.creditos}cr</span>
        </div>
        <div class="card-nome">${disciplina.nome}</div>
        <div class="card-rodape">
          <span class="card-codigo">${disciplina.codigo}</span>
          ${reqTexto ? `<span class="card-prereq">${reqTexto}</span>` : ""}
        </div>
      </div>`;
  }

  function render() {
    const periodos = Array.from({ length: 10 }, (_, i) => i + 1);
    const linhas = ["A", "B", "C", "D", "E", "F", "G", "H"];

    let colgroup = `<col class="col-linha">` + periodos.map(() => `<col />`).join("");

    let cabecalho = `<tr><th class="th-linha"></th>${periodos
      .map((p) => `<th>${p}° Período</th>`)
      .join("")}</tr>`;

    let corpo = linhas
      .map((linha) => {
        const celulas = periodos
          .map((p) => {
            const d = DISCIPLINAS.find((x) => x.codigo === `${linha}${p}`);
            return `<td>${d ? htmlCard(d) : ""}</td>`;
          })
          .join("");
        return `<tr><th class="th-linha">${linha}</th>${celulas}</tr>`;
      })
      .join("");

    let rodapeTotais = `<tr class="linha-totais"><th class="th-linha">Total</th>${periodos
      .map((p) => {
        const t = TOTAIS_POR_PERIODO[p];
        return `<td class="td-total">Créditos: ${t.creditos}<br>CH: ${t.ch}</td>`;
      })
      .join("")}</tr>`;

    const progresso = calcularProgresso(concluidas);

    elementoRaiz.innerHTML = `
      <div class="barra-progresso-wrap">
        <div class="barra-progresso-info">
          <strong>${progresso.percentual}%</strong> concluído
          — ${progresso.creditosConcluidos}/${progresso.totalCreditos} créditos
          — ${progresso.disciplinasConcluidas}/${progresso.totalDisciplinas} disciplinas
        </div>
        <div class="barra-progresso-fundo">
          <div class="barra-progresso-preenchida" style="width:${progresso.percentual}%"></div>
        </div>
      </div>

      <div class="legenda">
        <span class="legenda-item"><span class="amostra disponivel"></span> Disponível para cursar</span>
        <span class="legenda-item"><span class="amostra concluida"></span> Concluída</span>
        <span class="legenda-item"><span class="amostra depto-materiais"></span> Eng. de Materiais</span>
        <span class="legenda-item"><span class="amostra depto-outros"></span> Outros departamentos</span>
        <span class="legenda-dica">Clique numa disciplina para destacar pré-requisitos (azul) e quem depende dela (laranja).</span>
      </div>

      <div class="tabela-scroll">
        <table class="tabela-fluxograma">
          <colgroup>${colgroup}</colgroup>
          <thead>${cabecalho}</thead>
          <tbody>${corpo}${rodapeTotais}</tbody>
        </table>
      </div>
    `;

    elementoRaiz.querySelectorAll(".card-disciplina").forEach((card) => {
      card.addEventListener("click", (ev) => onClicarCard(card.dataset.codigo, ev));
    });
    elementoRaiz.querySelectorAll(".check-concluida input").forEach((chk) => {
      chk.addEventListener("change", () => onToggleConcluida(chk.dataset.codigo));
    });
  }

  return { init, render };
})();
