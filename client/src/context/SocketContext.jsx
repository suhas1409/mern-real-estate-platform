import {
  createContext,
  useEffect,
  useState,
  useContext,
} from "react";

import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketContextProvider = ({children}) => {
  const [socket, setSocket] = useState(null);

  const { currentUser } =
    useContext(AuthContext);

  useEffect(() => {
    const newSocket = io(
      import.meta.env.VITE_SOCKET_URL
    );

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // REGISTER USER
  useEffect(() => {
    if (socket && currentUser) {
      socket.emit(
        "newUser",
        currentUser.id
      );
    }
  }, [socket, currentUser]);

  return (
    <SocketContext.Provider
      value={{ socket }}
    >
      {children}
    </SocketContext.Provider>
  );
};