import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface tokenPayload extends JwtPayload {
  id?: string
}
const GoogleAuth = () => {

  const navigate = useNavigate();
  const responseMessage = async (response: CredentialResponse) => {
    const credential = response.credential

    const dataFromResponse = await axios.post('http://localhost:3001/sign-in/google-auth-verify', { credential });
    const statusCode: number = dataFromResponse.status

    if (statusCode === 200 || statusCode === 201) {
      const token: string = dataFromResponse.data.data.token
      const decoded: tokenPayload = jwtDecode(token)
      Cookies.set('token', `${token}`)
      Cookies.set('user_id', decoded.id ? decoded.id : "")

      navigate("/dashboard")
    }

  };
  const errorMessage = () => {
    console.log('login with google failed');
    navigate("/login")
  };
  return (
    <GoogleLogin
      onSuccess={responseMessage}
      onError={errorMessage}
    />
  );
};

export default GoogleAuth;