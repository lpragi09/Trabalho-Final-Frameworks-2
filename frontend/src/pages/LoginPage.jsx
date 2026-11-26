import { useState } from 'react';
import { Link as RouterLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Alert, Button, CircularProgress, Link, Stack, TextField, Typography } from '@mui/material';
import AuthLayout from '../components/AuthLayout';
import { mensagemDeErro } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, autenticado } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  if (autenticado) return <Navigate to="/eventos" replace />;

  const enviar = async (e) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      await login(email, senha);
      navigate(location.state?.de || '/eventos', { replace: true });
    } catch (err) {
      setErro(mensagemDeErro(err));
      setCarregando(false);
    }
  };

  return (
    <AuthLayout titulo="Entrar" subtitulo="Acesse sua conta para gerenciar os eventos.">
      <Stack component="form" spacing={2.5} onSubmit={enviar} noValidate>
        {erro && <Alert severity="error">{erro}</Alert>}
        <TextField label="E-mail" type="email" autoComplete="email" autoFocus required
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Senha" type="password" autoComplete="current-password" required
          value={senha} onChange={(e) => setSenha(e.target.value)} />
        <Button type="submit" variant="contained" size="large" disabled={carregando}
          startIcon={carregando && <CircularProgress size={18} color="inherit" />}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </Button>
        <Typography variant="body2" color="text.secondary" align="center">
          Não tem conta? <Link component={RouterLink} to="/registro">Cadastre-se</Link>
        </Typography>
      </Stack>
    </AuthLayout>
  );
}
