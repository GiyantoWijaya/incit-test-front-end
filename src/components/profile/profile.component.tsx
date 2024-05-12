
import { useEffect, useState } from 'react';
import { TextField, Button, Box, Container, FormControl, Alert } from '@mui/material';
import Cookies from 'js-cookie';
import axios from 'axios';
import SimpleBackdrop from '../spinner/spinner.component';

export default function MyProfile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<string>("")
  const [error, setError] = useState<string | null>("")
  const heederJwt = Cookies.get('token')

  useEffect(() => {
    try {
      const initialFetch = async () => {
        const response = await axios.get('http://localhost:3001/profile', {
          headers: {
            authorization: 'Bearer ' + heederJwt
          }
        });
        const { firstName, lastName } = response.data.data
        setFirstName(firstName)
        setLastName(lastName)
      }
      initialFetch()
    } catch (e) {
      setIsLoading(false)
      if (axios.isAxiosError(e)) {
        setError(e.response?.data.message)
        console.log(error)
      }
    }
  }, [heederJwt, error])

  const handleSave = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post('http://localhost:3001/profile', {
        firstName, lastName
      }, {
        headers: {
          authorization: 'Bearer ' + heederJwt
        }
      });
      console.log('Saving:', firstName, lastName);
      setSuccess(response.data.message)
      setError(null)
      setIsLoading(false)
    } catch (e) {
      setIsLoading(false)
      if (axios.isAxiosError(e)) {
        setError(e.response?.data.message)
        console.log(error)
      }
    }
  };

  return (
    <Container sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      mt: 15,
    }}>
      {isLoading && (<>
        <SimpleBackdrop />
      </>)}
      <h1>Edit My Profile</h1>
      {success && (<Alert severity="success">{success}</Alert>)}
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '35ch' },
          mt: 5
        }}
        noValidate
        autoComplete="off">
        {/* flash success */}
        <FormControl>
          <TextField
            sx={{ mb: 3 }}
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
          />
          <TextField
            sx={{ mb: 3 }}
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
          />
          <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
        </FormControl>
      </Box>
    </Container >

  );
}