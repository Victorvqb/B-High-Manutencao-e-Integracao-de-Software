from django.urls import path
from .views import (
    ChangePasswordView,
    ForumAPIView, 
    ResponderComentarioAPIView,
    
    # --- IMPORTS DOS LIKES (ETAPA 2) ---
    ToggleLikeComentarioView,  
    ToggleLikeRespostaView   
)

urlpatterns = [
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    
    # --- ROTAS DO FÓRUM 
    path('forum/', ForumAPIView.as_view(), name='forum-lista'),
    path('forum/<int:pk>/', ForumAPIView.as_view(), name='forum-detalhe'),
    path('forum/<int:pk>/responder/', ResponderComentarioAPIView.as_view(), name='forum-responder'),

    # VVVVVV ROTAS ADICIONADAS (ETAPA 2 - LIKES) VVVVVV
    path('forum/comentario/<int:comentario_id>/like/', ToggleLikeComentarioView.as_view(), name='like-comentario'),
    path('forum/resposta/<int:resposta_id>/like/', ToggleLikeRespostaView.as_view(), name='like-resposta'),
    # ^^^^^^ FIM DAS NOVAS ROTAS ^^^^^^
    
    # NOTA: Outras rotas (Aulas, Quizzes, etc.) precisam ser feitas, ver com o Breno 
]