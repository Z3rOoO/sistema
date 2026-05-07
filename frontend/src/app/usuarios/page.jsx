'use client';

import { useState, useEffect } from 'react';
import { usuarioAPI } from '@/lib/api';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [formData, setFormData] = useState({
    nome_usuario: '',
    login: '',
    senha: '',
  });

  // Carregar lista de usuários
  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await usuarioAPI.listarTodos(pagina, 10);
      if (response.sucesso) {
        setUsuarios(response.dados.usuarios || []);
        setTotalPaginas(response.dados.totalPaginas || 1);
      }
    } catch (err) {
      setError('Erro ao carregar usuários: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, [pagina]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await usuarioAPI.atualizar(editingId, formData);
      } else {
        await usuarioAPI.criar(formData);
      }

      setFormData({ nome_usuario: '', login: '', senha: '' });
      setEditingId(null);
      setShowForm(false);
      carregarUsuarios();
    } catch (err) {
      setError('Erro ao salvar usuário: ' + err.message);
    }
  };

  const handleEdit = (usuario) => {
    setFormData({
      nome_usuario: usuario.nome_usuario || usuario.nome,
      login: usuario.login,
      senha: '',
    });
    setEditingId(usuario.id_usuario || usuario.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      await usuarioAPI.excluir(id);
      carregarUsuarios();
    } catch (err) {
      setError('Erro ao excluir usuário: ' + err.message);
    }
  };

  const handleCancel = () => {
    setFormData({ nome_usuario: '', login: '', senha: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gerenciar Usuários</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            {showForm ? 'Cancelar' : 'Novo Usuário'}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Formulário */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingId ? 'Editar Usuário' : 'Novo Usuário'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nome_usuario" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Usuário
                </label>
                <input
                  type="text"
                  id="nome_usuario"
                  name="nome_usuario"
                  value={formData.nome_usuario}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Nome completo"
                />
              </div>

              <div>
                <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-2">
                  Login
                </label>
                <input
                  type="text"
                  id="login"
                  name="login"
                  value={formData.login}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Login de acesso"
                />
              </div>

              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha {editingId && '(deixe em branco para manter a atual)'}
                </label>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  required={!editingId}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Senha de acesso"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  {editingId ? 'Atualizar' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de usuários */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Carregando...</p>
          </div>
        ) : usuarios.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg">
            <p className="text-gray-600">Nenhum usuário cadastrado</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <table className="w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Nome</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Login</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id_usuario || usuario.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">{usuario.id_usuario || usuario.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{usuario.nome_usuario || usuario.nome}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{usuario.login}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleEdit(usuario)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-lg transition mr-2"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(usuario.id_usuario || usuario.id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-lg transition"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setPagina(Math.max(1, pagina - 1))}
                disabled={pagina === 1}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Anterior
              </button>
              <span className="py-2 px-4 text-gray-800">
                Página {pagina} de {totalPaginas}
              </span>
              <button
                onClick={() => setPagina(Math.min(totalPaginas, pagina + 1))}
                disabled={pagina === totalPaginas}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Próxima
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
