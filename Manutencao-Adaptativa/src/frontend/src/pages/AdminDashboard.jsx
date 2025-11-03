import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
// A linha 'import Sidebar from ...' foi removida.

export default function AdminDashboard() {
  const [tab, setTab] = useState("solicitacoes");
  const [loading, setLoading] = useState(false);

  const [solicitacoes, setSolicitacoes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [desempenhos, setDesempenhos] = useState([]);
  const [editandoUsuario, setEditandoUsuario] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = () => {
    fetchSolicitacoes();
    fetchUsuarios();
    fetchAulas();
    fetchAtividades();
    fetchQuizzes();
    fetchDesempenhos();
  };

  const fetchSolicitacoes = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("admin/solicitacoes-professor/");
      setSolicitacoes(data);
    } catch (err) {
      console.error("Erro ao buscar solicitações", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuarios = async () => { /* ... (código existente) ... */ };
  const fetchAulas = async () => { /* ... (código existente) ... */ };
  const fetchAtividades = async () => { /* ... (código existente) ... */ };
  const fetchQuizzes = async () => { /* ... (código existente) ... */ };
  const fetchDesempenhos = async () => { /* ... (código existente) ... */ };

  const aprovarSolicitacao = async (id) => {
    await axiosInstance.post(`admin/solicitacoes-professor/${id}/aprovar/`);
    fetchAll(); // Recarrega tudo para garantir consistência
  };

  const rejeitarSolicitacao = async (id) => {
    await axiosInstance.post(`admin/solicitacoes-professor/${id}/rejeitar/`);
    fetchSolicitacoes();
  };

  const deleteItem = async (endpoint, id) => {
    if (!window.confirm("Tem certeza que deseja deletar?")) return;
    await axiosInstance.delete(`${endpoint}/${id}/`);
    fetchAll();
  };
  
  const salvarEdicaoUsuario = async () => {
    if (!editandoUsuario) return;
    const { id, ...data } = editandoUsuario;
    // O endpoint de detalhe do usuário geralmente usa o ID, não o username.
    await axiosInstance.put(`usuarios/${id}/`, data);
    setEditandoUsuario(null);
    fetchUsuarios();
  };

  const renderTab = () => {
    // ... (código de renderTab existente) ...
  };

  const tabs = [
    { id: "solicitacoes", label: "Solicitações" },
    { id: "usuarios", label: "Usuários" },
    { id: "aulas", label: "Aulas" },
    { id: "atividades", label: "Atividades" },
    { id: "quizzes", label: "Quizzes" },
    { id: "desempenhos", label: "Desempenhos" },
  ];

  return (
    // A renderização agora começa diretamente com <main>, pois o LayoutComSidebar já fornece a estrutura
    <main role="main" className="flex-1 p-6">
      <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-6">
        Painel Administrativo
      </h1>
      <div className="mb-8 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-1 rounded ${
              tab === t.id
                ? "bg-green-600 text-white"
                : "bg-green-100 dark:bg-gray-800 text-green-800 dark:text-green-400 border border-green-300 dark:border-green-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {renderTab()}
    </main>
  );
}