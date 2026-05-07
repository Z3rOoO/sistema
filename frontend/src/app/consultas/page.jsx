'use client';

import { useState, useEffect } from 'react';
import { consultaAPI, animalAPI } from '@/lib/api';

export default function ConsultasPage() {
  const [consultas, setConsultas] = useState([]);
  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('todos');
  const [formData, setFormData] = useState({
    animal_id: '',
    data_hora: '',
    motivo: '',
    status: 'agendada',
  });

  // Carregar dados iniciais
  const carregarDados = async () => {
    try {
      setLoading(true);
      const [resConsultas, resAnimais] = await Promise.all([
        consultaAPI.listarTodos(),
        animalAPI.listarTodos()
      ]);

      if (resConsultas.sucesso) setConsultas(resConsultas.dados || []);
      if (resAnimais.sucesso) setAnimais(resAnimais.dados || []);
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
        await consultaAPI.atualizar(editingId, formData);
      } else {
        await consultaAPI.criar(formData);
      }

      setFormData({ animal_id: '', data_hora: '', motivo: '', status: 'agendada' });
      setEditingId(null);
      setShowForm(false);
      carregarDados();
    } catch (err) {
      setError('Erro ao salvar consulta: ' + err.message);
    }
  };

  const handleEdit = (consulta) => {
    // Formatar data para o input datetime-local (YYYY-MM-DDTHH:MM)
    let dataFormatada = '';
    if (consulta.data_hora) {
      const d = new Date(consulta.data_hora);
      dataFormatada = d.toISOString().slice(0, 16);
    }

    setFormData({ 
      animal_id: consulta.animal_id || '', 
      data_hora: dataFormatada,
      motivo: consulta.motivo || '',
      status: consulta.status || 'agendada'
    });
    setEditingId(consulta.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta consulta?')) return;

    try {
      await consultaAPI.excluir(id);
      carregarDados();
    } catch (err) {
      setError('Erro ao excluir consulta: ' + err.message);
    }
  };

  const handleStatusChange = async (id, novoStatus) => {
    try {
      await consultaAPI.atualizar(id, { status: novoStatus });
      carregarDados();
    } catch (err) {
      setError('Erro ao atualizar status: ' + err.message);
    }
  };

  const handleCancel = () => {
    setFormData({ animal_id: '', data_hora: '', motivo: '', status: 'agendada' });
    setEditingId(null);
    setShowForm(false);
  };

  const getNomeAnimal = (id) => {
    const animal = animais.find(a => a.id === id);
    return animal ? animal.nome : 'Desconhecido';
  };

  const formatarData = (dataStr) => {
    if (!dataStr) return 'N/A';
    return new Date(dataStr).toLocaleString('pt-BR');
  };

  // Filtrar consultas localmente para melhor UX
  const consultasFiltradas = filterStatus === 'todos' 
    ? consultas 
    : consultas.filter(c => c.status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gerenciar Consultas</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            {showForm ? 'Cancelar' : 'Nova Consulta'}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Filtros */}
        <div className="mb-6 bg-white rounded-lg shadow-md p-4 flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filtrar por Status:</label>
          <div className="flex gap-2">
            {['todos', 'agendada', 'concluida', 'cancelada'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                  filterStatus === status 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingId ? 'Editar Consulta' : 'Nova Consulta'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="animal_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Animal
                  </label>
                  <select
                    id="animal_id"
                    name="animal_id"
                    value={formData.animal_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">Selecione um animal</option>
                    {animais.map(animal => (
                      <option key={animal.id} value={animal.id}>{animal.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="data_hora" className="block text-sm font-medium text-gray-700 mb-2">
                    Data e Hora
                  </label>
                  <input
                    type="datetime-local"
                    id="data_hora"
                    name="data_hora"
                    value={formData.data_hora}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo da Consulta
                </label>
                <textarea
                  id="motivo"
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  rows="3"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Descreva o motivo da consulta..."
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="agendada">Agendada</option>
                  <option value="concluida">Concluída</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  {editingId ? 'Atualizar' : 'Agendar'}
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

        {/* Lista de consultas */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Carregando...</p>
          </div>
        ) : consultasFiltradas.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg">
            <p className="text-gray-600">Nenhuma consulta encontrada</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {consultasFiltradas.map((consulta) => (
              <div key={consulta.id} className="bg-white rounded-lg shadow-md p-6 border-t-4 border-indigo-500">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-800">{getNomeAnimal(consulta.animal_id)}</h3>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    consulta.status === 'concluida' ? 'bg-green-100 text-green-800' :
                    consulta.status === 'cancelada' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {consulta.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-2 mb-4">
                  <p><strong>Data:</strong> {formatarData(consulta.data_hora)}</p>
                  <p className="line-clamp-2"><strong>Motivo:</strong> {consulta.motivo}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(consulta)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-2 rounded-lg transition text-xs"
                  >
                    Editar
                  </button>
                  {consulta.status === 'agendada' && (
                    <button
                      onClick={() => handleStatusChange(consulta.id, 'concluida')}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-2 rounded-lg transition text-xs"
                    >
                      Concluir
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(consulta.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-2 rounded-lg transition text-xs"
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
