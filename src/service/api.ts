import axios from "axios";
import { io, Socket } from "socket.io-client";
import { reactViteBackendUrl } from "../env/envoriment";

export const api = axios.create({
  baseURL: `${reactViteBackendUrl}`,
  headers: {
    "Content-Type": "application/json",
  },
});

let socket: Socket | null = null;

export const getSocket = (reactViteBackendUrl: string) => {
  if (!socket) {
    socket = io(reactViteBackendUrl);
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
