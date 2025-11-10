from .models import Usuario, SolicitacaoProfessor
from django.db import IntegrityError

class ProfessorApprovalService:
    """
    Facade (Fachada) para encapsular a lógica de aprovação de professores.
    
    Esta classe fornece um ponto de entrada único (.approve()) 
    para a operação complexa de criar/atualizar um usuário 
    a partir de uma solicitação.
    
    Isso resolve o Code Smell de "Código Duplicado" encontrado em 
    views.py, 
    admin.py, 
    e signals.py.
    """
    
    @staticmethod
    def approve(solicitacao: SolicitacaoProfessor) -> (bool, str):
        """
        Aprova uma solicitação, criando ou atualizando o usuário professor.
        Retorna (True, "Mensagem") em sucesso, ou (False, "Erro") em falha.
        """
        # Garante que a operação seja idempotente (só rode uma vez)
        if solicitacao.aprovado:
            return False, "Solicitação já aprovada."

        try:
            # Tenta encontrar um usuário existente para atualizar
            user = Usuario.objects.get(username=solicitacao.username)
            
            user.first_name = solicitacao.nome
            user.last_name = solicitacao.sobrenome
            user.email = solicitacao.email
            user.is_staff = True
            user.is_active = True
            user.set_password(solicitacao.senha)
            user.save()

        except Usuario.DoesNotExist:
            # Cria um novo usuário se não existir
            try:
                Usuario.objects.create_user(
                    username=solicitacao.username,
                    password=solicitacao.senha,
                    email=solicitacao.email,
                    first_name=solicitacao.nome,
                    last_name=solicitacao.sobrenome,
                    is_staff=True,
                    is_active=True,
                )
            except IntegrityError as e:
                return False, f"Erro de integridade: {e}"

        except Exception as e:
            return False, f"Erro inesperado: {e}"

        # Marca a solicitação como aprovada e salva
        solicitacao.aprovado = True
        solicitacao.save()
        return True, "Aprovada"