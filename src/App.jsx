import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import PrivateLayout from "./layouts/PrivateLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PostsList from "./pages/PostsList";
import NewPost from "./pages/NewPost";
import EditPost from "./pages/EditPost";
import UsersList from "./pages/UsersList";
import UserDetail from "./pages/UserDetail";
import UserEdit from "./pages/UserEdit";
import PostShow from "./pages/PostShow";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* públicas, sin navbar */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* privadas, con navbar */}
          <Route element={<PrivateLayout />}>
            <Route path="/" element={<Navigate to="/posts" replace />} />
            <Route path="/posts" element={<PostsList />} />
            <Route path="/posts/new" element={<NewPost />} />
            <Route path="/posts/:id/edit" element={<EditPost />} />
            <Route path="/posts/:id" element={<PostShow />} />

            {/* usuarios */}
            <Route path="/users" element={<UsersList />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="/users/:id/edit" element={<UserEdit />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
