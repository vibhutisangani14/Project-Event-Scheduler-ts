import { useState, useEffect } from "react";
import { AuthContext } from ".";
import { me } from "../data";

const AuthProvider = ({ children }) => {
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [checkSession, setCheckSession] = useState(true);

  const handleSignIn = (token) => {
    localStorage.setItem("token", token);
    setSignedIn(true);
    setCheckSession(true);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setSignedIn(false);
    setUser(null);
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await me();
        setUser(data);
        setSignedIn(true);
      } catch (error) {
        console.error(error);
      } finally {
        setCheckSession(false);
      }
    };

    if (checkSession) getUser();
  }, [checkSession]);

  return (
    <AuthContext
      value={{
        signedIn,
        user,
        handleSignIn,
        handleSignOut,
      }}
    >
      {children}
    </AuthContext>
  );
};

export default AuthProvider;
