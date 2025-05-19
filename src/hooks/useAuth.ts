// hooks/useAuth.ts
export const useAuth = () => {
  const signIn = (email: string, password: string) => {
    if (email === "ankit@anscer.com" && password === "1234567") {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("authEmail", email);
      window.location.href = "/";
      return true;
    }
    return false;
  };

  const signOut = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("authEmail");
    window.location.href = "/login";
  };

  const isLogged = () => localStorage.getItem("isAuthenticated") === "true";
  const getEmail = () => localStorage.getItem("authEmail") || "";

  return { signIn, signOut, isLogged, getEmail };
};

export type AuthContext = ReturnType<typeof useAuth>;
