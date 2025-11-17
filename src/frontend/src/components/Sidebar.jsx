import React, { useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  FaHome, FaBookOpen, FaPuzzlePiece, FaClipboardCheck,
  FaComments, FaChartBar, FaSignOutAlt, FaCamera,
  FaBars, FaTimes, FaYoutube, FaCog
} from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../utils/axiosInstance";
import { AUTH_KEYS } from "../utils/constants"; // <-- REFATORAÇÃO 2 MANTIDA

export default function Sidebar({ isStaff: propIsStaff, isAluno: propIsAluno }) {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false);

  // --- INÍCIO DA REFATORAÇÃO 2 (Magic Strings) ---
  const isStaff = useMemo(() => {
    if (propIsStaff !== undefined) return propIsStaff;
    try {
      const tok = localStorage.getItem(AUTH_KEYS.ACCESS); // <-- USA CONSTANTE
      if (!tok) return false;
      return jwtDecode(tok).is_staff;
    } catch {
      return false;
    }
  }, [propIsStaff]);

  const [fotoPerfil, setFotoPerfil] = useState(localStorage.getItem(AUTH_KEYS.FOTO_PERFIL)); // <-- USA CONSTANTE
  // --- FIM DA REFATORAÇÃO 2 ---

  const handleImagemSelecionada = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('foto_perfil', file);

    try {
        const response = await axiosInstance.post('atualizar_foto_perfil/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        const novaFotoUrl = response.data.foto_url;
        
        // --- INÍCIO DA REFATORAÇÃO 2 (Magic Strings) ---
        localStorage.setItem(AUTH_KEYS.FOTO_PERFIL, novaFotoUrl); // <-- USA CONSTANTE
        // --- FIM DA REFATORAÇÃO 2 ---
        
        setFotoPerfil(novaFotoUrl);
    } catch (error) {
        console.error('Erro ao atualizar foto:', error);
        alert('Erro ao enviar imagem. Tente uma imagem menor ou com formato .jpg/.png');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // VVVVVV CORREÇÃO DA ORDEM DO MENU AQUI VVVVVV
  const menuItems = [
    ...(isStaff === false ? [
      { path: "/home", icon: <FaHome />, label: "Home" }, // <-- Home em primeiro
    ] : []),
    ...(isStaff === true ? [
        { path: "/professor", icon: <FaHome />, label: "Home" }, // <-- Home em primeiro
    ] : []),
    { path: "/youtube-videos", icon: <FaYoutube />, label: "Canal YouTube" },
    ...(isStaff === false ? [
      // O path foi corrigido de /aulas-aluno para /aulas, como no chat.rtf
      { path: "/aulas", icon: <FaBookOpen />, label: "Aulas" }, 
      { path: "/quizzes", icon: <FaPuzzlePiece />, label: "Quizzes" },
      { path: "/atividades-aluno", icon: <FaClipboardCheck />, label: "Atividades" },
      { path: "/forum-aluno", icon: <FaComments />, label: "Fórum" },
      { path: "/desempenho-aluno", icon: <FaChartBar />, label: "Desempenho" },
    ] : []),
    ...(isStaff === true ? [
        // O path foi corrigido de /aulas-professor para /aulas-prof, como no chat.rtf
        { path: "/aulas-prof", icon: <FaBookOpen />, label: "Aulas" },
        { path: "/quizzes", icon: <FaPuzzlePiece />, label: "Quizzes" },
        // O path foi corrigido de /atividades-professor para /atividades-prof, como no chat.rtf
        { path: "/atividades-prof", icon: <FaClipboardCheck />, label: "Atividades" },
        { path: "/forum-professor", icon: <FaComments />, label: "Fórum" },
        { path: "/desempenho-professor", icon: <FaChartBar />, label: "Desempenho" },
    ] : []),
    { path: "/configuracoes", icon: <FaCog />, label: "Configurações" },
  ];
  // ^^^^^^ FIM DA CORREÇÃO ^^^^^^


  const getFotoUrl = () => {
      // Lógica do chat.rtf para lidar com a foto de perfil
      const username = localStorage.getItem(AUTH_KEYS.USERNAME) || "User";
      const defaultAvatar = `https://ui-avatars.com/api/?name=${username}&background=0D8ABC&color=fff`;

      if (!fotoPerfil || fotoPerfil === "null") {
          return defaultAvatar;
      }
      if (fotoPerfil.startsWith("http")) {
          return fotoPerfil;
      }
      // Se for um caminho local (ex: /media/...), precisa do host da API
      const apiUrl = process.env.REACT_APP_API_URL || ''; 
      return `${apiUrl}${fotoPerfil}`;
  };

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b border-gray-700 flex flex-col items-center gap-3">
        <div
          className="relative group cursor-pointer"
          onClick={() => fileInputRef.current.click()}
        >
          <img
            src={getFotoUrl()}
            alt="Foto de Perfil"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-600"
          />
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <FaCamera className="text-white text-2xl" />
          </div>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImagemSelecionada} className="hidden" />
        </div>
        <span className="text-sm text-white text-center">
          {isStaff ? "Professor" : "Aluno"}
          <br />
          <span className="text-gray-400">{localStorage.getItem(AUTH_KEYS.USERNAME)}</span>
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-3 p-2 rounded transition-colors ${
              location.pathname === item.path
                ? "bg-green-600 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="border-t border-gray-700 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded bg-red-600 py-2 text-white hover:bg-red-700 transition-colors"
        >
          <FaSignOutAlt /> Sair
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-gray-800 p-2 rounded text-white"
        onClick={() => setMenuOpen(true)}
      >
        <FaBars />
      </button>

      <div className={`fixed top-0 left-0 h-full w-64 bg-gray-800 z-50 transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform lg:hidden flex flex-col`}>
        <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 text-white"><FaTimes /></button>
        <SidebarContent />
      </div>

      <div className="hidden lg:flex lg:flex-col h-screen w-64 bg-gray-800 sticky top-0">
        <SidebarContent />
      </div>
    </>
  );
}