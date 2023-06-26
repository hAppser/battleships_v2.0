import express, { Request, Response } from "express";
import http from "http";
import WebSocket from "ws";

interface WebSocketWithUsername extends WebSocket {
  username?: string;
}

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const games: { [key: string]: WebSocketWithUsername[] } = {};

wss.on("connection", (ws: WebSocketWithUsername) => {
  ws.on("message", async (message: string) => {
    const req = JSON.parse(message) as {
      event: string;
      payload: { username: string; gameId: string };
    };
    console.log(req);
    if (req.event === "connect") {
      ws.username = req.payload.username;
      initGames(ws, req.payload.gameId);
    }
    broadcast(req);
  });

  function initGames(ws: WebSocketWithUsername, gameId: string) {
    if (!games[gameId]) {
      games[gameId] = [ws];
    }
    if (games[gameId] && games[gameId]?.length < 2) {
      games[gameId] = [...games[gameId], ws];
    }
    if (games[gameId] && games[gameId]?.length === 2) {
      games[gameId] = games[gameId].filter(
        (wsc) => wsc.username !== ws.username
      );
      games[gameId] = [...games[gameId], ws];
    }
    if (games[gameId] && games[gameId]?.length > 2) {
      return 0;
    }
  }

  function broadcast(params: {
    event: string;
    payload: { username: string; gameId: string };
  }) {
    let res: { type: string; payload: any };
    const { username, gameId } = params.payload;
    for (const game in games) {
      if (games[game].length === 2) {
        // Ваш код для обработки событий, когда игра началась
      }
    }
    games[gameId].forEach((client) => {
      switch (params.event) {
        case "message":
          res = { type: "getMessage", payload: params.payload };
          break;
        case "connect":
          res = {
            type: "connectToPlay",
            payload: {
              success: true,
              rivalName: games[gameId].find(
                (user) => user.username !== client.username
              )?.username,
              username: client.username,
              gameId,
            },
          };
          break;
        case "ready":
          res = {
            type: "readyToPlay",
            payload: {
              canStart: games[gameId].length === 2,
              username,
              canShoot:
                games[gameId][0].username !==
                games[gameId].find((user) => user.username !== client.username)
                  ?.username
                  ? true
                  : false,
            },
          };
          break;
        case "shoot":
          res = { type: "afterShootByMe", payload: params.payload };
          break;
        case "checkShot":
          res = { type: "isPerfectHit", payload: params.payload };
          break;
        default:
          res = { type: "logout", payload: params.payload };
          break;
      }
      client.send(JSON.stringify(res));
    });
  }
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

