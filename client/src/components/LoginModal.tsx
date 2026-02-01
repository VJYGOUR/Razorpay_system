import { useAuth } from "../context/AuthContext";

const LoginModal = () => {
  const { loginOpen, closeLoginModal } = useAuth();
  console.log(loginOpen);
  if (!loginOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded">
        <h2>Login required</h2>
        <a href={`${import.meta.env.VITE_API_URL}/auth/google`} className="btn">
          Continue with Google
        </a>
        <button onClick={closeLoginModal}>Cancel</button>
      </div>
    </div>
  );
};
export default LoginModal;
