import React from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

export default function Configuracoes() {
    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        // 1. Primeira confirmação para evitar cliques acidentais
        const confirmation = window.confirm(
            "Você tem CERTEZA que deseja apagar a sua conta? Esta ação é permanente e não pode ser desfeita."
        );

        if (!confirmation) {
            return;
        }

        // 2. Segunda confirmação, exigindo a senha para segurança
        const password = window.prompt("Para confirmar, por favor, digite a sua senha:");

        if (password === null || password === "") {
            alert("A exclusão foi cancelada.");
            return;
        }

        try {
            await axiosInstance.delete('/user/delete-account/', {
                data: { password: password }
            });

            alert("A sua conta foi apagada com sucesso.");
            
            // 3. Limpa os dados de login e redireciona o utilizador
            localStorage.clear();
            navigate('/login');

        } catch (error) {
            const errorMsg = error.response?.data?.error || "Ocorreu um erro. Tente novamente.";
            console.error("Erro ao apagar conta:", error);
            alert(`Erro: ${errorMsg}`);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-6">
                Configurações da Conta
            </h1>
            
            {/* Outras opções de configuração podem ser adicionadas aqui no futuro */}

            {/* VVVVVV AJUSTE DE ALINHAMENTO APLICADO AQUI VVVVVV */}
            <div className="mt-8 p-6 rounded-lg border border-red-400 bg-red-50 dark:bg-gray-800 dark:border-red-500/50 text-center">
                <h2 className="text-xl font-bold text-red-700 dark:text-red-400">
                    Zona de Perigo
                </h2>
                <p className="mt-2 mb-4 text-gray-700 dark:text-gray-300">
                    Esta ação é irreversível. Todos os seus dados pessoais, aulas e histórico de atividades serão permanentemente removidos.
                </p>
                <button 
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                    Apagar a minha conta permanentemente
                </button>
            </div>
        </div>
    );
}