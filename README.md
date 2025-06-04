
# 🚀 Desafio Técnico - DFcom Sistemas

API RESTful desenvolvida com Node.js, Express e MongoDB para gerenciamento de produtos e suas avaliações. O projeto segue o modelo MVC (Model-View-Controller) para garantir uma estrutura organizada e escalável.

## 📋 Pré-requisitos

- Node.js (v18)
- MongoDB (local)
- Docker (para ambiente containerizado)

## 🛠️ Tecnologias Utilizadas

- **Backend:**

  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - Docker

- **Frontend:**
  - React.js
  - React Router DOM
  - Tailwind CSS
  - Axios
  - Vite

## 🚀 Como Executar?

### 🐳 Executando com Docker

O modo mais fácil de executar a aplicação completa é usando Docker Compose, que irá configurar tanto o backend quanto o frontend em um único comando:

```bash
docker-compose up --build
```
## O frontend estará disponível em: http://localhost ou http://localhost:80
## O backend estará rodando em: http://localhost:5000

## 📚 Documentação da API

### Produtos

- `GET /api/products` - Lista todos os produtos
- `GET /api/products/:id` - Obtém um produto específico
- `POST /api/products` - Cria um novo produto
- `PUT /api/products/:id` - Atualiza um produto
- `DELETE /api/products/:id` - Remove um produto
- `GET /api/products/:id/average-rating` - Obtém a média de avaliações de um produto

### Avaliações

- `GET /api/reviews` - Lista todas as avaliações
- `GET /api/reviews/product/:productId` - Lista avaliações de um produto específico
- `POST /api/reviews` - Cria uma nova avaliação
- `PUT /api/reviews/:id` - Atualiza uma avaliação
- `DELETE /api/reviews/:id` - Remove uma avaliação

## 🏗️ Modelo MVC

O projeto segue o modelo MVC (Model-View-Controller) para garantir uma estrutura organizada e escalável:

- **Model**: Representa os dados e a lógica de negócios. No backend, os modelos são definidos usando Mongoose para interagir com o MongoDB.
- **View**: Representa a interface do usuário. No frontend, as views são criadas usando React.js e Tailwind CSS.
- **Controller**: Gerencia as requisições e respostas. No backend, os controladores são implementados nas rotas da API para processar as solicitações e retornar as respostas apropriadas.

## 📝 Estrutura do Projeto

```
.
├── src/ # Backend
│   ├── models/ # Modelos do MongoDB
│   ├── routes/ # Rotas da API
│   ├── server.js # Arquivo principal
│   └── tests/ # Testes
├── frontend/ # Frontend React
│   ├── src/
│   │   ├── components/ # Componentes React
│   │   ├── services/ # Serviços de API
│   │   ├── App.jsx # Componente principal
│   │   └── main.jsx # Ponto de entrada
│   ├── index.html
│   └── package.json
├── .env # Variáveis de ambiente
├── .gitignore
├── package.json
└── README.md
```
