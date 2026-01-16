import { io, type Socket } from "socket.io-client";
import { EXPO_API_BASE_URL } from "./config";
import type { BikeDto } from "@app/shared";
import { useBikesStore } from "../stores/bike-store";

let socket: Socket | null = null;

export function connectSocket() {
  if (socket) return socket;

  socket = io(EXPO_API_BASE_URL, { transports: ["websocket"] });

  socket.on("bike:inserted", (dto: BikeDto) => {
    useBikesStore.getState().upsertBike(dto);
  });

  socket.on("bike:updated", (dto: BikeDto) => {
    useBikesStore.getState().upsertBike(dto);
  });

  socket.on("bike:deleted", (id: string) => {
    useBikesStore.getState().removeBike(id);
  });

  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
