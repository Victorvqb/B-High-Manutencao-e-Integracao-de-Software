import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs"; 
import axiosInstance from "../utils/axiosInstance";
import GerenciarAulasModal from "../components/GerenciarAulasModal";
// A importação do VideoCard foi removida porque não estava a ser usada diretamente aqui

export default function Professor() {
  const [aulas, setAulas] = useState([]);
  const [showGerenciar, setShowGerenciar] = useState(false);
  
  const navigate = useNavigate();

  const carregarAulas = () => {
    axiosInstance
      .get("aulas/")
      .then((r) => setAulas(r.data))
      .catch(console.error);
  };

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return navigate("/login");
    carregarAulas();
  }, [navigate]);

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {aulas.map((a) => (
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
        ))}
      </div>

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