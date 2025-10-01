# Manutenção Adaptativa: B-High Education

### TP2 - Manutenção e Integração de Software
Docente: Prof. Dr. Andrey Rodrigues

---

**Equipe:**
* Bruna Miranda
* Carlos Breno
* Julia Farias
* Victor Queiroz
* Welligton Salmo

---

## Roteiro da Apresentação

1.  **Adaptação 1:** Integração com API Externa (YouTube)
2.  **Adaptação 2:** Conformidade LGPD (Consentimento no Registo)
3.  **Adaptação 3:** Conformidade LGPD (Exclusão de Conta)
4.  **Conclusão**

---

## 1. Adaptação: Integração com API do YouTube

### Problema Adaptativo
* A plataforma necessitava de conteúdo multimídia dinâmico para aumentar o engajamento dos utilizadores.
* **Solução Estratégica:** Integrar vídeos de uma fonte externa relevante (YouTube).

### Implementação
* **Backend (Django):**
    * Criado um novo *endpoint* seguro (`/api/youtube-videos/`) que protege a chave da API.
    * Implementado um sistema de cache de 1 hora para otimizar as requisições.
* **Frontend (React):**
    * Criada uma nova página (`YouTubeVideos.jsx`) para exibir os vídeos.
    * Adicionado um link "Canal YouTube" ao menu lateral, visível para todos os perfis.

* **Evidências**:

![Antes da correção da API do YouTube](https://github.com/Victorvqb/TP2-Manutencao-Adaptativa/blob/cf6ee8e505a5a83960db5db4b1d41267590bf212/Manutencao-Adaptativa/Evidencias/1%20-%20Integra%C3%A7%C3%A3o%20com%20API%20Externa%20(YouTube)/1%20-%20Youtube-antes.png)
<center>Figura 1: Layout antes da implementação da API do Youtube</center>

![Depois da correção da API do YouTube](https://github.com/Victorvqb/TP2-Manutencao-Adaptativa/blob/094767c552110b1d9bba324ce36ad8694b7045c4/Manutencao-Adaptativa/Evidencias/1%20-%20Integra%C3%A7%C3%A3o%20com%20API%20Externa%20(YouTube)/2%20-%20Youtube-agora.png)
<center>Figura 2: Página funcionando corretamente e exibindo os vídeos obtidos através do endpoint do backend.</center>

---

## 2. Adaptação: Consentimento (LGPD)

### Problema Adaptativo
* O fluxo de registo original não estava em conformidade com a LGPD.
* Era necessário obter o consentimento explícito e auditável do utilizador para a coleta de dados.

### Implementação
* **Backend (Django):**
    * Adicionado o campo `consent_timestamp` ao modelo `Usuario` para registar a data e hora do consentimento.
    * A lógica de criação de utilizador foi atualizada para preencher este campo automaticamente.
* **Frontend (React):**
    * Adicionados checkboxes (não pré-marcados) para "Termos de Uso" e "Política de Privacidade" na página de registo.
    * Implementada a validação que impede o registo sem o aceite dos termos.
    * Criadas as páginas de texto para os documentos legais.

### Evidências

![Tela de Cadastro Antes](https://github.com/Victorvqb/TP2-Manutencao-Adaptativa/blob/c04c306f0a970c36a50b7ef540c735bf5d895de9/Manutencao-Adaptativa/Evidencias/2%20-%20Conformidade%20LGPD%20(Consentimento%20no%20Registo)/1%20-LGPD-cadastro-antes.png)
<center>Figura 3: Tela de registo original, sem os campos de consentimento.</center>

![Tela de Cadastro Depois](https://github.com/Victorvqb/TP2-Manutencao-Adaptativa/blob/c04c306f0a970c36a50b7ef540c735bf5d895de9/Manutencao-Adaptativa/Evidencias/2%20-%20Conformidade%20LGPD%20(Consentimento%20no%20Registo)/2%20-LGPD-cadastro-agora.png)
<center>Figura 4: Tela de registo modificada, com os checkboxes e links para os termos.</center>

---

## 3. Adaptação: Exclusão de Conta (LGPD)

### Problema Adaptativo
* A plataforma não garantia o "direito de ser esquecido" da LGPD, pois a funcionalidade existente apenas desativava a conta.
* A exclusão precisava de ser permanente e segura.

### Implementação
* **Backend (Django):**
    * Criado um novo *endpoint* seguro (`/api/user/delete-account/`).
    * A lógica agora exige a senha do utilizador para confirmação.
    * A operação realiza a exclusão **permanente** do registo do utilizador (`.delete()`).
    * É gerado um log anonimizado no console do servidor para fins de auditoria.
* **Frontend (React):**
    * Criada uma nova página de "Configurações", acessível pelo menu.
    * Adicionada uma "Zona de Perigo" com um fluxo de dupla confirmação (clique + senha) para garantir a segurança da operação.

### Evidências

![Página de Configurações](https://github.com/Victorvqb/TP2-Manutencao-Adaptativa/blob/c04c306f0a970c36a50b7ef540c735bf5d895de9/Manutencao-Adaptativa/Evidencias/3%20-%20Conformidade%20LGPD%20(Exclus%C3%A3o%20de%20Conta)/1%20-%20LGPD-exclus%C3%A3o-antes.png)
<center>Figura 5: Tela antes da implementação do local de configuração para exclusão da conta.</center>

![Confirmação de Exclusão](https://github.com/Victorvqb/TP2-Manutencao-Adaptativa/blob/c04c306f0a970c36a50b7ef540c735bf5d895de9/Manutencao-Adaptativa/Evidencias/3%20-%20Conformidade%20LGPD%20(Exclus%C3%A3o%20de%20Conta)/2%20-%20LGPD-exclus%C3%A3o-agora.png)
<center>Figura 6: Fluxo de segurança, campo para excluir a conta que exige a senha do utilizador para confirmar a exclusão.</center>

---

## Conclusão

As manutenções adaptativas realizadas demonstram a aplicação prática de conceitos fundamentais da disciplina de Manutenção e Integração de Software.

* **Adaptação a Ambientes Externos**: A integração com a API do YouTube representa uma resposta a uma mudança no ambiente de negócio (a necessidade de conteúdo dinâmico), mostrando como um sistema pode evoluir para se conectar a serviços externos. A estratégia de usar um *endpoint* intermediário no backend foi crucial para garantir a manutenibilidade e a segurança, abstraindo a complexidade da API externa do frontend.

* **Adaptação a Requisitos Regulatórios**: A implementação das funcionalidades de consentimento e exclusão de conta (LGPD) é um exemplo clássico de manutenção adaptativa impulsionada por fatores externos não técnicos. Estas alterações garantem que o software permaneça em conformidade com o ambiente legal em que opera, um aspecto crítico no ciclo de vida de qualquer sistema moderno.


### Obrigado!
