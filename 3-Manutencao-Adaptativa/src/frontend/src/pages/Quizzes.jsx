import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";

export default function Quizzes() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [quizzes, setQuizzes] = useState([]);
  const [isStaff, setIsStaff] = useState(false);

  const fetchQuizzes = async () => {
    try {
      const { data } = await axiosInstance.get("quizzes/");
      setQuizzes(data);
    } catch (err) {
      console.error("Erro ao buscar quizzes:", err);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setIsStaff(decoded.is_staff === true || decoded.is_staff === "true");
    } catch {
      setIsStaff(false);
    }

    fetchQuizzes();

    const intervalId = setInterval(fetchQuizzes, 15000);
    return () => clearInterval(intervalId);
  }, [token, navigate]);

  const handleStart = (id) => navigate(`/quizzes/${id}`);
  const handleCreate = () => navigate("/quizzes/criar");
  const handleEdit = (id) => navigate(`/quizzes/${id}/editar`);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este quiz?")) return;
    try {
      await axiosInstance.delete(`quizzes/${id}/`);
      fetchQuizzes();
    } catch (err) {
      console.error("Erro ao excluir quiz:", err);
      alert("Erro ao excluir quiz.");
    }
  };

  return (
    <main className="flex-1 p-6">
      {/* Conteúdo da página de Quizzes aqui... */}
    </main>
  );
}