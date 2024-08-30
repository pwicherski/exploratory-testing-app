import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    // TODO: Implement actual Google Sign-In
    console.log("Signing in with Google");
    // For now, we'll just navigate to the session list
    navigate("/sessions");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Welcome to Note Scribe Sessions</h1>
        <Button onClick={handleSignIn} className="w-full">
          Sign in with Google
        </Button>
      </div>
    </div>
  );
};

export default SignIn;