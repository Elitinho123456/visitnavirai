# Portal de Turismo de Naviraí

Aplicação web institucional para promoção turística do Município de Naviraí-MS, com área pública para visitantes e painel administrativo para gestão de conteúdo.

## 1. Finalidade do Projeto

Este sistema foi desenvolvido para:

- Divulgar informações turísticas oficiais do município.
- Publicar e organizar meios de hospedagem.
- Publicar calendário e destaques de eventos locais.
- Disponibilizar uma área administrativa com autenticação e controle de permissões por perfil.

## 2. Escopo Funcional

### 2.1 Portal público

- Página inicial com destaques institucionais, carrossel de imagens e widgets.
- Catálogo de acomodações (hotéis, pousadas, flats e área de camping).
- Página de detalhe de acomodação com informações completas.
- Página de história do município.
- Página de oportunidades e conteúdo para investidores.
- Componente de clima com integração à API Open-Meteo.
- Componente de eventos com calendário mensal.

### 2.2 Painel administrativo

- Autenticação (login e registro).
- Gestão de hotéis/acomodações (criar, listar, editar e excluir).
- Gestão de eventos (criar, listar e excluir).
- Gestão de usuários e atribuição de cargos.
- Gestão de cargos customizados e permissões por módulo.
- Upload de imagem única e múltipla para mídias do portal.
- Upload e atualização de foto de perfil do usuário autenticado.

## 3. Arquitetura Técnica

Projeto em monorepositório com duas camadas:

- Frontend SPA em React + Vite + TypeScript.
- Backend API REST em Express + TypeScript.

Persistência:

- MongoDB com Mongoose.

Autorização:

- JWT com middleware de validação.
- Perfis de sistema: admin e user.
- Perfis customizados com permissões por módulo e ação (read, create, edit, delete).

## 4. Principais Tecnologias

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- Express 5
- Mongoose
- JWT
- Multer
- bcrypt

## 5. Estrutura de Pastas (resumo)

```text
database/
	auth/                # login e registro
	db/
		models/            # modelos Mongoose (User, Role, Hotel, Event)
	middlewares/         # autenticação e autorização
	routes/              # rotas REST
	utils/               # utilitários de arquivos
	server.ts            # inicialização da API

src/
	components/
		admin/             # painel administrativo
		layout/            # layout do portal
		middleware/        # guards de rota no frontend
		pages/             # páginas públicas e login
		shared/            # componentes compartilhados
	config/              # rotas, constantes e URL base da API
	lib/                 # i18n
	locales/             # traduções (pt, en, es)
```

## 6. Modelagem de Dados (MongoDB)

### 6.1 User

- name
- email (único)
- password (hash)
- role (admin, user ou cargo customizado)
- profileImage
- date

### 6.2 Role

- name (único)
- isSystem
- permissions: mapa por módulo com ações read/create/edit/delete

### 6.3 Hotel

- name
- image
- category (Hotel, Pousada, Flat, Área de Camping)
- features
- highlight, highlightExpiration
- latitude, longitude
- socials
- blocos descritivos (about, accommodation, policies, amenities, gallery, cta)

### 6.4 Event

- name
- date
- startTime
- endTime
- image
- description

## 7. Variáveis de Ambiente

Crie um arquivo .env na raiz do projeto.

```env
DB=mongodb+srv://usuario:senha@cluster/database
JWT_SECRET=sua_chave_jwt

VITE_API_PROTOCOL=http
VITE_API_HOST=auto
VITE_API_PORT=3000

API_HOST=0.0.0.0
```

Descrição:

- DB: string de conexão do MongoDB.
- JWT_SECRET: segredo para assinatura e validação de tokens.
- VITE_API_PROTOCOL: protocolo usado pelo frontend para montar a URL da API.
- VITE_API_HOST: host da API no frontend (use auto para detectar hostname em runtime).
- VITE_API_PORT: porta da API (backend e frontend utilizam este valor).
- API_HOST: host de bind do servidor Express.

## 8. Instalação

Pré-requisitos:

- Node.js 23 ou superior
- npm 11 ou superior
- MongoDB acessível pela string DB

Instalar dependências:

```bash
npm install
```

## 9. Execução em Desenvolvimento

Inicie backend e frontend em terminais separados.

Terminal 1 (API):

```bash
npm run server
```

Terminal 2 (Frontend):

```bash
npm run dev
```

Endereços padrão:

- Frontend: http://localhost:5173
- API: http://localhost:3000

## 10. Build e Publicação

Gerar build de produção do frontend:

```bash
npm run build
```

Pré-visualizar build local:

```bash
npm run preview
```

## 11. Endpoints Principais

### 11.1 Autenticação

- POST /auth/login
- POST /auth/register

### 11.2 Usuários

- GET /api/users
- GET /api/users/:id
- PUT /api/users/:id/role
- PUT /api/users/:id/profile-image

### 11.3 Cargos e permissões

- GET /api/roles
- POST /api/roles
- POST /api/roles/check
- PUT /api/roles/:id
- DELETE /api/roles/:id

### 11.4 Hospedagens

- GET /api/hotels
- GET /api/hotels/:id
- POST /api/hotels
- PUT /api/hotels/:id
- DELETE /api/hotels/:id

### 11.5 Eventos

- GET /api/events
- POST /api/events
- DELETE /api/events/:id

### 11.6 Dashboard

- GET /api/dashboard/stats

### 11.7 Upload de imagens

- POST /api/imgs/upload
- POST /api/imgs/upload-multiple

## 12. Armazenamento de Imagens

As imagens são gravadas em disco local na pasta:

```text
database/imgs/
```

A API expõe os arquivos por meio da rota estática:

```text
/imgs
```

A organização ocorre por categoria e nome sanitizado do registro.

## 13. Controle de Acesso

Regras centrais de segurança implementadas:

- Rotas protegidas por token Bearer.
- Perfis admin com acesso ampliado.
- Perfis customizados com permissões por módulo e ação.
- Restrições específicas no painel para áreas de usuários e cargos.

Observação operacional:

- O cadastro via registro público cria contas com role user.

## 14. Internacionalização

O frontend possui base i18n com arquivos de tradução em:

- src/locales/pt.json
- src/locales/en.json
- src/locales/es.json

Idioma padrão (fallback):

- pt

## 15. Observações para Ambiente de Produção

- Definir JWT_SECRET forte e exclusivo por ambiente.
- Restringir CORS para domínios oficiais.
- Substituir armazenamento local de arquivos por estratégia persistente (quando necessário).
- Configurar HTTPS e política de backup de banco e mídias.
- Adotar logs centralizados e monitoramento de disponibilidade.

## 16. Situação Atual e Evolução Recomendada

Estado atual identificado no repositório:

- Projeto funcional para operação com conteúdo turístico e gestão administrativa.
- Não há suíte de testes automatizados configurada no package.json.

Evoluções Futuras:

- Implementar testes automatizados (unitários e integração).
- Adicionar validação de dados de entrada com esquema formal (ex.: zod/joi).
- Revisar nomenclatura da rota de upload para endpoint semântico em produção.

## 17. Licença

Consulte o arquivo LICENSE para os termos de uso do projeto.
