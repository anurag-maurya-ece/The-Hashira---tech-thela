import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(
      process.env.NEXT_PUBLIC_URL || (typeof window !== "undefined" ? window.location.origin : ""),
      {
        autoConnect: false,
        transports: ["websocket", "polling"],
      }
    );
  }
  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
  return s;
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};
