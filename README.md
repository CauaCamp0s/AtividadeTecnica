# 🚀 Desafio Técnico - DFcom Sistemas

API RESTful desenvolvida com Node.js, Express e MongoDB para gerenciamento de produtos e suas avaliações.

## 📋 Pré-requisitos

- Node.js (v14 ou superior)
- MongoDB (local ou Atlas)
- Docker (opcional, para ambiente containerizado)

## 🛠️ Tecnologias Utilizadas

- **Backend:**

  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - Docker
  - Jest (para testes)

- **Frontend:**

  - React.js
  - React Router DOM
  - Tailwind CSS
  - Axios
  - Vite

## 🚀 Como Executar?

## 🐳 Executando com Docker

O modo mais fácil de executar a aplicação completa é usando Docker Compose, que irá configurar tanto o backend quanto o frontend em um único comando:

```bash
docker-compose up --build
```

## 📚 Documentação da API

#### Produtos

- `GET /api/products` - Lista todos os produtos
- `GET /api/products/:id` - Obtém um produto específico
- `POST /api/products` - Cria um novo produto
- `PUT /api/products/:id` - Atualiza um produto
- `DELETE /api/products/:id` - Remove um produto
- `GET /api/products/:id/average-rating` - Obtém a média de avaliações de um produto

#### Avaliações

- `GET /api/reviews` - Lista todas as avaliações
- `GET /api/reviews/product/:productId` - Lista avaliações de um produto específico
- `POST /api/reviews` - Cria uma nova avaliação
- `PUT /api/reviews/:id` - Atualiza uma avaliação
- `DELETE /api/reviews/:id` - Remove uma avaliação

## 📝 Estrutura do Projeto

```

.
├── src/ # Backend
│ ├── models/ # Modelos do MongoDB
│ ├── routes/ # Rotas da API
│ ├── server.js # Arquivo principal
│ └── tests/ # Testes
├── frontend/ # Frontend React
│ ├── src/
│ │ ├── components/ # Componentes React
│ │ ├── services/ # Serviços de API
│ │ ├── App.jsx # Componente principal
│ │ └── main.jsx # Ponto de entrada
│ ├── index.html
│ └── package.json
├── .env # Variáveis de ambiente
├── .gitignore
├── package.json
└── README.md

```

```

```
