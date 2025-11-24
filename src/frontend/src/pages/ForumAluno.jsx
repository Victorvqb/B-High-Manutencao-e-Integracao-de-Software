import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { FaReply, FaHeart, FaTrash } from "react-icons/fa";

export default function ForumAluno() {
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [respostaAtiva, setRespostaAtiva] = useState(null);
  const [novaResposta, setNovaResposta] = useState("");
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

  const handleLike = async (id, isResposta = false) => {
    const url = isResposta
      ? `forum/resposta/${id}/like/`
      : `forum/comentario/${id}/like/`;
    try {
      const { data } = await axiosInstance.post(url);
      setComentarios(prev => prev.map(com => {
        if (!isResposta && com.id === id) {
          return { ...com, likes_count: data.total_likes, usuario_curtiu: data.curtido };
        }
        if (isResposta) {
          return {
            ...com,
            respostas: com.respostas.map(res => {
              if (res.id === id) return { ...res, likes_count: data.total_likes, usuario_curtiu: data.curtido };
              return res;
            })
          };
        }
        return com;
      }));
    } catch (err) {
      console.error("Erro ao curtir:", err);
    }
  };

  const apagar = async (id) => {
    if (!window.confirm("Apagar seu comentário?")) return;
    try {
      await axiosInstance.delete(`forum/${id}/`);
      fetchComentarios();
    } catch (err) { console.error(err); }
  };

  return (
    <main className="flex-1 p-6">
      <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-6">Fórum da Turma</h1>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <textarea
          value={novoComentario}
          onChange={(e) => setNovoComentario(e.target.value)}
          placeholder="Tire sua dúvida ou compartilhe algo..."
          className="w-full p-2 rounded border dark:bg-gray-700 text-black dark:text-white"
        />
        <button onClick={adicionarComentario} className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Publicar</button>
      </div>

      <div className="space-y-4">
        {comentarios.map(com => (
          <div key={com.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-gray-900 dark:text-white"><strong>{com.autor_nome}:</strong> {com.texto}</p>
            <div className="flex gap-3 text-xs mt-2 items-center">
              <button 
                onClick={() => handleLike(com.id, false)}
                className={`flex items-center gap-1 ${com.usuario_curtiu ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
              >
                <FaHeart /> {com.likes_count || 0}
              </button>
              <button onClick={() => setRespostaAtiva(respostaAtiva === com.id ? null : com.id)} className="text-blue-500 hover:underline flex gap-1 items-center"><FaReply /> Responder</button>
              {com.autor_username === username && (
                 <button onClick={() => apagar(com.id)} className="text-red-500 hover:underline flex gap-1 items-center"><FaTrash /> Apagar</button>
              )}
            </div>

            <div className="ml-6 mt-3 space-y-2 border-l-2 pl-4 dark:border-gray-700">
              {com.respostas.map(res => (
                <div key={res.id}>
                  <p className="text-gray-800 dark:text-gray-200 text-sm"><strong>{res.autor_nome}:</strong> {res.texto}</p>
                  <div className="flex gap-3 text-xs mt-1">
                    <button 
                        onClick={() => handleLike(res.id, true)}
                        className={`flex items-center gap-1 ${res.usuario_curtiu ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                    >
                        <FaHeart /> {res.likes_count || 0}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {respostaAtiva === com.id && (
              <div className="ml-6 mt-2">
                <textarea
                  value={novaResposta}
                  onChange={(e) => setNovaResposta(e.target.value)}
                  placeholder="Sua resposta..."
                  className="w-full p-2 text-sm rounded border dark:bg-gray-700"
                />
                <button onClick={() => adicionarResposta(com.id)} className="mt-1 bg-blue-500 text-white px-3 py-1 text-sm rounded">Enviar</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}