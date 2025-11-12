import { useEffect, useState } from "react";
import { getUser, deleteUser } from "../api/users";
import { useParams, useNavigate } from "react-router-dom";
import { useIsAdmin, useAuth } from "../context/AuthContext";
import { Container, Typography, Stack, Button } from "@mui/material";

export default function UserDetail() {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const isAdmin = useIsAdmin();
  const nav = useNavigate();
  const [u, setU] = useState(null);

  useEffect(()=>{ getUser(id).then(({data})=>setU(data)); }, [id]);
  if (!u) return null;

  const canDelete = isAdmin || user?.id === u.id; // backend igual valida
  const handleDelete = async () => {
    await deleteUser(u.id);
    if (user?.id === u.id) { await logout(); nav("/login"); } else { nav("/users"); }
  };

  return (
    <Container sx={{ mt:3 }}>
      <Typography variant="h5">Usuario #{u.id}</Typography>
      <Typography sx={{ mt:1 }}>Nombre: {u.name}</Typography>
      <Typography>Email: {u.email}</Typography>
      <Typography>Rol: {u.role}</Typography>

      <Stack direction="row" spacing={2} sx={{ mt:2 }}>
        {isAdmin && <Button variant="contained" onClick={()=>nav(`/users/${u.id}/edit`)}>Editar</Button>}
        {canDelete && <Button variant="outlined" color="error" onClick={handleDelete}>Borrar</Button>}
      </Stack>
    </Container>
  );
}
