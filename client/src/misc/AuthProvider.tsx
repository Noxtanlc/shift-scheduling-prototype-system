import { readLocalStorageValue, useLocalStorage } from "@mantine/hooks";
import axios from "axios";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";

const AuthContext = createContext<any>('');

export function useAuth() {
  return useContext(AuthContext!);
};

export default function AuthProvider({ children }: any) {
  const tokenValue = readLocalStorageValue({
    key: 'token',
    defaultValue: {
      accessToken: '',
      refreshToken: ''
    }
  });
  const [token, setToken, removeToken] = useLocalStorage({
    key: 'token',
    defaultValue: {
      accessToken: tokenValue.accessToken,
      refreshToken: tokenValue.refreshToken,
    },
  });
  const [user, setUser, removeUser] = useLocalStorage({
    key: 'user',
    defaultValue: {
      username: '',
      isAdmin: '',
    }
  });

  const refreshToken = async () => {
    try {
      const res = await axios.post('/api/refresh', {
        token: token.refreshToken
      });
      setToken({
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      });
      return res.data;
    }
    catch (err) {
      console.log(err);
      removeToken();
      removeUser();
    }
  };

  useEffect(() => {
    if (token.accessToken) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token.accessToken;
    } else {
      delete axios.defaults.headers.common["Authorization"];
      removeToken();
      removeUser();
    }
  }, [token.accessToken]);

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      const decodedToken = jwtDecode(token.accessToken);
      let currentDate = dayjs().unix();
      if (decodedToken.exp! < currentDate) {
        const data = await refreshToken();
        config.headers["Authorization"] = "Bearer " + data.accessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error)
    }
  );

  const contextValue: any = useMemo(() => (
    { token, setToken, removeToken, user, setUser, removeUser, axiosJWT }
  ), [token]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
