# Trabalho Prático 5 – Engenharia Reversa de Software
**Instituição:** Universidade Federal do Amazonas (UFAM)  
**Disciplina:** Manutenção e Integração de Software  
**Sistema Analisado:** B-High Education (Plataforma AVA)

#### **Docente:** Prof. Dr. Andrey Rodrigues

---

**Equipe:**
* Bruna Miranda
* Carlos Breno
* Julia Farias
* Victor Queiroz
* Welligton Salmo

---

## 1. Introdução
Este documento apresenta o resultado do processo de Engenharia Reversa aplicado ao sistema **B-High Education**. O objetivo deste trabalho foi reconstruir a visão funcional, estrutural, arquitetural e tecnológica da plataforma, visto que a documentação original era inexistente.

O sistema consiste em um Ambiente Virtual de Aprendizagem (AVA) que conecta Professores e Alunos, permitindo a gestão de aulas, atividades avaliativas e acompanhamento de desempenho acadêmico.

---

## 2. Requisitos do Sistema (Visão Funcional)

Abaixo estão listados os Requisitos Funcionais recuperados através da análise estática do código-fonte e da observação dinâmica da interface.

### 2.1 Módulo de Autenticação e Conta

#### US-01: Cadastro de Usuário
* **História:** "Enquanto **Visitante**, quero criar uma conta informando se sou Aluno ou Professor, para acessar a plataforma."
* **Critérios de Aceitação:**
  * O formulário deve exigir: Nome, Sobrenome, Email, Usuário e Senha.
  * O usuário deve obrigatoriamente aceitar os Termos de Uso.
* **Regras de Negócio:**
  * **RN-01 (Segurança):** A senha deve ter no mínimo 6 caracteres, incluindo 1 letra maiúscula e 1 número.
  * **RN-02 (Aprovação):** Contas de "Professor" são criadas com status pendente e requerem aprovação administrativa.

**Evidência Lógica (Código Fonte - Frontend):**

 *Trecho de `src/pages/Cadastro.jsx` demonstrando a validação da Regra de Negócio RN-01:*

```javascript
// Validação em tempo real extraída da engenharia reversa
useEffect(() => {
  setValidacaoSenha({
    minChar: senha.length >= 6,
    maiuscula: /[A-Z]/.test(senha),
    numero: /[0-9]/.test(senha)
  });
}, [senha]);
```

**Evidência com o Sistema:**
![Tela de Cadastro](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/db63051460133fec1e3119175a6677ce78985149/6-Engenharia%20Reversa/1-%20Evidencias/Cadastro.png)

#### US-02: Autenticação (Login)
* **História:** "Enquanto **Usuário**, quero inserir minhas credenciais, para ser direcionado ao painel correspondente ao meu perfil."
* **Critérios de Aceitação:**
  * Redirecionamento automático baseado na *role* (Papel): Admin, Professor ou Aluno.
  * Exibição de mensagem de erro clara para credenciais inválidas.

**Evidência com o Sistema:**
![Tela de Login](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/db63051460133fec1e3119175a6677ce78985149/6-Engenharia%20Reversa/1-%20Evidencias/Login.png)

---

### 2.2 Módulo do Professor (Gestão de Ensino)

#### US-03: Gerenciar Aulas
* **História:** "Enquanto **Professor**, quero publicar e editar aulas contendo vídeos ou arquivos, para disponibilizar material de estudo."
* **Critérios de Aceitação:**
  * O professor deve poder inserir Título, Descrição, Data e Hora.
  * O sistema deve permitir alternar entre "Link de Vídeo Externo" e "Upload de Arquivo (PDF)".
* **Regras de Negócio:**
  * **RN-03 (Validação):** É obrigatório fornecer o link ou o arquivo conforme o tipo de conteúdo selecionado.

**Evidência com o Sistema:**
![Modal de Criação de Aula](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/db63051460133fec1e3119175a6677ce78985149/6-Engenharia%20Reversa/1-%20Evidencias/professor-criar-aula.png)

#### US-04: Gestão de Atividades Avaliativas
* **História:** "Enquanto **Professor**, quero criar atividades com prazo e pontuação definidos, para avaliar os alunos."
* **Critérios de Aceitação:**
  * O sistema deve permitir definir data limite e hora de entrega.
  * Deve haver um campo numérico para a pontuação.

**Evidência com o Sistema:**
![Tela de Criação de Atividade](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/d991927a6ad1dccfbf905182f013c41860cf6f99/6-Engenharia%20Reversa/1-%20Evidencias/professor-atividades.png)

#### US-05: Monitoramento de Entregas
* **História:** "Enquanto **Professor**, quero visualizar e baixar as entregas dos alunos, para realizar a correção."
* **Critérios de Aceitação:**
  * Listagem de alunos inscritos no curso.
  * Acesso aos arquivos enviados por cada aluno em um modal específico.

**Evidência com o Sistema:**
![Dashboard Professor com Lista](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/6626ceb4d26d55ad1d19b5ac1b6e2470b66b9f6d/6-Engenharia%20Reversa/1-%20Evidencias/monitor-entregas.png)

---

### 2.3 Módulo do Aluno (Consumo e Realização)

