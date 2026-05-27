import { createContext, useState, useCallback } from "react";
import { getToken, setToken, removeToken, getUser, setUser, removeUser } from "../utils/storage";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(getToken);
  const [user, setUserState] = useState(getUser);

  // remember=true → localStorage (persists across browser restarts)
  // remember=false → sessionStorage (cleared when tab/browser closes)
  const login = useCallback((authData, remember = true) => {
    setToken(authData.token, remember);
    setUser(authData.user, remember);
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
