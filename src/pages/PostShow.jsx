import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPost, deletePost } from "../api/posts";
import {
  Container, Box, Card, CardContent, CardMedia,
  Typography, Stack, Button
} from "@mui/material";

export default function PostShow() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);

  useEffect(() => { (async () => {
    const { data } = await getPost(id);
    setPost(data.data || data);
  })(); }, [id]);

  if (!post) return <Container sx={{ mt:6 }}><Typography>Cargando…</Typography></Container>;
  const isOwner = user && post.user?.id === user.id;
  const img = post.image_url || post.imageUrl || post.imagePath || null;

  const onDelete = async () => {
    if (!window.confirm("¿Borrar este post?")) return;
    await deletePost(post.id);
    nav("/posts");
  };

  return (
    <Container sx={{ mt:4 }}>
      <Box sx={{ display:"flex", justifyContent:"center" }}>
        <Card sx={{ width:"100%", maxWidth:720 }}>
          {img && <CardMedia component="img" image={img} alt={post.title}/>}
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom>{post.title}</Typography>
            <Typography align="center" sx={{ whiteSpace:"pre-wrap" }}>{post.description}</Typography>
            <Typography variant="subtitle2" color="text.secondary" align="center" sx={{ mt:2 }}>
              Autor: {post.user?.name} {post.user?.email ? `· ${post.user.email}` : ""}
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt:3 }}>
              <Button component={Link} to="/posts">Volver</Button>
              {isOwner && (
                <>
                  <Button onClick={() => nav(`/posts/${post.id}/edit`)}>Editar</Button>
                  <Button color="error" onClick={onDelete}>Borrar</Button>
                </>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
