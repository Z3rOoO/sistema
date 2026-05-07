'use client';

import { useState, useEffect } from 'react';
import { tutorAPI } from '@/lib/api';

export default function TutoresPage() {
  const [tutores, setTutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
  });

  // Carregar lista de tutores
  const carregarTutores = async () => {
    try {
      setLoading(true);
      const response = await tutorAPI.listarTodos();
      if (response.sucesso) {
        setTutores(response.dados || []);
      }
    } catch (err) {
      setError('Erro ao carregar tutores: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTutores();
  }, []);

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
        // Atualizar
        await tutorAPI.atualizar(editingId, formData);
      } else {
        // Criar
        await tutorAPI.criar(formData);
      }

      setFormData({ nome: '', descricao: '' });
      setEditingId(null);
      setShowForm(false);
      carregarTutores();
    } catch (err) {
      setError('Erro ao salvar tutor: ' + err.message);
    }
  };

  const handleEdit = (tutor) => {
    setFormData({ nome: tutor.nome, descricao: tutor.descricao });
    setEditingId(tutor.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este tutor?')) return;

    try {
      await tutorAPI.excluir(id);
      carregarTutores();
    } catch (err) {
      setError('Erro ao excluir tutor: ' + err.message);
    }
  };

  const handleCancel = () => {
    setFormData({ nome: '', descricao: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gerenciar Tutores</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            {showForm ? 'Cancelar' : 'Novo Tutor'}
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
              {editingId ? 'Editar Tutor' : 'Novo Tutor'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Digite o nome do tutor"
                />
              </div>

              <div>
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Digite a descrição do tutor"
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

        {/* Lista de tutores */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Carregando...</p>
          </div>
        ) : tutores.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg">
            <p className="text-gray-600">Nenhum tutor cadastrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tutores.map((tutor) => (
              <div key={tutor.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{tutor.nome}</h3>
                <p className="text-gray-600 text-sm mb-4">{tutor.descricao}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(tutor)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(tutor.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
