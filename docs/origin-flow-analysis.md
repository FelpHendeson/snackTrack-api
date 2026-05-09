# Analise do fluxo de origens no SnackTrack

Data da analise: 2026-05-09

Este documento analisa o comportamento real do back-end atual em relacao a
`Origin`, `Movement`, `CashRefill`, `CashRegister` e `Workspace`. A ideia e
separar o que o codigo ja implementa do que ainda precisa de decisao de
negocio antes de fechar o fluxo da interface.

## 1. Resumo executivo

No codigo atual, `Origin` representa uma origem/classificacao de uma
movimentacao financeira dentro de um workspace.

Ela e:

- obrigatoria para criar uma `Movement`;
- vinculada a um `Workspace`;
- criada por um usuario autenticado;
- usada para popular dados das movimentacoes no historico;
- independente de `CashRefill`;
- independente do calculo direto do caixa.

Ela nao e, pelo codigo atual:

- um caixa;
- uma conta bancaria;
- um reforco;
- um workspace;
- uma permissao;
- uma forma de pagamento isolada obrigatoriamente.

Decisao de negocio confirmada: o campo `type` da origem deve ser obrigatoriamente
`entrada` ou `saida`. Esse tipo acompanha o sentido financeiro da movimentacao.
Uma origem de `entrada` so deve ser usada em movimentacoes de `entrada`; uma
origem de `saida` so deve ser usada em movimentacoes de `saida`.

## 2. Arquivos analisados

Arquivos principais:

- `src/models/origin.model.ts`
- `src/interfaces/IOrigin.interface.ts`
- `src/validations/origin.validation.ts`
- `src/routes/origin.route.ts`
- `src/controllers/origin.controller.ts`
- `src/services/origin.service.ts`
- `src/repositories/origin.repository.ts`

Arquivos relacionados:

- `src/models/movement.model.ts`
- `src/validations/movement.validation.ts`
- `src/services/movement.service.ts`
- `src/repositories/movement.repository.ts`
- `src/models/cashRefill.model.ts`
- `src/services/cashRefill.service.ts`
- `src/models/cashRegister.model.ts`
- `src/services/cashRegister.service.ts`
- `src/repositories/cashRegister.repository.ts`
- `src/services/workspace.service.ts`
- `src/routes/workspace.route.ts`

## 3. Modelo atual de Origin

O schema atual de `Origin` possui:

| Campo | Obrigatorio | Descricao tecnica |
| --- | --- | --- |
| `name` | sim | Nome da origem, com `trim` |
| `description` | nao | Descricao textual, com `trim` |
| `type` | sim | Enum: `entrada` ou `saida` |
| `createdBy` | sim | Usuario que criou a origem |
| `updatedBy` | nao | Usuario que atualizou a origem |
| `workspaceId` | sim | Workspace dono da origem |
| `createdAt` | automatico | Timestamp do Mongoose |
| `updatedAt` | automatico | Timestamp do Mongoose |

Indices definidos:

- `{ workspaceId: 1, type: 1 }`
- `{ workspaceId: 1, name: 1 }`
- `{ createdBy: 1 }`

Observacao importante: o indice por `workspaceId` + `name` nao e unico. Entao,
hoje o back-end permite criar duas origens com o mesmo nome no mesmo workspace.

## 4. Endpoints de Origin

Todos os endpoints de origem passam por `authenticateToken`.

Base considerando o prefixo geral da API:

| Metodo | Rota | Funcao |
| --- | --- | --- |
| `POST` | `/snacktrack/origins` | Cria uma origem |
| `GET` | `/snacktrack/origins/workspace?workspaceId=...` | Lista origens de um workspace |
| `GET` | `/snacktrack/origins/:id` | Busca uma origem por ID |
| `PUT` | `/snacktrack/origins/:id` | Atualiza uma origem |
| `DELETE` | `/snacktrack/origins/:id` | Remove uma origem |

Payload atual para criar origem:

