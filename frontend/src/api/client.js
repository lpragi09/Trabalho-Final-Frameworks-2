import axios from 'axios';

const TOKEN_KEY = 'agenda.token';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 15000,
});

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

// Envia o JWT no cabeçalho Authorization de todas as requisições
api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Token expirado/inválido em rota protegida -> avisa o AuthContext para deslogar
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.startsWith('/auth');
    if (error.response?.status === 401 && !isAuthRoute) {
      window.dispatchEvent(new Event('auth:expirado'));
    }
    return Promise.reject(error);
  },
);

/** Extrai uma mensagem legível do erro devolvido pela API. */
export function mensagemDeErro(error) {
  if (error.response?.data?.mensagem) return error.response.data.mensagem;
  if (error.code === 'ECONNABORTED') return 'A API demorou demais para responder.';
  if (!error.response) return 'Não foi possível conectar à API. Ela está rodando?';
  return `Erro inesperado (${error.response.status}).`;
}

/** Erros de validação por campo ({ titulo: 'O título é obrigatório' }). */
export function errosDosCampos(error) {
  return error.response?.data?.campos || {};
}
