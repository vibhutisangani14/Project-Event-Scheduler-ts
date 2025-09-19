import { createContext, useContext } from "react";
import AuthProvider from "./AuthProvider";
import EventProvider from "./EventProvider";
const EventContext = createContext();



const useEvents = () => {
  const context = use(EventContext);
  if (!context) throw new Error("useDucks must be used within a DuckContext");
  return context;
};

const AuthContext = createContext();

const useAuth = () => {
  const context = use(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthContextProvider");
  return context;
};

export {
  AuthProvider,
  AuthContext,
  useAuth,
  EventProvider,
  EventContext,
  useEvents,
};
