import React, { useEffect, useState, useMemo } from "react"; // <-- 1. useMemo adicionado
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs"; 
import axiosInstance from "../utils/axiosInstance";
import GerenciarAulasModal from "../components/GerenciarAulasModal";
import { FaInbox, FaSearch } from "react-icons/fa"; // <-- 2. Ícone de busca

export default function Professor() {
  const [aulas, setAulas] = useState([]);
  const [showGerenciar, setShowGerenciar] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [busca, setBusca] = useState(""); // <-- 3. Estado para a busca
  
  const navigate = useNavigate();

  const carregarAulas = () => {
    setLoading(true); 
    axiosInstance
      .get("aulas/")
      .then((r) => setAulas(r.data))
      .catch(console.error)
      .finally(() => setLoading(false)); 
  };

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return navigate("/login");
    carregarAulas();
  }, [navigate]);

  // 4. Lógica para filtrar as aulas com base na busca
  const aulasFiltradas = useMemo(() => {
    if (!busca) return aulas;
    return aulas.filter(a => 
      a.titulo.toLowerCase().includes(busca.toLowerCase())
    );
  }, [aulas, busca]);
  // Fim da lógica de filtro

  const renderContent = () => {
    // Estado de Carregamento
    if (loading) {
      return (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>Carregando aulas...</p>
        </div>
      );
    }

    // VVVVVV 5. ESTADO VAZIO ATUALIZADO VVVVVV
    // Agora verifica a lista filtrada
    if (aulas.length === 0) {
      return (
        <div className="text-center text-gray-500 dark:text-gray-400 p-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <FaInbox className="text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhuma aula publicada</h3>
          <p className="text-sm">
            Clique em "Gerenciar Aulas" no canto superior para começar a publicar seu conteúdo.
          </p>
        </div>
      );
    }

    // Estado com Conteúdo (Lista de aulas)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* VVVVVV 6. USA a lista 'aulasFiltradas' VVVVVV */}
        {aulasFiltradas.length > 0 ? (
          aulasFiltradas.map((a) => (
            <div
              key={a.id}
              className="rounded-lg shadow-md bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-xl font-bold mb-2 text-green-800 dark:text-green-300">
                {a.titulo}
              </h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                Postado em: {dayjs(a.data).format("DD/MM/YYYY")}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 h-16 overflow-hidden">
                {a.descricao}
              </p>

              <div className="mb-4">
                {a.arquivo && (
                  <a
                    href={a.arquivo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Ver Slide
                  </a>
                )}
                {a.video_url && (
                  <a
                    href={a.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Ver Vídeo
                  </a>
                )}
                {!a.arquivo && !a.video_url && (
                  <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-500">
                    Sem conteúdo multimédia
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          // Estado Vazio (Nenhum resultado na busca)
          <p className="text-gray-500 dark:text-gray-400 col-span-3 text-center">
            Nenhuma aula encontrada para "{busca}".
          </p>
        )}
      </div>
    );
  };
  // ^^^^^^ FIM DA SEÇÃO ^^^^^^

  return (
    <main role="main" className="flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">
          Minhas Aulas
        </h1>
        <button
          onClick={() => setShowGerenciar(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Gerenciar Aulas
        </button>
      </div>

      {/* VVVVVV 7. BARRA DE BUSCA ADICIONADA AQUI VVVVVV */}
      <div className="mb-6 relative">
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar aula por título..."
            className="w-full p-2 pl-10 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
      {/* ^^^^^^ FIM DA BARRA DE BUSCA ^^^^^^ */}

      {renderContent()}

      <GerenciarAulasModal
        isOpen={showGerenciar}
        onClose={() => {
          setShowGerenciar(false);
          carregarAulas();
        }}
        requiredFieldsFeedback
      />
    </main>
  );
}