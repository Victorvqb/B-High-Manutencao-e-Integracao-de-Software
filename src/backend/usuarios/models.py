from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

# ─── Usuário ───────────────────────────────────────────────────
class Usuario(AbstractUser):
    foto_perfil = models.ImageField(upload_to="fotos_perfil/", null=True, blank=True)
    consent_timestamp = models.DateTimeField(null=True, blank=True, help_text="Timestamp of user consent to terms.")

    def __str__(self):
        return self.username


# ─── Aulas ─────────────────────────────────────────────────────
def validate_video(value):
    file_extension = value.name.split('.')[-1].lower()
    if file_extension not in ['mp4', 'mov']:
        raise ValidationError('Arquivo de vídeo inválido. Use arquivos .mp4 ou .mov.')

def validate_pdf(value):
    file_extension = value.name.split('.')[-1].lower()
    if file_extension != 'pdf':
        raise ValidationError('Arquivo inválido. Apenas arquivos PDF são permitidos.')

def validate_aula_arquivo(value):
    """Validador único que aceita vídeo OU PDF."""
    file_extension = value.name.split('.')[-1].lower()
    if file_extension not in ['mp4', 'mov', 'pdf']:
        raise ValidationError('Tipo de arquivo inválido. Use .mp4, .mov ou .pdf.')


class Aula(models.Model):
    """Modelo de Aulas Postadas por Professores"""

    class TipoConteudo(models.TextChoices):
        URL_EXTERNA = 'video_url', 'Link de Vídeo Externo'
        UPLOAD_VIDEO = 'video_upload', 'Upload de Vídeo'
        ARQUIVO_PDF = 'pdf', 'Documento PDF'
        INDEFINIDO = 'undefined', 'Indefinido'

    titulo = models.CharField(max_length=100)
    descricao = models.TextField(blank=True)
    
    tipo_conteudo = models.CharField(
        max_length=20,
        choices=TipoConteudo.choices,
        default=TipoConteudo.INDEFINIDO,
        help_text="Define se a aula é um link, um vídeo ou um PDF."
    )
    
    video_url = models.URLField(
        blank=True, 
        help_text="Use para links do YouTube, Vimeo, etc. (se tipo_conteudo='video_url')"
    )
    arquivo = models.FileField(
        upload_to="aulas_uploads/", 
        blank=True, 
        null=True, 
        validators=[validate_aula_arquivo], 
        help_text="Use para uploads de .mp4, .mov ou .pdf"
    )
    
    data = models.DateField()
    hora = models.TimeField()
    agendada = models.BooleanField(default=False)
    professor = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="aulas")
    criada_em = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.tipo_conteudo == 'video_url':
            self.arquivo = None
        elif self.tipo_conteudo in ['video_upload', 'pdf']:
            self.video_url = ''
        
        if self.tipo_conteudo == 'undefined':
            if self.video_url:
                self.tipo_conteudo = self.TipoConteudo.URL_EXTERNA
            elif self.arquivo:
                ext = self.arquivo.name.split('.')[-1].lower()
                if ext == 'pdf':
                    self.tipo_conteudo = self.TipoConteudo.ARQUIVO_PDF
                elif ext in ['mp4', 'mov']:
                    self.tipo_conteudo = self.TipoConteudo.UPLOAD_VIDEO
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.titulo} - {self.professor.username}"


# ─── Entregas ──────────────────────────────────────────────────
class Entrega(models.Model):
    aluno = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="entregas")
    aula = models.ForeignKey(Aula, on_delete=models.CASCADE, related_name="entregas")
    arquivo = models.FileField(upload_to="entregas/")
    data_envio = models.DateTimeField(auto_now_add=True)
    resposta_texto = models.TextField(blank=True)
    quiz = models.ForeignKey('Quiz', on_delete=models.CASCADE, related_name="entregas")
    comentario = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Entrega do Quiz {self.quiz.title} - {self.aluno.username}"


