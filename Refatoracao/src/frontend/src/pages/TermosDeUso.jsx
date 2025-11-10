import React from 'react';
import { Link } from 'react-router-dom';

export default function TermosDeUso() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-green-600 dark:text-green-400">
          Termos de Uso
        </h1>
        <p className="text-sm text-center text-gray-500">Última atualização: 30 de setembro de 2025</p>

        <div className="space-y-4 text-left">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Aceitação dos Termos</h2>
            <p>Ao se cadastrar e utilizar a plataforma B-High Education ("Plataforma"), você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concorda com estes termos, não deve aceder ou usar a Plataforma.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Descrição do Serviço</h2>
            <p>A Plataforma é um Ambiente Virtual de Aprendizagem (AVA) que permite que utilizadores autorizados (alunos e professores) acedam a aulas, quizzes, atividades e outras funcionalidades educacionais.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. Responsabilidades do Utilizador</h2>
            <p>Você concorda em usar a Plataforma apenas para fins lícitos e de acordo com as políticas da instituição. Você é responsável por manter a confidencialidade da sua senha e por todas as atividades que ocorram na sua conta.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Propriedade Intelectual</h2>
            <p>Todo o conteúdo e materiais disponíveis na Plataforma, incluindo, mas não se limitando a, texto, gráficos, logótipos e software, são propriedade da B-High Education ou dos seus licenciadores e são protegidos por leis de direitos de autor.</p>
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