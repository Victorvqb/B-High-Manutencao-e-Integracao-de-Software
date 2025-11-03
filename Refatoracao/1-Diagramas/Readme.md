# Análise do Diagrama de Classe Completo

Este documento detalha a arquitetura de backend do sistema B-High Education, conforme representado no diagrama de classe. O diagrama foi gerado para refletir a estrutura final do sistema após a aplicação das refatorações do TP3.

![Diagrama de Classe Completo]([./diagrama-de-classe-completo.png](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/855665e4ea395b5c92cbe3c938c161a1bbb3ef56/Refatoracao/1-Diagramas/Diagra-de-Classe-backend-B-High%20Education.jpg))


---

## 1. Visão Geral da Arquitetura

O diagrama está dividido em quatro pacotes (packages) principais, que representam as camadas lógicas da nossa aplicação:

1.  **Django Framework (Base):** As classes abstratas do próprio framework (como `AbstractUser`, `Model`, `APIView`). Elas servem como a "fundação" da qual nossas classes herdam.
2.  **B-High Education: Modelos (models.py):** O coração do sistema. Representa a estrutura do nosso banco de dados, com todas as entidades de negócio.
3.  **B-High Education: Serviços (services.py):** Uma camada de serviço desacoplada. **Esta é a evidência da nossa principal refatoração de design (Facade)**.
4.  **B-High Education: Controladores (views.py & admin.py):** A camada que recebe requisições (nossas views de API) e gerencia o painel de administração.

## 2. Análise dos Modelos (O Coração do Sistema)

A camada de `Modelos` define os dados do nosso negócio:

* **`Usuario`:** É a classe central. Ela herda de `AbstractUser` do Django, e dela saem quase todos os relacionamentos principais (1-para-N):
    * Um `Usuario` (professor) é "professor de" **N** `Aulas` e **N** `Atividades`.
    * Um `Usuario` (professor) é "criador de" **N** `Quizzes`.
    * Um `Usuario` (aluno) é "aluno de" **N** `Entregas`, **N** `RespostaQuiz` e **N** `Desempenho`.
* **`Quiz`:** É outra entidade central, que "contém" (`1-para-N`) `Questao`, que por sua vez "contém" `Alternativa`.
* **`Aula` e `Atividade`:** São os principais objetos de conteúdo criados pelos professores.
* **`SolicitacaoProfessor`:** O modelo que armazena pedidos de registro de novos professores. Esta classe é fundamental para a refatoração.

## 3. Evidenciando a Refatoração (Facade) no Diagrama

O principal objetivo deste diagrama é **provar visualmente** o sucesso da nossa refatoração de design (Padrão Facade).

### Antes da Refatoração (O Problema)
* **Code Smell:** Código Duplicado.
* **Descrição:** A lógica para aprovar uma `SolicitacaoProfessor` estava duplicada em três lugares: `SolicitacaoProfessorAdmin`, `SolicitacaoProfessorAdminViewSet` e no `signals.py`.
* **No Diagrama "Antes" (Não mostrado):** Veríamos setas de dependência (tracejadas) saindo de `SolicitacaoProfessorAdmin` e `SolicitacaoProfessorAdminViewSet` e apontando **diretamente** para `Usuario` e `SolicitacaoProfessor`, criando um acoplamento forte.

### Depois da Refatoração (A Solução no Diagrama)
* **Novo Componente:** Introduzimos a classe `ProfessorApprovalService` no pacote de "Serviços", marcada com o estereótipo `<<Facade>>`.
* **Inversão de Dependência:**
    1.  O diagrama agora mostra claramente que `SolicitacaoProfessorAdmin` e `SolicitacaoProfessorAdminViewSet` **NÃO** dependem mais de `Usuario`.
    2.  Em vez disso, ambas as classes têm uma seta de dependência (`..> Usa`) apontando para a fachada: `ProfessorApprovalService`.
    3.  A fachada `ProfessorApprovalService` é quem agora centraliza as dependências, apontando para `Usuario` (para "Gerenciar cria/atualiza") e `SolicitacaoProfessor` (para "Gerenciar lê/atualiza").

**Conclusão da Evidência:** O diagrama prova que centralizamos a lógica de negócio, removemos o código duplicado e diminuímos o acoplamento dos nossos controladores, que agora dependem de uma interface de serviço estável.

## 4. Legenda dos Relacionamentos (Semântica UML)

O diagrama utiliza três tipos principais de setas para seguir a "cartilha" tradicional:

1.  **Herança (Generalização):** `(Classe Filha) --|> (Classe Pai)`
    * **Exemplo:** `Usuario` herda de `AbstractUser`. `SolicitacaoProfessorAdmin` herda de `ModelAdmin`.

2.  **Relacionamento de Modelos (Agregação):** `(Classe A) "1" o-- "N" (Classe B)`
    * **Exemplo:** `Usuario "1" o-- "N" Aula` (Um Usuário para muitas Aulas). Isso representa um `ForeignKey` no Django.

3.  **Dependência (Uso):** `(Classe A) ..> (Classe B)`
    * **Exemplo:** `SolicitacaoProfessorAdmin ..> ProfessorApprovalService` (O Admin "Usa" o Serviço). Isso mostra que uma classe chama métodos de outra.
