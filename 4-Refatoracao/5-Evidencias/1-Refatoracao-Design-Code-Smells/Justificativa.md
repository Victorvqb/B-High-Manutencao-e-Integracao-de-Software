# Justificativa: Padrão Facade (Fachada)

### Problema (Code Smell)
[cite_start]Identificamos o code smell **"Código Duplicado" (Duplicated Code)**.

A lógica de negócio para aprovar uma `SolicitacaoProfessor` (buscar usuário, criar se não existir, atualizar se existir, definir senha, salvar) estava copiada em três locais:
1.  `src/backend/usuarios/admin.py` (na action `aprovar_solicitacao`)
2.  `src/backend/usuarios/signals.py` (no receiver `criar_usuario_professor`)
3.  `src/backend/usuarios/views.py` (no ViewSet `SolicitacaoProfessorAdminViewSet`)

### Solução (Padrão de Projeto)
[cite_start]Aplicamos o padrão **Facade (Fachada)** [cite: 16, 810, 821-824][cite_start], que provê uma interface unificada e simples para um subsistema complexo[cite: 822].

[cite_start]Criamos a classe `ProfessorApprovalService` em um novo arquivo `services.py` [cite: 220-227]. Esta classe agora atua como a fachada, centralizando toda a lógica de aprovação.

[cite_start]Os três arquivos originais (`admin.py`, `signals.py`, `views.py`) foram refatorados para apagar o código duplicado e fazer uma única chamada ao método `ProfessorApprovalService.approve()` [cite: 230-235, 295-299].

