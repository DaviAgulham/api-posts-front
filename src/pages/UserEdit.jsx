import { useEffect, useState } from "react";
import { getUser, updateUser } from "../api/users";
import { useParams, useNavigate } from "react-router-dom";
import { useIsAdmin } from "../context/AuthContext";
import { Container, Box, TextField, Button, Typography, MenuItem } from "@mui/material";

export default function UserEdit() {
  const { id } = useParams();
  const isAdmin = useIsAdmin();
  const nav = useNavigate();
  const [form, setForm] = useState({ name:"", email:"", role:"user", password:"", password_confirmation:"" });
  const [err, setErr] = useState("");

  useEffect(()=>{ (async () => {
    const { data } = await getUser(id);
    setForm(f => ({ ...f, name: data.name, email: data.email, role: data.role || "user" }));
  })(); }, [id]);

  if (!isAdmin) return null; // protección de UI (el back igual devuelve 403)

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { name: form.name, email: form.email, role: form.role };
      if (form.password) {
        payload.password = form.password;
        payload.password_confirmation = form.password_confirmation;
      }
      await updateUser(id, payload);
      nav(`/users/${id}`);
    } catch (e) { setErr(e.response?.data?.message || "Error"); }
  };

  return (
    <Container maxWidth="sm" sx={{ mt:3 }}>
      <Box component="form" onSubmit={submit}>
        <Typography variant="h5" gutterBottom>Editar usuario #{id}</Typography>
        <TextField fullWidth label="Nombre" margin="normal"
          value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
        <TextField fullWidth label="Email" margin="normal"
          value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
        <TextField select fullWidth label="Rol" margin="normal"
          value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
          <MenuItem value="user">user</MenuItem>
          <MenuItem value="admin">admin</MenuItem>
        </TextField>
        <TextField fullWidth type="password" label="Nueva contraseña (opcional)" margin="normal"
          value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
        <TextField fullWidth type="password" label="Confirmación" margin="normal"
          value={form.password_confirmation} onChange={e=>setForm({...form, password_confirmation:e.target.value})}/>
        {err && <Typography color="error" sx={{ mt:1 }}>{err}</Typography>}
        <Button type="submit" variant="contained" sx={{ mt:2 }}>Guardar</Button>
      </Box>
    </Container>
  );
}
