# Relatório de Refatoração: B-High Education

### TP3 - Manutenção e Integração de Software

---

**Equipa:**
* Bruna Miranda
* Carlos Breno
* Julia Farias
* Victor Queiroz
* Welligton Salmo

---

## Roteiro da Apresentação

1.  **Refatoração de Design:** Padrão Facade (Fachada)
2.  **Refatoração de Código 1:** Extract Method (Extrair Método)
3.  **Refatoração de Código 2:** Replace Magic String (Substituir String Mágica)
4.  **Refatoração de Código 3:** Remove Dead Code (Remover Código Morto)
5.  **Refatoração de Código 4:** Introduce Constant (Introduzir Constante)
6.  **Análise de Tipos de Refatoração** (Planejada vs. Oportunista)
7.  **Análise de Reversibilidade** (Refatoração A/B)
8.  **Conclusão**

---

## 1. Refatoração de Design: Padrão Facade

### Problema (Code Smell)
* **Code Smell Identificado:** "Código Duplicado" (Duplicated Code).
* **Justificativa:** A lógica de negócio para aprovar um professor (`SolicitacaoProfessor`) era complexa e estava copiada em três arquivos: `admin.py`, `signals.py` e `views.py`. Isso feria o princípio DRY (Don't Repeat Yourself) e tornava a manutenção arriscada.

### Implementação (Padrão Facade)
* **O que é:** O Padrão Facade (Fachada) "oferece uma interface mais simples para um sistema", escondendo a complexidade interna.
* **Como foi feito:**
    * Toda a lógica duplicada (buscar `Usuario`, criar, atualizar, salvar) foi movida para um novo arquivo `services.py`, dentro de uma classe `ProfessorApprovalService`.
    * Esta classe atua como a "fachada".
    * Os três arquivos originais (`admin.py`, `signals.py`, `views.py`) foram refatorados para apagar o código antigo e fazer uma **única chamada** ao método `ProfessorApprovalService.approve()`.

### Evidências

![Código duplicado em admin.py ANTES](./1-Refatoracao-Design-Code-Smells/Antes/antes_admin.png)
_Figura 1: "Antes" - Lógica de criação de usuário duplicada diretamente no `admin.py`._

![Código duplicado em signals.py ANTES](./1-Refatoracao-Design-Code-Smells/Antes/antes_signals.png)
_Figura 2: "Antes" - A mesma lógica duplicada no `signals.py`._

![Código duplicado em views.py ANTES](./1-Refatoracao-Design-Code-Smells/Antes/antes_views.png)
_Figura 3: "Antes" - A terceira duplicata, no `views.py`, completando o code smell._

![A nova Fachada em services.py DEPOIS](./1-Refatoracao-Design-Code-Smells/Depois/depois_services_facade.png)
_Figura 4: "Depois" - A nova classe `ProfessorApprovalService` centraliza toda a lógica._

![Chamada à Fachada em admin.py DEPOIS](./1-Refatoracao-Design-Code-Smells/Depois/depois_admin_chamada.png)
_Figura 5: "Depois" - O `admin.py` (assim como `signals.py` e `views.py`) agora delega a responsabilidade para a fachada._

---

## 2. Refatoração de Código 1: Extract Method

### Problema (Code Smell)
* **Code Smell Identificado:** "Método Longo" (Long Method).
* **Justificativa:** O método `post` da `QuizSubmitView` (em `views.py`) estava fazendo muitas coisas: validando, recebendo dados, calculando notas (com um `for` loop) e salvando no banco.

### Implementação (Extract Method)
* **O que é:** Uma refatoração onde um trecho de código é "extraído" do seu método original e transformado em um novo método.
* **Como foi feito:**
    * A lógica do `for` loop (que calculava os `acertos`) foi selecionada.
    * Ela foi movida para um novo método privado: `_calculate_score(self, respostas)`.
    * O método `post` original agora é mais limpo e apenas chama `self._calculate_score()`.

### Evidências

![views.py ANTES da extração do método](./2-Refatoracao-Codigo-Extract-Method/Antes/antes_views_post.png)
_Figura 6: "Antes" - O método `post` continha o loop de cálculo de `acertos` (Linhas 181-188 no original)._

![views.py DEPOIS da extração do método](./2-Refatoracao-Codigo-Extract-Method/Depois/depois_views_post.png)
_Figura 7: "Depois" - O método `post` foi simplificado e o novo método `_calculate_score` foi criado._

---

## 3. Refatoração de Código 2: Replace Magic String

### Problema (Code Smell)
* **Code Smell Identificado:** "Strings Mágicas" (Magic Strings).
* **Justificativa:** Strings literais como `"access"`, `"refresh"`, `"is_staff"` eram usadas em `Login.jsx`, `App.js` e `Sidebar.jsx`. Se a chave `"access"` mudasse, teríamos que "caçar" essa string em vários arquivos, arriscando erros de digitação.

### Implementação (Replace Magic String)
* **O que é:** Uma refatoração que substitui um valor literal por uma constante simbólica.
* **Como foi feito:**
    * Criamos um arquivo `src/frontend/src/utils/constants.js`.
    * Este arquivo exporta um objeto `AUTH_KEYS` (ex: `AUTH_KEYS = { ACCESS: "access", ... }`).
    * Os arquivos `Login.jsx`, `App.js` e `Sidebar.jsx` foram atualizados para importar e usar `AUTH_KEYS.ACCESS` em vez da string `"access"`.

### Evidências

![Login.jsx ANTES das constantes](./3-Refatoracao-Codigo-Replace-Magic-String/Antes/antes_login.png)
_Figura 8: "Antes" - Uso de strings literais `"access"`, `"refresh"`, etc., no `Login.jsx`._

![O novo arquivo constants.js DEPOIS](./3-Refatoracao-Codigo-Replace-Magic-String/Depois/depois_constants.png)
_Figura 9: "Depois" - O novo arquivo `constants.js` centraliza todas as chaves._

![Login.jsx DEPOIS das constantes](./3-Refatoracao-Codigo-Replace-Magic-String/Depois/depois_login.png)
_Figura 10: "Depois" - O `Login.jsx` agora usa as constantes importadas, tornando o código robusto._

---

## 4. Refatoração de Código 3: Remove Dead Code

### Problema (Code Smell)
* **Code Smell Identificado:** "Código Morto" (Dead Code).
* **Justificativa:** O projeto continha código obsoleto. A classe `EnviarAtividadeView` em `views.py` não era mais usada, mas o `backend/urls.py` ainda tentava importá-la, causando um `ImportError` fatal que impedia a aplicação de rodar.

### Implementação (Remove Dead Code)
* **O que é:** A refatoração mais simples: deletar código que não é mais executado ou necessário.
* **Como foi feito:**
    * A classe `EnviarAtividadeView` foi removida de `views.py`.
    * A linha `from usuarios.views import EnviarAtividadeView` foi removida de `backend/urls.py`.
    * O arquivo duplicado `token_serializers.py` também foi removido.

### Evidências

![urls.py ANTES da remoção](./4-Refatoracao-Codigo-Remove-Dead-Code/Antes/antes_urls.png)
_Figura 11: "Antes" - O `urls.py` principal importando a `EnviarAtividadeView` (Linha 6), causando um `ImportError`._

![views.py ANTES da remoção](./4-Refatoracao-Codigo-Remove-Dead-Code/Antes/antes_views_dead_class.png)
_Figura 12: "Antes" - A classe `EnviarAtividadeView` que era código morto no `views.py`._

![urls.py DEPOIS da remoção](./4-Refatoracao-Codigo-Remove-Dead-Code/Depois/depois_urls.png)
_Figura 13: "Depois" - A importação foi removida, corrigindo o `ImportError`._

---

## 5. Refatoração de Código 4: Introduce Constant

### Problema (Code Smell)
* **Code Smell Identificado:** "Valor Hardcoded" (um tipo de Magic String).
* **Justificativa:** Na `YouTubeVideosView`, valores de configuração (o `CHANNEL_ID` do YouTube e a `CACHE_KEY`) estavam "enterrados" dentro do método `get`.

### Implementação (Introduce Constant)
* **O que é:** Uma refatoração que move um valor "mágico" para uma constante nomeada.
* **Como foi feito:**
    * Os valores foram movidos para o topo do arquivo `views.py` como constantes (`YOUTUBE_CHANNEL_ID` e `YOUTUBE_CACHE_KEY`).
    * O método `get` foi atualizado para usar essas constantes.

### Evidências

![views.py ANTES das constantes](./5-Refatoracao-Codigo-Introduce-constant/Antes/antes_views_youtube.png)
_Figura 14: "Antes" - Strings mágicas "hardcoded" dentro do método `get`._

![views.py DEPOIS das constantes](./5-Refatoracao-Codigo-Introduce-constant/Depois/depois_views_youtube.png)
_Figura 15: "Depois" - Constantes definidas no topo do arquivo e usadas no método `get`._

---

## 6. Análise de Tipos de Refatoração

* **Refatorações Planejadas:** A aplicação do **Padrão Facade** e a **Replace Magic String** foram "planejadas". Sabíamos que tínhamos código duplicado e strings mágicas, e estruturamos uma solução antecipada para resolvê-los.

* **Refatoração Oportunista:** A **Remove Dead Code** foi "oportunista". Durante a aplicação de outras mudanças, o sistema quebrou (`ImportError`). Ao investigar o bug, percebemos que a causa era código morto e aproveitamos a *oportunidade* para limpá-lo, corrigindo o bug no processo.

## 7. Análise de Reversibilidade (A/B)

O TP3 pede para demonstrar o caráter neutro da refatoração. Usamos o **Extract Method** como exemplo:

* **Refatoração A (Extract Method):** Foi o que fizemos ao criar o método `_calculate_score` na `QuizSubmitView`.
* **Refatoração B (Inline Method):** A refatoração que reverte "Extract Method" é "Inline Method". Para aplicá-la, poderíamos copiar o conteúdo do `_calculate_score` de volta para o método `post` e apagar o `_calculate_score`. O sistema voltaria ao estado original, provando que a mudança é puramente estrutural e não altera o comportamento.

---

## 8. Conclusão

As refatorações aplicadas melhoraram a qualidade interna do código do B-High Education sem alterar seu comportamento externo, como provado pelos testes do Postman (pasta `Testes-Postman/`).

* **Manutenibilidade:** O Padrão **Facade** centralizou uma regra de negócio crítica. Agora, alterar a aprovação de professores é feito em *um* arquivo (`services.py`), não em três.
* **Legibilidade e Robustez:** As refatorações de código tornaram os métodos mais limpos (`Extract Method`), eliminaram riscos de erros de digitação (`Replace Magic String`), corrigiram bugs (`Remove Dead Code`) e facilitaram futuras configurações (`Introduce Constant`).

O processo foi essencial para pagar "dívidas técnicas" e garantir que o software seja mais fácil de manter e evoluir.