```json
{
  "name": "Balcao",
  "type": "entrada",
  "description": "Vendas presenciais",
  "workspaceId": "WORKSPACE_ID"
}
```

O `createdBy` nao vem do front. Ele e preenchido pelo controller a partir do
token JWT.

## 5. Relacao entre Origin e Movement

`Movement` possui `originId` obrigatorio.

Campos relevantes de `Movement`:

| Campo | Obrigatorio | Observacao |
| --- | --- | --- |
| `workspaceId` | sim | Workspace da movimentacao |
| `originId` | sim | Origem/classificacao da movimentacao |
| `value` | sim | Valor minimo `0.01` |
| `date` | sim | Data da movimentacao |
| `type` | sim | Enum: `entrada` ou `saida` |
| `description` | nao | Texto livre |
| `createdBy` | sim | Usuario autenticado |

Payload atual para criar movimentacao:

```json
{
  "workspaceId": "WORKSPACE_ID",
  "originId": "ORIGIN_ID",
  "type": "entrada",
  "value": 25.5,
  "date": "2026-05-09T12:00:00.000Z",
  "description": "Venda no balcao"
}
```

Ao listar ou buscar movimentacoes, o repository usa `populate("originId")`.
Isso indica que a origem foi pensada para aparecer no historico/extrato como
informacao de contexto da movimentacao.

### Validacao importante

O back-end deve validar, e a implementacao atualizada passa a validar, se:

- a origem existe antes de criar a movimentacao;
- a origem pertence ao mesmo workspace da movimentacao;
- o `origin.type` e compativel com o `movement.type`.

Ainda fica pendente validar se:

- o usuario e membro do workspace;
- o usuario tem permissao para criar movimentacao naquele workspace.

Com isso, o front nao deve permitir escolher uma origem de `saida` ao registrar
uma `entrada`, nem uma origem de `entrada` ao registrar uma `saida`.

## 6. Relacao entre Origin e CashRefill

`CashRefill` nao possui `originId`.

O reforco de caixa hoje tem:

- `workspaceId`;
- `value`;
- `date`;
- `description`;
- `createdBy`;
- `updatedBy`.

Portanto, no modelo atual, reforco nao usa origem. Ele e uma entidade separada
de entradas e saidas operacionais.

Interpretacao provavel:

- `Movement` representa entradas e saidas do negocio.
- `CashRefill` representa reforcos manuais/adicionais no caixa.
- `Origin` classifica apenas `Movement`.

Se o produto precisar rastrear a origem de um reforco, o back-end ainda nao tem
esse campo.

## 7. Relacao entre Origin e CashRegister

`CashRegister` nao possui relacao direta com `Origin`.

O caixa guarda:

- `workspaceId`;
- `openingDate`;
- `initialValue`;
- `finalValue`;
- `balance`;
- `status` (`open` ou `closed`);
- lista de `movements`;
- lista de `refills`;
- usuario criador/atualizador.

O calculo do saldo funciona assim:

```text
saldo = valor inicial
      + soma dos reforcos vinculados
      + soma das movimentacoes de entrada vinculadas
      - soma das movimentacoes de saida vinculadas
```

A origem entra apenas indiretamente, porque cada movimentacao vinculada ao caixa
pode ter uma origem. O caixa nao filtra, abre, fecha ou calcula saldo com base
em origem.

## 8. Auto-link de caixa

O caixa possui fluxo de auto-vinculo:

- ao abrir caixa com `autoLinkMovements`;
- ao fechar caixa com `autoLinkBeforeClose`;
- manualmente via endpoint de `auto-link`.

O auto-link busca:

- movimentacoes do mesmo `workspaceId`;
- reforcos do mesmo `workspaceId`;
- registros cuja `date` esteja no mesmo dia da `openingDate` do caixa.

Origem nao participa desse filtro.

Isso significa que, para o back-end atual, o criterio principal para uma
movimentacao entrar no caixa e:

