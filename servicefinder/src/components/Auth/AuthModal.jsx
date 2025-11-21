import { useState } from "react";
import { X } from "lucide-react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import { authService } from "../../firebase/firebaseServices";

const AuthModal = ({ isOpen, onClose }) => {
  const [view, setView] = useState('signin');

  const handleSignInSuccess = () => {
    onClose();
  };

  const handleSignUpSuccess = () => {
    onClose();
  };

  const handleForgotPassword = async () => {
    const email = prompt('Enter your email:');
    if (email) {
      try {
        await authService.sendPasswordReset(email);
        alert('Password reset email sent! Check your inbox.');
      } catch (error) {
        alert(error.message);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          {view === 'signin' ? (
            <SignInForm
              onSuccess={handleSignInSuccess}
              onSwitchToSignUp={() => setView('signup')}
              onForgotPassword={handleForgotPassword}
            />
          ) : (
            <SignUpForm
              onSuccess={handleSignUpSuccess}
              onSwitchToSignIn={() => setView('signin')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;