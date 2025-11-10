import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function AdminDashboard() {
  const [tab, setTab] = useState("solicitacoes"); // Inicia na aba mais importante
  const [loading, setLoading] = useState(false);

  const [solicitacoes, setSolicitacoes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [editandoUsuario, setEditandoUsuario] = useState(null); // Estado para edição

  // Carrega todos os dados quando o componente monta
  useEffect(() => {
    fetchSolicitacoes();
    fetchUsuarios();
  }, []);

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

  const fetchUsuarios = async () => {
    try {
      const { data } = await axiosInstance.get("usuarios/"); // Endpoint de listagem de usuários
      setUsuarios(data);
    } catch (err) { 
      console.error("Erro ao buscar usuários", err); 
    }
  };

  // Ações do Admin
  const aprovarSolicitacao = async (id) => {
    try {
      await axiosInstance.post(`admin/solicitacoes-professor/${id}/aprovar/`);
      fetchSolicitacoes(); // Recarrega só as solicitações
      fetchUsuarios(); // Recarrega os usuários (pois um novo foi criado)
    } catch (err) {
      alert("Erro ao aprovar solicitação.");
    }
  };

  const rejeitarSolicitacao = async (id) => {
    try {
      await axiosInstance.post(`admin/solicitacoes-professor/${id}/rejeitar/`);
      fetchSolicitacoes(); // Recarrega só as solicitações
    } catch (err) {
      alert("Erro ao rejeitar solicitação.");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar este usuário?")) return;
    try {
      await axiosInstance.delete(`usuarios/${id}/`);
      fetchUsuarios(); // Recarrega os usuários
    } catch (err) {
      alert("Erro ao deletar usuário.");
    }
  };
  
  // (Funções de edição de usuário podem ser adicionadas aqui depois, se necessário)

  // Renderiza o conteúdo da aba selecionada
  const renderTab = () => {
    if (loading) {
      return <p className="text-gray-500 dark:text-gray-400">Carregando...</p>;
    }

    switch (tab) {
      case "solicitacoes":
        return (
          <div className="space-y-3">
            {solicitacoes.length === 0 && <p>Nenhuma solicitação pendente.</p>}
            {solicitacoes.map((s) => (
              <div key={s.id} className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center gap-2">
                <span className="text-sm">
                  <strong>{s.nome} {s.sobrenome}</strong> ({s.email}) - User: <strong>{s.username}</strong>
                </span>
                <div className="flex-shrink-0">
                  <button onClick={() => aprovarSolicitacao(s.id)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs mr-2 transition-colors">Aprovar</button>
                  <button onClick={() => rejeitarSolicitacao(s.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors">Rejeitar</button>
                </div>
              </div>
            ))}
          </div>
        );
        
      case "usuarios":
        return (
          <div className="space-y-3">
            {usuarios.length === 0 && <p>Nenhum usuário encontrado.</p>}
            {usuarios.map((u) => (
              <div key={u.id} className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center gap-2">
                <span className="text-sm">
                  <strong>{u.username}</strong> ({u.first_name} {u.last_name}) - {u.email}
                  {u.is_staff && <span className="ml-2 text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">Professor</span>}
                  {u.is_superuser && <span className="ml-2 text-xs bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded-full">Admin</span>}
                </span>
                <div className="flex-shrink-0">
                  {/* <button onClick={() => {}} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs mr-2 transition-colors">Editar</button> */}
                  {!u.is_superuser && ( // Impede que o admin se delete
                    <button onClick={() => deleteUser(u.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors">Deletar</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
        
      default:
        return null;
    }
  };

  const tabs = [
    { id: "solicitacoes", label: `Solicitações (${solicitacoes.length})` },
    { id: "usuarios", label: "Gerenciar Usuários" },
  ];

  return (
    <main role="main" className="flex-1">
      <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-6">
        Painel Administrativo
      </h1>
      
      {/* Abas de Navegação (Agora simplificadas) */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-300 dark:border-gray-700 pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-white dark:bg-gray-800 border-x border-t border-gray-300 dark:border-gray-700 text-green-600 dark:text-green-400"
                : "bg-transparent text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      
      {/* Container para o conteúdo da aba */}
      <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg shadow-inner">
        {renderTab()}
      </div>
    </main>
  );
}