# Frontend — React + Vite + MUI (Users & Posts)

SPA que consume la API (Laravel **o** Spring). Autenticación vía **JWT** (Bearer), UI con **MUI**, rutas privadas, control de roles (`user`/`admin`), CRUD de **posts** con imagen y gestión de **usuarios** (solo admin edita/borra).

---

## Requisitos
- **Node 18+**, **npm**
- API corriendo (elige una):
  - Laravel: `http://127.0.0.1:8000/api`
  - Spring: `http://127.0.0.1:8081/api`

---

## 1) Setup rápido

```bash
# dentro de /frontend
npm install
Crear .env
npm run dev
```

`.env` (elige una API):
```dotenv
# Laravel
VITE_API_BASE_URL=http://127.0.0.1:8000/api

# Spring (alternativa)
# VITE_API_BASE_URL=http://127.0.0.1:8081/api
```

Build y preview:
```bash
npm run build
npm run preview
```

---

## 2) Estructura (sugerida)

```
/src
  /api
    client.js        # axios base + interceptores
    auth.js          # login, register, me
    posts.js         # CRUD posts
    users.js         # CRUD users
  /components
    NavBar.jsx
    PrivateLayout.jsx
  /context
    AuthContext.jsx  # user + token + helpers
  /pages
    Login.jsx
    Register.jsx
    PostsList.jsx
    PostNew.jsx
    PostEdit.jsx
    UsersList.jsx
    UserDetail.jsx
    UserEdit.jsx
  App.jsx
  main.jsx
```

---

## 3) Cliente HTTP (Axios)

`src/api/client.js`
```js
import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default client;
```

APIs:
```js
// src/api/auth.js
import client from "./client";
export const register = (data) => client.post("/auth/register", data);
export const login    = (data) => client.post("/auth/login", data);
export const me       = ()     => client.get("/auth/me");

// src/api/posts.js
import client from "./client";
export const listPosts   = (page=1) => client.get(`/posts?page=${page}`);
export const getPost     = (id)     => client.get(`/posts/${id}`);
export const createPost  = (fd)     => client.post("/posts", fd, { headers:{ "Content-Type":"multipart/form-data" }});
export const updatePost  = (id, fd) => client.put(`/posts/${id}`, fd, { headers:{ "Content-Type":"multipart/form-data" }});
export const deletePost  = (id)     => client.delete(`/posts/${id}`);

// src/api/users.js
import client from "./client";
export const listUsers   = (page=1) => client.get(`/users?page=${page}`);
export const getUser     = (id)     => client.get(`/users/${id}`);
export const updateUser  = (id, d)  => client.put(`/users/${id}`, d);
export const deleteUser  = (id)     => client.delete(`/users/${id}`);
```

---

## 4) Auth global (Context)

`src/context/AuthContext.jsx`
```jsx
import { createContext, useContext, useEffect, useState } from "react";
import { me } from "../api/auth";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);
export const useIsAdmin = () => useAuth()?.user?.role === "admin";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }
    me().then(({data}) => setUser(data)).catch(()=> localStorage.removeItem("token")).finally(()=>setLoading(false));
  }, []);

  const login = (token) => { localStorage.setItem("token", token); return me().then(({data})=> setUser(data)); };
  const logout = () => { localStorage.removeItem("token"); setUser(null); };

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>;
}
```

**Ocultar NavBar si no estás logueado**: usa `useAuth().user`.

---

## 5) Rutas y protección

`src/components/PrivateLayout.jsx`
```jsx
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NavBar from "./NavBar";

export default function PrivateLayout() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
```

