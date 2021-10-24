import { createContext, useEffect, useState } from "react";
import { api } from "../services/api";

interface User {
  id: string;
  name: string;
  avatar_url: string;
  login: string;
  github_id: number;
}

interface AuthContextData {
  user: User | null;
  singInUrl: string;
  signOut: () => void;
}

interface AuthResponse {
  token: string;
  user: User;
}

export const AuthContext = createContext({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const singInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=35fbf57df0aae1f43f4d`;

  async function signIn(githubCode: string) {
    const {
      data: { token, user },
    } = await api.post<AuthResponse>("authenticate", {
      code: githubCode,
    });

    api.defaults.headers.common.authorization = `Bearer ${token}`;

    localStorage.setItem("@dowhile:token", token);

    setUser(user);
  }

  function signOut() {
    setUser(null);
    localStorage.removeItem("@dowhile:token");
  }

  useEffect(() => {
    const token = localStorage.getItem("@dowhile:token");
    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`;

      api.get<User>("profile").then((response) => {
        setUser(response.data);
      });
    }
  }, []);

  useEffect(() => {
    const [urlWithoutCode, githubCode] = window.location.href.split("?code=");

    if (githubCode) {
      window.history.replaceState({}, "", urlWithoutCode);

      signIn(githubCode);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ singInUrl, user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
