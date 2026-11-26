import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { tokenStorage } from '../api/client';
import { authApi } from '../api/services';

const USER_KEY = 'agenda.usuario';
const AuthContext = createContext(null);

function lerUsuario() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => (tokenStorage.get() ? lerUsuario() : null));

  const salvarSessao = useCallback(({ token, usuario }) => {
    tokenStorage.set(token);
    localStorage.setItem(USER_KEY, JSON.stringify(usuario));
    setUsuario(usuario);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    localStorage.removeItem(USER_KEY);
    setUsuario(null);
  }, []);

  // O interceptor do axios dispara este evento quando a API responde 401
  useEffect(() => {
    window.addEventListener('auth:expirado', logout);
    return () => window.removeEventListener('auth:expirado', logout);
  }, [logout]);

  const valor = useMemo(() => ({
    usuario,
    autenticado: Boolean(usuario),
    login: async (email, senha) => salvarSessao(await authApi.login(email, senha)),
    registrar: async (nome, email, senha) => salvarSessao(await authApi.registrar(nome, email, senha)),
    logout,
  }), [usuario, salvarSessao, logout]);

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