`src/App.jsx`
```jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import PostsList from "./pages/PostsList";
import PostNew from "./pages/PostNew";
import PostEdit from "./pages/PostEdit";
import UsersList from "./pages/UsersList";
import UserDetail from "./pages/UserDetail";
import UserEdit from "./pages/UserEdit";
import PrivateLayout from "./components/PrivateLayout";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateLayout />}>
            <Route path="/" element={<Navigate to="/posts" replace />} />
            <Route path="/posts" element={<PostsList />} />
            <Route path="/posts/new" element={<PostNew />} />
            <Route path="/posts/:id/edit" element={<PostEdit />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="/users/:id/edit" element={<UserEdit />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

---

## 6) UI con MUI

Instalación (si no está):
```bash
npm i @mui/material @emotion/react @emotion/styled @mui/icons-material
```

`src/components/NavBar.jsx` (oculto si no hay `user`):
```jsx
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  if (!user) return null;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography sx={{ flexGrow: 1 }}>Users & Posts</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button color="inherit" component={Link} to="/posts">Posts</Button>
          <Button color="inherit" component={Link} to="/users">Usuarios</Button>
          <Button color="inherit" onClick={()=>{ logout(); nav("/login"); }}>Logout</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
```

---

## 7) Formularios clave

**Login** (guardar token):
```jsx
import { useState } from "react";
import { login as loginApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Container, TextField, Typography } from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [err, setErr] = useState(""); const { login } = useAuth(); const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setErr("");
    try {
      const { data } = await loginApi({ email, password });
      await login(data.access_token);
      nav("/");
    } catch (e) { setErr(e.response?.data?.message || "Error"); }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 6 }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      <form onSubmit={submit}>
        <TextField fullWidth label="Email" margin="normal" value={email} onChange={e=>setEmail(e.target.value)} />
        <TextField fullWidth type="password" label="Password" margin="normal" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <Typography color="error" sx={{ mt:1 }}>{err}</Typography>}
        <Button type="submit" variant="contained" sx={{ mt:2, width:"100%" }}>Entrar</Button>
      </form>
    </Container>
  );
}
```

**Nuevo Post** (multipart):
```jsx
import { useState } from "react";
import { createPost } from "../api/posts";
import { useNavigate } from "react-router-dom";
import { Button, Container, TextField, Typography } from "@mui/material";

export default function PostNew() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    if (file) fd.append("image", file);
    await createPost(fd);
    nav("/posts");
  };

  return (
    <Container maxWidth="sm" sx={{ mt:3 }}>
      <Typography variant="h5">Nuevo Post</Typography>
      <form onSubmit={submit}>
        <TextField fullWidth label="Título" margin="normal" value={title} onChange={e=>setTitle(e.target.value)} />
        <TextField fullWidth multiline minRows={3} label="Descripción" margin="normal" value={description} onChange={e=>setDescription(e.target.value)} />
        <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0] || null)} />
        <Button type="submit" variant="contained" sx={{ mt:2 }}>Crear</Button>
      </form>
    </Container>
  );
}
```

---

## 8) Roles en UI

- `useIsAdmin()` expone si el usuario es admin.
- Ocultá botones de **Editar/Borrar** a no-admin (el backend igual valida `403`).

```jsx
import { useIsAdmin } from "../context/AuthContext";

const isAdmin = useIsAdmin();
{isAdmin && <Button onClick={...}>Editar</Button>}
```

---

## 9) Conectar a Laravel o Spring

- Cambiá `VITE_API_BASE_URL` en `.env`.
- Reiniciá Vite si cambiás variables: `Ctrl+C` y `npm run dev` de nuevo.
- Asegurate de CORS en el backend:
  - Laravel: `config/cors.php` con `http://localhost:5173`.
  - Spring: habilitar `cors()` y origen `http://localhost:5173`.

---

## 10) Errores comunes

- **401**: sin token / expirado → login otra vez.
- **403**: sin permisos (no admin / no dueño).
- **CORS**: configurar backend y hacer `php artisan optimize:clear` (Laravel).
- **Uploads**: asegurate de mandar `FormData` y que el backend soporte `multipart/form-data`.
- **Base URL mal**: revisar `VITE_API_BASE_URL` y consola del navegador.

---

Listo. Con esto levantás el front, te logueás, ves posts/usuarios y podés crear/editar/borrar según roles.
