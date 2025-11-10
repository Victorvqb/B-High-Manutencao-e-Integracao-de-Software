import os
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Exists, OuterRef, Q
from rest_framework.parsers import MultiPartParser
from googleapiclient.discovery import build
from django.core.cache import cache
from rest_framework.views import APIView
from django.utils import timezone
from rest_framework.response import Response
from django.db.models import Exists, OuterRef, Q
from rest_framework.parsers import MultiPartParser
from rest_framework import serializers
from .models import Quiz
from rest_framework import status
from .serializers import QuizSerializer
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets, generics, permissions
from .serializers import AulaSerializer, EntregaSerializer
from .models import Usuario, Entrega, Aula
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
    ListAPIView
)
from rest_framework.decorators import action
from rest_framework.permissions import (
    IsAuthenticated, IsAdminUser, AllowAny
)
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils.timezone import now

from .models import (
    Usuario, Aula, Entrega, Quiz, RespostaQuiz,
    Atividade, Alternativa,
    ComentarioForum, RespostaForum, Desempenho,
    SolicitacaoProfessor
)

from .serializers import (
    CustomLoginSerializer,
    UsuarioSerializer,
    AulaSerializer,
    EntregaSerializer,
    QuizSerializer,
    RespostaQuizSerializer,
    CustomTokenObtainPairSerializer,
    AtividadeSerializer,
    ComentarioForumSerializer,
    DesempenhoSerializer,
    SolicitacaoProfessorSerializer,
    YouTubeVideoSerializer,
)

# ─── Entregas ──────────────────────────────
class EntregaView(generics.CreateAPIView):
    queryset = Entrega.objects.all()
    serializer_class = EntregaSerializer

    def perform_create(self, serializer):
        serializer.save(aluno=self.request.user)

# ─── Aulas ────────────────────────────────
class HomeMetricsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        aluno = self.request.user
        total_aulas = Aula.objects.filter(professor=aluno).count()
        entregas = Entrega.objects.filter(aluno=aluno)
        aulas_concluidas_ids = entregas.values_list('aula', flat=True)
        aulas_pendentes = total_aulas - len(aulas_concluidas_ids)
        aulas_concluidas = len(aulas_concluidas_ids)
        total_quizzes = Quiz.objects.count()
        quizzes_pendentes = total_quizzes - len(entregas.filter(aula__quiz__isnull=False))
        total_atividades = Atividade.objects.filter(professor=aluno).count()
        atividades_pendentes = total_atividades - len(entregas.filter(aula__atividade__isnull=False))
        return Response({
            "total_aulas": total_aulas, "aulas_pendentes": aulas_pendentes,
            "aulas_concluidas": aulas_concluidas, "total_quizzes": total_quizzes,
            "quizzes_pendentes": quizzes_pendentes, "total_atividades": total_atividades,
            "atividades_pendentes": atividades_pendentes,
        })

class AulaMetricsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        total_aulas = Aula.objects.filter(professor=request.user).count()
        entregas = Entrega.objects.filter(aluno=request.user)
        aulas_concluidas_ids = entregas.values_list('aula', flat=True)
        aulas_pendentes = total_aulas - len(aulas_concluidas_ids)
        aulas_concluidas = len(aulas_concluidas_ids)
        return Response({
            "total_aulas": total_aulas,
            "aulas_pendentes": aulas_pendentes,
            "aulas_concluidas": aulas_concluidas
        })

class AulaView(ListCreateAPIView):
    queryset = Aula.objects.all()
    serializer_class = AulaSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]
    def perform_create(self, serializer):
        agendada = self.request.data.get("agendada", "false").lower() == "true"
        serializer.save(professor=self.request.user, agendada=agendada)

class AulaDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = AulaSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Aula.objects.filter(professor=user)
        return Aula.objects.none()

class AulasDisponiveisView(ListAPIView):
    serializer_class = AulaSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Aula.objects.none()
        agora = timezone.localtime()
        entregas = Entrega.objects.filter(aula=OuterRef('pk'), aluno=user)
        return Aula.objects.annotate(ja_entregue=Exists(entregas)).filter(ja_entregue=False).filter(
            Q(agendada=False) |
            Q(agendada=True, data__lt=agora.date()) |
            Q(agendada=True, data=agora.date(), hora__lte=agora.time())
        )

# ─── Quizzes ──────────────────────────────
class QuizListCreateView(generics.ListCreateAPIView):
    queryset = Quiz.objects.all().order_by('-created_at')
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), permissions.IsAdminUser()]
        return [permissions.AllowAny()]
    def perform_create(self, serializer):
        pdf_file = self.request.FILES.get("pdf")
        if pdf_file:
            serializer.save(criador=self.request.user, pdf=pdf_file)
        else:
            serializer.save(criador=self.request.user)

