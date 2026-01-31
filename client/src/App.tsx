import { BrowserRouter, Routes, Route } from "react-router-dom";
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
      </Routes>
    </BrowserRouter>
  );
};

export default App;
