# B-High Education - TP2: Manutenção Adaptativa

Este repositório contém a entrega do **Trabalho Prático 2 (TP2)** da disciplina de **Manutenção e Integração de Software**, do curso de Engenharia de Software da Universidade Federal do Amazonas (UFAM).
Docente: Prof. Dr. Andrey Rodrigues


O projeto consiste na aplicação de técnicas de **manutenção adaptativa** sobre uma aplicação web existente, um Ambiente Virtual de Aprendizagem (AVA) chamado B-High Education.

---

## 🚀 Equipa de Desenvolvimento

* Bruna Miranda
* Carlos Breno
* Julia Farias
* Victor Queiroz
* Welligton Salmo

---

## 📂 Estrutura do Repositório

O projeto está organizado na seguinte estrutura de pastas, conforme as diretrizes do trabalho:

-   `./manutencao-adaptativa/`: Contém toda a documentação relacionada ao TP2, incluindo este README, o relatório final, o plano de estratégia e as evidências.
-   `./src/`: Contém o código-fonte completo da aplicação, dividido em:
    -   `./src/backend/`: A API RESTful desenvolvida em Django.
    -   `./src/frontend/`: A aplicação cliente (Single Page Application) desenvolvida em React.

---

## 🛠️ Tecnologias Utilizadas

* **Backend**: Python, Django, Django Rest Framework, Simple JWT, SQLite.
* **Frontend**: React, React Router, Axios, TailwindCSS.
* **Ferramentas**: Git, GitHub, VS Code.

---

## 📋 Resumo das Adaptações Realizadas

Foram implementadas três principais manutenções adaptativas, baseadas na ata de reunião da equipa e nos requisitos do trabalho:

1.  **Integração com API Externa (YouTube)**: Adicionada uma funcionalidade para buscar e exibir vídeos do YouTube, enriquecendo o conteúdo da plataforma.
2.  **Conformidade com a LGPD (Consentimento)**: Implementado um mecanismo de consentimento explícito na página de registo, com checkboxes para Termos de Uso e Política de Privacidade.
3.  **Conformidade com a LGPD (Direito à Exclusão)**: Adicionada a funcionalidade que permite ao utilizador apagar permanentemente a sua conta e dados pessoais.

---

## ⚙️ Como Executar o Projeto Localmente

Para executar a aplicação, é necessário iniciar o backend e o frontend em terminais separados.

### Backend (Django)

1.  **Navegue até a pasta do backend**:
    ```bash
    cd src/backend
    ```
2.  **Crie e ative um ambiente virtual**:
    ```bash
    python -m venv venv
    venv\Scripts\activate
    ```
3.  **Instale as dependências**:
    ```bash
    pip install -r requirements.txt
    ```
4.  **Crie o ficheiro `.env`** na pasta `src/backend` com o conteúdo necessário (chave secreta e API key do YouTube).

5.  **Aplique as migrações e crie o superutilizador**:
    ```bash
    python manage.py migrate
    python manage.py create_admin
    ```
6.  **Inicie o servidor**:
    ```bash
    python manage.py runserver
    ```
    *O backend estará a ser executado em `http://127.0.0.1:8000`.*

### Frontend (React)

1.  **Abra um novo terminal e navegue até a pasta do frontend**:
    ```bash
    cd src/frontend
    ```
2.  **Instale as dependências**:
    ```bash
    npm install
    ```
3.  **Crie o ficheiro `.env`** na pasta `src/frontend` e adicione a seguinte linha:
    ```env
    REACT_APP_API_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)
    ```
4.  **Inicie o servidor de desenvolvimento**:
    ```bash
    npm start
    ```
    *A aplicação abrirá no seu navegador em `http://localhost:3000`.*

---

## 📄 Documentação do TP2

Toda a documentação detalhada do trabalho, incluindo o relatório final, o plano de estratégia, o changelog e as evidências, pode ser encontrada na pasta `manutencao-adaptativa`.

-   **[RELATORIO.md](./RELATORIO.md)**: Síntese completa de todas as adaptações realizadas.
-   **[plano-estrategia.md](./plano-estrategia.md)**: Descrição da estratégia adotada para cada tarefa.
-   **[CHANGELOG.md](./CHANGELOG.md)**: Histórico detalhado das alterações feitas no sistema.
-   **[/evidencias/prints/](./evidencias/prints/)**: Screenshots que evidenciam o funcionamento antes e depois das modificações.