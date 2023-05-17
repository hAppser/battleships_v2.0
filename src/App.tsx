import React, { useEffect, useRef, useState } from "react";

const App: React.FC = () => {
  const [message, setMessage] = useState("");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to the WebSocket server
    socketRef.current = new WebSocket("ws://localhost:8080");

    // Handle incoming messages
    socketRef.current.onmessage = (event) => {
      setMessage(event.data);
    };

    // Clean up the WebSocket connection on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const sendMessage = (message: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    }
  };

  return (
    <div className="App">
      <h1>{message}</h1>
      <button onClick={() => sendMessage("Hello, server!")}>
        Send Message to Server
      </button>
    </div>
  );
};

export default App;
