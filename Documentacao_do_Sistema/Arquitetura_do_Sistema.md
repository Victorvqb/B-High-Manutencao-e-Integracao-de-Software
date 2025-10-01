# Documento de Arquitetura - B-High Education

## 1. Visão Geral

O B-High Education utiliza uma arquitetura de aplicação web moderna, baseada no padrão cliente-servidor, com uma clara separação de responsabilidades entre o backend e o frontend.

* **Backend (Servidor):** Uma API RESTful que lida com toda a lógica de negócio, acesso ao banco de dados e autenticação.
* **Frontend (Cliente):** Uma Single Page Application (SPA) que consome a API do backend e é responsável por toda a interface e experiência do usuário.

Essa abordagem desacoplada oferece flexibilidade, escalabilidade e permite que as equipas de backend e frontend trabalhem de forma independente.

### Fluxo de Dados Básico
[Navegador do Usuário] <--> [Frontend - React App] <--> [API - Backend Django] <--> [Banco de Dados]


---

## 2. Arquitetura do Backend

O backend é construído sobre o ecossistema Python/Django, conhecido pela sua robustez e segurança.

* **Framework Principal:** `Django`, utilizado para a estrutura geral do projeto, ORM (Object-Relational Mapping) e interface de administração.
* **API:** `Django Rest Framework (DRF)`, utilizado para construir a API RESTful de forma rápida e seguindo as melhores práticas.
* **Autenticação:** `Simple JWT`, que implementa a autenticação baseada em tokens JWT (JSON Web Tokens). Após o login, o cliente recebe um `access token` que é enviado em cada requisição para validar a identidade do usuário.
* **Banco de Dados:** `SQLite` por padrão para o ambiente de desenvolvimento, facilitando a configuração inicial. A arquitetura permite a troca para um banco de dados mais robusto (como `PostgreSQL`) em produção através de variáveis de ambiente.
* **Aplicação Principal (`usuarios`):** Toda a lógica de negócio central (modelos, views, serializers) está encapsulada na aplicação Django chamada `usuarios`.

---

## 3. Arquitetura do Frontend

O frontend é uma SPA moderna construída com `React`, focada em reatividade e experiência do usuário.

* **Framework Principal:** `React`, utilizando a ferramenta `Create React App` como base.
* **Roteamento:** `React Router DOM`, utilizado para gerenciar a navegação entre as diferentes "páginas" da aplicação (ex: `/login`, `/home`, `/aulas`) sem a necessidade de recarregar a página inteira.
* **Comunicação com a API:** `Axios`, utilizado para fazer as requisições HTTP para a API do backend. Foi configurada uma instância (`axiosInstance`) que intercepta todas as requisições para adicionar automaticamente o token de autenticação JWT no cabeçalho.
* **Estilização:** `TailwindCSS`, um framework de CSS "utility-first" que permite a construção de interfaces complexas e consistentes diretamente no HTML/JSX.
* **Estrutura de Componentes:** O código é organizado em `pages` (componentes de página inteira) e `components` (componentes reutilizáveis, como a `Sidebar` e `Modais`).
