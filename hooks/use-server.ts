// hooks/useServer.ts
import { Player } from "@/lib/types";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

type Message = { id: string; msg: string };

export function useServer() {
  const [serverId, setServerId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (socketRef.current) return;

    const socket = io({
      path: "/socket.io",
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      if (socket.id) console.log("Connected:", socket.id);
    });

    socket.on("server_id", (id: string) => {
      console.log("Assigned server:", id);
      setServerId(id); // 👈 store in state for UI
    });

    socket.on("sync", (players: Player[]) => {
      setPlayers(players);
    });

    socket.on("chat", ({ id, msg }) => {
      setMessages((prev) => [...prev, { id, msg }]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (msg: string) => {
    socketRef.current?.emit("chat", msg);
  };

  const updatePlayerBoard = (id: string, coins: number) => {
    socketRef.current?.emit("update_playerboard", { id, coins });
  };

  return {
    serverId,
    messages,
    players,
    updatePlayerBoard,
    sendMessage,
  };
}
