import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import GoogleAuth from './sign-in-google.component';
import FacebookAuth from './sign-in-facebook.component';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import axios from 'axios';
import SimpleBackdrop from '../spinner/spinner.component';
import Cookies from 'js-cookie';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface tokenPayload extends JwtPayload {
  id?: string
}

export default function SignIn() {
  const [message, setMessage] = useState("")
  const [error, setError] = useState<string | null>("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();

  const location = useLocation();
  useEffect(() => {
    if (!location.state) {
      setMessage("")
    } else {
      setMessage(location.state.message)
    }
  }, [location])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      email: data.get('email'),
      password: data.get('password'),
    }

    try {
      setIsLoading(true)
      const response = await axios.post('http://localhost:3001/sign-in', payload);
      const jwt_token = response.data.data.jwt_token
      const decoded: tokenPayload = jwtDecode(jwt_token)
      Cookies.set('token', `${jwt_token}`)
      Cookies.set('user_id', decoded.id ? decoded.id : "")
      setError(null)
      setIsLoading(false)
      navigate("/dashboard")
    } catch (error) {
      setIsLoading(false)
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message)
        if (error.response?.status === 403) return navigate(`/verify/${payload.email}`)
      }
    }

  };
  return (
    <Container component="main" maxWidth="xs">
      {isLoading && (<>
        <SimpleBackdrop />
      </>)}
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* flash success */}
        {message && (<Alert severity="success">{message}</Alert>)}
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {/* flash error */}
        {error && (<Alert severity="error">{error}</Alert>)}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Container>
        <Box
          sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <GoogleAuth />
        </Box>
        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <FacebookAuth />
        </Box>
      </Container>
      <Container>
      </Container>
    </Container>

  );
}