import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Box, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name:"", email:"", password:"", password_confirmation:"" });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try { await register(form); nav("/posts"); }
    catch (e) { setErr(e.response?.data?.message || "Error"); }
  };

  return (
    <Container maxWidth="xs">
      <Box component="form" onSubmit={submit} sx={{ mt: 8 }}>
        <Typography variant="h5" gutterBottom>Registro</Typography>
        <TextField fullWidth label="Nombre" margin="normal"
          value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
        <TextField fullWidth label="Email" margin="normal"
          value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
        <TextField fullWidth type="password" label="Password" margin="normal"
          value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
        <TextField fullWidth type="password" label="Confirmación" margin="normal"
          value={form.password_confirmation} onChange={e=>setForm({...form, password_confirmation:e.target.value})}/>
        {err && <Typography color="error" sx={{ mt:1 }}>{err}</Typography>}
        <Button type="submit" variant="contained" fullWidth sx={{ mt:2 }}>Crear</Button>
      </Box>
    </Container>
  );
}
