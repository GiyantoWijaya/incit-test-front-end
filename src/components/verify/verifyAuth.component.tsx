import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SimpleBackdrop from "../spinner/spinner.component";

export default function VerifyAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();

  const { email, token } = useParams();
  useEffect(() => {
    const callVerifyBackend = async () => {
      try {
        setIsLoading(true)
        const response = await axios.post('http://localhost:3001/sign-up/verify-email-code', { email, token });

        setIsLoading(false)
        navigate('/login', { state: response.data })
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data.message)
          navigate("/register", { state: error.response?.data })
        }
      }
    }
    callVerifyBackend()
  }, [email, token, navigate])

  return (
    <>
      {isLoading && (<>
        <SimpleBackdrop />
      </>)}
    </>
  );
}