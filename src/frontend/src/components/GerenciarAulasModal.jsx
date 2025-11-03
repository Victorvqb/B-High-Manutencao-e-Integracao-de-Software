import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import axiosInstance from "../utils/axiosInstance";
import EditAulaModal from "./EditAulaModal";

export default function GerenciarAulasModal({ isOpen, onClose }) {
  const [aba, setAba] = useState("listar");
  const [aulas, setAulas] = useState([]);
  const [editAula, setEditAula] = useState(null);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  
  // --- INÍCIO DAS MODIFICAÇÕES (MIGRAÇÃO DE API) ---
  const [tipoConteudo, setTipoConteudo] = useState("video_url"); // Padrão é link
  const [videoUrl, setVideoUrl] = useState(""); // Campo separado para URL
  const [arquivo, setArquivo] = useState(null); 
  // --- FIM DAS MODIFICAÇÕES ---

  const [erros, setErros] = useState({});
  const [carregando, setCarregando] = useState(false);

  const recarregarAulas = async () => {
    try {
      const { data } = await axiosInstance.get("aulas/");
      setAulas(data);
    } catch {
      console.error("Erro ao buscar aulas.");
    }
  };

  const apagarAula = async (id) => {
    if (!window.confirm("Tem certeza que deseja apagar esta aula?")) return;
    try {
      await axiosInstance.delete(`aulas/${id}/`);
      recarregarAulas();
    } catch {
      alert("Erro ao apagar aula.");
    }
  };

  const validarCampos = () => {
    const novosErros = {};
    if (!titulo.trim()) novosErros.titulo = true;
    if (!data.trim()) novosErros.data = true;
    if (!hora.trim()) novosErros.hora = true;

    // Validação específica do tipo de conteúdo
    if (tipoConteudo === "video_url" && !videoUrl.trim()) {
        novosErros.videoUrl = true;
    } else if (tipoConteudo !== "video_url" && !arquivo) {
        novosErros.arquivo = true;
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const publicarAula = async (e) => {
    e.preventDefault();
    if (!validarCampos() || carregando) return;
    setCarregando(true);

    const fd = new FormData();
    fd.append("titulo", titulo);
    fd.append("descricao", descricao);
    fd.append("data", data);
    fd.append("hora", hora);
    fd.append("agendada", aba === "agendar" ? "true" : "false");
    
    // --- LÓGICA DE UPLOAD ATUALIZADA ---
    fd.append("tipo_conteudo", tipoConteudo);
    if (tipoConteudo === "video_url") {
      fd.append("video_url", videoUrl);
    } else {
      if (arquivo) fd.append("arquivo", arquivo);
    }
    // --- FIM DA LÓGICA ---

    try {
      await axiosInstance.post("aulas/", fd);
      alert("Aula publicada!");
      recarregarAulas();
      setAba("listar");
      // Resetar todos os campos
      setTitulo("");
      setDescricao("");
      setData("");
      setHora("");
      setArquivo(null);
      setVideoUrl("");
      setTipoConteudo("video_url");
      setErros({});
    } catch (err) {
      console.error("Erro ao publicar aula:", err.response?.data || err);
      alert("Erro ao publicar aula. Verifique os campos obrigatórios.");
    } finally {
      setCarregando(false);
    }
  };

  // Carrega as aulas quando o modal abre e a aba "listar" está ativa
  useEffect(() => {
    if (isOpen && aba === "listar") {
      recarregarAulas();
    }
  }, [isOpen, aba]);

  if (!isOpen) return null;

  const inputClass = (erro) =>
    `w-full rounded border px-3 py-2 ${
      erro
        ? "border-red-500 dark:border-red-400"
        : "border-gray-300 dark:border-gray-600"
    } bg-white dark:bg-gray-700`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2">
      <div className="relative flex h-[80vh] w-full max-w-3xl flex-col rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          ✕
        </button>

        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setAba("listar")}
            className={`flex-1 p-3 font-medium ${
              aba === "listar"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Listar Aulas
          </button>
          <button
            onClick={() => setAba("aula")}
            className={`flex-1 p-3 font-medium ${
              aba === "aula"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Publicar Aula
          </button>
          <button
            onClick={() => setAba("agendar")}
            className={`flex-1 p-3 font-medium ${
              aba === "agendar"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Agendar Aula
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5">
          {aba === "listar" && (
            <div className="space-y-3">
              {aulas.map((aula) => (
                <div
                  key={aula.id}
                  className="flex items-center justify-between rounded border border-gray-200 dark:border-gray-700 p-3"
                >
                  <div>
                    <p className="font-semibold">{aula.titulo}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {dayjs(aula.data).format("DD/MM/YYYY")} - {aula.hora}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditAula(aula)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => apagarAula(aula.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Apagar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(aba === "aula" || aba === "agendar") && (
            <form onSubmit={publicarAula} className="space-y-3">
              <h2 className="text-xl font-semibold text-green-600 dark:text-green-400">
                {aba === "agendar" ? "Agendar Nova Aula" : "Publicar Nova Aula"}
              </h2>
              
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className={inputClass(erros.titulo)}
                placeholder="Título"
              />
              {erros.titulo && <p className="text-sm text-red-500">Preencha o título</p>}

              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className={inputClass(erros.descricao)}
                placeholder="Descrição"
              />

              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className={inputClass(erros.data)}
              />
              {erros.data && <p className="text-sm text-red-500">Preencha a data</p>}

              <input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className={inputClass(erros.hora)}
              />
              {erros.hora && <p className="text-sm text-red-500">Preencha o horário</p>}

              {/* --- INÍCIO DO SELETOR DE CONTEÚDO (MIGRAÇÃO API) --- */}
              <select
                value={tipoConteudo}
                onChange={(e) => setTipoConteudo(e.target.value)}
                className={inputClass(erros.tipoConteudo)}
              >
                <option value="video_url">Link de Vídeo Externo (YouTube, etc.)</option>
                <option value="video_upload">Upload de Vídeo (.mp4, .mov)</option>
                <option value="pdf">Upload de Documento (.pdf)</option>
              </select>

              {tipoConteudo === "video_url" ? (
                <div>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className={inputClass(erros.videoUrl)}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  {erros.videoUrl && <p className="text-sm text-red-500">Insira um link válido</p>}
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept={tipoConteudo === "video_upload" ? ".mp4,.mov" : ".pdf"}
                    className={`w-full text-sm ${erros.arquivo ? "border-red-500 border rounded" : ""}`}
                    onChange={(e) => setArquivo(e.target.files[0])}
                  />
                  {erros.arquivo && <p className="text-sm text-red-500">Escolha um arquivo válido</p>}
                </div>
              )}
              {/* --- FIM DO SELETOR DE CONTEÚDO --- */}

              <button
                className="rounded bg-green-600 hover:bg-green-700 px-4 py-2 font-medium text-white"
                disabled={carregando}
              >
                {carregando ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                ) : (
                  aba === "agendar" ? "Agendar Aula" : "Publicar Aula"
                )}
              </button>
            </form>
          )}
        </div>

        {editAula && (
          <EditAulaModal
            aula={editAula}
            onClose={() => setEditAula(null)}
            onSaved={() => {
              setEditAula(null);
              recarregarAulas();
            }}
            onDeleted={() => {
              setEditAula(null);
              recarregarAulas();
            }}
          />
        )}
      </div>
    </div>
  );
}