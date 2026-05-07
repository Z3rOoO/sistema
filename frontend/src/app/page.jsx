'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const token = localStorage.getItem('token');
    const usuarioData = localStorage.getItem('usuario');

    if (!token) {
      router.push('/login');
    } else {
      try {
        setUsuario(JSON.parse(usuarioData));
      } catch (err) {
        console.error('Erro ao parsear dados do usuário:', err);
      }
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Sistema de Gestão</h1>
          <div className="flex items-center gap-4">
            {usuario && (
              <span className="text-gray-700">
                Bem-vindo, <strong>{usuario.nome}</strong>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Painel de Controle</h2>

        {/* Grid de Módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Animais */}
          <Link href="/animais">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer">
              <div className="text-4xl mb-4">🐾</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Animais</h3>
              <p className="text-gray-600 text-sm">
                Gerenciar o cadastro de animais do petshop
              </p>
            </div>
          </Link>

          {/* Tutores */}
          <Link href="/tutores">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Tutores</h3>
              <p className="text-gray-600 text-sm">
                Gerenciar os tutores dos animais
              </p>
            </div>
          </Link>

          {/* Consultas */}
          <Link href="/consultas">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Consultas</h3>
              <p className="text-gray-600 text-sm">
                Agendar e gerenciar consultas veterinárias
              </p>
            </div>
          </Link>

          {/* Usuários (apenas para admin) */}
          {usuario && usuario.tipo === 'admin' && (
            <Link href="/usuarios">
              <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer">
                <div className="text-4xl mb-4">🔐</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Gerenciar Usuários</h3>
                <p className="text-gray-600 text-sm">
                  Controle de acesso e usuários do sistema
                </p>
              </div>
            </Link>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-2">Informações do Sistema</h3>
          <p className="text-blue-800">
            Bem-vindo ao Sistema de Gestão! Use o menu acima para navegar entre os diferentes módulos.
            Cada módulo permite que você crie, edite, visualize e delete registros conforme necessário.
          </p>
        </div>
      </main>
    </div>
  );
}
