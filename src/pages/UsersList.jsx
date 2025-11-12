import { useEffect, useState } from "react";
import { listUsers, deleteUser } from "../api/users"; // <-- deleteUser
import { useIsAdmin, useAuth } from "../context/AuthContext"; // <-- useAuth
import { Link, useNavigate } from "react-router-dom";
import { Container, Table, TableBody, TableCell, TableHead, TableRow, Button, Stack, Typography } from "@mui/material";

export default function UsersList() {
  const [rows, setRows] = useState([]);
  const isAdmin = useIsAdmin();
  const { user, logout } = useAuth();          // <-- user/logout
  const nav = useNavigate();

  useEffect(() => { (async () => {
    const { data } = await listUsers();
    setRows(data.data || data);
  })(); }, []);

  const handleDelete = async (u) => {          // <-- borrar
    if (!window.confirm(`¿Borrar usuario ${u.name}?`)) return;
    await deleteUser(u.id);
    if (user?.id === u.id) {                   // si el admin se borra a sí mismo
      await logout();
      nav("/login");
    } else {
      setRows(rs => rs.filter(r => r.id !== u.id));
    }
  };

  return (
    <Container sx={{ mt:3 }}>
      <Typography variant="h5" gutterBottom>Usuarios</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell><TableCell>Nombre</TableCell><TableCell>Email</TableCell><TableCell>Rol</TableCell><TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(u=>(
            <TableRow key={u.id} hover>
              <TableCell>{u.id}</TableCell>
              <TableCell><Button component={Link} to={`/users/${u.id}`}>{u.name}</Button></TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.role}</TableCell>
              <TableCell align="right">
                {isAdmin && (
                  <Stack direction="row" spacing={1} justifyContent="end">
                    <Button size="small" onClick={()=>nav(`/users/${u.id}/edit`)}>Editar</Button>
                    <Button size="small" color="error" onClick={()=>handleDelete(u)}>Borrar</Button>
                  </Stack>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
