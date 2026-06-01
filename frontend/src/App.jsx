import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider }     from "./context/AuthContext";
import Navbar               from "./components/Navbar";
import Home                 from "./pages/Home";
import Destinations         from "./pages/Destinations";
import DestinationDetail    from "./pages/DestinationDetail";
import Packages             from "./pages/Packages";
import Hotels               from "./pages/Hotels";
import HotelDetail          from "./pages/HotelDetail";
import Login                from "./pages/Login";
import Profile              from "./pages/Profile";
import AdminLogin           from "./pages/AdminLogin";
import AdminDashboard       from "./pages/AdminDashboard";
import "./assets/css/global.css";

function AppRoutes() {
  return (
    <Routes>
      {/* Pages WITHOUT navbar */}
      <Route path="/login"        element={<Login />} />
      <Route path="/admin-login"  element={<AdminLogin />} />
      <Route path="/admin"        element={<AdminDashboard />} />

      {/* All pages WITH navbar */}
      <Route
        path="/*"
        element={
          <>
            <Navbar />
            <Routes>
              <Route path="/"                     element={<Home />} />
              <Route path="/destinations"         element={<Destinations />} />
              <Route path="/destinations/:id"     element={<DestinationDetail />} />
              <Route path="/packages"             element={<Packages />} />
              <Route path="/hotels"               element={<Hotels />} />
              <Route path="/hotels/:id"           element={<HotelDetail />} />
              <Route path="/profile"              element={<Profile />} />
            </Routes>
          </>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
