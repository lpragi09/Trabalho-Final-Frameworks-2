import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Avatar, Box, Button, Container, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import EventIcon from '@mui/icons-material/EventAvailable';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';

const links = [
  { para: '/eventos', texto: 'Eventos' },
  { para: '/categorias', texto: 'Categorias' },
];

export default function Layout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const sair = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" color="inherit" sx={{ borderBottom: '1px solid #e7e5f2' }} elevation={0}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 1 }}>
            <Box component={NavLink} to="/eventos"
              sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', textDecoration: 'none', mr: 3 }}>
              <EventIcon />
              <Typography variant="h6" sx={{ color: 'text.primary' }}>Agenda<Box component="span" sx={{ color: 'secondary.main' }}>+</Box></Typography>
            </Box>

            {links.map((l) => (
              <Button key={l.para} component={NavLink} to={l.para} color="inherit"
                sx={{ color: 'text.secondary', '&.active': { color: 'primary.main', bgcolor: '#eef0ff' } }}>
                {l.texto}
              </Button>
            ))}

            <Box sx={{ flexGrow: 1 }} />
            <Typography variant="body2" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
              {usuario?.nome}
            </Typography>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
              {usuario?.nome?.[0]?.toUpperCase()}
            </Avatar>
            <Tooltip title="Sair">
              <IconButton onClick={sair} aria-label="Sair"><LogoutIcon fontSize="small" /></IconButton>
            </Tooltip>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg" component="main" sx={{ py: 4, flexGrow: 1 }}>
        <Outlet />
      </Container>

      <Box component="footer" sx={{ py: 3, textAlign: 'center', color: 'text.secondary', fontSize: 13 }}>
        Trabalho Final · Frameworks Web II · Unilavras
      </Box>
    </Box>
  );
}
