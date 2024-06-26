"use client";

import { useEffect, useState } from "react";
import socket from "../socket";
import EEGComponent from "./components/eeg";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  

  useEffect(() => {
    socket.connect(); // Initiate socket connection

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      
      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    function onMessage(message : string) {
      setMessages((prevMessages) => [...prevMessages, message]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", onMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message", onMessage);
    };
  }, []);

  // const sendMessage = () => {
  //   if (inputMessage) {
  //     socket.send(inputMessage);
  //     setInputMessage("");
  //   }
  // };

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      <EEGComponent />
    </div>
  );
}
