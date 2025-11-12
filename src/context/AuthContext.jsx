import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export const useIsAdmin = () => {
  const { user } = useAuth();
  if (!user) return false;

  const norm = (s) => String(s ?? '').trim().toUpperCase();

  const role = norm(user.role).replace(/^ROLE_/, '');
  const authList = (user.authorities ?? []).map((a) =>
    norm(typeof a === 'string' ? a : a && a.authority).replace(/^ROLE_/, '')
  );

  return role === 'ADMIN' || authList.includes('ADMIN');
};

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    if (!token) return;
    client.get("/auth/me").then(res => setUser(res.data)).catch(() => {
      localStorage.removeItem("token");
      setToken(null);
    }).finally(()=>setLoading(false));
  }, [token]);

  const login = async (email, password) => {
    const { data } = await client.post("/auth/login", { email, password });
    localStorage.setItem("token", data.access_token);
    setToken(data.access_token);
    const me = await client.get("/auth/me");
    setUser(me.data);
  };

  const register = async (payload) => {
    await client.post("/auth/register", payload);
    // opcional: loguear directo
    await login(payload.email, payload.password);
  };

  const logout = async () => {
    try { await client.post("/auth/logout"); } catch {}
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ token, user, loading, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