# ─── Quizzes ───────────────────────────────────────────────────
class Quiz(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    criador = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    pdf = models.FileField(upload_to='quizzes/pdf/', null=True, blank=True, validators=[validate_pdf])

    def __str__(self):
        return self.title


class Questao(models.Model):
    quiz = models.ForeignKey(Quiz, related_name="questions", on_delete=models.CASCADE)
    text = models.TextField()

    def __str__(self):
        return f"Q: {self.text[:50]}"


class Alternativa(models.Model):
    question = models.ForeignKey(Questao, related_name="choices", on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.text} ({'✔' if self.is_correct else '✘'})"


# ─── Resposta de Quiz ──────────────────────────────────────────
class RespostaQuiz(models.Model):
    aluno = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="respostas_quiz")
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="respostas")
    resposta = models.JSONField()
    nota = models.IntegerField(null=True, blank=True)
    respondido_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.aluno.username} → Quiz {self.quiz.id}"


# ─── Atividades ────────────────────────────────────────────────
class Atividade(models.Model):
    titulo = models.CharField(max_length=200)
    descricao = models.TextField(blank=True)
    data_entrega = models.DateField()
    hora_entrega = models.TimeField()
    pontos = models.PositiveIntegerField()
    arquivo = models.FileField(upload_to="atividades/", null=True, blank=True)
    professor = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="atividades")
    criada_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.titulo} - {self.professor.username}"


# ─── Fórum ─────────────────────────────────────────────────────
class ComentarioForum(models.Model):
    autor = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="comentarios_forum")
    texto = models.TextField()
    criado_em = models.DateTimeField(auto_now_add=True)
    # VVVVVV MUDANÇA (ETAPA 2) VVVVVV
    likes = models.ManyToManyField(Usuario, related_name='comentarios_curtidos', blank=True)
    # ^^^^^^ FIM DA MUDANÇA ^^^^^^

    def __str__(self):
        return f"{self.autor.username}: {self.texto[:30]}"

    # VVVVVV PROPRIEDADES ADICIONADAS (para o frontend) VVVVVV
    @property
    def autor_nome(self):
        return self.autor.first_name or self.autor.username

    @property
    def autor_username(self):
        return self.autor.username
    # ^^^^^^ FIM DAS PROPRIEDADES ^^^^^^


class RespostaForum(models.Model):
    comentario = models.ForeignKey(ComentarioForum, related_name="respostas", on_delete=models.CASCADE)
    autor = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="respostas_forum")
    texto = models.TextField()
    criado_em = models.DateTimeField(auto_now_add=True)
    # VVVVVV MUDANÇA (ETAPA 2) VVVVVV
    likes = models.ManyToManyField(Usuario, related_name='respostas_curtidas', blank=True)
    # ^^^^^^ FIM DA MUDANÇA ^^^^^^

    def __str__(self):
        return f"{self.autor.username} respondeu: {self.texto[:30]}"

    # VVVVVV PROPRIEDADE ADICIONADA (para o frontend) VVVVVV
    @property
    def autor_nome(self):
        return self.autor.first_name or self.autor.username
    # ^^^^^^ FIM DA PROPRIEDADE ^^^^^^


# ─── Desempenho ────────────────────────────────────────────────
class Desempenho(models.Model):
    titulo = models.CharField(max_length=255)
    descricao = models.TextField()
    nota = models.DecimalField(max_digits=4, decimal_places=2)
    aluno = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="desempenhos")

    def __str__(self):
        return f"{self.titulo} - {self.aluno.username}"


# ─── Solicitação de Professor ──────────────────────────────────
class SolicitacaoProfessor(models.Model):
    nome = models.CharField(max_length=150)
    sobrenome = models.CharField(max_length=150)
    email = models.EmailField()
    username = models.CharField(max_length=150, unique=True)
    senha = models.CharField(max_length=128, help_text="Senha em texto puro, será criptografada ao aprovar.")
    data_solicitacao = models.DateTimeField(auto_now_add=True)
    aprovado = models.BooleanField(default=False)

    def __str__(self):
        status = "Aprovado" if self.aprovado else "Pendente"
        return f"{self.username} ({status})"