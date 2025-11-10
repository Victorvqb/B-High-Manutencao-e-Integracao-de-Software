import React from 'react';
import { Link } from 'react-router-dom';

export default function PoliticaDePrivacidade() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-green-600 dark:text-green-400">
          Política de Privacidade
        </h1>
        <p className="text-sm text-center text-gray-500">Última atualização: 30 de setembro de 2025</p>

        <div className="space-y-4 text-left">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Coleta de Informações</h2>
            <p>Coletamos informações que você nos fornece diretamente ao se registar, como nome, sobrenome, e-mail e nome de utilizador. Estas informações são necessárias para a criação e gestão da sua conta.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Uso das Informações</h2>
            <p>As informações coletadas são usadas para:</p>
            <ul className="list-disc list-inside ml-4">
                <li>Gerir a sua conta e fornecer acesso aos nossos serviços.</li>
                <li>Comunicar informações importantes sobre as suas atividades na plataforma.</li>
                <li>Garantir a segurança da plataforma e o cumprimento dos nossos Termos de Uso.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-2">3. Seus Direitos (LGPD)</h2>
            <p>De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem o direito de aceder, corrigir e solicitar a exclusão dos seus dados pessoais. A funcionalidade para a exclusão da sua conta estará disponível nas configurações do seu perfil.</p>
          </section>
        </div>

        <div className="text-center mt-8">
            <Link to="/cadastro" className="text-green-600 dark:text-green-400 underline">
                Voltar à página de cadastro
            </Link>
        </div>
      </div>
    </div>
  );
}