# Changelog

## [1.1.0] - 2025-10-01

Esta versão introduz funcionalidades de manutenção adaptativa para enriquecer o conteúdo e garantir a conformidade com a LGPD.

### Added (Adicionado)

-   **Integração com API do YouTube**:
    -   Novo endpoint no backend (`/api/youtube-videos/`) para buscar vídeos de um canal específico.
    -   Implementado cache de 1 hora no backend para otimizar as chamadas à API.
    -   Nova página no frontend (`/youtube-videos`) para exibir os vídeos.
    -   Adicionado link "Canal YouTube" no menu lateral para todos os utilizadores.
-   **Funcionalidade de Consentimento (LGPD)**:
    -   Adicionado campo `consent_timestamp` ao modelo de utilizador no banco de dados.
    -   Adicionados checkboxes de consentimento para "Termos de Uso" e "Política de Privacidade" na página de registo.
    -   Adicionada validação no frontend para exigir o aceite dos termos.
    -   Criadas páginas estáticas para os documentos de Termos de Uso e Política de Privacidade.
-   **Funcionalidade de Exclusão de Conta (LGPD)**:
    -   Novo endpoint seguro no backend (`/api/user/delete-account/`) para exclusão permanente de conta.
    -   Implementada verificação de senha no backend para confirmar a exclusão.
    -   Nova página de "Configurações" no frontend.
    -   Adicionada secção "Zona de Perigo" com botão e fluxo de dupla confirmação para apagar a conta.
    -   Adicionado link "Configurações" no menu lateral.

### Changed (Alterado)

-   **Lógica de Registo**: O processo de criação de utilizador no backend agora regista o `timestamp` de consentimento.
-   **Exclusão de Utilizador**: A funcionalidade de exclusão foi alterada de uma desativação lógica (`is_active=False`) para uma exclusão física e permanente do banco de dados (`.delete()`).

### Fixed (Corrigido)

-   **Erro de CORS**: Corrigido o erro de política de CORS no backend (em `settings.py`) para permitir a comunicação com o ambiente de desenvolvimento local (`localhost:3000`).
-   **Sidebar Duplicada**: Removida a renderização duplicada do componente `Sidebar` em múltiplas páginas do frontend (`Home.jsx`, `Professor.jsx`, `DesempenhoProfessor.jsx`, `ForumProfessor.jsx`, etc.), resolvendo o bug de layout.
-   **Bug de Validação no Registo**: Corrigida a regra de validação de `username` no backend (`serializers.py`) que impedia o registo de utilizadores válidos.
-   **Caminhos de API no Frontend**: Padronizada a `baseURL` da API no ficheiro `axiosInstance.js` para garantir que todas as chamadas fossem direcionadas corretamente para o servidor local.