```text
mesmo workspace + mesma data do caixa
```

Nao existe regra por origem.

## 9. Fluxo operacional real sugerido pelo codigo

Este e o fluxo que o back-end atual suporta de forma mais natural:

1. Usuario cria conta ou faz login.
2. Front usa token JWT para chamar rotas autenticadas.
3. Usuario ve workspaces dos quais e membro.
4. Se nao tiver workspace, cria um novo workspace.
5. Ao criar workspace, o usuario entra como membro com role `Owner`.
6. Dentro do workspace, o usuario deve ter origens cadastradas.
7. Usuario abre um caixa para o workspace.
8. Usuario cria movimentacoes de entrada ou saida, sempre escolhendo uma origem.
9. Usuario cria reforcos quando precisar adicionar valor ao caixa sem tratar isso como entrada operacional.
10. Usuario pode vincular movimentacoes/reforcos ao caixa manualmente ou por auto-link.
11. Usuario fecha o caixa, opcionalmente fazendo auto-link antes do fechamento.
12. Historico/extrato lista movimentacoes por workspace e mostra a origem populada.

## 10. Fluxo ideal para o front respeitando o back atual

Para a interface, o fluxo mais coerente seria:

### Login e workspace

- Login/cadastro primeiro.
- Tela de selecao de workspace depois do login.
- Botao sempre visivel para criar workspace.
- Se o usuario criar workspace, ele passa a ser `Owner`.
- Se nao houver workspace, a UI orienta criar o primeiro.

### Setup inicial do workspace

Antes de registrar a primeira entrada/saida, o sistema precisa ter pelo menos
uma origem.

Existem duas possibilidades de produto:

1. Criar uma origem padrao automaticamente, por exemplo `Operacao`.
2. Mostrar uma etapa de configuracao pedindo que o usuario crie uma origem.

Como o back-end nao cria origem padrao hoje, a alternativa mais fiel ao codigo e
a segunda. A primeira exige mudanca de back-end ou uma criacao automatica pelo
front apos criar workspace.

### Operacao diaria

- Dashboard mostra resumo do workspace.
- Tela de caixas mostra caixas abertos/fechados.
- Tela de lancamento exige:
  - tipo: entrada ou saida;
  - origem;
  - valor;
  - data;
  - descricao opcional.
- Tela de reforco nao deve pedir origem, pelo modelo atual.
- Historico/extrato pode agrupar ou filtrar por origem.
- Configuracoes do workspace devem ter CRUD de origens.

## 11. Como entender "origem" no produto

Pelo codigo atual, a melhor leitura e:

> Origem e a classificacao que explica de onde veio uma entrada ou para onde foi
> uma saida dentro de um workspace.

Exemplos de origens de entrada:

- `Pix`
- `Dinheiro`
- `Cartao`
- `Balcao`
- `Delivery`
- `iFood`

Exemplos de origens de saida:

- `Compra de insumos`
- `Compra de Mercadoria`
- `Pagamento de Funcionario`
- `Fornecedor`
- `Ajuste operacional`

Esses nomes ainda podem representar conceitos diferentes:

- canal de venda;
- forma de pagamento;
- categoria financeira;
- motivo operacional.

O que fica definido e o sentido financeiro pelo `type`: `entrada` ou `saida`.
A semantica exata do `name` ainda pode ser refinada pela experiencia do produto.

## 12. Decisao fechada sobre o campo type

`Origin.type` deve ser enum com apenas dois valores:

- `entrada`;
- `saida`.

Regra:

```text
Origin.type === Movement.type
```

Exemplos:

- origem `Pix`, type `entrada`;
- origem `Cartao`, type `entrada`;
- origem `Dinheiro`, type `entrada`;
- origem `Compra de mercadoria`, type `saida`.
- origem `Pagamento de Funcionario`, type `saida`.

Impacto na UI:

