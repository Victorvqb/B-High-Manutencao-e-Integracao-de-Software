from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from usuarios.views import EnviarAtividadeView

from usuarios.views import (
    # Autenticação e usuários
    LoginView, CustomTokenObtainPairView, ChangePasswordView,
    UsuarioListCreateView, UsuarioDetailView, AtualizarFotoPerfilView, AlunoListView,

    # Aulas e entregas
    AulaView, AulaDetailView, AulasDisponiveisView,
    EntregaView,

    # Quizzes
    QuizListCreateView, QuizDetailView, QuizSubmitView, RespostaQuizView,

    # Atividades
    AtividadeView, AtividadeDetailView, AtividadesDisponiveisView,

    # Fórum
    ForumAPIView, ResponderComentarioAPIView,

    # Desempenho
    DesempenhoCreateListView, DesempenhoDetailView,

    # Solicitação de professor
    SolicitacaoProfessorCreateView, SolicitacaoProfessorAdminViewSet,

    # Métricas
    AulaMetricsView,

    # YouTube
    YouTubeVideosView,
    
    DeleteUserAccountView,
)

# DRF Router para ViewSets
router = DefaultRouter()
router.register(
    r"api/admin/solicitacoes-professor",
    SolicitacaoProfessorAdminViewSet,
    basename="admin-solicitacoes-professor"
)

urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),

    # Autenticação
    path("api/login/", LoginView.as_view(), name="login"),
    path("api/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/change_password/", ChangePasswordView.as_view(), name="change_password"),

    # Usuários
    path("api/usuarios/", UsuarioListCreateView.as_view(), name="usuarios"),
    path("api/usuarios/<int:pk>/", UsuarioDetailView.as_view(), name="usuario_detail"),
    path("api/alunos/", AlunoListView.as_view(), name="alunos"),
    path("api/atualizar_foto_perfil/", AtualizarFotoPerfilView.as_view(), name="atualizar_foto_perfil"),

    # Aulas
    path("api/aulas/", AulaView.as_view(), name="aulas"),
    path("api/aulas/<int:pk>/", AulaDetailView.as_view(), name="aula_detail"),
    path("api/aulas-aluno/", AulasDisponiveisView.as_view(), name="aulas_aluno"),
    path("api/metrics/", AulaMetricsView.as_view(), name="metrics"),

    # Quizzes
    path("api/quizzes/", QuizListCreateView.as_view(), name="quizzes"),
    path("api/quizzes/<int:pk>/", QuizDetailView.as_view(), name="quiz_detail"),
    path("api/quizzes/<int:pk>/submit/", QuizSubmitView.as_view(), name="quiz_submit"),
    path("api/respostas/", RespostaQuizView.as_view(), name="respostas_quiz"),

    # Atividades
    path("api/atividades/", AtividadeView.as_view(), name="atividades"),
    path("api/atividades/<int:pk>/", AtividadeDetailView.as_view(), name="atividade_detail"),
    path("api/atividades-aluno/", AtividadesDisponiveisView.as_view(), name="atividades_aluno"),

    # Fórum
    path("api/forum/", ForumAPIView.as_view(), name="forum"),
    path("api/forum/<int:pk>/", ForumAPIView.as_view(), name="forum_detail"),
    path("api/forum/<int:pk>/responder/", ResponderComentarioAPIView.as_view(), name="forum_responder"),

    # Desempenho
    path("api/desempenhos/", DesempenhoCreateListView.as_view(), name="desempenhos"),
    path("api/desempenhos/<int:pk>/", DesempenhoDetailView.as_view(), name="desempenho_detail"),

    # Solicitação pública de professor
    path("api/solicitacoes-professor/", SolicitacaoProfessorCreateView.as_view(), name="solicitacao_professor"),

    path('api/entregas/', EntregaView.as_view(), name='entrega-list'),
    
    # YouTube Videos
    path("api/youtube-videos/", YouTubeVideosView.as_view(), name="youtube_videos"),
    
    path("api/user/delete-account/", DeleteUserAccountView.as_view(), name="delete_user_account"),

    # Rotas do Router
    path("", include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)