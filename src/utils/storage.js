// Token is stored in localStorage (Remember Me = true) or
// sessionStorage (Remember Me = false, cleared when tab closes).
export const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

export const setToken = (token, remember = true) => {
  if (remember) {
    localStorage.setItem("token", token);
    sessionStorage.removeItem("token");
  } else {
    sessionStorage.setItem("token", token);
    localStorage.removeItem("token");
  }
};

export const removeToken = () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
};

export const getUser = () => {
  try {
    const raw =
      localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
    return JSON.parse(raw) || null;
  } catch {
    return null;
  }
};

export const setUser = (user, remember = true) => {
  const raw = JSON.stringify(user);
  if (remember) {
    localStorage.setItem("authUser", raw);
    sessionStorage.removeItem("authUser");
  } else {
    sessionStorage.setItem("authUser", raw);
    localStorage.removeItem("authUser");
  }
};

export const removeUser = () => {
  localStorage.removeItem("authUser");
  sessionStorage.removeItem("authUser");
};
