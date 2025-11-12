import client from "./client";

// lista
export const listPosts = () => client.get("/posts");

// detalle
export const getPost = (id) => client.get(`/posts/${id}`);

// crear (multipart opcional)
export const createPost = ({ title, description, file }) => {
  const form = new FormData();
  form.append("title", title);
  form.append("description", description);
  if (file) form.append("file", file);
  return client.post("/posts", form, { headers: { "Content-Type": "multipart/form-data" } });
};

// actualizar con POST + override (funciona en Laravel y en Java porque ya mapeaste POST /posts/:id)
export const updatePost = (id, { title, description, file }) => {
  const form = new FormData();
  if (title != null) form.append("title", title);
  if (description != null) form.append("description", description);
  if (file) form.append("file", file);
  form.append("_method", "PUT"); // Laravel
  return client.post(`/posts/${id}`, form, { headers: { "Content-Type": "multipart/form-data" } });
};

// borrar
export const deletePost = (id) => client.delete(`/posts/${id}`);
