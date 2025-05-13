# 🐾 API de Usuários e Pets

Esta API permite o cadastro e autenticação de usuários, gerenciamento de pets e o processo de adoção. Abaixo está a documentação completa para utilizar todos os endpoints, incluindo exemplos de uso via Postman.

---

## 🚀 Instalação e Execução

### Pré-requisitos

* Node.js
* MongoDB (local ou Atlas)

### Passos para rodar localmente:

```bash
npm install
npm start
```

Crie um arquivo `.env` na raiz com o seguinte conteúdo:

```env
SECRET=sua_chave_secreta
MONGO_URI=sua_string_de_conexao_mongodb
```

---

## 🔐 Autenticação

A autenticação é feita via JWT. Após o login, você receberá um token que deve ser usado nos headers para rotas protegidas.

**Header necessário:**

```
Authorization: Bearer SEU_TOKEN_JWT
```

---

## 👤 Usuário

### 📍 `POST /usuario/register`

**Cadastrar novo usuário**

```json
{
  "name": "Maria",
  "email": "maria@email.com",
  "password": "123456",
  "phone": "11999999999"
}
```

**Resposta:** 201 Created

### 📍 `POST /usuario/login`

**Autenticar usuário e obter token**

```json
{
  "email": "maria@email.com",
  "password": "123456"
}
```

**Resposta:** 200 OK com token JWT

### 📍 `GET /usuario`

**Listar todos os usuários**

### 📍 `GET /usuario/:id`

**Buscar usuário por ID**

### 📍 `PATCH /usuario/:id`

**Atualizar usuário**

```json
{
  "name": "Maria Silva"
}
```

### 📍 `DELETE /usuario/:id`

**Deletar usuário por ID**

---

## 🐶 Pets

### 📍 `POST /pet/register` *(com token)*

**Cadastrar pet**

```json
{
  "name": "Bob",
  "age": 3,
  "weight": 10,
  "color": "Marrom"
}
```

### 📍 `GET /pet/`

**Listar todos os pets disponíveis**

### 📍 `GET /pet/mypets` *(com token)*

**Listar pets do usuário logado**

### 📍 `GET /pet/:id`

**Buscar pet por ID**

### 📍 `PATCH /pet/:id` *(com token)*

**Atualizar pet**

```json
{
  "weight": 12
}
```

### 📍 `DELETE /pet/:id` *(com token)*

**Remover pet**

### 📍 `PATCH /pet/schedule/:id` *(com token)*

**Agendar visita para adoção**

### 📍 `PATCH /pet/adopt/:id` *(com token)*

**Concluir adoção do pet**

---

## 📬 Exemplos de Uso no Postman

### ➕ Cadastro de Usuário

* Método: POST
* URL: `http://localhost:3000/usuario/register`
* Body: JSON com nome, email, senha e telefone

### 🔐 Login

* Método: POST
* URL: `http://localhost:3000/usuario/login`
* Body: JSON com email e senha
* **Copie o token da resposta para usar nas próximas requisições.**

### 🐶 Cadastro de Pet (com Token)

* Método: POST
* URL: `http://localhost:3000/pet/`
* Headers: Authorization: Bearer `TOKEN`
* Body: JSON com dados do pet

### 📆 Agendar Visita

* Método: PATCH
* URL: `http://localhost:3000/pet/schedule/{id}`
* Headers: Authorization: Bearer `TOKEN`

### 🏡 Concluir Adoção

* Método: PATCH
* URL: `http://localhost:3000/pet/adopt/{id}`
* Headers: Authorization: Bearer `TOKEN`

---

## ✅ Considerações Finais

* Use ferramentas como Postman para testar.
* Sempre forneça o token JWT nas rotas protegidas.
* O `userId` é extraído automaticamente via token nas rotas seguras.

Se precisar de uma `collection` pronta para importar no Postman, posso gerar também!