#### US-06: Dashboard de Prioridades
* **História:** "Enquanto **Aluno**, quero visualizar minhas aulas organizadas por urgência de prazo, para priorizar meus estudos."
* **Critérios de Aceitação:**
  * As aulas devem ser separadas visualmente em colunas: Alta, Média e Baixa Prioridade.
* **Regras de Negócio:**
  * **RN-04 (Cálculo de Prioridade):** Alta (vence hoje), Média (até 7 dias), Baixa (até 31 dias).

**Evidência com o Sistema:**
![Dashboard Aluno](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/6626ceb4d26d55ad1d19b5ac1b6e2470b66b9f6d/6-Engenharia%20Reversa/1-%20Evidencias/aluno%20atividades.png)

#### US-07: Responder Atividade
* **História:** "Enquanto **Aluno**, quero enviar minha resposta (texto ou arquivo) para uma atividade, para ser avaliado."
* **Critérios de Aceitação:**
  * O aluno deve visualizar o prazo final e a descrição.
  * O formulário deve permitir upload de arquivo.

**Evidência com o Sistema:**
![Tela de Envio de Atividade](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/6626ceb4d26d55ad1d19b5ac1b6e2470b66b9f6d/6-Engenharia%20Reversa/1-%20Evidencias/aluno%20atividades-2.png)

---

## 3. Modelagem do Sistema

### 3.1 Modelagem Estrutural (Diagrama de Classes)
O Diagrama de Classes abaixo ilustra a organização dos dados no Backend (Django Models), destacando as relações entre Usuários, Conteúdos (Aulas/Atividades) e Entregas.

![Diagrama de Classes UML](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/6626ceb4d26d55ad1d19b5ac1b6e2470b66b9f6d/6-Engenharia%20Reversa/2-%20Diagramas/Diagrama%20de%20classe%20.jpg)

### Evidência da Comunicação Cliente-Servidor
O sistema utiliza o `axiosInstance` para centralizar as requisições HTTP, injetando o Token JWT automaticamente no cabeçalho. Isso comprova a arquitetura *Stateless* da API REST.

> *Fonte: `src/utils/axiosInstance.js` (Inferido pelo uso em `Home.jsx`)*
```javascript
// Exemplo de consumo da API no Frontend
async function carregarDados() {
  // O Frontend solicita dados ao Backend via JSON
  const [aulasRes, entregasRes] = await Promise.all([
    axiosInstance.get("aulas-aluno/"),
    axiosInstance.get("entregas/"),
  ]);
  // ... processamento dos dados ...
}
```

### 3.2 Modelagem Comportamental (Diagrama MoLIC)
Foi utilizado o **MoLIC (Modelagem da Linguagem de Interação como Conversa)** para representar os fluxos de diálogo entre usuário e sistema. O diagrama evidencia a separação dos espaços de Professor e Aluno e as interações de ida e volta (solicitação/feedback).

**Legenda:**
* `u:` Fala do Usuário (Ação)
* `s:` Fala do Sistema (Resposta)

![Diagrama MoLIC Estruturado](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/6626ceb4d26d55ad1d19b5ac1b6e2470b66b9f6d/6-Engenharia%20Reversa/2-%20Diagramas/Molic.png)

---

## 4. Arquitetura do Sistema

A engenharia reversa revelou uma arquitetura **Cliente-Servidor Desacoplada** baseada em **API REST**.

* **Frontend (SPA):** Gerencia a interface e navegação via React.js. Não há renderização no servidor.
* **Backend (API):** O Django REST Framework expõe endpoints JSON, processa regras de negócio e acessa o banco de dados.

### Evidência da Comunicação Cliente-Servidor
O sistema utiliza o `axiosInstance` para centralizar as requisições HTTP, injetando o Token JWT automaticamente no cabeçalho. Isso comprova a arquitetura *Stateless* da API REST.

> *Fonte: `src/utils/axiosInstance.js` (Inferido pelo uso em `Home.jsx`)*
```javascript
// Exemplo de consumo da API no Frontend
async function carregarDados() {
  // O Frontend solicita dados ao Backend via JSON
  const [aulasRes, entregasRes] = await Promise.all([
    axiosInstance.get("aulas-aluno/"),
    axiosInstance.get("entregas/"),
  ]);
  // ... processamento dos dados ...
}
```

![Diagrama de Arquitetura](https://github.com/Victorvqb/B-High-Manutencao-e-Integracao-de-Software/blob/6626ceb4d26d55ad1d19b5ac1b6e2470b66b9f6d/6-Engenharia%20Reversa/2-%20Diagramas/Arquitetura.jpg)

---

## 5. Stack Tecnológica

A análise dos arquivos de configuração (`package.json`, `requirements.txt`) identificou a seguinte stack:

### Frontend
* **Framework:** React.js
* **Estilização:** Tailwind CSS
* **Roteamento:** React Router Dom
* **HTTP Client:** Axios
* **Utils:** Day.js (Datas), JWT-Decode (Auth)

### Backend
* **Linguagem:** Python 3
* **Framework Web:** Django
* **API:** Django REST Framework (DRF)
* **Autenticação:** SimpleJWT
* **Banco de Dados:** SQLite (Dev)

### Integrações
* **Google YouTube Data API:** Para consumo de vídeos externos.

#Obrigado!!
