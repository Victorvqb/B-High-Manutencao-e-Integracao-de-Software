import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
// VVVVVV ÍCONE DE CORAÇÃO ADICIONADO VVVVVV
import { FaEdit, FaTrash, FaReply, FaHeart } from "react-icons/fa"; 

export default function ForumProfessor() {
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [respostaAtiva, setRespostaAtiva] = useState(null);
  const [novaResposta, setNovaResposta] = useState("");
  const [editando, setEditando] = useState({ id: null, texto: "", isResposta: false, comentarioPaiId: null });
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setUsername(decoded.username || decoded.name || "Usuário");
    } catch {
      navigate("/login");
      return;
    }
    fetchComentarios();
  }, [navigate]);

  const fetchComentarios = async () => {
    try {
      // ATUALIZADO: Passa o 'context' para o serializer saber quem está logado
      const { data } = await axiosInstance.get("forum/", {
        params: { context: 'request' } 
      });
      setComentarios(data);
    } catch (err) {
      console.error("Erro ao carregar comentários:", err);
    }
  };

  const adicionarComentario = async () => {
    if (!novoComentario.trim()) return;
    try {
      await axiosInstance.post("forum/", { texto: novoComentario });
      setNovoComentario("");
      fetchComentarios();
    } catch (err) {
      console.error("Erro ao adicionar comentário:", err);
    }
  };

  const adicionarResposta = async (comentarioId) => {
    if (!novaResposta.trim()) return;
    try {
      await axiosInstance.post(`forum/${comentarioId}/responder/`, { texto: novaResposta });
      setNovaResposta("");
      setRespostaAtiva(null);
      fetchComentarios();
    } catch (err) {
      console.error("Erro ao adicionar resposta:", err);
    }
  };
  
  const iniciarEdicao = (id, texto, isResposta = false, comentarioPaiId = null) => {
    setEditando({ id, texto, isResposta, comentarioPaiId });
  };

  const salvarEdicao = async () => {
    const { id, texto, isResposta } = editando;
    if (!texto.trim()) return;
    try {
        if (isResposta) {
            // await axiosInstance.put(`forum/respostas/${id}/`, { texto }); // Endpoint hipotético
        } else {
            await axiosInstance.put(`forum/${id}/`, { texto });
        }
        setEditando({ id: null, texto: "" });
        fetchComentarios();
    } catch(err) {
        console.error("Erro ao salvar edição:", err);
    }
  };
  
  const apagar = async (id, isResposta = false) => {
    const confirmDelete = window.confirm("Tem a certeza que quer apagar?");
    if (!confirmDelete) return;
    try {
        if (isResposta) {
            // await axiosInstance.delete(`forum/respostas/${id}/`); // Endpoint hipotético
        } else {
            await axiosInstance.delete(`forum/${id}/`);
        }
        fetchComentarios();
    } catch (err) {
        console.error("Erro ao apagar:", err);
    }
  };

  // VVVVVV NOVA FUNÇÃO DE LIKE (ETAPA 2) VVVVVV
  const handleLike = async (id, isResposta = false) => {
    const url = isResposta
      ? `forum/resposta/${id}/like/`
      : `forum/comentario/${id}/like/`;
    
    try {
      const { data } = await axiosInstance.post(url);

      // Atualiza o estado local (UI Otimista)
      setComentarios(prevComentarios => {
        return prevComentarios.map(com => {
          if (!isResposta && com.id === id) {
            return {
              ...com,
              likes_count: data.total_likes,
              usuario_curtiu: data.curtido,
            };
          }
          if (isResposta) {
            return {
              ...com,
              respostas: com.respostas.map(res => {
                if (res.id === id) {
                  return {
                    ...res,
                    likes_count: data.total_likes,
                    usuario_curtiu: data.curtido,
                  };
                }
                return res;
              })
            };
          }
          return com;
        });
      });

    } catch (err) {
      console.error("Erro ao curtir:", err);
    }
  };
  // ^^^^^^ FIM DA FUNÇÃO ^^^^^^

  return (
    <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-6">
            Fórum da Turma
        </h1>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
            <textarea
                value={novoComentario}
                onChange={(e) => setNovoComentario(e.target.value)}
                placeholder="Escreva um novo comentário no fórum..."
                className="w-full p-2 rounded border dark:bg-gray-700"
            />
            <button onClick={adicionarComentario} className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Publicar</button>
        </div>
        
        <div className="space-y-4">
            {comentarios.map(comentario => (
                <div key={comentario.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <p className="text-gray-900 dark:text-white"><strong>{comentario.autor_nome}:</strong> {comentario.texto}</p>
                    
                    <div className="flex gap-3 text-xs mt-2 items-center">
                        {/* VVVVVV BOTÃO DE LIKE ADICIONADO VVVVVV */}
                        <button 
                            onClick={() => handleLike(comentario.id, false)}
                            className={`flex items-center gap-1 ${comentario.usuario_curtiu ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'} transition-colors`}
                        >
                            <FaHeart /> {comentario.likes_count || 0}
                        </button>
                        {/* ^^^^^^ FIM DO BOTÃO ^^^^^^ */}

                        <button 
                            onClick={() => setRespostaAtiva(respostaAtiva === comentario.id ? null : comentario.id)}
                            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                            <FaReply /> Responder
                        </button>
                        
                        {comentario.autor_username === username && (
                            <>
                                <button 
                                    onClick={() => iniciarEdicao(comentario.id, comentario.texto)} 
                                    className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-400 text-white px-3 py-1 rounded text-xs transition-colors"
                                >
                                    <FaEdit /> Editar
                                </button>
                                <button 
                                    onClick={() => apagar(comentario.id)} 
                                    className="flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-xs transition-colors"
                                >
                                    <FaTrash /> Apagar
                                </button>
                            </>
                        )}
                    </div>
                    
                    {/* Respostas */}
                    <div className="ml-6 mt-3 space-y-3 border-l-2 pl-4 dark:border-gray-700">
                        {comentario.respostas.map(resposta => (
                            <div key={resposta.id}>
                                <p className="text-gray-800 dark:text-gray-200"><strong>{resposta.autor_nome}:</strong> {resposta.texto}</p>
                                {/* VVVVVV LIKES NAS RESPOSTAS VVVVVV */}
                                <div className="flex gap-3 text-xs mt-1 items-center">
                                    <button 
                                        onClick={() => handleLike(resposta.id, true)}
                                        className={`flex items-center gap-1 ${resposta.usuario_curtiu ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'} transition-colors`}
                                    >
                                        <FaHeart /> {resposta.likes_count || 0}
                                    </button>
                                </div>
                                {/* ^^^^^^ FIM DOS LIKES ^^^^^^ */}
                            </div>
                        ))}
                    </div>

                    {/* Formulário de Resposta */}
                    {respostaAtiva === comentario.id && (
                        <div className="ml-6 mt-2">
                            <textarea
                                value={novaResposta}
                                onChange={(e) => setNovaResposta(e.target.value)}
                                placeholder="Escreva a sua resposta..."
                                className="w-full p-2 text-sm rounded border dark:bg-gray-700"
                            />
                            <button onClick={() => adicionarResposta(comentario.id)} className="mt-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm rounded">Enviar Resposta</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </main>
  );
}