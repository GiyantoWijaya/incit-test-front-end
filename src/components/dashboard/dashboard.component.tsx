import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Container } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import SimpleBackdrop from '../spinner/spinner.component';
import Chart from './charts.component';
import formatDateFromUnix from '../../utils/methodHelper/formatDate';

interface Session {
  last_logget_out_at: number;
  times_account_creation: number;
  times_logged_in: number;
}

interface User extends Session {
  email: string;
  firstName: string;
  lastName: string | null;
  sessions: Session[];
}


export default function DashboardMain() {
  const [data, setData] = useState<User[]>([])
  const [firstName, setFirstName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>("")
  const headerJwt = Cookies.get('token')

  useEffect(() => {
    try {
      setIsLoading(true)
      const initialFetch = async () => {
        const whoLogin = await axios.get('http://localhost:3001/profile', {
          headers: {
            authorization: 'Bearer ' + headerJwt
          }
        });
        setFirstName(whoLogin.data.data.firstName)

        const response = await axios.get('http://localhost:3001/dashboard', {
          headers: {
            authorization: 'Bearer ' + headerJwt
          }
        });
        setData(response.data.data)

      }
      initialFetch()
      setIsLoading(false)
    } catch (e) {
      setIsLoading(false)
      if (axios.isAxiosError(e)) {
        setError(e.response?.data.message)
        console.log(error)
      }
    }
  }, [headerJwt, error])

  return (
    <>
      {isLoading && (<>
        <SimpleBackdrop />
      </>)}
      <Container sx={{
        mt: 5
      }}>
        <h1>Welcome Back {firstName}</h1>
      </Container>

      <Container sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        mt: 5,
        mb: 10
      }}>
        <h1>This is main dashboard</h1>
        {/* display chart */}
        <Container sx={{
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Chart headerJwt={headerJwt} />
        </Container>
        {/* table */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell align="right">User Sign-up Timestamp</TableCell>
                <TableCell align="right">Logged-In</TableCell>
                <TableCell align="right">Logged-Out</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {item.email}
                  </TableCell>
                  <TableCell align="right">{item.sessions[0].times_account_creation ? formatDateFromUnix(item.sessions[0].times_account_creation) : ""}</TableCell>
                  <TableCell align="right">{item.sessions[0].times_logged_in}</TableCell>
                  <TableCell align="right">{item.sessions[0].last_logget_out_at ? formatDateFromUnix(item.sessions[0].last_logget_out_at) : ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}


