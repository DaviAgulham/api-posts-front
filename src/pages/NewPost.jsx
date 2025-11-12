import { useState } from "react";
import client from "../api/client";
import { Container, Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      if (image) fd.append("image", image);
      await client.post("/posts", fd);
      nav("/posts");
    } catch (e) { setErr(e.response?.data?.message || "Error"); }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 3 }}>
      <Box component="form" onSubmit={submit}>
        <Typography variant="h5" gutterBottom>Nuevo post</Typography>
        <TextField fullWidth label="Título" margin="normal" value={title} onChange={e=>setTitle(e.target.value)} />
        <TextField fullWidth label="Descripción" margin="normal" multiline minRows={3}
          value={description} onChange={e=>setDescription(e.target.value)} />
        <Button variant="outlined" component="label" sx={{ mt: 2 }}>
          Subir imagen
          <input type="file" hidden accept="image/*" onChange={e=>setImage(e.target.files?.[0]||null)} />
        </Button>
        {image && <Typography variant="caption" sx={{ ml:1 }}>{image.name}</Typography>}
        {err && <Typography color="error" sx={{ mt:1 }}>{err}</Typography>}
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Crear</Button>
      </Box>
    </Container>
  );
}
