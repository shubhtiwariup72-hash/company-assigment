import { createContext, useState, useCallback } from "react";
import { getToken, setToken, removeToken, getUser, setUser, removeUser } from "../utils/storage";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(getToken);
  const [user, setUserState] = useState(getUser);

  const login = useCallback((authData) => {
    setToken(authData.token);
    setUser(authData.user);
    setTokenState(authData.token);
    setUserState(authData.user);
  }, []);

  const logout = useCallback(() => {
    removeToken();
    removeUser();
    setTokenState(null);
    setUserState(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
