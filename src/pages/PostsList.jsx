import { useEffect, useState } from "react";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Container, Grid, Card, CardContent, CardMedia, Typography, CardActions, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { CardActionArea } from "@mui/material";

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const { user } = useAuth();
  const nav = useNavigate();

  const load = async () => {
    const { data } = await client.get("/posts");
    setPosts(data.data || data); // paginate o array
  };

  useEffect(()=>{ load(); },[]);

  const del = async (id) => { await client.delete(`/posts/${id}`); await load(); };

  return (
    <Container sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        {posts.map(p => (
          <Grid item xs={12} md={4} key={p.id}>
            <Card>
              <CardActionArea component={Link} to={`/posts/${p.id}`}>
                {p.image_url && (
                  <CardMedia component="img" height="180" image={p.image_url} alt={p.title}/>
                )}
                <CardContent>
                  <Typography variant="h6">{p.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {p.description}
                  </Typography>
                  <Typography variant="caption" sx={{ display:'block', mt:1 }}>
                    Autor: {p.user?.name} (id {p.user?.id})
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                {user && p.user?.id === user.id && (
                  <>
                    <Button size="small" onClick={()=>nav(`/posts/${p.id}/edit`)}>Editar</Button>
                    <Button size="small" color="error" onClick={()=>del(p.id)}>Borrar</Button>
                  </>
                )}
              </CardActions>
            </Card>
        </Grid>
        ))}
      </Grid>
    </Container>
  );
}
