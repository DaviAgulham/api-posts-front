import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TextField, Button, Container, Box, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try { await login(form.email, form.password); nav("/posts"); }
    catch (e) { setErr(e.response?.data?.message || "Error"); }
  };

  return (
    <Container maxWidth="xs">
      <Box component="form" onSubmit={submit} sx={{ mt: 8 }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        <TextField fullWidth label="Email" margin="normal"
          value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <TextField fullWidth type="password" label="Password" margin="normal"
          value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        {err && <Typography color="error" sx={{ mt:1 }}>{err}</Typography>}
        <Button type="submit" variant="contained" fullWidth sx={{ mt:2 }}>Entrar</Button>
        <Button component={Link} to="/register" fullWidth sx={{ mt:1 }}>Crear cuenta</Button>
      </Box>
    </Container>
  );
}
