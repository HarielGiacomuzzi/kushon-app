import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ToastContainer from "./components/ToastContainer";
import Layout from "./components/Layout";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserPanel from "./pages/UserPanel";
import AdminPanel from "./pages/AdminPanel";
import AllTitles from "./pages/AllTitles";
import MyTitles from "./pages/MyTitles";
import TitleDetail from "./pages/TitleDetail";
import EditTitle from "./pages/EditTitle";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <Layout userType="user">
                    <UserPanel />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/all-titles"
              element={
                <ProtectedRoute>
                  <Layout userType="user">
                    <AllTitles />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-titles"
              element={
                <ProtectedRoute>
                  <Layout userType="user">
                    <MyTitles />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <Layout userType="admin">
                    <AdminPanel />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/edit/:titleId"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <Layout userType="admin">
                    <EditTitle />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/title/:titleId"
              element={
                <ProtectedRoute>
                  <Layout userType="user">
                    <TitleDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
