# Documentação das Páginas do Frontend

Este documento descreve todas as páginas e componentes criados para o frontend do Sistema de Gestão.

## Estrutura de Pastas

```
src/app/
├── page.jsx                 # Página inicial (Dashboard)
├── login/
│   └── page.jsx            # Página de login
├── registrar/
│   └── page.jsx            # Página de registro
├── animais/
│   └── page.jsx            # Gerenciamento de animais/equipamentos
├── tutores/
│   └── page.jsx            # Gerenciamento de tutores/clientes
├── consultas/
│   └── page.jsx            # Gerenciamento de consultas/empréstimos
├── usuarios/
│   └── page.jsx            # Gerenciamento de usuários (Admin)
├── clientes/
│   └── page.jsx            # Página de clientes (já existia)
└── equipamentos/
    └── page.jsx            # Página de equipamentos (já existia)

src/lib/
├── api.js                  # Funções de requisição à API
└── utils.js                # Utilitários (já existia)
```

## Páginas Criadas

### 1. **Página de Login** (`/login`)
- **Arquivo:** `src/app/login/page.jsx`
- **Funcionalidade:**
  - Formulário de login com campos: login e senha
  - Validação de credenciais
  - Armazenamento de token no localStorage
  - Redirecionamento para a página inicial após login bem-sucedido
  - Link para página de registro

### 2. **Página de Registro** (`/registrar`)
- **Arquivo:** `src/app/registrar/page.jsx`
- **Funcionalidade:**
  - Formulário de registro com campos: nome, login, senha e confirmação de senha
  - Validações:
    - Nome com mínimo 2 caracteres
    - Login com 3-20 caracteres (letras, números e underscore)
    - Senha com mínimo 6 caracteres
    - Confirmação de senha
  - Redirecionamento para login após registro bem-sucedido
  - Link para página de login

### 3. **Página Inicial/Dashboard** (`/`)
- **Arquivo:** `src/app/page.jsx`
- **Funcionalidade:**
  - Verifica autenticação do usuário
  - Exibe bem-vindo com nome do usuário
  - Grid com cards para cada módulo:
    - Animais/Equipamentos
    - Tutores/Clientes
    - Consultas/Empréstimos
    - Gerenciar Usuários (apenas para admin)
    - Clientes
    - Equipamentos
  - Botão de logout
  - Redirecionamento para login se não autenticado

### 4. **Página de Animais/Equipamentos** (`/animais`)
- **Arquivo:** `src/app/animais/page.jsx`
- **Funcionalidade:**
  - Listar todos os animais
  - Criar novo animal (nome, descrição)
  - Editar animal existente
  - Excluir animal
  - Exibição em grid de cards
  - Tratamento de erros

### 5. **Página de Tutores/Clientes** (`/tutores`)
- **Arquivo:** `src/app/tutores/page.jsx`
- **Funcionalidade:**
  - Listar todos os tutores
  - Criar novo tutor (nome, descrição)
  - Editar tutor existente
  - Excluir tutor
  - Exibição em grid de cards
  - Tratamento de erros

### 6. **Página de Consultas/Empréstimos** (`/consultas`)
- **Arquivo:** `src/app/consultas/page.jsx`
- **Funcionalidade:**
  - Listar todas as consultas
  - Filtrar por status: todos, em-aberto, concluídas, canceladas
  - Criar nova consulta (nome, descrição)
  - Editar consulta existente
  - Marcar como devolvida
  - Excluir consulta
  - Exibição em grid de cards
  - Tratamento de erros

### 7. **Página de Usuários** (`/usuarios`) - Admin Only
- **Arquivo:** `src/app/usuarios/page.jsx`
- **Funcionalidade:**
  - Listar usuários com paginação (10 por página)
  - Criar novo usuário (nome, login, senha, tipo)
  - Editar usuário existente
  - Excluir usuário
  - Seleção de tipo de usuário (usuário ou admin)
  - Exibição em tabela
  - Navegação entre páginas
  - Tratamento de erros

