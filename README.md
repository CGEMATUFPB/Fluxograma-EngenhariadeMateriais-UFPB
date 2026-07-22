# Fluxograma — Engenharia de Materiais (UFPB)

Site para acompanhar o fluxograma do curso e os horários das disciplinas de cada período.

## Como abrir

Basta dar duplo clique em `index.html` — funciona direto no navegador, sem instalar nada.

Se preferir rodar via servidor local (opcional, útil para testar em outro dispositivo na mesma rede):

```
cd site-fluxograma
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

## O que tem

- **Aba Fluxograma**: todas as disciplinas dos 10 períodos, organizadas como no fluxograma oficial.
  - Clique na caixinha de cada disciplina para marcar como concluída (fica salvo no navegador).
  - Clique no cartão da disciplina para destacar em azul os pré-requisitos dela e em laranja quem depende dela.
  - Barra de progresso mostra % de créditos concluídos.
- **Aba Horários**, com duas formas de visualizar:
  - **Lista**: escolha um período e veja as disciplinas agrupadas por departamento responsável
    (Engenharia de Materiais, Matemática, Física, Química, Estatística, etc.), já pré-preenchidas com
    a oferta oficial do período letivo 2026.1 (turma, dia, horário e professor). Quando uma disciplina
    tem mais de uma turma cadastrada, são opções diferentes de horário — comum quando ela atende tanto
    quem está no fluxo normal quanto quem ficou em dependência e precisa de um horário sem choque com o
    período atual. Tudo é editável: dá pra apagar a turma que não te interessa, ajustar sala, adicionar
    um horário novo, ou clicar em "restaurar oficial" para desfazer suas edições numa disciplina.
  - **Matriz**: grade semanal (dias x horários) com as disciplinas que têm horário salvo, coloridas
    por departamento. Tem seletor de período — "Todos" (padrão, útil pra ver a grade completa e
    detectar choques entre disciplinas de períodos diferentes) ou um período específico (1° a 10°).
    Horários livres aparecem marcados como "Livre". Filtros de departamento permitem esconder/mostrar
    disciplinas por área. Quando duas disciplinas caem no mesmo horário (conflito), a célula mostra as
    duas empilhadas.
  - No topo do período 1 (modo Lista) tem uma seção recolhível com outras disciplinas ofertadas este
    período que não estão no fluxograma oficial.
  - Nos slots de optativa do fluxograma (**Optativa A** no 7° período, **Optativa B** no 8° e
    **Optativa C** no 9°), o cartão mostra as disciplinas concretas de cada grupo (com horário
    oficial) e um botão "usar esta opção" — clique pra aplicar o horário daquela disciplina ao
    slot. O cartão passa a mostrar qual optativa você escolheu.
- **Aba Ofertadas DEMAT**: matriz semanal pra apoiar o planejamento da oferta do próprio departamento.
  Tem dois modos:
  - **Oficial**: sempre o horário fixo de `horarios-oficiais.js` — é igual pra qualquer pessoa que
    abrir o site, é a "fonte da verdade". Mostra as disciplinas obrigatórias do DEMAT (não as básicas
    de outros departamentos) mais as 16 optativas, com turma e professor em cada célula. Quando duas
    ou mais turmas caem no mesmo horário, a célula fica laranja com todas empilhadas — útil pra achar
    horário livre e evitar choque antes de abrir uma turma nova. Tem seletor de período: "Todos" junta
    a grade inteira, ou filtra só as obrigatórias de um período específico (as optativas aparecem
    sempre, já que não têm período fixo).
  - **Minha proposta**: um rascunho separado, guardado só neste navegador, pra testar reorganizações
    de horário sem afetar o horário oficial nem o horário pessoal de nenhum aluno. Tem três visões:
    - **Lista**: cartões editáveis por período (obrigatórias do DEMAT) e das optativas ativas — dá pra
      ajustar dia, horário, turma e professor de cada uma, adicionar/remover horários, ou restaurar o
      valor oficial de uma disciplina específica. Linhas fora da janela 16h–19h (nos períodos 7º, 8º,
      9º e nas optativas) ficam marcadas em laranja. No fim da tela tem um bloco recolhível **"Todas as
      disciplinas ofertadas no Xº período"**, somente leitura, com o horário oficial de toda disciplina
      do currículo (qualquer departamento) ofertada naquele período — útil pra checar conflito com
      outras matérias (Cálculo, Física etc.) antes de mover uma turma do DEMAT.
    - **Matriz**: mesma grade da aba Oficial, mas refletindo a proposta (e as optativas ativas).
    - **⚙ Optativas**: só aparecem no site (Lista e Matriz da proposta) as optativas marcadas aqui.
      Por padrão as 16 optativas cadastradas em `data.js` vêm todas marcadas — desmarcar uma esconde
      ela da visualização sem apagar o horário salvo (dá pra marcar de novo depois). Também dá pra
      criar optativas novas, que ainda não existem no cadastro padrão: só preencher nome e créditos e
      clicar em "+ criar optativa" — elas entram automaticamente na Lista e na Matriz da proposta,
      com horário em branco pra você preencher. Essa configuração é independente do horário oficial da
      aba Oficial, que sempre mostra as 16 optativas originais.
    - **Gerar sugestão automática**: botão que tenta mover o máximo possível das disciplinas do 7º,
      8º e 9º período (mais as optativas ativas) pra dentro da janela 16h–19h, liberando a manhã pro
      aluno estagiar. O modelo de choque é por período: as obrigatórias de um período só evitam conflito
      com as do mesmo período (um aluno no fluxo normal cursa só um período final por vez, então 7º e
      8º podem, por exemplo, ocupar o mesmo horário sem problema real). Já as optativas evitam os três
      períodos finais e também umas às outras, pois qualquer uma pode ser escolhida em qualquer um
      deles. O botão mostra um resumo de quantas turmas foram movidas e quantas não couberam sem gerar
      choque (essas continuam no horário original — dá pra ajustar manualmente na Lista). Na prática, a
      janela de 3h (16h–19h) em dias úteis costuma ter menos capacidade do que a demanda total dos três
      períodos finais mais as optativas, então nem tudo cabe — o gerador prioriza o que consegue encaixar
      sem choque e deixa claro o que sobrou.
    - **Descartar toda a proposta**: apaga o rascunho salvo (horários) e recarrega o horário oficial. A
      configuração de optativas ativas/customizadas fica guardada à parte e não é afetada por esse botão.
- **Limpar dados salvos**: apaga progresso e horários salvos neste navegador (volta a carregar a oferta oficial na próxima visita).

## Estrutura do projeto

```
site-fluxograma/
├── index.html              # estrutura da página e abas
├── css/style.css            # todo o estilo visual
└── js/
    ├── data.js              # dados do curso (disciplinas, créditos, pré-requisitos, departamento)
    ├── horarios-oficiais.js # oferta oficial de turmas/horários do período letivo atual
    ├── state.js             # camada de persistência (localStorage) + helpers de domínio
    ├── render.js             # lógica da aba Fluxograma
    ├── horarios.js           # lógica da aba Horários (Lista + Matriz)
    ├── ofertadas.js           # lógica da aba Ofertadas DEMAT (matriz oficial + proposta editável do departamento)
    └── app.js                # inicialização e navegação entre abas
