import { useState } from 'react';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import { Alert, Button, CircularProgress, Link, Stack, TextField, Typography } from '@mui/material';
import AuthLayout from '../components/AuthLayout';
import { errosDosCampos, mensagemDeErro } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useNotificacao } from '../context/NotificacaoContext';

export default function RegistroPage() {
  const { registrar, autenticado } = useAuth();
  const notificar = useNotificacao();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [erros, setErros] = useState({});
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  if (autenticado) return <Navigate to="/eventos" replace />;

  const alterar = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }));

  const enviar = async (e) => {
    e.preventDefault();
    setErro(null);
    setErros({});
    setCarregando(true);
    try {
      await registrar(form.nome, form.email, form.senha);
      notificar('Conta criada! Bem-vindo(a).');
      navigate('/eventos', { replace: true });
    } catch (err) {
      setErros(errosDosCampos(err));
      setErro(mensagemDeErro(err));
      setCarregando(false);
    }
  };

  return (
    <AuthLayout titulo="Criar conta" subtitulo="Leva menos de um minuto.">
      <Stack component="form" spacing={2.5} onSubmit={enviar} noValidate>
        {erro && <Alert severity="error">{erro}</Alert>}
        <TextField label="Nome" autoComplete="name" autoFocus required value={form.nome} onChange={alterar('nome')}
          error={Boolean(erros.nome)} helperText={erros.nome} />
        <TextField label="E-mail" type="email" autoComplete="email" required value={form.email} onChange={alterar('email')}
          error={Boolean(erros.email)} helperText={erros.email} />
        <TextField label="Senha" type="password" autoComplete="new-password" required value={form.senha} onChange={alterar('senha')}
          error={Boolean(erros.senha)} helperText={erros.senha || 'Mínimo de 6 caracteres'} />
        <Button type="submit" variant="contained" size="large" disabled={carregando}
          startIcon={carregando && <CircularProgress size={18} color="inherit" />}>
          {carregando ? 'Criando conta...' : 'Criar conta'}
        </Button>
        <Typography variant="body2" color="text.secondary" align="center">
          Já tem conta? <Link component={RouterLink} to="/login">Entrar</Link>
        </Typography>
      </Stack>
    </AuthLayout>
  );
}
