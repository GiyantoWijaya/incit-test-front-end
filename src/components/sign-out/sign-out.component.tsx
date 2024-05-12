import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function SignOut() {
  const heederJwt = Cookies.get('token')
  const navigate = useNavigate()

  try {
    const doLogout = async () => {
      const response = await axios.post('http://localhost:3001/sign-out', {}, {
        headers: {
          authorization: 'Bearer ' + heederJwt
        }
      });
      Cookies.remove('token')
      Cookies.remove("user_id")
      navigate("/login", { state: response.data })
    }
    doLogout()
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data.message)
    }
  }
  return (
    <div>

      <p>this is dashboard</p>
    </div>
  );
}


