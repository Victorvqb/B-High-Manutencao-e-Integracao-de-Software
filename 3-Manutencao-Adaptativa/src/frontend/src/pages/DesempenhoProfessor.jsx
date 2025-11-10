import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function DesempenhoProfessor() {
  const [notas, setNotas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    nota: "",
    aluno: "",
  });

  useEffect(() => {
    fetchDados();
  }, []);

  const fetchDados = async () => {
    setLoading(true);
    try {
      const [notasRes, alunosRes] = await Promise.all([
        axiosInstance.get("desempenhos/"),
        axiosInstance.get("alunos/"),
      ]);
      setNotas(notasRes.data);
      setAlunos(alunosRes.data);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ titulo: "", descricao: "", nota: "", aluno: "" });
    setEditandoId(null);
  };

  const salvarNota = async () => {
    const payload = { ...form };

    try {
      if (editandoId) {
        await axiosInstance.put(`desempenhos/${editandoId}/`, payload);
      } else {
        await axiosInstance.post("desempenhos/", payload);
      }
      resetForm();
      fetchDados();
    } catch (err) {
      console.error("Erro ao salvar nota:", err.response?.data || err);
      alert("Erro ao salvar. Verifique se todos os campos estão corretos.");
    }
  };

  const iniciarEdicao = (nota) => {
    setEditandoId(nota.id);
    setForm({
      titulo: nota.titulo,
      descricao: nota.descricao,
      nota: nota.nota,
      aluno: nota.aluno,
    });
  };

  const deletarNota = async (id) => {
    if (!window.confirm("Tem certeza que deseja apagar esta nota?")) return;
    try {
      await axiosInstance.delete(`desempenhos/${id}/`);
      fetchDados();
    } catch (err) {
      console.error("Erro ao apagar nota:", err);
      alert("Erro ao apagar nota.");
    }
  };

  const notasPorAluno = notas.reduce((acc, nota) => {
    const alunoNome = nota.aluno_nome || "Aluno Desconhecido";
    if (!acc[alunoNome]) acc[alunoNome] = [];
    acc[alunoNome].push(nota);
    return acc;
  }, {});

  return (
    <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-6">
            Desempenho dos Alunos
        </h1>
        {/* Formulário de Edição/Criação */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-3">{editandoId ? "Editar Nota" : "Adicionar Nova Nota"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={form.titulo} onChange={(e) => setForm({...form, titulo: e.target.value})} placeholder="Título" className="p-2 rounded border dark:bg-gray-700"/>
                <input value={form.descricao} onChange={(e) => setForm({...form, descricao: e.target.value})} placeholder="Descrição" className="p-2 rounded border dark:bg-gray-700"/>
                <input type="number" value={form.nota} onChange={(e) => setForm({...form, nota: e.target.value})} placeholder="Nota" className="p-2 rounded border dark:bg-gray-700"/>
                <select value={form.aluno} onChange={(e) => setForm({...form, aluno: e.target.value})} className="p-2 rounded border dark:bg-gray-700">
                    <option value="">Selecione o Aluno</option>
                    {alunos.map(al => <option key={al.id} value={al.id}>{al.username}</option>)}
                </select>
            </div>
            <div className="mt-4 flex gap-4">
                <button onClick={salvarNota} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Salvar</button>
                {editandoId && <button onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">Cancelar Edição</button>}
            </div>
        </div>
        
        {loading ? <p>A carregar...</p> : Object.entries(notasPorAluno).map(([alunoNome, notasAluno]) => (
            <div key={alunoNome} className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">{alunoNome}</h3>
                {notasAluno.map((n) => (
                    <div key={n.id} className="border border-gray-300 dark:border-gray-700 p-3 rounded mb-2 flex justify-between items-center bg-white dark:bg-gray-800 text-black dark:text-gray-100">
                        <div>
                            <strong>{n.titulo}</strong>:{" "}
                            <span className="text-green-700 dark:text-green-400">{n.nota}</span>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{n.descricao}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => iniciarEdicao(n)} className="text-blue-600 dark:text-blue-400 hover:underline">Editar</button>
                            <button onClick={() => deletarNota(n.id)} className="text-red-600 dark:text-red-400 hover:underline">Apagar</button>
                        </div>
                    </div>
                ))}
            </div>
        ))}
    </main>
  );
}