import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const ProtectedPage: React.FC = () => {
  const { user, loading, refreshUser } = useAuth();

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Access Denied. Please login.</div>;

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Business: {user.businessName}</p>
    </div>
  );
};

export default ProtectedPage;