class QuizListView(APIView):
    def get(self, request):
        quizzes = Quiz.objects.all()
        serializer = QuizSerializer(quizzes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class QuizDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Quiz.objects.all()
    def get_permissions(self):
        if self.request.method in ['PUT', 'DELETE']:
            if not self.request.user == self.get_object().criador and not self.request.user.is_staff:
                return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]

class RespostaQuizView(ListAPIView):
    serializer_class = RespostaQuizSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return RespostaQuiz.objects.filter(aluno=self.request.user)

class QuizSubmitView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, pk):
        quiz = Quiz.objects.filter(pk=pk).first()
        if not quiz:
            return Response({"error": "Quiz não encontrado"}, status=404)
        respostas = request.data.get("answers", {})
        comentario = request.data.get("comentario", "")
        arquivo = request.FILES.get("arquivo")
        acertos = 0
        for question_id, alternativa_id in respostas.items():
            try:
                alt = Alternativa.objects.get(id=alternativa_id, question__id=question_id)
                if alt.is_correct:
                    acertos += 1
            except Alternativa.DoesNotExist:
                continue
        entrega = Entrega.objects.create(
            aluno=request.user, quiz=quiz, arquivo=arquivo, comentario=comentario
        )
        RespostaQuiz.objects.create(
            aluno=request.user, quiz=quiz, resposta=respostas, nota=acertos
        )
        return Response({"message": "Respostas enviadas.", "score": acertos})

# ─── Usuários ─────────────────────────────
class AlunoListView(ListAPIView):
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Usuario.objects.filter(is_staff=False, is_active=True)

class UsuarioListCreateView(ListCreateAPIView):
    queryset = Usuario.objects.filter(is_active=True)
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny]
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("🚨 Erros de validação no cadastro:", serializer.errors)
            return Response(serializer.errors, status=400)
        self.perform_create(serializer)
        return Response(serializer.data, status=201)

class UsuarioDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]
    def delete(self, request, *args, **kwargs):
        usuario = self.get_object()
        usuario.is_active = False
        usuario.save()
        return Response({"detail": "Usuário desativado"}, status=204)

