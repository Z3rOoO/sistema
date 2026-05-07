'use client';

import { useState, useEffect } from 'react';
import { animalAPI, tutorAPI } from '@/lib/api';

export default function AnimaisPage() {
  const [animais, setAnimais] = useState([]);
  const [tutores, setTutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    especie: '',
    raca: '',
    tutor_id: '',
  });

  // Carregar dados iniciais
  const carregarDados = async () => {
    try {
      setLoading(true);
      const [resAnimais, resTutores] = await Promise.all([
        animalAPI.listarTodos(),
        tutorAPI.listarTodos()
      ]);
      
      if (resAnimais.sucesso) setAnimais(resAnimais.dados || []);
      if (resTutores.sucesso) setTutores(resTutores.dados || []);
    } catch (err) {
      setError('Erro ao carregar dados: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
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
        await animalAPI.atualizar(editingId, formData);
      } else {
        await animalAPI.criar(formData);
      }

      setFormData({ nome: '', especie: '', raca: '', tutor_id: '' });
      setEditingId(null);
      setShowForm(false);
      carregarDados();
    } catch (err) {
      setError('Erro ao salvar animal: ' + err.message);
    }
  };

  const handleEdit = (animal) => {
    setFormData({ 
      nome: animal.nome, 
      especie: animal.especie || '', 
      raca: animal.raca || '',
      tutor_id: animal.tutor_id || ''
    });
    setEditingId(animal.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este animal?')) return;

    try {
      await animalAPI.excluir(id);
      carregarDados();
    } catch (err) {
      setError('Erro ao excluir animal: ' + err.message);
    }
  };

  const handleCancel = () => {
    setFormData({ nome: '', especie: '', raca: '', tutor_id: '' });
    setEditingId(null);
    setShowForm(false);
  };

  // Função para encontrar o nome do tutor pelo ID
  const getNomeTutor = (id) => {
    const tutor = tutores.find(t => t.id === id);
    return tutor ? tutor.nome : 'Não vinculado';
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Animal
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Ex: Rex"
                  />
                </div>
                <div>
                  <label htmlFor="tutor_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Tutor (Dono)
                  </label>
                  <select
                    id="tutor_id"
                    name="tutor_id"
                    value={formData.tutor_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">Selecione um tutor</option>
                    {tutores.map(tutor => (
                      <option key={tutor.id} value={tutor.id}>{tutor.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="especie" className="block text-sm font-medium text-gray-700 mb-2">
                    Espécie
                  </label>
                  <input
                    type="text"
                    id="especie"
                    name="especie"
                    value={formData.especie}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Ex: Cachorro, Gato"
                  />
                </div>
                <div>
                  <label htmlFor="raca" className="block text-sm font-medium text-gray-700 mb-2">
                    Raça
                  </label>
                  <input
                    type="text"
                    id="raca"
                    name="raca"
                    value={formData.raca}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Ex: Poodle, SRD"
                  />
                </div>
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
                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <p><strong>Espécie:</strong> {animal.especie || 'N/A'}</p>
                  <p><strong>Raça:</strong> {animal.raca || 'N/A'}</p>
                  <p><strong>Tutor:</strong> {getNomeTutor(animal.tutor_id)}</p>
                </div>
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
