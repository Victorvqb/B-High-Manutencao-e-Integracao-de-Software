from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import SolicitacaoProfessor
# Importa a Facade
from .services import ProfessorApprovalService

@receiver(post_save, sender=SolicitacaoProfessor)
def criar_usuario_professor(sender, instance, created, **kwargs):
    """
    Escuta por mudanças no modelo SolicitacaoProfessor.
    Se o campo 'aprovado' for True, chama a Facade para criar/atualizar o usuário.
    """
    if instance.aprovado:
        # --- LÓGICA DE NEGÓCIO REMOVIDA E SUBSTITUÍDA PELA FACADE ---
        # A Facade já é idempotente (verifica 'if solicitacao.aprovado'),
        # então é seguro chamar em cada save onde 'aprovado' é True.
        ProfessorApprovalService.approve(instance)
        # --- FIM DA MODIFICAÇÃO ---