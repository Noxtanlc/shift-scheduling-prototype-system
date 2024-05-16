import { useLocalStorage } from "@mantine/hooks";
import axios from "axios";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";

const AuthContext = createContext<any>(undefined);

export function useAuth() {
  return useContext(AuthContext!);
};

export default function AuthProvider({ children }: any) {
  const [token, _setToken, removeToken] = useLocalStorage({
    key: 'token',
    defaultValue: localStorage.token,
  });
  const [user, setUser, removeUser] = useLocalStorage({
    key: 'user',
    defaultValue: {
      username: '',
      isAdmin: '',
    }
  });

  const setToken = (newToken: any) => {
    _setToken(newToken);
  };

  const refreshToken = async () => {
    try {
      const res = await axios.post('/api/refresh');
      setToken({
        token: res.data.refreshtoken,
      })
      return res.data;
    }
    catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    } else {
      delete axios.defaults.headers.common["Authorization"];
      removeUser();
    }
  }, [token, user]);

  if (token) {
    // refresh token
    const decodedToken = jwtDecode(token);
    axios.interceptors.request.use(async (config) => {
      let currentDate = dayjs().unix();
      if (decodedToken.exp! < currentDate) {
        const data = await refreshToken();
        config.headers["Authorization"] = "Bearer " + data.accessToken;
        setToken(data.accessToken);
        console.log('New Token - ' + data.accessToken);
      }
      return config;
    }, (error) => { return Promise.reject(error) });

    let timeouet = dayjs();
    let tokenTime = dayjs.unix(decodedToken.exp!);

    if (timeouet.diff(tokenTime, 'hour') === 12) {
      delete axios.defaults.headers.common["Authorization"];
      removeToken();
      removeUser();
    }
  }

  const contextValue: any = useMemo(() => (
    { token, setToken, removeToken, user, setUser, removeUser }
  ), [token, user]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
