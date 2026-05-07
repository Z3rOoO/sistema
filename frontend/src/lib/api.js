// Configuração da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
    
    // Tentar obter o JSON da resposta
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(`Erro no servidor (${response.status}): O servidor não retornou JSON. Resposta: ${text.substring(0, 100)}...`);
    }

    if (!response.ok) {
      throw new Error(data.mensagem || data.erro || 'Erro na requisição');
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
      body: JSON.stringify({
        nome: dados.nome,
        descricao: `${dados.especie || ''} | ${dados.raca || ''} | Tutor: ${dados.tutor_id || ''}`
      }),
    }),

  atualizar: (id, dados) =>
    apiRequest(`/animal/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        nome: dados.nome,
        descricao: `${dados.especie || ''} | ${dados.raca || ''} | Tutor: ${dados.tutor_id || ''}`
      }),
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
      body: JSON.stringify({
        nome: `Consulta: ${dados.animal_id}`,
        descricao: `Motivo: ${dados.motivo} | Data: ${dados.data_hora} | Status: ${dados.status}`
      }),
    }),

  atualizar: (id, dados) =>
    apiRequest(`/consulta/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        nome: dados.nome || `Consulta: ${dados.animal_id}`,
        descricao: dados.descricao || `Motivo: ${dados.motivo} | Data: ${dados.data_hora} | Status: ${dados.status}`
      }),
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
      body: JSON.stringify({
        nome: dados.nome,
        descricao: `Tel: ${dados.telefone || ''} | Email: ${dados.email || ''}`
      }),
    }),

  atualizar: (id, dados) =>
    apiRequest(`/tutor/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        nome: dados.nome,
        descricao: `Tel: ${dados.telefone || ''} | Email: ${dados.email || ''}`
      }),
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
