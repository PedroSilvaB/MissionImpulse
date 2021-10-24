import React, { createContext, useEffect, useState } from "react";
import * as AuthSessions from "expo-auth-session";
import { api } from "../service/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CLIENT_ID = "64fcea481d4c2d4629ec";
const USER_STORAGE = "@stage-mobile:user";
const TOKEN_STORAGE = "@stage-mobile:token";

interface User {
  is: string;
  name: string;
  avatar_url: string;
  login: string;
}

interface AuthContextData {
  user: User | null;
  isSigningIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthorizationResponse {
  params: {
    code?: string;
    error?: string;
  };
  type?: string;
}

export const AuthContext = createContext({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(true);

  useEffect(() => {
    async function loadUserStorageDate() {
      const userStorage = await AsyncStorage.getItem(USER_STORAGE);
      const tokenStorage = await AsyncStorage.getItem(TOKEN_STORAGE);

      if (userStorage && tokenStorage) {
        setUser(JSON.parse(userStorage));
        api.defaults.headers.common.authorization = `Bearer ${tokenStorage}`;
      }
      setIsSigningIn(false);
    }
    loadUserStorageDate();
  }, []);

  async function signIn() {
    try {
      setIsSigningIn(true);
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=read:user`;
      const authSessionResponse = (await AuthSessions.startAsync({
        authUrl,
      })) as AuthorizationResponse;

      const {
        type,
        params: { code, error },
      } = authSessionResponse;

      if (code && type === "success" && error !== "access_denied") {
        const authResponse = await api.post("/authenticate", {
          code,
        });
        const { token, user } = authResponse.data as AuthResponse;

        api.defaults.headers.common.authorization = `Bearer ${token}`;

        setUser(user);
        await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
        await AsyncStorage.setItem(TOKEN_STORAGE, token);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSigningIn(false);
    }
  }
  async function signOut() {
    setUser(null);
    await AsyncStorage.removeItem(USER_STORAGE);
    await AsyncStorage.removeItem(TOKEN_STORAGE);
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, user, isSigningIn }}>
      {children}
    </AuthContext.Provider>
  );
};
