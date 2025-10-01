# Documentação da API - B-High Education

Esta é a documentação para os principais endpoints da API do B-High Education.

**URL Base da API:** `/api/`

---

## Autenticação

### `POST /api/token/`
* **Descrição:** Autentica um utilizador com `username` e `password` e retorna os tokens de acesso.
* **Permissões:** Aberto (`AllowAny`).
* **Corpo da Requisição:**
    ```json
    {
        "username": "seu_usuario",
        "password": "sua_senha"
    }
    ```
* **Resposta de Sucesso (200 OK):**
    ```json
    {
        "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

---

## Utilizadores

### `POST /api/usuarios/`
* **Descrição:** Cria um novo utilizador (aluno).
* **Permissões:** Aberto (`AllowAny`).
* **Corpo da Requisição:**
    ```json
    {
        "first_name": "Nome",
        "last_name": "Sobrenome",
        "email": "email@exemplo.com",
        "username": "nome_de_usuario",
        "password": "senha_forte"
    }
    ```

### `POST /api/solicitacoes-professor/`
* **Descrição:** Envia uma solicitação para registo de um novo professor. Requer aprovação do administrador.
* **Permissões:** Aberto (`AllowAny`).

### `DELETE /api/user/delete-account/`
* **Descrição:** Apaga permanentemente a conta do utilizador autenticado. Requer a senha do utilizador no corpo da requisição para confirmação.
* **Permissões:** Requer Autenticação (`IsAuthenticated`).
* **Corpo da Requisição:**
    ```json
    {
        "password": "sua_senha_atual"
    }
    ```

---

## Conteúdo & Aulas

### `GET /api/aulas/`
* **Descrição:** Lista as aulas criadas pelo professor autenticado.
* **Permissões:** Requer Autenticação (`IsAuthenticated`).

### `POST /api/aulas/`
* **Descrição:** Cria uma nova aula. Requer um corpo `multipart/form-data` se um ficheiro for enviado.
* **Permissões:** Requer Autenticação de Professor (`IsStaff`).

### `GET /api/aulas-aluno/`
* **Descrição:** Lista as aulas disponíveis para o aluno autenticado.
* **Permissões:** Requer Autenticação (`IsAuthenticated`).

### `GET /api/youtube-videos/`
* **Descrição:** Retorna uma lista de vídeos recentes do canal do YouTube configurado. Os resultados são cacheados por 1 hora.
* **Permissões:** Aberto (`AllowAny`).

---

## Atividades Avaliativas

### `GET /api/quizzes/`
* **Descrição:** Lista todos os quizzes disponíveis.
* **Permissões:** Requer Autenticação (`IsAuthenticated`).

### `POST /api/quizzes/`
* **Descrição:** Cria um novo quiz.
* **Permissões:** Requer Autenticação de Professor/Admin (`IsStaff`).

### `POST /api/quizzes/<id>/submit/`
* **Descrição:** Submete as respostas de um aluno para um quiz específico.
* **Permissões:** Requer Autenticação.

### `GET /api/atividades-aluno/`
* **Descrição:** Lista as atividades disponíveis para o aluno autenticado.
* **Permissões:** Requer Autenticação.

---

## Fórum

### `GET /api/forum/`
* **Descrição:** Lista todos os comentários principais do fórum.
* **Permissões:** Requer Autenticação.

### `POST /api/forum/`
* **Descrição:** Publica um novo comentário no fórum.
* **Permissões:** Requer Autenticação.
