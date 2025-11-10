from django.urls import path, include # <-- ADICIONADO 'include'
from rest_framework.routers import DefaultRouter # <-- ADICIONADO 'DefaultRouter'

# IMPORTAÇÕES COMPLETAS DAS VIEWS
from .views import (
    ChangePasswordView,
    UsuarioViewSet,
    AulaView, AulaDetailView, AulasDisponiveisView,
    EntregaView,
    QuizListCreateView, QuizDetailView, QuizSubmitView, RespostaQuizView,
    AtividadeView, AtividadesDisponiveisView, AtividadeDetailView,
    ForumAPIView, ResponderComentarioAPIView,
    DesempenhoCreateListView, DesempenhoDetailView,
    SolicitacaoProfessorCreateView, SolicitacaoProfessorAdminViewSet,
    AlunoListView,
    AtualizarFotoPerfilView,
    DeleteUserAccountView,
    YoutubeVideosView,
    CustomTokenObtainPairView,

    # Novas Views de Like (Etapa 2)
    ToggleLikeComentarioView,
    ToggleLikeRespostaView
)

# O seu 'views.py' usa ViewSets, então precisamos registrar elas em um router.
router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'solicitacoes-professor', SolicitacaoProfessorCreateView, basename='solicitacao-professor')
router.register(r'admin/solicitacoes-professor', SolicitacaoProfessorAdminViewSet, basename='admin-solicitacoes')

# O 'urlpatterns' agora inclui as rotas do router e as paths manuais
urlpatterns = [
    path('', include(router.urls)), # Rotas do Router
    
    # Rotas de Autenticação/Usuário
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('atualizar_foto_perfil/', AtualizarFotoPerfilView.as_view(), name='atualizar-foto-perfil'),
    path('user/delete-account/', DeleteUserAccountView.as_view(), name='delete-user-account'),
    path('alunos/', AlunoListView.as_view(), name='lista-alunos'),

    # Rotas de Aulas
    path('aulas/', AulaView.as_view(), name='aula-lista-criar'),
    path('aulas/<int:pk>/', AulaDetailView.as_view(), name='aula-detalhe'),
    path('aulas-aluno/', AulasDisponiveisView.as_view(), name='aulas-disponiveis'),

    # Rotas de Atividades
    path('atividades/', AtividadeView.as_view(), name='atividade-lista-criar'),
    path('atividades/<int:pk>/', AtividadeDetailView.as_view(), name='atividade-detalhe'),
    path('atividades-aluno/', AtividadesDisponiveisView.as_view(), name='atividades-disponiveis'),

    # Rotas de Quizzes
    path('quizzes/', QuizListCreateView.as_view(), name='quiz-lista-criar'),
    path('quizzes/<int:pk>/', QuizDetailView.as_view(), name='quiz-detalhe'),
    path('quizzes/<int:pk>/submit/', QuizSubmitView.as_view(), name='quiz-submit'),
    path('respostas-quiz/', RespostaQuizView.as_view(), name='respostas-quiz-lista'),
    
    # Rotas de Entregas
    path('entregas/', EntregaView.as_view(), name='entrega-criar'),

    # Rotas de Desempenho
    path('desempenhos/', DesempenhoCreateListView.as_view(), name='desempenho-lista-criar'),
    path('desempenhos/<int:pk>/', DesempenhoDetailView.as_view(), name='desempenho-detalhe'),

    # Rotas do Fórum
    path('forum/', ForumAPIView.as_view(), name='forum-lista'),
    path('forum/<int:pk>/', ForumAPIView.as_view(), name='forum-detalhe'),
    path('forum/<int:pk>/responder/', ResponderComentarioAPIView.as_view(), name='forum-responder'),

    # VVVVVV ROTAS ADICIONADAS (ETAPA 2 - LIKES) VVVVVV
    path('forum/comentario/<int:comentario_id>/like/', ToggleLikeComentarioView.as_view(), name='like-comentario'),
    path('forum/resposta/<int:resposta_id>/like/', ToggleLikeRespostaView.as_view(), name='like-resposta'),
    # ^^^^^^ FIM DAS NOVAS ROTAS ^^^^^^

    # Rota do YouTube
    path('youtube-videos/', YoutubeVideosView.as_view(), name='youtube-videos'),
]