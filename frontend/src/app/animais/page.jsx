'use client';

import { useState, useEffect } from 'react';
import { animalAPI } from '@/lib/api';
import Link from 'next/link';

export default function AnimaisPage() {
  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
  });

  // Carregar lista de animais
  const carregarAnimais = async () => {
    try {
      setLoading(true);
      const response = await animalAPI.listarTodos();
      if (response.sucesso) {
        setAnimais(response.dados || []);
      }
    } catch (err) {
      setError('Erro ao carregar animais: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAnimais();
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
        await animalAPI.atualizar(editingId, formData);
      } else {
        // Criar
        await animalAPI.criar(formData);
      }

      setFormData({ nome: '', descricao: '' });
      setEditingId(null);
      setShowForm(false);
      carregarAnimais();
    } catch (err) {
      setError('Erro ao salvar animal: ' + err.message);
    }
  };

  const handleEdit = (animal) => {
    setFormData({ nome: animal.nome, descricao: animal.descricao });
    setEditingId(animal.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este animal?')) return;

    try {
      await animalAPI.excluir(id);
      carregarAnimais();
    } catch (err) {
      setError('Erro ao excluir animal: ' + err.message);
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
          <h1 className="text-3xl font-bold text-gray-800">Gerenciar Animais</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            {showForm ? 'Cancelar' : 'Novo Animal'}
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
              {editingId ? 'Editar Animal' : 'Novo Animal'}
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
                  placeholder="Digite o nome do animal"
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
                  placeholder="Digite a descrição do animal"
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

        {/* Lista de animais */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Carregando...</p>
          </div>
        ) : animais.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg">
            <p className="text-gray-600">Nenhum animal cadastrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {animais.map((animal) => (
              <div key={animal.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{animal.nome}</h3>
                <p className="text-gray-600 text-sm mb-4">{animal.descricao}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(animal)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(animal.id)}
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
