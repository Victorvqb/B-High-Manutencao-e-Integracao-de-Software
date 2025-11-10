# Plano de Estratégia Adaptativa - B-High Education

## 1. Introdução

Este documento delineia a estratégia adotada para a manutenção adaptativa do sistema B-High Education, um Ambiente Virtual de Aprendizagem (AVA). O plano foi elaborado para endereçar mudanças no ambiente de negócio e regulatório, garantindo a evolução e a conformidade da plataforma a longo prazo. As estratégias foram divididas em três frentes principais, conforme a ata da reunião do projeto.

---

## 2. Estratégia 1: Integração com API Externa (YouTube)

* **Objetivo Estratégico**: Enriquecer a experiência de aprendizagem e aumentar o engajamento dos utilizadores através da incorporação de conteúdo multimídia dinâmico e relevante, sem a necessidade de hospedar ficheiros de vídeo pesados no servidor da aplicação.

* **Plano de Ação**:
    * **Backend (Django)**: A estratégia central foi criar um *endpoint* intermediário (`/api/youtube-videos/`) que atua como um *proxy* seguro. Esta abordagem protege a chave da API do YouTube, mantendo-a exclusivamente no servidor e nunca a expondo ao cliente. Para otimizar o desempenho e respeitar os limites de quota da API do YouTube, foi implementada uma camada de cache que armazena os resultados das buscas por uma hora, reduzindo drasticamente o número de chamadas externas.
    * **Frontend (React)**: A interface consumirá apenas o *endpoint* interno seguro. Foi planeada a criação de uma nova página dedicada, acessível a todos os perfis de utilizador (alunos e professores) através do menu principal, garantindo que o novo conteúdo seja facilmente descoberto. O design da apresentação dos vídeos seguirá a identidade visual já existente na aplicação, utilizando componentes reutilizáveis.

---

## 3. Estratégia 2: Conformidade com a LGPD (Consentimento de Termos)

* **Objetivo Estratégico**: Alinhar a plataforma com a Lei Geral de Proteção de Dados (LGPD), garantindo a transparência na coleta de dados e obtendo o consentimento explícito e auditável dos utilizadores no momento do registo.

* **Plano de Ação**:
    * **Backend (Django)**: A estratégia de conformidade exigiu uma alteração no modelo de dados. Foi adicionado um campo `consent_timestamp` ao modelo `Usuario` para registar a data e a hora exatas do consentimento, servindo como prova auditável. A lógica de criação de utilizadores no `UsuarioSerializer` foi modificada para preencher este campo automaticamente no momento em que um novo registo é bem-sucedido.
    * **Frontend (React)**: Na página de registo (`Cadastro.jsx`), a estratégia foi adicionar checkboxes de consentimento não pré-marcados. O envio do formulário foi bloqueado até que o utilizador aceite explicitamente os "Termos de Uso" e a "Política de Privacidade". Foram criadas páginas estáticas para estes documentos legais, acessíveis através de links que abrem em novas abas para não interromper o fluxo de registo.

---

## 4. Estratégia 3: Conformidade com a LGPD (Direito à Exclusão)

* **Objetivo Estratégico**: Garantir o direito do utilizador de apagar os seus dados ("direito de ser esquecido"), conforme estipulado pela LGPD, de forma segura, permanente e irreversível.

* **Plano de Ação**:
    * **Backend (Django)**: A estratégia foi criar um *endpoint* dedicado e seguro (`/api/user/delete-account/`) que executa a exclusão permanente (`.delete()`) do registo do utilizador. Para prevenir ações acidentais ou maliciosas, o *endpoint* foi protegido para exigir autenticação via token JWT e a confirmação da senha atual do utilizador. Conforme decidido em reunião, um log anonimizado da operação (contendo apenas o ID do utilizador e a data) é gerado no console do servidor para fins de conformidade.
    * **Frontend (React)**: Foi executada a criação de uma nova página de "Configurações", acessível pelo menu principal. Dentro desta página, uma "Zona de Perigo" claramente identificada conteria o botão de exclusão. O fluxo de utilizador foi desenhado para ser seguro, exigindo uma dupla confirmação: um clique no botão, seguido de um `prompt` para inserir a senha. Após a exclusão bem-sucedida, a aplicação limpa todos os dados de sessão do navegador e redireciona o utilizador para a página de login.