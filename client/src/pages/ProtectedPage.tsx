import React from "react";
import { useAuth } from "../context/AuthContext";

const ProtectedPage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Access Denied. Please login.</div>;

  return (
    <div>
      <h1>this is a protected page</h1>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Business: {user.businessName}</p>
    </div>
  );
};

export default ProtectedPage;
