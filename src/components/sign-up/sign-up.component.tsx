import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Alert } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import SimpleBackdrop from '../spinner/spinner.component';



export default function SignUp() {
  const [error, setError] = useState<string | null>("")
  const [success, setSuccess] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();
  const location = useLocation()

  useEffect(() => {
    if (!location.state) {
      setError("")
    } else {
      setError(location.state.message)
    }
  }, [location])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      firstName: data.get('firstName'),
      lastName: data.get('lastName'),
      email: data.get('email'),
      password: data.get('password'),
      confirm_password: data.get('confirm_password')
    }

    try {
      setIsLoading(true)
      const response = await axios.post('http://localhost:3001/sign-up', payload);

      setSuccess(response.data.message)
      console.log(success)
      setError(null)
      setIsLoading(false)
      navigate(`/verify/${payload.email}`)
    } catch (error) {
      setIsLoading(false)
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message[0].msg)
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

        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>

        {/* set error notifier */}
        {error && (<Alert severity="error">{error}</Alert>)}

        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirm_password"
                label="Confirm Password"
                type="password"
                id="confirm_password"
                autoComplete="new-confirm_password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}