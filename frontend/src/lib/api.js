// Configuração da API
// O backend está usando prefixos como /auth, /tutor, /animal, /consulta sem o prefixo /api
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
    
    // Se a resposta não for JSON (ex: erro 404 HTML), lançar erro antes de tentar parsear
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Erro no servidor (${response.status}): Resposta não é JSON`);
    }

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
    apiRequest('/animal', {
      method: 'GET',
    }),

  buscarPorId: (id) =>
    apiRequest(`/animal/${id}`, {
      method: 'GET',
    }),

  criar: (dados) =>
    apiRequest('/animal', {
      method: 'POST',
      body: JSON.stringify(dados),
    }),

  atualizar: (id, dados) =>
    apiRequest(`/animal/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    }),

  excluir: (id) =>
    apiRequest(`/animal/${id}`, {
      method: 'DELETE',
    }),
};

// ===== CONSULTAS =====
export const consultaAPI = {
  listarTodos: () =>
    apiRequest('/consulta', {
      method: 'GET',
    }),

  listarEmAberto: () =>
    apiRequest('/consulta/em-aberto', {
      method: 'GET',
    }),

  listarConcluidas: () =>
    apiRequest('/consulta/concluidas', {
      method: 'GET',
    }),

  listarCanceladas: () =>
    apiRequest('/consulta/canceladas', {
      method: 'GET',
    }),

  buscarPorId: (id) =>
    apiRequest(`/consulta/${id}`, {
      method: 'GET',
    }),

  criar: (dados) =>
    apiRequest('/consulta', {
      method: 'POST',
      body: JSON.stringify(dados),
    }),

  atualizar: (id, dados) =>
    apiRequest(`/consulta/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    }),

  devolver: (id, dados) =>
    apiRequest(`/consulta/${id}/devolver`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    }),

  excluir: (id) =>
    apiRequest(`/consulta/${id}`, {
      method: 'DELETE',
    }),
};

// ===== TUTORES =====
export const tutorAPI = {
  listarTodos: () =>
    apiRequest('/tutor', {
      method: 'GET',
    }),

  buscarPorId: (id) =>
    apiRequest(`/tutor/${id}`, {
      method: 'GET',
    }),

  criar: (dados) =>
    apiRequest('/tutor', {
      method: 'POST',
      body: JSON.stringify(dados),
    }),

  atualizar: (id, dados) =>
    apiRequest(`/tutor/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    }),

  excluir: (id) =>
    apiRequest(`/tutor/${id}`, {
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
