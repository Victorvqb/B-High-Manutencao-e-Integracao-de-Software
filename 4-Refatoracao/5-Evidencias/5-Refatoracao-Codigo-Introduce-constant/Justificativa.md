# Justificativa: Introduce Constant (Introduzir Constante)

### Problema (Code Smell)
[cite_start]Identificamos o code smell **"Valor Hardcoded"** (um tipo de Magic String).

[cite_start]Na `YouTubeVideosView` (em `views.py`), valores de configuração importantes (o `CHANNEL_ID` do YouTube e a `CACHE_KEY`) estavam "enterrados" dentro do método `get` [cite: 300, 312, 882-883].

### Solução (Refatoração de Código)
Aplicamos a refatoração **Introduce Constant**.

Os valores foram movidos para o topo do arquivo `views.py` como constantes de módulo (`YOUTUBE_CHANNEL_ID` e `YOUTUBE_CACHE_KEY`). O método `get` foi atualizado para usar essas constantes.

Isso melhora a legibilidade e facilita a manutenção, pois agora esses valores de configuração estão em um local central e óbvio.

