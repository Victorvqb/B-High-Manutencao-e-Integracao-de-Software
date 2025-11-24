import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export default function ResponderAtividadeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [atividade, setAtividade] = useState(null);
  const [respostaTexto, setRespostaTexto] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAtividade = async () => {
      try {
        const { data } = await axiosInstance.get(`atividades/${id}/`);
        setAtividade(data);
      } catch (err) {
        console.error("Erro ao carregar atividade:", err);
        setMensagem("Erro ao carregar atividade.");
      } finally {
        setLoading(false);
      }
    };
    fetchAtividade();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("Enviando...");

    const formData = new FormData();
    // O Backend espera "atividade" (ID da atividade a que se refere)
    formData.append("atividade", id); 
    formData.append("resposta_texto", respostaTexto);
    if (arquivo) formData.append("arquivo", arquivo);

    try {
      await axiosInstance.post("entregas/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMensagem("✅ Atividade enviada com sucesso!");
      setRespostaTexto("");
      setArquivo(null);
      setTimeout(() => navigate("/atividades-aluno"), 2000); // Redireciona para a lista
    } catch (err) {
      console.error("Erro ao enviar atividade:", err.response?.data || err);
      setMensagem("❌ Erro ao enviar atividade. Tente novamente.");
    }
  };

  return (
    <div className="flex-1 p-6">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-4 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
      >
        ← Voltar
      </button>

      {loading ? (
        <p>Carregando atividade...</p>
      ) : atividade ? (
        <div className="max-w-2xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
            Responder: {atividade.titulo}
          </h1>
          <p className="mb-4 text-gray-700 dark:text-gray-300">{atividade.descricao}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 border-b pb-4 dark:border-gray-700">
            Prazo: {atividade.data_entrega} às {atividade.hora_entrega}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Sua Resposta (Texto):</label>
              <textarea
                value={respostaTexto}
                onChange={(e) => setRespostaTexto(e.target.value)}
                className="w-full h-32 p-3 rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Digite sua resposta aqui..."
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Anexar Arquivo (Opcional):</label>
              <input
                type="file"
                onChange={(e) => setArquivo(e.target.files[0])}
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Enviar Atividade
            </button>

            {mensagem && (
              <p className={`mt-4 text-center font-medium ${mensagem.includes("sucesso") ? "text-green-600" : "text-red-600"}`}>
                {mensagem}
              </p>
            )}
          </form>
        </div>
      ) : (
        <p>Atividade não encontrada.</p>
      )}
    </div>
  );
}