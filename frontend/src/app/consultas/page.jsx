'use client';

import { useState, useEffect } from 'react';
import { consultaAPI } from '@/lib/api';

export default function ConsultasPage() {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('todos');
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
  });

  // Carregar lista de consultas
  const carregarConsultas = async () => {
    try {
      setLoading(true);
      let response;

      if (filterStatus === 'todos') {
        response = await consultaAPI.listarTodos();
      } else if (filterStatus === 'em-aberto') {
        response = await consultaAPI.listarEmAberto();
      } else if (filterStatus === 'concluidas') {
        response = await consultaAPI.listarConcluidas();
      } else if (filterStatus === 'canceladas') {
        response = await consultaAPI.listarCanceladas();
      }

      if (response.sucesso) {
        setConsultas(response.dados || []);
      }
    } catch (err) {
      setError('Erro ao carregar consultas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarConsultas();
  }, [filterStatus]);

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
        await consultaAPI.atualizar(editingId, formData);
      } else {
        // Criar
        await consultaAPI.criar(formData);
      }

      setFormData({ nome: '', descricao: '' });
      setEditingId(null);
      setShowForm(false);
      carregarConsultas();
    } catch (err) {
      setError('Erro ao salvar consulta: ' + err.message);
    }
  };

  const handleEdit = (consulta) => {
    setFormData({ nome: consulta.nome, descricao: consulta.descricao });
    setEditingId(consulta.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta consulta?')) return;

    try {
      await consultaAPI.excluir(id);
      carregarConsultas();
    } catch (err) {
      setError('Erro ao excluir consulta: ' + err.message);
    }
  };

  const handleDevolver = async (id) => {
    try {
      await consultaAPI.devolver(id, { status: 'concluida' });
      carregarConsultas();
    } catch (err) {
      setError('Erro ao devolver consulta: ' + err.message);
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
          <h1 className="text-3xl font-bold text-gray-800">Consultas/Empréstimos</h1>
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
        <div className="mb-6 bg-white rounded-lg shadow-md p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="todos">Todas</option>
            <option value="em-aberto">Em Aberto</option>
            <option value="concluidas">Concluídas</option>
            <option value="canceladas">Canceladas</option>
          </select>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingId ? 'Editar Consulta' : 'Nova Consulta'}
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
                  placeholder="Digite o nome da consulta"
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
                  placeholder="Digite a descrição da consulta"
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

        {/* Lista de consultas */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Carregando...</p>
          </div>
        ) : consultas.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg">
            <p className="text-gray-600">Nenhuma consulta cadastrada</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {consultas.map((consulta) => (
              <div key={consulta.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{consulta.nome}</h3>
                <p className="text-gray-600 text-sm mb-2">{consulta.descricao}</p>
                <p className="text-xs text-gray-500 mb-4">
                  Status: <span className="font-semibold">{consulta.status || 'N/A'}</span>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(consulta)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDevolver(consulta.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
                  >
                    Devolver
                  </button>
                  <button
                    onClick={() => handleDelete(consulta.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
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