class ChangePasswordView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get("username")
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        if not username or not old_password or not new_password:
            return Response({"detail": "Todos os campos são obrigatórios."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = Usuario.objects.get(username=username)
        except Usuario.DoesNotExist:
            return Response({"detail": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        if not user.check_password(old_password):
            return Response({"detail": "Senha antiga incorreta."}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        user.save()
        return Response({"detail": "Senha alterada com sucesso!"}, status=status.HTTP_200_OK)

# ─── Foto Perfil ──────────────────────────
class AtualizarFotoPerfilView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user = request.user
        user.foto_perfil = request.data.get("foto_perfil")
        user.save()
        return Response({"foto_url": user.foto_perfil.url})

# ─── Login/Token ──────────────────────────
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class LoginView(APIView):
    def post(self, request):
        serializer = CustomLoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data)
        return Response(serializer.errors, status=400)

# ─── Atividade View ───────────────────────────────────
class AtividadeView(ListCreateAPIView):
    serializer_class = AtividadeSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Atividade.objects.filter(professor=user) if user.is_staff else Atividade.objects.none()
    def perform_create(self, serializer):
        serializer.save(professor=self.request.user)

class AtividadesDisponiveisView(ListAPIView):
    serializer_class = AtividadeSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and not user.is_staff:
            return Atividade.objects.filter(data_entrega__gte=now()).order_by("data_entrega")
        return Atividade.objects.none()

class AtividadeDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = AtividadeSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Atividade.objects.filter(professor=user) if user.is_staff else Atividade.objects.all()

class EnviarAtividadeView(APIView):
    def post(self, request, *args, **kwargs):
        if 'arquivo' not in request.FILES:
            return Response({"detail": "Arquivo é necessário!"}, status=status.HTTP_400_BAD_REQUEST)
        arquivo = request.FILES['arquivo']
        quiz = request.data.get('quiz')
        comentario = request.data.get('comentario')
        entrega = Entrega.objects.create(
            quiz_id=quiz, comentario=comentario, arquivo=arquivo,
        )
        return Response({"message": "Atividade recebida!"}, status=status.HTTP_200_OK)

# ─── Fórum ────────────────────────────────
class ForumAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        comentarios = ComentarioForum.objects.all().order_by("-id")
        serializer = ComentarioForumSerializer(comentarios, many=True)
        return Response(serializer.data)
    def post(self, request):
        comentario = ComentarioForum.objects.create(
            autor=request.user, texto=request.data.get("texto")
        )
        return Response({"id": comentario.id})
    def put(self, request, pk):
        comentario = get_object_or_404(ComentarioForum, pk=pk, autor=request.user)
        comentario.texto = request.data.get("texto", comentario.texto)
        comentario.save()
        return Response({"detail": "Comentário atualizado"})
    def delete(self, request, pk):
        comentario = get_object_or_404(ComentarioForum, pk=pk, autor=request.user)
        comentario.delete()
        return Response({"detail": "Comentário apagado"})

class ResponderComentarioAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, pk):
        comentario = ComentarioForum.objects.filter(pk=pk).first()
        if not comentario:
            return Response({"error": "Comentário não encontrado"}, status=404)
        resposta = RespostaForum.objects.create(
            comentario=comentario, autor=request.user, texto=request.data.get("texto")
        )
        return Response({"id": resposta.id})

# ─── Desempenho ───────────────────────────
class DesempenhoCreateListView(ListCreateAPIView):
    serializer_class = DesempenhoSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Desempenho.objects.all() if user.is_staff else Desempenho.objects.filter(aluno=user)

class DesempenhoDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Desempenho.objects.all()
    serializer_class = DesempenhoSerializer
    permission_classes = [IsAuthenticated]

# ─── Solicitação de Professores ───────────
class SolicitacaoProfessorCreateView(ListCreateAPIView):
    queryset = SolicitacaoProfessor.objects.all()
    serializer_class = SolicitacaoProfessorSerializer
    permission_classes = [AllowAny]

class (viewsets.ViewSet):
    permission_classes = [IsAdminUser]
    def list(self, request):
        queryset = SolicitacaoProfessor.objects.all()
        serializer = SolicitacaoProfessorSerializer(queryset, many=True)
        return Response(serializer.data)
    @action(detail=True, methods=["post"])
    def aprovar(self, request, pk=None):
        solicitacao = SolicitacaoProfessor.objects.filter(pk=pk).first()
        if not solicitacao:
            return Response({"detail": "Não encontrada"}, status=404)
        if solicitacao.aprovado:
            return Response({"detail": "Já aprovada"}, status=400)
        Usuario.objects.create_user(
            username=solicitacao.username, password=solicitacao.senha,
            email=solicitacao.email, first_name=solicitacao.nome,
            last_name=solicitacao.sobrenome, is_staff=True, is_active=True,
        )
        solicitacao.aprovado = True
        solicitacao.save()
        return Response({"detail": "Aprovada"})
    @action(detail=True, methods=["post"])
    def rejeitar(self, request, pk=None):
        solicitacao = SolicitacaoProfessor.objects.filter(pk=pk).first()
        if not solicitacao:
            return Response({"detail": "Não encontrada"}, status=404)
        solicitacao.delete()
        return Response({"detail": "Rejeitada"})

# ─── YouTube Videos ───────────────────────────────────────────
class YouTubeVideosView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')
        CHANNEL_ID = 'UC_x5XG1OV2P6uZZ5FSM9Ttw' 
        CACHE_KEY = 'youtube_videos'
        
        cached_videos = cache.get(CACHE_KEY)
        if cached_videos:
            print("🎬 Servindo vídeos do YouTube a partir do cache.")
            return Response(cached_videos)

        if not YOUTUBE_API_KEY:
            return Response(
                {"error": "A chave da API do YouTube não está configurada no servidor."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        try:
            print("🎬 Buscando vídeos novos da API do YouTube...")
            youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)
            search_response = youtube.search().list(
                channelId=CHANNEL_ID, part='snippet', maxResults=6,
                order='date', type='video'
            ).execute()
            videos = []
            for item in search_response.get('items', []):
                video_data = {
                    'title': item['snippet']['title'],
                    'video_id': item['id']['videoId'],
                    'thumbnail_url': item['snippet']['thumbnails']['high']['url']
                }
                videos.append(video_data)
            serializer = YouTubeVideoSerializer(data=videos, many=True)
            serializer.is_valid(raise_exception=True)
            cache.set(CACHE_KEY, serializer.data, timeout=3600)
            return Response(serializer.data)
        except Exception as e:
            # ADICIONE APENAS ESTA LINHA DENTRO DO BLOCO "except"
            print(f"❌ ERRO DETALhado DA API DO YOUTUBE: {e}") 
            
            print(f"❌ Erro ao buscar vídeos do YouTube: {e}")
            return Response(
                {"error": "Ocorreu um erro ao buscar os vídeos do YouTube."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
            # ─── Exclusão de Conta (LGPD) ───────────────────────────────────
class DeleteUserAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        user = request.user
        password = request.data.get("password")

        if not password:
            return Response(
                {"error": "A senha é necessária para confirmar a exclusão."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user.check_password(password):
            return Response(
                {"error": "Senha incorreta."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Log anonimizado antes de apagar, como planeado na ata
        print(f"[LGPD LOG] Utilizador com ID {user.id} solicitou exclusão e foi apagado em {timezone.now()}")
        
        # Apaga o utilizador permanentemente
        user.delete()
        
        return Response(
            {"detail": "Conta apagada com sucesso."},
            status=status.HTTP_204_NO_CONTENT
        )