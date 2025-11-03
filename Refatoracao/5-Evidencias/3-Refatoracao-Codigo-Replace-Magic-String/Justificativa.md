# Justificativa: Replace Magic String with Symbolic Constant

### Problema (Code Smell)
[cite_start]Identificamos o code smell **"String Mágica" (Magic String)**.

Strings literais (ex: `"access"`, `"refresh"`, `"is_staff"`) eram usadas em múltiplos arquivos do frontend (`Login.jsx`, `App.js`, `Sidebar.jsx`) para interagir com o `localStorage`.

Isso é um risco para a manutenção: um erro de digitação (`"acess"`) causaria um bug silencioso, e renomear uma chave (ex: de `"access"` para `"accessToken"`) exigiria "caçar" a string em todo o projeto.

### Solução (Refatoração de Código)
Aplicamos a refatoração **Replace Magic String with Symbolic Constant**.

[cite_start]Criamos um arquivo central `src/frontend/src/utils/constants.js` [cite: 314-315] que exporta um objeto `AUTH_KEYS`. Todos os componentes foram refatorados para importar e usar essas constantes (ex: `AUTH_KEYS.ACCESS`) [cite: 325-326, 346-348, 365-366].

