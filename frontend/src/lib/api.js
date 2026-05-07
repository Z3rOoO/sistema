// Configuração da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Função para fazer requisições à API
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Adicionar token de autenticação se existir
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.mensagem || 'Erro na requisição');
    }

    return data;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}

// ===== AUTENTICAÇÃO =====
export const authAPI = {
  login: (login, senha) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login, senha }),
    }),

  registrar: (nome, login, senha) =>
    apiRequest('/auth/registrar', {
      method: 'POST',
      body: JSON.stringify({ nome, login, senha }),
    }),

  obterPerfil: () =>
    apiRequest('/auth/perfil', {
      method: 'GET',
    }),
};

// ===== ANIMAIS =====
export const animalAPI = {
  listarTodos: () =>
    apiRequest('/equipamentos', {
      method: 'GET',
    }),

  buscarPorId: (id) =>
    apiRequest(`/equipamentos/${id}`, {
      method: 'GET',
    }),

  criar: (dados) =>
    apiRequest('/equipamentos', {
      method: 'POST',
      body: JSON.stringify(dados),
    }),

  atualizar: (id, dados) =>
    apiRequest(`/equipamentos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    }),

  excluir: (id) =>
    apiRequest(`/equipamentos/${id}`, {
      method: 'DELETE',
    }),
};

// ===== CONSULTAS =====
export const consultaAPI = {
  listarTodos: () =>
    apiRequest('/emprestimos', {
      method: 'GET',
    }),

  listarEmAberto: () =>
    apiRequest('/emprestimos/em-aberto', {
      method: 'GET',
    }),

  listarConcluidas: () =>
    apiRequest('/emprestimos/concluidas', {
      method: 'GET',
    }),

  listarCanceladas: () =>
    apiRequest('/emprestimos/canceladas', {
      method: 'GET',
    }),

  buscarPorId: (id) =>
    apiRequest(`/emprestimos/${id}`, {
      method: 'GET',
    }),

  criar: (dados) =>
    apiRequest('/emprestimos', {
      method: 'POST',
      body: JSON.stringify(dados),
    }),

  atualizar: (id, dados) =>
    apiRequest(`/emprestimos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    }),

  devolver: (id, dados) =>
    apiRequest(`/emprestimos/${id}/devolver`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    }),

  excluir: (id) =>
    apiRequest(`/emprestimos/${id}`, {
      method: 'DELETE',
    }),
};

// ===== TUTORES =====
export const tutorAPI = {
  listarTodos: () =>
    apiRequest('/tutores', {
      method: 'GET',
    }),

  buscarPorId: (id) =>
    apiRequest(`/tutores/${id}`, {
      method: 'GET',
    }),

  criar: (dados) =>
    apiRequest('/tutores', {
      method: 'POST',
      body: JSON.stringify(dados),
    }),

  atualizar: (id, dados) =>
    apiRequest(`/tutores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    }),

  excluir: (id) =>
    apiRequest(`/tutores/${id}`, {
      method: 'DELETE',
    }),
};

// ===== USUÁRIOS (Admin) =====
export const usuarioAPI = {
  listarTodos: (pagina = 1, limite = 10) =>
    apiRequest(`/usuarios?pagina=${pagina}&limite=${limite}`, {
      method: 'GET',
    }),

  criar: (dados) =>
    apiRequest('/usuarios', {
      method: 'POST',
      body: JSON.stringify(dados),
    }),

  atualizar: (id, dados) =>
    apiRequest(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    }),

  excluir: (id) =>
    apiRequest(`/usuarios/${id}`, {
      method: 'DELETE',
    }),
};
