# SnackTrack API

API para controle financeiro de pequenos comércios e autônomos, com foco em gestão de caixa, movimentações e reforços.

## 🚀 Versão 1.0.0

### Funcionalidades Implementadas

- **Sistema de Caixa**
  - Abertura e fechamento de caixa
  - Cálculo automático de saldo
  - Auto-link de movimentações e reforços
  - Reabertura de caixa

- **Movimentações**
  - Registro de entradas e saídas
  - Vinculação automática ao caixa
  - Validações de valores e datas

- **Reforços**
  - Gestão de reforços de caixa
  - Vinculação automática
  - Cálculo de saldo

### Tecnologias Utilizadas

- TypeScript
- Node.js
- Express
- MongoDB
- Mongoose
- JWT para autenticação
- Zod para validações

### Pré-requisitos

- Node.js (v18 ou superior)
- MongoDB
- Git

### Instalação

1. Clone o repositório:
```bash
git clone https://gitlab.com/flpblacksystems/typescript-ts/snacktrackapi.git
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Execute as seeds (opcional):
```bash
npm run seed:dev
```

### Scripts Disponíveis

- `npm run start:dev`: Inicia o servidor em modo desenvolvimento
- `npm run start:watch`: Inicia o servidor com hot-reload
- `npm run dist`: Gera build de desenvolvimento
- `npm run dist:prod`: Gera build de produção
- `npm run seed:dev`: Executa seeds de desenvolvimento
- `npm run seed:clear`: Limpa o banco de dados

### Estrutura do Projeto

## 🛠️ Como rodar localmente

1. **Clone o repositório:**
```bash
mkdir snacktrackapi
cd snacktrackapi
git clone https://gitlab.com/flpblacksystems/typescript-ts/snacktrackapi.git
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure o ambiente:**
```bash
cp .env.example .env
```

4. **Inicie a aplicação:**

Modo desenvolvimento:
```bash
npm run start:dev
```

Build + produção:
```bash
npm run start:dist
```

## 📦 Scripts disponíveis

| Script | Descrição |
|--------|-----------|
| `start:dev` | Inicia o servidor com TSX (dev) |
| `start:watch` | Roda com watch para hot reload |
| `start:dist` | Gera build com tsup e roda com Node |
| `dist` | Apenas compila o projeto para /dist |

## 📌 Padrão de Commits

Utilizamos o padrão Conventional Commits:

```
<tipo>(escopo): mensagem

ex: feat(auth): adiciona autenticação JWT
```

### Tipos comuns:
- `feat`: nova funcionalidade
- `fix`: correção de bug
- `docs`: alteração apenas na documentação
- `refactor`: refatoração de código (sem adicionar funcionalidades ou corrigir bugs)
- `test`: adição ou modificação de testes
- `chore`: mudanças em tarefas de build, configs, etc.

## 📄 Licença

Projeto licenciado sob a ISC.  
Desenvolvido com �� por DevLipeBlack.