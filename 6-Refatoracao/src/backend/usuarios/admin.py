from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model
from .models import SolicitacaoProfessor, Usuario

from .models import (
    Aula,
    Atividade,
    Entrega,
    Quiz,
    RespostaQuiz,
    ComentarioForum,
    RespostaForum,
    Desempenho,
)
# Importa a Facade
from .services import ProfessorApprovalService

User = get_user_model()

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ("username", "email", "is_staff", "is_active")
    list_filter = ("is_staff", "is_superuser", "is_active")
    search_fields = ("username", "email")


@admin.register(Aula)
class AulaAdmin(admin.ModelAdmin):
    list_display = ("id", "titulo", "professor", "data", "hora", "agendada")
    search_fields = ("titulo", "professor__username")
    list_filter = ("agendada", "data")


@admin.register(Atividade)
class AtividadeAdmin(admin.ModelAdmin):
    list_display = ("id", "titulo", "professor", "data_entrega", "pontos")
    search_fields = ("titulo", "professor__username")
    list_filter = ("data_entrega",)


@admin.register(Entrega)
class EntregaAdmin(admin.ModelAdmin):
    list_display = ("id", "aluno", "aula", "quiz", "arquivo", "data_envio", "comentario")
    search_fields = ("aluno__username", "aula__titulo", "quiz__title")
    list_filter = ("data_envio",)


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "criador", "created_at")
    search_fields = ("title", "criador__username")
    list_filter = ("created_at",)


@admin.register(RespostaQuiz)
class RespostaQuizAdmin(admin.ModelAdmin):
    list_display = ("id", "aluno", "quiz", "nota", "respondido_em")
    search_fields = ("aluno__username", "quiz__title")
    list_filter = ("respondido_em",)


@admin.register(ComentarioForum)
class ComentarioForumAdmin(admin.ModelAdmin):
    list_display = ("id", "autor", "texto", "criado_em")
    search_fields = ("autor__username", "texto")
    list_filter = ("criado_em",)


@admin.register(RespostaForum)
class RespostaForumAdmin(admin.ModelAdmin):
    list_display = ("id", "autor", "texto", "criado_em")
    search_fields = ("autor__username", "texto")
    list_filter = ("criado_em",)


@admin.register(Desempenho)
class DesempenhoAdmin(admin.ModelAdmin):
    list_display = ("id", "titulo", "nota", "aluno", "descricao")
    search_fields = ("aluno__username", "titulo")
    list_filter = ("nota",)


@admin.register(SolicitacaoProfessor)
class SolicitacaoProfessorAdmin(admin.ModelAdmin):
    list_display = ["username", "email", "data_solicitacao", "aprovado"]
    actions = ["aprovar_solicitacao"]

    def aprovar_solicitacao(self, request, queryset):
        # --- LÓGICA DE NEGÓCIO REMOVIDA E SUBSTITUÍDA PELA FACADE ---
        aprovadas = 0
        falhas = 0
        for solicitacao in queryset:
            success, message = ProfessorApprovalService.approve(solicitacao)
            if success:
                aprovadas += 1
            else:
                # Se já estava aprovada, não contamos como falha nova
                if message != "Solicitação já aprovada.":
                    falhas += 1
        
        if aprovadas > 0:
            self.message_user(request, f"{aprovadas} solicitações aprovadas com sucesso.")
        if falhas > 0:
            self.message_user(request, f"{falhas} solicitações falharam.", level='ERROR')
        # --- FIM DA MODIFICAÇÃO ---

    aprovar_solicitacao.short_description = "Aprovar solicitações selecionadas"