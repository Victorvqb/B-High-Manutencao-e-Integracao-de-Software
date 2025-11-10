# Avaliação Heurística do Sistema B-High Education

Este documento detalha a avaliação de usabilidade da plataforma B-High Education, baseada nas 10 Heurísticas de Nielsen. A análise identifica pontos fortes e fracos da interface atual e prioriza os problemas encontrados para guiar o esforço de redesign.

---

## Pontos Fortes (Heurísticas Atendidas)

A interface atual, embora apresente problemas, também possui pontos fortes que devem ser mantidos:

* **Heurística 2 (Correspondência entre o sistema e o mundo real):** O sistema utiliza uma linguagem familiar ao usuário (Aulas, Quizzes, Fórum) e ícones universalmente reconhecidos (Home, Configurações, Sair), o que reduz a carga cognitiva.

* **Heurística 8 (Design estético e minimalista):** A interface geral é limpa, com um bom uso do modo escuro. Não há excesso de informações competindo pela atenção, e o layout de `Sidebar` + Conteúdo é focado.

* **Heurística 6 (Reconhecimento em vez de recordação):** A navegação principal (Sidebar) está sempre visível em telas maiores, permitindo que o usuário reconheça as opções disponíveis em vez de ter que memorizar os caminhos.

---

## Pontos Fracos (Heurísticas Violadas)

Foram identificados 9 problemas de usabilidade, classificados por prioridade.

### Prioridade ALTA

**1. Inconsistência de Navegação (Heurística 4: Consistência e padrões)**
* **Problema:** A tela do "Painel Administrativo" (`AdminDashboard.jsx`) introduz uma navegação por abas horizontais que é completamente diferente da navegação vertical (Sidebar) usada no resto do sistema. Pior, essas abas duplicam links já presentes na Sidebar (ex: Aulas, Quizzes).
* **Evidência:** `image_ee1387.png`

**2. Inconsistência de Ações (Heurística 4: Consistência e padrões)**
* **Problema:** Ações idênticas são apresentadas de formas diferentes. Em `AtividadesProfessor.jsx`, "Editar" e "Excluir" são botões com ícones e cores. Em `ForumProfessor.jsx`, as mesmas ações são links de texto simples.
* **Evidência:** `image_ee663a.png` (Atividades) vs. `image_ee6675.png` (Fórum)

### Prioridade MÉDIA

**3. Falta de Feedback em Estados Vazios (Heurística 1: Visibilidade do status)**
* **Problema:** Em telas de listagem, como "Minhas Aulas" (`Professor.jsx`), se nenhum item for encontrado, a tela fica em branco. O usuário não sabe se o sistema está carregando, se houve um erro, ou se a lista está vazia.
* **Evidência:** `image_ee1438.png`

**4. Má Hierarquia de Ações (Heurística 8: Design estético e minimalista)**
* **Problema:** Na tela de Login, a ação primária ("Entrar") e a secundária ("Cadastrar-se") são apresentadas como botões com peso visual muito similar, competindo pela atenção do usuário.
* **Evidência:** `image_ee1345.png`

**5. Falta de Feedback de Ação (Heurística 1: Visibilidade do status)**
* **Problema:** Ao clicar em "Entrar" na tela de `Login.jsx`, o sistema faz uma requisição à API. Durante esse tempo, o botão continua clicável e nenhuma indicação visual (loading) é mostrada, podendo levar o usuário a clicar múltiplas vezes.
* **Evidência:** `Login.jsx`

**6. Mensagens de Erro Ineficientes (Heurística 9: Diagnosticar e recuperar de erros)**
* **Problema:** Em várias telas (ex: `Home.jsx`), se a API falhar ao carregar dados, o erro é apenas logado no console. O usuário vê uma tela quebrada (com "0 atividades") e não recebe nenhuma mensagem sobre o que aconteceu ou como proceder.
* **Evidência:** Código do `Home.jsx` (bloco `catch`).

### Prioridade BAIXA

**7. Uso de Alertas Nativos (Heurística 9: Diagnosticar e recuperar de erros)**
* **Problema:** O sistema utiliza `window.alert()` e `window.confirm()` para feedback (ex: upload de foto na `Sidebar.jsx`, deleções no `DesempenhoProfessor.jsx`). Alertas nativos do navegador são feios, quebram a consistência visual e bloqueiam a interface.
* **Evidência:** `Sidebar.jsx`, `DesempenhoProfessor.jsx`

**8. Baixa Eficiência de Uso (Heurística 7: Flexibilidade e eficiência)**
* **Problema:** Nenhuma das telas de listagem (Aulas, Atividades, Quizzes) possui um mecanismo de busca ou filtro. Se um professor tiver 100 aulas, ele terá que rolar a página inteira para encontrar uma específica.
* **Evidência:** `Professor.jsx`, `Quizzes.jsx`

---

## Plano de Ação (Redesign - Etapa 1)

Com base na avaliação, os 4 problemas a seguir foram priorizados para implementação imediata, pois representam as falhas mais graves de consistência e feedback:

1.  **Corrigir Inconsistência de Navegação** (Prioridade ALTA)
2.  **Corrigir Inconsistência de Ações** (Prioridade ALTA)
3.  **Corrigir Falta de Feedback em Estados Vazios** (Prioridade MÉDIA)
4.  **Corrigir Má Hierarquia de Ações no Login** (Prioridade MÉDIA)