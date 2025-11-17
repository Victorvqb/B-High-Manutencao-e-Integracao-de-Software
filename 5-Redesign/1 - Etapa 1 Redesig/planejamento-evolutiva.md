# Etapa 2: Planejamento da Manutenção Evolutiva

Este documento descreve as novas funcionalidades e a melhoria de acessibilidade implementadas na Etapa 2 do TP4, conforme solicitado.

---

## 1. Novas Funcionalidades

Foram planejadas e implementadas duas novas funcionalidades relevantes para o contexto do sistema, com o objetivo de melhorar significativamente a experiência do usuário.

### Funcionalidade 1: Barra de Busca de Aulas

* **Descrição:** Adição de um campo de busca textual nas telas "Minhas Aulas" (aluno e professor). O usuário pode digitar um termo e a lista de aulas é filtrada em tempo real, exibindo apenas as aulas cujo título corresponda à busca.
* **Justificativa:** Esta funcionalidade melhora significativamente a eficiência de uso. Em um cenário real com dezenas ou centenas de aulas, encontrar um conteúdo específico rolando a lista seria impraticável. A busca torna a navegação mais rápida e direta, alinhando-se aos objetivos do sistema de ser uma plataforma de aprendizado eficiente.

### Funcionalidade 2: Sistema de "Likes" (Curtidas) no Fórum

* **Descrição:** Adição de um botão "Curtir" (com um ícone de coração e contagem) em cada postagem e resposta do fórum.
* **Justificativa:** Esta funcionalidade amplia o escopo de interação do fórum. Ela incentiva o engajamento passivo (permitindo que alunos concordem com uma dúvida sem precisar postar "eu também") e fornece feedback visual imediato ao autor. Para o professor, serve como um indicador rápido de quais dúvidas são mais relevantes ou recorrentes na turma.

---

## 2. Melhoria de Acessibilidade

Foi implementada uma melhoria significativa de acessibilidade para tornar o sistema mais inclusivo.

### Melhoria: Otimização para Leitores de Tela (Atributos ARIA)

* **Problema Identificado:** Diversos elementos de formulário, como os campos de "Usuário" e "Senha" na tela de Login (`Login.jsx`), não possuíam `labels` (etiquetas) textuais associadas.
* **Impacto:** Esta é uma "limitação real" que impacta "pessoas com deficiência" visual que dependem de leitores de tela. Sem `labels` adequadas, o software de narração não consegue informar ao usuário qual informação deve ser inserida em cada campo, anunciando apenas "campo de edição" genérico.
* **Solução Implementada:** Foram adicionados `aria-label` (ou a combinação `htmlFor`/`id`) aos elementos de formulário críticos. Por exemplo, no `Login.jsx`, o campo de usuário agora possui um `aria-label="Usuário"`. Isso garante que o leitor de telas anuncie corretamente "Usuário, campo de edição", tornando a página navegável e funcional para todos.