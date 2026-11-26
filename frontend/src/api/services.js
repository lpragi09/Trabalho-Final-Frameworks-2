import { api } from './client';

const dados = (promise) => promise.then((res) => res.data);

export const authApi = {
  login: (email, senha) => dados(api.post('/auth/login', { email, senha })),
  registrar: (nome, email, senha) => dados(api.post('/auth/register', { nome, email, senha })),
};

export const eventosApi = {
  listar: (params) => dados(api.get('/api/eventos', { params })),
  buscar: (id) => dados(api.get(`/api/eventos/${id}`)),
  criar: (evento) => dados(api.post('/api/eventos', evento)),
  atualizar: (id, evento) => dados(api.put(`/api/eventos/${id}`, evento)),
  excluir: (id) => dados(api.delete(`/api/eventos/${id}`)),
};

export const categoriasApi = {
  listar: (params) => dados(api.get('/api/categorias', { params })),
  todas: () => dados(api.get('/api/categorias/todas')),
  criar: (categoria) => dados(api.post('/api/categorias', categoria)),
  atualizar: (id, categoria) => dados(api.put(`/api/categorias/${id}`, categoria)),
  excluir: (id) => dados(api.delete(`/api/categorias/${id}`)),
};

export const participantesApi = {
  listar: (eventoId, params) => dados(api.get(`/api/eventos/${eventoId}/participantes`, { params })),
  inscrever: (eventoId, participante) => dados(api.post(`/api/eventos/${eventoId}/participantes`, participante)),
  cancelar: (eventoId, id) => dados(api.delete(`/api/eventos/${eventoId}/participantes/${id}`)),
};
