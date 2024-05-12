
import { useState } from 'react';
import { TextField, Button, Box, Container, FormControl, Alert } from '@mui/material';
import Cookies from 'js-cookie';
import axios from 'axios';
import SimpleBackdrop from '../spinner/spinner.component';

export default function Account() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<string>("")
  const [error, setError] = useState<string | null>("")
  const heederJwt = Cookies.get('token')


  const handleSave = async () => {
    try {
      setIsLoading(true)
      const response = await axios.patch('http://localhost:3001/change-password', {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_new_password: confirmNewPassword
      }, {
        headers: {
          authorization: 'Bearer ' + heederJwt
        }
      });

      setSuccess(response.data.message)
      setError(null)
      setIsLoading(false)
    } catch (e) {
      setIsLoading(false)
      if (axios.isAxiosError(e)) {
        setError(e.response?.data.message[0].msg)
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
      <h1>Change Password</h1>
      {/* set success notifier */}
      {success && (<Alert sx={{ mb: 1 }} severity="success">{success}</Alert>)}
      {/* set error notifier */}
      {error && (<Alert severity="error">{error}</Alert>)}
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
            label="Old Password"
            type='password'
            onChange={(e) => setOldPassword(e.target.value)}
            fullWidth
          />
          <TextField
            sx={{ mb: 3 }}
            label="New Password"
            type='password'
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
          />
          <TextField
            sx={{ mb: 3 }}
            label="Confirm New Password"
            type='password'
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            fullWidth
          />
          <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
        </FormControl>
      </Box>
    </Container >

  );
}