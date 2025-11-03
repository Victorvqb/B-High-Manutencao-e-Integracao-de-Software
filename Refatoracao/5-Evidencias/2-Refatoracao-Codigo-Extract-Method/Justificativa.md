# Justificativa: Extract Method (Extrair Método)

### Problema (Code Smell)
[cite_start]Identificamos o code smell **"Método Longo" (Long Method)**.

O método `post` da classe `QuizSubmitView` (em `views.py`) estava longo e com múltiplas responsabilidades: ele recebia os dados da web, processava-os (calculando a nota em um loop) e salvava-os no banco.

### Solução (Refatoração de Código)
Aplicamos a refatoração **Extract Method (Extrair Método)**.

[cite_start]A lógica de cálculo de pontuação (o `for` loop que iterava as respostas) foi "extraída" do método `post` e movida para um novo método privado, `_calculate_score(self, respostas)` [cite: 278-279].

[cite_start]O método `post` agora é mais curto, coeso, legível e apenas *orquestra* a operação, delegando o cálculo [cite: 280-281].

