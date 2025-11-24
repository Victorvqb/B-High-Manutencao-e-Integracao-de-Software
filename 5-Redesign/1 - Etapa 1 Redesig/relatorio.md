# Relatório: Etapa 1 - Redesign e Avaliação Heurística

### TP4 - Manutenção e Integração de Software

---

**Equipa:**
* Bruna Miranda
* Carlos Breno
* Julia Farias
* Victor Queiroz
* Welligton Salmo

---

## 1. Avaliação Heurística (Diagnóstico)

### Justificativa
A primeira etapa do trabalho consistiu em uma avaliação heurística do sistema B-High Education. Esta análise teve como base as **10 Heurísticas de Usabilidade de Nielsen**.

### Problema
O sistema, embora funcional, apresentava inconsistências de design que prejudicavam a usabilidade e violavam princípios de interação, como **Consistência (Heurística 4)** e **Visibilidade do Status (Heurística 1)**.

---

## 2. Implementação do Redesign

Com base na avaliação, foram implementadas 4 correções de redesign, com o objetivo de demonstrar evidências claras das melhorias de usabilidade.

### 2.1. Redesign 1: Consistência de Ações

* **Problema (Heurística 4: Consistência e Padrões):** Ações idênticas ("Editar", "Apagar") eram apresentadas de formas diferentes em telas diferentes. A tela `AtividadesProfessor.jsx` usava botões coloridos com ícones, enquanto `ForumProfessor.jsx` usava links de texto simples.
* **Solução:** Os botões de ação no módulo do Fórum (`ForumProfessor.jsx`) foram padronizados para usar o mesmo design (cor, ícone, texto) da tela de Atividades, criando um padrão de UI consistente.

**Evidências (Antes e Depois):**

| Antes (FórumProfessor.jsx) | Depois (FórumProfessor.jsx) |
| :---: | :---: |
| [INSERIR PRINT DA TELA DO FÓRUM "ANTES"] | [INSERIR PRINT DA TELA DO FÓRUM "DEPOIS"] |

---

### 2.2. Redesign 2: Consistência de Navegação

* **Problema (Heurística 4: Consistência e Padrões):** A tela `AdminDashboard.jsx` quebrava o padrão de navegação global. O sistema utiliza uma `Sidebar` vertical, mas esta página introduzia abas horizontais que duplicavam links já existentes.
* **Solução:** As abas redundantes foram removidas do `AdminDashboard.jsx`. A página foi simplificada para focar apenas nas funções exclusivas do Admin ("Solicitações", "Gerenciar Usuários"), respeitando a `Sidebar` global.

**Evidências (Antes e Depois):**

| Antes (AdminDashboard.jsx) | Depois (AdminDashboard.jsx) |
| :---: | :---: |
| [INSERIR PRINT `image_ee1387.png`] | [INSERIR PRINT DA TELA DO ADMIN "DEPOIS"] |

---

### 2.3. Redesign 3: Feedback de Estado Vazio

* **Problema (Heurística 1: Visibilidade do Status):** A tela `Professor.jsx` ("Minhas Aulas"), quando vazia, ficava em branco. O usuário não recebia feedback se o sistema estava carregando, quebrado, ou se simplesmente não havia aulas cadastradas.
* **Solução:** Foi implementado um "estado vazio" claro, com um ícone e uma mensagem (`Nenhuma aula publicada...`) que informa o status ao usuário e o direciona para a ação correta.

**Evidências (Antes e Depois):**

| Antes (Professor.jsx) | Depois (Professor.jsx) |
| :---: | :---: |
| [INSERIR PRINT `image_ee1438.png`] | [INSERIR PRINT `image_0771c9.png`] |

---

### 2.4. Redesign 4: Hierarquia de Ações no Login

* **Problema (Heurística 8: Design Estético e Minimalista):** Na tela de Login, a ação primária ("Entrar") e a secundária ("Cadastrar-se") eram botões com peso visual semelhante, competindo pela atenção do usuário.
* **Solução:** A ação secundária "Cadastrar-se" foi alterada de um botão sólido para um link de texto (`text-green-600 hover:underline`), estabelecendo uma hierarquia visual clara e dando foco total à ação principal.

**Evidências (Antes e Depois):**

| Antes (Login.jsx) | Depois (Login.jsx) |
| :---: | :---: |
| [INSERIR PRINT `image_ee1345.png`] | [INSERIR PRINT DA TELA DE LOGIN "DEPOIS"] |

---

## 3. Organização e Versionamento (Git)

### Implementação
Foi adotado um fluxo de trabalho baseado em Git Flow simplificado:
1.  **`develop`:** Criada como a branch principal de desenvolvimento.
2.  **`feature/...`:** Branches individuais para cada tarefa (ex: `feature/redesign-consistencia-botoes`, `feature/redesign-navegacao-admin`).
3.  **Commits:** Cada correção foi registrada com uma mensagem clara, ligando-a ao Redesign e à Heurística.

### Evidência

| Histórico de Commits e Branches |
| :---: |
| [INSERIR PRINT DO HISTÓRICO DE BRANCHES/COMMITS DO GITHUB] |

---

**Obrigado!**