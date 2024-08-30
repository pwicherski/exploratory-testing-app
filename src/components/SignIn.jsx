import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';

const SignIn = () => {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
      // TODO: Send the access token to your backend
      navigate("/sessions");
    },
    scope: 'https://www.googleapis.com/auth/drive.file',
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Welcome to Note Scribe Sessions</h1>
        <Button onClick={() => login()} className="w-full">
          Sign in with Google
        </Button>
      </div>
    </div>
  );
};

export default SignIn;
