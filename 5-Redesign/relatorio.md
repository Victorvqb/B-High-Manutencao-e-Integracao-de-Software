# Relatório Final: Redesign e Manutenção Evolutiva

### TP4 - Manutenção e Integração de Software

---

**Equipa:**
* Bruna Miranda
* Carlos Breno
* Julia Farias
* Victor Queiroz
* Welligton Salmo

---

## Roteiro da Apresentação

1.  Avaliação Heurística (Diagnóstico - Etapa 1)
2.  Implementação do Redesign (Etapa 1)
3.  Manutenção Evolutiva: Novas Funcionalidades (Etapa 2)
4.  Manutenção Evolutiva: Acessibilidade (Etapa 2)
5.  Organização e Versionamento (Git)
6.  Conclusão

---

## 1. Avaliação Heurística (Diagnóstico)

### Justificativa
A primeira etapa do trabalho consistiu em uma avaliação heurística do sistema B-High Education. Esta análise teve como base as **10 Heurísticas de Usabilidade de Nielsen**.

### Problema
O sistema, embora funcional, apresentava inconsistências de design que prejudicavam a usabilidade e violavam princípios de interação, como **Consistência (Heurística 4)** e **Visibilidade do Status (Heurística 1)**.

---

## 2. Implementação do Redesign (Etapa 1)

Com base na avaliação, foram implementadas 4 correções de redesign, com o objetivo de demonstrar evidências claras das melhorias de usabilidade.

### 2.1. Redesign 1: Consistência de Ações

* **Problema (Heurística 4: Consistência e Padrões):** Ações idênticas ("Editar", "Apagar") eram apresentadas de formas diferentes em telas diferentes. A tela `AtividadesProfessor.jsx` usava botões coloridos com ícones, enquanto `ForumProfessor.jsx` usava links de texto simples.
* **Solução:** Os botões de ação no módulo do Fórum (`ForumProfessor.jsx`) foram padronizados para usar o mesmo design (cor, ícone, texto) da tela de Atividades, criando um padrão de UI consistente.

**Evidências (Antes e Depois):**

Antes (FórumProfessor.jsx)
![Antes (FórumProfessor.jsx)](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/94ceef8bc2e28a84485b94e3f0af00c5e0876240/5-Redesign/5-evidencias-antes/forum-turma-adm.png?raw=true)
Depois (FórumProfessor.jsx)
![Depois (FórumProfessor.jsx)](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/1203c09646d6888f94ad5e1ac24a7252e0dded6c/5-Redesign/1-%20botao-editar-excluir/Botao-Depois.png?raw=true)

---

### 2.2. Redesign 2: Consistência de Navegação

* **Problema (Heurística 4: Consistência e Padrões):** A tela `AdminDashboard.jsx` quebrava o padrão de navegação global. O sistema utiliza uma `Sidebar` vertical, mas esta página introduzia abas horizontais que duplicavam links já existentes.
* **Solução:** As abas redundantes foram removidas do `AdminDashboard.jsx`. A página foi simplificada para focar apenas nas funções exclusivas do Admin ("Solicitações", "Gerenciar Usuários"), respeitando a `Sidebar` global.

**Evidências (Antes e Depois):**

Antes (AdminDashboard.jsx)
![Antes (AdminDashboard.jsx)](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/1af01ceb9a69de97b903e95aff4cb7a28abb4ca1/5-Redesign/2%20-abas-adicionais/adm-dash-antes.png?raw=true)
Depois (AdminDashboard.jsx)
![Depois (AdminDashboard.jsx)](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/1af01ceb9a69de97b903e95aff4cb7a28abb4ca1/5-Redesign/2%20-abas-adicionais/adm-dash-depois.png?raw=true)

---

### 2.3. Redesign 3: Feedback de Estado Vazio

* **Problema (Heurística 1: Visibilidade do Status):** A tela `Professor.jsx` ("Minhas Aulas"), quando vazia, ficava em branco. O usuário não recebia feedback se o sistema estava carregando, quebrado, ou se simplesmente não havia aulas cadastradas.
* **Solução:** Foi implementado um "estado vazio" claro, com um ícone e uma mensagem (`Nenhuma aula publicada...`) que informa o status ao usuário e o direciona para a ação correta.

**Evidências (Antes e Depois):**

Antes (Professor.jsx)
![Antes (Professor.jsx)](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/1af01ceb9a69de97b903e95aff4cb7a28abb4ca1/5-Redesign/3-tela-sem-status/minhas-aulas-adm.png?raw=true)
Depois (Professor.jsx)
![Depois (Professor.jsx)](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/1af01ceb9a69de97b903e95aff4cb7a28abb4ca1/5-Redesign/3-tela-sem-status/minhas-aulas-adm-2-depois.png?raw=true)

---

### 2.4. Redesign 4: Hierarquia de Ações no Login

