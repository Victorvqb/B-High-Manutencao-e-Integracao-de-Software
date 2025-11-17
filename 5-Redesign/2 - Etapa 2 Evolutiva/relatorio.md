# Relatório: Etapa 2 - Manutenção Evolutiva
### TP4 - Manutenção e Integração de Software

---

**Equipa:**
* Bruna Miranda
* Carlos Breno
* Julia Farias
* Victor Queiroz
* Welligton Salmo

---

## 1. Manutenção Evolutiva: Novas Funcionalidades (Etapa 2)
Conforme planejado, duas novas funcionalidades relevantes foram implementadas para expandir o escopo do sistema.

### 1.1. Funcionalidade 1: Barra de Busca de Aulas
* **Justificativa:** Melhorar a eficiência de navegação (Heurística 7), permitindo que alunos e professores encontrem aulas específicas rapidamente sem precisar rolar listas extensas.
* **Implementação:** Foi adicionado um campo de input com ícone de busca nas telas `AulasAluno.jsx` e `Professor.jsx`. A filtragem é realizada em tempo real no frontend.
* **Evidências (Antes e Depois):**

Antes (Sem busca)
![Antes (Sem busca)](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/e3a4fea328dec25099b527b19ad5d4a89e52f8cb/5-Redesign/7-Funcionalidade-busca/antes-busca-antes.png?raw=true)
Depois (Com busca)
![Depois (Com busca)](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/e3a4fea328dec25099b527b19ad5d4a89e52f8cb/5-Redesign/7-Funcionalidade-busca/busca-depois.png?raw=true)

---

### 1.2. Funcionalidade 2: Sistema de "Likes" no Fórum
* **Justificativa:** Ampliar o engajamento no fórum, permitindo feedback rápido e passivo entre usuários, além de ajudar professores a identificar dúvidas mais relevantes.
* **Implementação:** O backend foi atualizado para armazenar `likes` em comentários e respostas. O frontend recebeu ícones interativos de coração que atualizam em tempo real.
* **Evidências (Antes e Depois):**

Antes (Fórum sem likes)
![Antes (Fórum sem likes)](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/e3a4fea328dec25099b527b19ad5d4a89e52f8cb/5-Redesign/8-Funcionalidade-curtida/funcionalidade-curtida-antes.png?raw=true)
Depois (Fórum com likes)
![Depois (Fórum com likes)](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/e3a4fea328dec25099b527b19ad5d4a89e52f8cb/5-Redesign/8-Funcionalidade-curtida/funcionalidade-curtida-depois.png?raw=true)

---

## 2. Manutenção Evolutiva: Acessibilidade (Etapa 2)
Foram implementadas duas melhorias significativas de acessibilidade.

### 2.1. Melhoria 1: Adequação de Contraste (WCAG AA)
* **Problema:** A auditoria via **Lighthouse** identificou que as cores na tela de Login tinham uma taxa de contraste insuficiente, dificultando a leitura para usuários com baixa visão.
* **Solução:** As classes de cor foram ajustadas. O botão "Entrar" foi escurecido (`bg-green-700`) e os links de texto foram clareados (`dark:text-blue-400`) no modo escuro.
* **Evidências (Relatórios Lighthouse):**



Antes (Falha de Contraste)
![Antes (Falha de Contraste)](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/e520daa9462f4305bf20d7d2ae8ae08137e9a230/5-Redesign/5-evidencias-antes/Funcionalidade-curtida-antes.png?raw=true)
Depois (Aprovado)
![Depois (Aprovado)](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/e520daa9462f4305bf20d7d2ae8ae08137e9a230/5-Redesign/5-evidencias-antes/Funcionalidade-curtida-depois.png?raw=true)

---

### 2.2. Melhoria 2: Prevenção de Erros e Acessibilidade na Senha (Heurística 5)
* **Justificativa:** Esta melhoria foi solicitada pelo Professor Andrey Rodrigues como um aprimoramento da Etapa 1.
* **Problema:** Os campos de senha no `Login.jsx` e `Cadastro.jsx` violavam a **Heurística 5 (Prevenção de erros)**. O usuário não podia ver a senha que estava digitando e o cadastro não validava a complexidade.
* **Solução:**
    * Um ícone de "olho" (`<FaEye />`) foi adicionado aos campos de senha em `Login.jsx` e `Cadastro.jsx` para alternar a visibilidade.
    * O `Cadastro.jsx` agora exibe uma lista de requisitos de senha (mínimo de 6 caracteres, 1 maiúscula, 1 número) que valida em tempo real.
    * Um campo "Confirmar Senha" foi adicionado ao `Cadastro.jsx`.
      
* **Evidências (Antes e Depois):**
  
Antes (Login)
!(https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/f09a2ba203fecc25d7237ab796cc4923784eb697/5-Redesign/2%20-%20Etapa%202%20Evolutiva/4%20-%20cadastro-login/tela-login-antes.png)
Depois (Login)
!(https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/f09a2ba203fecc25d7237ab796cc4923784eb697/5-Redesign/2%20-%20Etapa%202%20Evolutiva/4%20-%20cadastro-login/tela-login-depois.png)

Antes (Cadastro)
!(https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/f09a2ba203fecc25d7237ab796cc4923784eb697/5-Redesign/2%20-%20Etapa%202%20Evolutiva/4%20-%20cadastro-login/cadastro-antes.png)
Depois (Cadastro)
!(https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/f09a2ba203fecc25d7237ab796cc4923784eb697/5-Redesign/2%20-%20Etapa%202%20Evolutiva/4%20-%20cadastro-login/cadastro-depois.png)


---

## 3. Organização e Versionamento (Git)

### Implementação
Foi adotado um fluxo de trabalho baseado em Git Flow simplificado:
1.  **`develop`:** Criada como a branch principal de desenvolvimento.
2.  **`feature/...`:** Branches individuais para cada tarefa (ex: `feature/redesign-consistencia-botoes`, `feature/forum-likes`).
3.  **Commits:** Cada correção foi registrada com uma mensagem clara, ligando-a ao Redesign ou à Etapa 2.
* **Evidência:**

Histórico de Commits e Branches
![Histórico Git](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/e520daa9462f4305bf20d7d2ae8ae08137e9a230/5-Redesign/6-versionamento/Branchs.png?raw=true)
