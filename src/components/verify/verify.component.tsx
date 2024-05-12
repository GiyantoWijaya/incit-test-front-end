import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Alert, Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';


export default function VerifyNotification() {
  const [disabled, setDisabled] = useState<boolean>(() => {
    const savedDisabled = localStorage.getItem('disabled');
    return savedDisabled ? JSON.parse(savedDisabled) : false;
  });
  const [remainingTime, setRemainingTime] = useState<number>(() => {
    const savedTime = localStorage.getItem('remainingTime');
    return savedTime ? parseInt(savedTime, 10) : 30;
  });
  const [message, setMessage] = useState("")
  const { email } = useParams();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (disabled) {
      interval = setInterval(() => {
        setRemainingTime(prevTime => {
          if (prevTime === 0) {
            setDisabled(false);
            clearInterval(interval);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [disabled]);

  useEffect(() => {
    localStorage.setItem('remainingTime', remainingTime.toString());
    localStorage.setItem('disabled', JSON.stringify(disabled));
  }, [remainingTime, disabled]);

  const handleClick = async () => {
    setDisabled(true);
    setRemainingTime(30);

    setTimeout(() => {
      // Enable the button after 30 seconds
      setDisabled(false);
      setRemainingTime(30);
    }, 30000);

    try {
      const response = await axios.post('http://localhost:3001/sign-up/request-verify-email', { email });
      setMessage(response.data.message)

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message)
      }
    }
  };
  return (
    <Container>
      {/* flash success */}
      <Box sx={{
        marginTop: 10,
      }}>
        {message && (<Alert severity="success">{message}</Alert>)}
        <Card sx={{ minWidth: 275, mt: 1 }}>
          <CardContent>
            <Typography variant="body2">
              Please Check your email for verification
              <br />
              {`${email}`}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={handleClick} disabled={disabled}>Resend verification email {disabled ? `(${remainingTime}s)` : null}</Button>
          </CardActions>
        </Card>
      </Box>
    </Container>
  );
}