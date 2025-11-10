import React, { useState } from "react";
import axios from "../utils/axiosInstance";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AUTH_KEYS } from "../utils/constants"; 

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [souAdmin, setSouAdmin] = useState(false);
  const [erroLogin, setErroLogin] = useState("");
  const [isLoading, setIsLoading] = useState(false); // <-- ESTADO DE LOADING
  const navigate = useNavigate();

  const handleLogin = async () => {
    setErroLogin("");

    if (!username || !password) {
      setErroLogin("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true); // <-- ATIVA LOADING

    try {
      const response = await axios.post("token/", {
        username,
        password,
      });

      const { access, refresh } = response.data;
      const decoded = jwtDecode(access);

      const isStaff = decoded.is_staff === true || decoded.is_staff === "true";
      const isSuperuser = decoded.is_superuser === true || decoded.is_superuser === "true";
      const userFromBackend = decoded.username;

      localStorage.setItem(AUTH_KEYS.ACCESS, access);
      localStorage.setItem(AUTH_KEYS.REFRESH, refresh);
      localStorage.setItem(AUTH_KEYS.USERNAME, userFromBackend);
      localStorage.setItem(AUTH_KEYS.IS_STAFF, JSON.stringify(isStaff));
      localStorage.setItem(AUTH_KEYS.IS_SUPERUSER, JSON.stringify(isSuperuser));
      localStorage.removeItem(AUTH_KEYS.FOTO_PERFIL);

      // --- CORREÇÃO: USAR NAVIGATE EM VEZ DE window.location ---
      if (souAdmin) {
        if (isSuperuser && userFromBackend === "admin") {
          navigate("/admin-dashboard");
        } else if (isStaff) {
          navigate("/professor");
        } else {
          setErroLogin("Você não tem permissão de administrador.");
          localStorage.clear();
        }
      } else {
        navigate("/home");
      }
    } catch (err) {
      setErroLogin("Usuário ou senha inválidos.");
    } finally {
      setIsLoading(false); // <-- DESATIVA LOADING
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-green-600 dark:text-green-400">
          B-High Education
        </h1>
        {erroLogin && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-center text-sm text-red-700 dark:bg-red-900 dark:text-red-200">
            {erroLogin}
          </div>
        )}
        <input
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <p
          className="text-sm text-blue-600 hover:underline text-center cursor-pointer mb-4"
          onClick={() => navigate("/recuperar-senha")}
        >
          Esqueceu sua senha?
        </p>

        <label className="flex items-center mb-4 text-black dark:text-white">
          <input
            type="checkbox"
            checked={souAdmin}
            onChange={(e) => setSouAdmin(e.target.checked)}
            className="mr-2"
          />
          Sou administrador
        </label>

        <button
          onClick={handleLogin}
          disabled={isLoading} // <-- DESABILITA BOTÃO ENQUANTO CARREGA
          className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-md mb-3 disabled:bg-gray-400"
        >
          {isLoading ? "Entrando..." : "Entrar"} {/* <-- MUDA TEXTO */}
        </button>
        
        {/* VVVVVV BOTÃO DE CADASTRO MODIFICADO AQUI VVVVVV */}
        <button
          onClick={() => navigate("/cadastro")}
          className="w-full text-center text-green-600 dark:text-green-400 hover:underline py-2 rounded-md"
        >
          Cadastrar-se
        </button>
        {/* ^^^^^^ FIM DA MODIFICAÇÃO ^^^^^^ */}
      </div>
    </div>
  );
}