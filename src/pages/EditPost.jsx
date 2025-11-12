import { useEffect, useState } from "react";
import client from "../api/client";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Box, TextField, Button, Typography } from "@mui/material";

export default function EditPost() {
  const { id } = useParams();
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    client.get(`/posts/${id}`).then(({data})=>{
      setTitle(data.title);
      setDescription(data.description);
    }).catch(()=>setErr("No encontrado"));
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      if (image) fd.append("image", image);
      // Laravel + multipart -> POST con override
      await client.post(`/posts/${id}?_method=PUT`, fd);
      nav("/posts");
    } catch (e) { setErr(e.response?.data?.message || "Error"); }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 3 }}>
      <Box component="form" onSubmit={submit}>
        <Typography variant="h5" gutterBottom>Editar post</Typography>
        <TextField fullWidth label="Título" margin="normal" value={title} onChange={e=>setTitle(e.target.value)} />
        <TextField fullWidth label="Descripción" margin="normal" multiline minRows={3}
          value={description} onChange={e=>setDescription(e.target.value)} />
        <Button variant="outlined" component="label" sx={{ mt: 2 }}>
          Cambiar imagen
          <input type="file" hidden accept="image/*" onChange={e=>setImage(e.target.files?.[0]||null)} />
        </Button>
        {image && <Typography variant="caption" sx={{ ml:1 }}>{image.name}</Typography>}
        {err && <Typography color="error" sx={{ mt:1 }}>{err}</Typography>}
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Guardar</Button>
      </Box>
    </Container>
  );
}
