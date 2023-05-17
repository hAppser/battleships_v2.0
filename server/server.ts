import { WebSocketServer } from "ws";

const port = 8080;
const wss = new WebSocketServer({ port });

// wss.on("connection", (ws) => {
//   ws.on("message", (data) => {
//     console.log(`Received message from client ${data}`);
//   });
//   ws.send("Hello, this is server.ts");
// });
wss.on("connection", (ws) => {
  console.log(`Received user!`);
  // Handle incoming messages
  ws.on("message", (message: string) => {
    console.log(`Received message: ${message}`);

    // Echo the message back to the client
    ws.send(`Echo: ${message}`);
  });

  // Handle connection close
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Handle server startup
wss.on("listening", () => {
  console.log("WebSocket server started");
});