- ao registrar entrada, listar apenas origens de entrada;
- ao registrar saida, listar apenas origens de saida;
- ao criar origem, obrigar o usuario a escolher entrada ou saida;
- reforco continua sem origem pelo modelo atual.

Uma modelagem futura ainda poderia separar conceitos mais finos:

- `PaymentMethod`: dinheiro, pix, cartao;
- `Channel`: balcao, delivery, app;
- `Category`: compra de mercadoria, pagamento de funcionario, taxa.

Mas, no fluxo atual, tudo isso fica representado pelo cadastro de origens,
separado por `entrada` e `saida`.

## 13. Riscos e inconsistencias atuais

### 13.1 Origem pode ser deletada mesmo com movimentacoes

Hoje o service de origem remove a origem sem verificar se existem
movimentacoes apontando para ela.

Risco:

- historico pode ficar com `originId` sem populate;
- relatorios por origem podem quebrar ou perder contexto;
- usuario pode apagar uma origem usada em lancamentos antigos.

Sugestao:

- bloquear delete quando houver `Movement` usando a origem;
- ou implementar soft delete (`active: false`) para manter historico.

### 13.2 Nao ha unicidade por nome no workspace

Hoje podem existir varias origens com mesmo nome no mesmo workspace.

Risco:

- dropdown confuso no front;
- relatorios duplicados;
- usuario escolhe origem errada.

Sugestao:

- indice unico por `{ workspaceId, name }`;
- ou validacao no service antes de criar/editar.

### 13.3 Regra Origin x Movement

Esta regra deve ser tratada como contrato do back-end:

- a origem precisa existir;
- a origem precisa pertencer ao mesmo workspace da movimentacao;
- a origem precisa ter o mesmo `type` da movimentacao.

Esse ponto foi incorporado no service de movimentacoes para evitar dados
cruzados entre workspaces e lancamentos com tipo incompativel.

Observacao: se ja houver dados antigos inconsistentes no banco, pode ser
necessaria uma rotina de revisao/migracao.

### 13.4 Rotas de Origin nao validam ObjectId por middleware

As rotas de origem usam `:id`, mas nao aplicam `validateObjectId`.

Risco:

- ID invalido pode virar erro 500 em vez de 400;
- experiencia ruim no front.

Sugestao:

- aplicar `validateObjectId` em `GET /:id`, `PUT /:id` e `DELETE /:id`.

### 13.5 Permissoes de workspace ainda nao aparecem aplicadas

O workspace cria o usuario como `Owner`, mas as rotas analisadas nao parecem
validar se o usuario autenticado e membro do workspace antes de operar origens,
movimentacoes, reforcos ou caixas.

Risco:

- qualquer usuario autenticado pode operar IDs de workspace se souber os IDs;
- front pode parecer correto, mas API ainda permite acesso indevido.

Sugestao:

- adicionar middleware/service de autorizacao por workspace;
- validar role/permissao antes de operacoes sensiveis.

### 13.6 Caixa nao obriga existencia de caixa aberto para lancar movimento

Movimentacoes sao criadas independentemente de caixa aberto.

Isso nao e necessariamente erro. Pode ser uma decisao de produto:

- modelo A: lancamentos existem soltos e depois sao vinculados ao caixa;
- modelo B: lancamentos so podem ser criados dentro de um caixa aberto.

O codigo atual segue mais o modelo A.

Se a UX desejada for "dentro do caixa fazer lancamentos", talvez o back precise
validar caixa aberto ou o front precisa criar e vincular imediatamente.

### 13.7 Nao ha regra impedindo multiplos caixas abertos

Pelo codigo analisado, abrir caixa nao verifica se ja existe outro caixa aberto
no workspace.

Risco:

- lancamentos do mesmo dia podem ser vinculados a caixas diferentes;
- saldo operacional fica confuso.

Sugestao:

- decidir se o workspace pode ter apenas um caixa aberto por vez;
- se sim, validar isso no `CashRegisterService.open`.

## 14. Proposta de arquitetura de telas para origens

