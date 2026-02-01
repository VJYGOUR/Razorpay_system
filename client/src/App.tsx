import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Docs from "./pages/Docs";
import TestPayment from "./pages/TestPayment";

import AdminLogin from "./pages/AdminLogin";
import AdminConsole from "./pages/AdminConsole";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/console" element={<AdminConsole />} />
        <Route path="/payments/test" element={<TestPayment />} />
        <Route path="*" element={<Navigate to="/payments/test" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import LoginPage from "./pages/Login";
// import ProtectedPage from "./pages/ProtectedPage";

// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const { user, loading } = useAuth();
//   if (loading) return <div>Loading...</div>;
//   if (!user) return <Navigate to="/login" replace />;
//   return <>{children}</>;
// };

// const App: React.FC = () => {
//   return (
//
//       <Router>
//         <Routes>
//           <Route path="/login" element={<LoginPage />} />
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <ProtectedPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="*" element={<Navigate to="/dashboard" replace />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// };

// export default App;
