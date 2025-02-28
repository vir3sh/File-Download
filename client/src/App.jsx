import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import UploadFile from "./components/UploadFile";
import FileList from "./components/FileList";
import DownloadFile from "./components/DownloadFile";
import Dashboard from "./components/Dashboard";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";

const PrivateRoute = ({ element }) => {
  const { user } = useContext(AuthContext);
  return user ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={<PrivateRoute element={<Dashboard />} />}
          />
          <Route
            path="/upload"
            element={<PrivateRoute element={<UploadFile />} />}
          />
          <Route
            path="/files"
            element={<PrivateRoute element={<FileList />} />}
          />
          <Route
            path="/download"
            element={<PrivateRoute element={<DownloadFile />} />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