Considerando o back-end atual, origens deveriam aparecer em dois pontos:

### 14.1 Configuracoes do workspace

Tela: `Configuracoes > Origens`

Funcoes:

- listar origens do workspace;
- criar origem;
- editar origem;
- inativar/remover origem;
- informar se a origem esta em uso.

Estados:

- sem origem cadastrada;
- carregando origens;
- erro ao buscar origens;
- origem duplicada;
- tentativa de excluir origem em uso, se essa regra for implementada.

### 14.2 Formulario de lancamento

Tela: `Lancar`

Funcoes:

- escolher entrada ou saida;
- escolher origem em select/dropdown;
- criar origem rapida se nao existir;
- informar valor, data e descricao;
- salvar movimentacao.

Estado critico:

- se nao houver origem, bloquear lancamento e chamar usuario para criar a
  primeira origem.

Texto de UX sugerido:

```text
Antes de registrar entradas e saidas, crie pelo menos uma origem para organizar
seu historico financeiro.
```

## 15. Perguntas para validar com voce

Estas perguntas precisam de resposta antes de fechar o fluxo definitivo:

1. "Origem" significa categoria do lancamento, canal de venda, forma de
   pagamento ou motivo operacional?
2. Reforco de caixa deve ter origem ou deve continuar separado?
3. O sistema deve criar origens padrao ao criar workspace, como Pix, Cartao,
   Dinheiro, Compra de Mercadoria e Pagamento de Funcionario?
4. O usuario pode excluir uma origem que ja foi usada?
5. O workspace pode ter duas origens com mesmo nome?
6. Lancamento deve poder existir sem caixa aberto?
7. Lancamento deve ser criado "dentro do caixa" e vinculado automaticamente?
8. Pode haver mais de um caixa aberto por workspace?
9. O auto-link por data e workspace e suficiente, ou precisa considerar caixa
    aberto/turno/usuario?

## 16. Recomendacao para a proxima implementacao de front

Enquanto essas decisoes nao forem fechadas, o front deve seguir o fluxo mais
conservador e compativel com o back:

1. Login/cadastro.
2. Selecao/criacao de workspace.
3. Dashboard do workspace.
4. Configuracoes com CRUD de origens.
5. Abertura de caixa.
6. Lancamento de entrada/saida exigindo origem.
7. Reforco sem origem.
8. Historico/extrato mostrando origem nas movimentacoes.
9. Fechamento de caixa com opcao de auto-link.

Para nao inventar regra incompativel com o back, o front deve tratar origens
como cadastro obrigatorio para entradas/saidas e filtrar as opcoes pelo tipo do
lancamento.

## 17. Ajustes de back-end recomendados antes de evoluir UX

Prioridade alta:

- impedir ou tratar exclusao de origem usada em movimentacoes;
- validar membership/permissao do usuario no workspace;
- validar ObjectId nas rotas de origem.

Prioridade media:

- impedir nomes duplicados por workspace;
- decidir se deve haver origens padrao por workspace;
- decidir se movimento exige caixa aberto.

Prioridade baixa:

- criar endpoints agregados para resumo por origem;
- adicionar filtros por origem no extrato;
- adicionar soft delete e estado ativo/inativo para origem.

## 18. Conclusao

O back-end atual coloca `Origin` como uma dependencia obrigatoria de
`Movement`. Com a regra confirmada, `Origin.type` passa a ser o mesmo sentido da
movimentacao: `entrada` ou `saida`.

O fluxo mais fiel ao codigo e:

```text
Workspace -> Origens -> Movimentacoes -> Caixa por vinculo/manual ou auto-link
```

E nao:

```text
Workspace -> Caixa -> Origem
```

Na pratica, a UI deve permitir gerenciar origens dentro do workspace e exigir
uma origem compativel ao registrar entrada ou saida. O caixa deve continuar
tratando movimentacoes e reforcos como itens vinculaveis por workspace/data, ate
que uma nova regra de negocio diga o contrario.