```

Cada parte fica isolada de propósito: se um dia você quiser evoluir isso (por exemplo, criar login e
guardar os dados em um servidor em vez do navegador), só é necessário reescrever as funções de
`state.js` — o resto do site (telas, cliques, cálculo de progresso) continua igual.

## Sobre os dados

As disciplinas, créditos e pré-requisitos foram extraídos do fluxograma oficial em PDF. Os totais de
créditos por período nas colunas do fluxograma batem exatamente com os totais impressos no documento
original. Cada disciplina também tem um `departamento` (nome oficial, conforme SIGAA) usado para
agrupar a Lista e colorir a Matriz — para disciplinas não ofertadas no período letivo mais recente, o
departamento foi inferido pela área da disciplina. Se notar algo desatualizado (grades mudam de tempos
em tempos), é só editar o arquivo `js/data.js` — a estrutura de cada disciplina é:

```js
{ codigo: "B4", nome: "Mecânica dos Materiais I", periodo: 4, creditos: 4, depto: "materiais",
  departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["A3", "B3", "C3"] }
```

Os horários oficiais vêm de `js/horarios-oficiais.js`, gerado a partir do relatório "Relatório de
Turmas Ofertadas ao Curso" (planilha `Horario - 2025-1.xlsx`, aba Plan1), que lista turma, horário no
formato SIGAA (ex.: `35M23` = terça e quinta, manhã, dos horários 2 e 3) e professor de cada disciplina
efetivamente ofertada no período letivo 2026.1. Esse arquivo é só o "valor padrão" — depois que o aluno
edita algo na tela, a versão salva no navegador manda. Quando a coordenação divulgar a oferta de um novo
período, é só gerar um `horarios-oficiais.js` novo (ou editar os valores manualmente) para atualizar os
padrões.

As aulas diurnas (manhã e tarde) duram 1h cada, corridas, sem intervalo (07:00–13:00 e 13:00–19:00). As
aulas noturnas duram 50min, com intervalo entre a 2ª e a 3ª (19:00–22:30). Essa tabela de horários fica
em `FAIXAS`, no topo de `js/horarios.js`, e é usada tanto pra desenhar as linhas da Matriz quanto pra
converter os códigos SIGAA em horário de relógio ao gerar `horarios-oficiais.js`.

As opções concretas de **Optativa A/B/C** (16 disciplinas ao todo, divididas em 3 grupos conforme a
lista da coordenação) também ficam em `js/horarios-oficiais.js`, nas estruturas `GRUPOS_OPTATIVAS`
(disciplinas de cada grupo) e `CODIGO_PARA_GRUPO_OPTATIVA` (liga o slot do fluxograma ao grupo certo).

## Próximos passos possíveis

- Adicionar autenticação para salvar o progresso na nuvem (hoje é só local, por navegador).
- Alertar visualmente quando a Matriz detectar um conflito real de horário.
- Exportar o progresso/horário em PDF ou imagem.
- Script para regenerar `horarios-oficiais.js` automaticamente a cada nova planilha de horários.