* **Problema (Heurística 8: Design Estético e Minimalista):** Na tela de Login, a ação primária ("Entrar") e a secundária ("Cadastrar-se") eram botões com peso visual semelhante, competindo pela atenção do usuário.
* **Solução:** A ação secundária "Cadastrar-se" foi alterada de um botão sólido para um link de texto (`text-green-600 hover:underline`), estabelecendo uma hierarquia visual clara e dando foco total à ação principal.

**Evidências (Antes e Depois):**

Antes (Login.jsx)
![Antes (Login.jsx)](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/c11cef0991fd2215ec980348fbf37c77400d16e2/5-Redesign/4-botao-semelhante/cadastro-antes.png?raw=true)
Depois (Login.jsx)
![Depois (Login.jsx)](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/e3a4fea328dec25099b527b19ad5d4a89e52f8cb/5-Redesign/4-botao-semelhante/cadastro-depois.png)

---

## 3. Manutenção Evolutiva: Novas Funcionalidades (Etapa 2)

Conforme planejado, duas novas funcionalidades relevantes foram implementadas para expandir o escopo do sistema.

### 3.1. Funcionalidade 1: Barra de Busca de Aulas

* **Justificativa:** Melhorar a eficiência de navegação (Heurística 7), permitindo que alunos e professores encontrem aulas específicas rapidamente sem precisar rolar listas extensas.
* **Implementação:** Foi adicionado um campo de input com ícone de busca nas telas `AulasAluno.jsx` e `Professor.jsx`. A filtragem é realizada em tempo real no frontend.

**Evidências (Antes e Depois):**

Antes (Sem busca)
![Antes (Sem busca)](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/e3a4fea328dec25099b527b19ad5d4a89e52f8cb/5-Redesign/7-Funcionalidade-busca/antes-busca-antes.png)
Depois (Com busca)
![Depois (Com busca)](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/e3a4fea328dec25099b527b19ad5d4a89e52f8cb/5-Redesign/7-Funcionalidade-busca/busca-depois.png)

---

### 3.2. Funcionalidade 2: Sistema de "Likes" no Fórum

* **Justificativa:** Ampliar o engajamento no fórum, permitindo feedback rápido e passivo entre usuários, além de ajudar professores a identificar dúvidas mais relevantes.
* **Implementação:** O backend foi atualizado para armazenar `likes` em comentários e respostas. O frontend recebeu ícones interativos de coração que atualizam em tempo real.

**Evidências (Antes e Depois):**

Antes (Fórum sem likes)
![Antes (Fórum sem likes)](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/e3a4fea328dec25099b527b19ad5d4a89e52f8cb/5-Redesign/8-Funcionalidade-curtida/funcionalidade-curtida-antes.png)
Depois (Fórum com likes)
![Depois (Fórum com likes)](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/e3a4fea328dec25099b527b19ad5d4a89e52f8cb/5-Redesign/8-Funcionalidade-curtida/funcionalidade-curtida-depois.png)

---

## 4. Manutenção Evolutiva: Acessibilidade (Etapa 2)

### 4.1. Melhoria: Adequação de Contraste (WCAG AA)

* **Problema:** A auditoria via **Lighthouse** identificou que as cores na tela de Login (ex: texto verde sobre fundo cinza escuro) tinham uma taxa de contraste insuficiente, dificultando a leitura para usuários com baixa visão.
* **Solução:** As classes de cor foram ajustadas. O botão "Entrar" foi escurecido (`bg-green-700`) e os links de texto foram clareados (`dark:text-blue-400`) no modo escuro para atender aos requisitos mínimos.

**Evidências (Relatórios Lighthouse):**

Antes (Falha de Contraste)
![Antes (Falha de Contraste)](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/e520daa9462f4305bf20d7d2ae8ae08137e9a230/5-Redesign/5-evidencias-antes/Funcionalidade-curtida-antes.png)
Depois (Aprovado)
![Depois (Aprovado)](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/e520daa9462f4305bf20d7d2ae8ae08137e9a230/5-Redesign/5-evidencias-antes/Funcionalidade-curtida-depois.png)

---

## 5. Organização e Versionamento (Git)

### Implementação
Foi adotado um fluxo de trabalho baseado em Git Flow simplificado:
1.  **`develop`:** Criada como a branch principal de desenvolvimento.
2.  **`feature/...`:** Branches individuais para cada tarefa (ex: `feature/redesign-consistencia-botoes`, `feature/forum-likes`).
3.  **Commits:** Cada correção foi registrada com uma mensagem clara, ligando-a ao Redesign ou à Etapa 2.

### Evidência

Histórico de Commits e Branches
![Histórico Git]([COLE_O_LINK_DO_PRINT_AQUI?raw=true](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/e520daa9462f4305bf20d7d2ae8ae08137e9a230/5-Redesign/6-versionamento/Branchs.png))

---

## 6. Conclusão

O TP4 foi concluído com sucesso. A **Etapa 1** corrigiu problemas críticos de usabilidade identificados na avaliação heurística. A **Etapa 2** expandiu o sistema com funcionalidades de Busca e Likes, além de corrigir falhas reais de acessibilidade (contraste). O produto final é mais consistente, eficiente e inclusivo.
