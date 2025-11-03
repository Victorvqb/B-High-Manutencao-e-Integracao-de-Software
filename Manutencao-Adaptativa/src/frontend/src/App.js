import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LayoutComSidebar from "./components/LayoutComSidebar";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import RecuperarSenha from "./pages/RecuperarSenha";
import Home from "./pages/Home";
import AulasAluno from "./pages/AulasAluno";
import AulasProfessor from "./pages/AulasProfessor";
import ProfessorDashboard from "./pages/Professor";
import ProfessorEntregas from "./pages/ProfessorEntregas";
import Quizzes from "./pages/Quizzes";
import QuizCreate from "./pages/QuizCreate";
import QuizDetail from "./pages/QuizDetail";
import EditarQuiz from "./pages/EditarQuiz";
import AtividadesProfessor from "./pages/AtividadesProfessor";
import AtividadeCreate from "./pages/AtividadeCreate";
import ResponderAtividades from "./pages/ResponderAtividades";
import ResponderAtividadeDetail from "./pages/ResponderAtividadeDetail";
import ForumProfessor from "./pages/ForumProfessor";
import ForumAluno from "./pages/ForumAluno";
import DesempenhoProfessor from "./pages/DesempenhoProfessor";
import DesempenhoAluno from "./pages/DesempenhoAluno";
import YouTubeVideos from "./pages/YouTubeVideos";
import TermosDeUso from "./pages/TermosDeUso";
import PoliticaDePrivacidade from "./pages/PoliticaDePrivacidade";
import Configuracoes from "./pages/Configuracoes";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access");
  if (!token) { return <Navigate to="/login" replace />; }
  try { jwtDecode(token); } catch { return <Navigate to="/login" replace />; }
  return children;
}

function RedirectRoot() {
  const token = localStorage.getItem("access");
  if (!token) { return <Navigate to="/login" replace />; }
  try {
    const decoded = jwtDecode(token);
    const isStaff = decoded.is_staff === true || decoded.is_staff === "true";
    if (isStaff) { return <Navigate to="/professor" replace />; }
    return <Navigate to="/home" replace />;
  } catch { return <Navigate to="/login" replace />; }
}

export default function App() {
  useEffect(() => { document.body.classList.add("dark"); }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/" element={<RedirectRoot />} />
        <Route path="/termos-de-uso" element={<TermosDeUso />} />
        <Route path="/politica-de-privacidade" element={<PoliticaDePrivacidade />} />

        <Route element={<ProtectedRoute><LayoutComSidebar /></ProtectedRoute>}>
          <Route path="/youtube-videos" element={<YouTubeVideos />} />
          <Route path="/home" element={<Home />} />
          <Route path="/aulas" element={<AulasAluno />} />
          <Route path="/aulas-prof" element={<AulasProfessor />} />
          <Route path="/professor" element={<ProfessorDashboard />} />
          <Route path="/entregas" element={<ProfessorEntregas />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/quizzes/criar" element={<QuizCreate />} />
          <Route path="/quizzes/:id" element={<QuizDetail />} />
          <Route path="/quizzes/:id/editar" element={<EditarQuiz />} />
          <Route path="/atividades-prof" element={<AtividadesProfessor />} />
          <Route path="/atividades-aluno" element={<ResponderAtividades />} />
          <Route path="/atividades/criar" element={<AtividadeCreate />} />
          <Route path="/atividades/:id/responder" element={<ResponderAtividadeDetail />} />
          <Route path="/forum-professor" element={<ForumProfessor />} />
          <Route path="/forum-aluno" element={<ForumAluno />} />
          <Route path="/desempenho-professor" element={<DesempenhoProfessor />} />
          <Route path="/desempenho-aluno" element={<DesempenhoAluno />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}