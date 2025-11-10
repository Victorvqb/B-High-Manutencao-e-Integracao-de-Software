import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export default function ForumAluno() {
    const [comentarios, setComentarios] = useState([]);
    const [novoComentario, setNovoComentario] = useState("");
    const [respostaAtiva, setRespostaAtiva] = useState(null);
    const [novaResposta, setNovaResposta] = useState("");
    const [editando, setEditando] = useState({ id: null, texto: "", isResposta: false });
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
        const { data } = await axiosInstance.get("forum/");
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

    // ... (restante das funções como adicionarResposta, iniciarEdicao, salvarEdicao, apagar)
    const adicionarResposta = async (comentarioId) => {
        // ...
    };
    const iniciarEdicao = (id, texto, isResposta = false) => {
        // ...
    };
    const salvarEdicao = async () => {
        // ...
    };
    const apagar = async (id, isResposta = false) => {
        // ...
    };
  
    return (
      <div className="p-6">
        {/* Conteúdo da página do Fórum do Aluno aqui... */}
      </div>
    );
}