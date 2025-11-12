import client from "./client";

export const listUsers  = (page=1) => client.get(`/users?page=${page}`);
export const getUser    = (id)     => client.get(`/users/${id}`);
export const updateUser = (id, d)  => client.put(`/users/${id}`, d);
export const deleteUser = (id)     => client.delete(`/users/${id}`);
