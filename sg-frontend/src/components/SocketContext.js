// src/SocketContext.js
import { createContext, useContext } from "react";
import { io } from "socket.io-client";
import { ENDPOINTS } from "../constants";

const SocketContext = createContext();

// Initialize socket instance
const socket = io(ENDPOINTS.CHAT_URL);

export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// Custom hook to use the socket in components
export const useSocket = () => {
  return useContext(SocketContext);
};
