import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance'; // <--- MUDANÇA IMPORTANTE

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState('aluno');
  const [erroCadastro, setErroCadastro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [termosAceites, setTermosAceites] = useState(false);

  const navigate = useNavigate();

  // VVVVVV REGRA DE VALIDAÇÃO ATUALIZADA AQUI VVVVVV
  const validarUsername = (user) => /^[a-zA-Z0-9_]+$/.test(user);

  const handleCadastro = async () => {
    setErroCadastro('');
    setMensagem('');

    const trimmedNome = nome.trim();
    const trimmedSobrenome = sobrenome.trim();
    const trimmedEmail = email.trim();
    const trimmedUsername = username.trim();

    if (!trimmedNome || !trimmedSobrenome || !trimmedEmail || !trimmedUsername || !senha) {
      setErroCadastro("Por favor, preencha todos os campos.");
      return;
    }
    
    if (!termosAceites) {
      setErroCadastro("Você deve aceitar os Termos de Uso e a Política de Privacidade para continuar.");
      return;
    }

    if (senha.length < 6) {
      setErroCadastro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (!validarUsername(trimmedUsername)) {
      setErroCadastro(
        "O nome de usuário só pode conter letras, números e underscores (_)."
      );
      return;
    }

    const endpoint = role === 'aluno' ? 'usuarios/' : 'solicitacoes-professor/';
    const payload = role === 'aluno'
      ? {
          first_name: trimmedNome,
          last_name: trimmedSobrenome,
          email: trimmedEmail,
          username: trimmedUsername,
          password: senha,
          is_staff: false,
        }
      : {
          nome: trimmedNome,
          sobrenome: trimmedSobrenome,
          email: trimmedEmail,
          username: trimmedUsername,
          senha: senha,
        };

    try {
      // VVVVVV CHAMADA À API ATUALIZADA PARA USAR AXIOSINSTANCE VVVVVV
      await axiosInstance.post(endpoint, payload);

      setMensagem(
        role === 'aluno'
          ? "Cadastro realizado com sucesso! Redirecionando para o login..."
          : "Solicitação de cadastro de professor enviada com sucesso! Aguarde a aprovação do administrador."
      );

      setTimeout(() => navigate('/login'), 3000);

    } catch (err) {
      console.error('Erro no cadastro:', err.response?.data || err);
      const errors = err.response?.data;
      if (errors) {
        let errorMsg = Object.values(errors).flat().join(' ');
        setErroCadastro(errorMsg);
      } else {
        setErroCadastro('Ocorreu um erro. Tente novamente.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-green-600 dark:text-green-400">
          Crie a sua Conta
        </h1>

        {erroCadastro && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-300">
            {erroCadastro}
          </div>
        )}
        {mensagem && (
          <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-900/30 dark:text-green-300">
            {mensagem}
          </div>
        )}

        <input
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-md px-3 py-2"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-md px-3 py-2"
          placeholder="Sobrenome"
          value={sobrenome}
          onChange={(e) => setSobrenome(e.target.value)}
        />
        <input
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-md px-3 py-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-md px-3 py-2"
          placeholder="Nome de usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-md px-3 py-2"
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <div className="flex flex-col gap-2 mb-4 text-black dark:text-white">
          <label className="flex items-center">
            <input
              type="radio"
              name="role"
              value="aluno"
              checked={role === 'aluno'}
              onChange={() => setRole('aluno')}
              className="mr-2"
            />
            Sou aluno
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="role"
              value="professor"
              checked={role === 'professor'}
              onChange={() => setRole('professor')}
              className="mr-2"
            />
            Sou professor (aguarda aprovação do admin)
          </label>
        </div>
        
        <div className="flex items-start space-x-2">
            <input
                id="termos"
                type="checkbox"
                checked={termosAceites}
                onChange={(e) => setTermosAceites(e.target.checked)}
                className="mt-1 border-gray-300 rounded"
            />
            <label htmlFor="termos" className="text-sm text-gray-700 dark:text-gray-300">
                Eu li e concordo com os{" "}
                <a href="/termos-de-uso" target="_blank" rel="noopener noreferrer" className="underline text-green-600 dark:text-green-400">
                    Termos de Uso
                </a>{" "}
                e a{" "}
                <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer" className="underline text-green-600 dark:text-green-400">
                    Política de Privacidade
                </a>.
            </label>
        </div>

        <button
          onClick={handleCadastro}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-500 mb-3"
        >
          Cadastrar
        </button>

        <button
          onClick={() => navigate('/login')}
          className="w-full border border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white py-2 rounded"
        >
          Já tenho uma conta
        </button>
      </div>
    </div>
  );
}