## Arquivo de Utilitários de API (`src/lib/api.js`)

Este arquivo contém todas as funções para comunicação com o backend:

### Autenticação
- `authAPI.login(login, senha)` - POST /auth/login
- `authAPI.registrar(nome, login, senha)` - POST /auth/registrar
- `authAPI.obterPerfil()` - GET /auth/perfil

### Animais
- `animalAPI.listarTodos()` - GET /equipamentos
- `animalAPI.buscarPorId(id)` - GET /equipamentos/:id
- `animalAPI.criar(dados)` - POST /equipamentos
- `animalAPI.atualizar(id, dados)` - PUT /equipamentos/:id
- `animalAPI.excluir(id)` - DELETE /equipamentos/:id

### Consultas
- `consultaAPI.listarTodos()` - GET /emprestimos
- `consultaAPI.listarEmAberto()` - GET /emprestimos/em-aberto
- `consultaAPI.listarConcluidas()` - GET /emprestimos/concluidas
- `consultaAPI.listarCanceladas()` - GET /emprestimos/canceladas
- `consultaAPI.buscarPorId(id)` - GET /emprestimos/:id
- `consultaAPI.criar(dados)` - POST /emprestimos
- `consultaAPI.atualizar(id, dados)` - PUT /emprestimos/:id
- `consultaAPI.devolver(id, dados)` - PUT /emprestimos/:id/devolver
- `consultaAPI.excluir(id)` - DELETE /emprestimos/:id

### Tutores
- `tutorAPI.listarTodos()` - GET /tutores
- `tutorAPI.buscarPorId(id)` - GET /tutores/:id
- `tutorAPI.criar(dados)` - POST /tutores
- `tutorAPI.atualizar(id, dados)` - PUT /tutores/:id
- `tutorAPI.excluir(id)` - DELETE /tutores/:id

### Usuários (Admin)
- `usuarioAPI.listarTodos(pagina, limite)` - GET /usuarios?pagina=X&limite=Y
- `usuarioAPI.criar(dados)` - POST /usuarios
- `usuarioAPI.atualizar(id, dados)` - PUT /usuarios/:id
- `usuarioAPI.excluir(id)` - DELETE /usuarios/:id

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto frontend com:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Se estiver usando um servidor backend em outro endereço, ajuste a URL conforme necessário.

## Autenticação

O sistema utiliza tokens JWT armazenados no localStorage:
- **Token:** Armazenado em `localStorage.getItem('token')`
- **Dados do Usuário:** Armazenados em `localStorage.getItem('usuario')`

Todos os requests incluem automaticamente o token no header `Authorization: Bearer <token>`.

## Tratamento de Erros

Cada página possui:
- Exibição de mensagens de erro em cards vermelhos
- Tratamento de exceções nas requisições
- Feedback visual durante o carregamento

## Estilos

As páginas utilizam:
- **Tailwind CSS** para estilização
- **Cores:** Gradientes azuis/índigo para backgrounds
- **Componentes:** Cards, formulários, tabelas e botões responsivos
- **Responsividade:** Grid layouts que se adaptam a diferentes tamanhos de tela

## Fluxo de Autenticação

1. Usuário acessa `/` (página inicial)
2. Se não estiver autenticado, é redirecionado para `/login`
3. Após login bem-sucedido, token e dados do usuário são armazenados
4. Usuário é redirecionado para a página inicial
5. Ao fazer logout, token e dados são removidos do localStorage

## Próximos Passos

Para completar a integração:

1. Certifique-se de que o backend está rodando em `http://localhost:3001`
2. Configure o arquivo `.env.local` com a URL correta da API
3. Execute `npm install` para instalar dependências (se necessário)
4. Execute `npm run dev` para iniciar o servidor de desenvolvimento
5. Acesse `http://localhost:3000` no navegador
