import express, { Request, Response } from "express";
import http from "http";
import WebSocket from "ws";
import { Pool, QueryResult } from "pg";

interface WebSocketWithUsername extends WebSocket {
  username?: string;
  gameId?: string;
}

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Подключение к базе данных PostgreSQL
const pool = new Pool({
  connectionString: "postgres://postgres:zxcvbnm@localhost:5432/battleships",
});

wss.on("connection", (ws: WebSocketWithUsername) => {
  ws.on("message", async (message: string) => {
    const req = JSON.parse(message) as {
      event: string;
      payload: { username: string; gameId: string };
    };
    console.log(req);
    if (req.event === "connect") {
      ws.username = req.payload.username;
      ws.gameId = req.payload.gameId;
      initGames(ws, req.payload.gameId);
    }
    broadcast(req);
  });

  async function initGames(ws: WebSocketWithUsername, gameId: string) {
    const client = await pool.connect();

    try {
      const result: QueryResult<any> = await client.query(
        "SELECT * FROM games WHERE game_id = $1",
        [gameId]
      );
      if (result.rowCount === 0) {
        await client.query(
          "INSERT INTO games (game_id, player1_username) VALUES ($1, $2)",
          [gameId, ws.username]
        );
      } else if (result.rowCount === 1) {
        await client.query(
          "UPDATE games SET player2_username = $1 WHERE game_id = $2",
          [ws.username, gameId]
        );
      } else {
        return;
      }
    } finally {
      client.release();
    }
  }
  function broadcast(params: {
    event: string;
    payload: { username: string; gameId: string };
  }) {
    let res: { type: string; payload: any };
    const { username, gameId } = params.payload;
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        if (
          (client as WebSocketWithUsername).username === username &&
          (client as WebSocketWithUsername).gameId === gameId
        ) {
          switch (params.event) {
            case "message":
              res = { type: "getMessage", payload: params.payload };
              break;
            case "connect":
              res = {
                type: "connectToPlay",
                payload: {
                  success: true,
                  rivalName: Array.from(wss.clients)
                    .filter(
                      (c) =>
                        c !== client &&
                        (c as WebSocketWithUsername).username !==
                          (client as WebSocketWithUsername).username &&
                        (c as WebSocketWithUsername).gameId === gameId
                    )
                    .map((c) => (c as WebSocketWithUsername).username)[0],
                  username: (client as WebSocketWithUsername).username,
                  gameId,
                },
              };
              console.log(
                Array.from(wss.clients)
                  .filter(
                    (c) =>
                      c !== client &&
                      (c as WebSocketWithUsername).username !==
                        (client as WebSocketWithUsername).username &&
                      (c as WebSocketWithUsername).gameId === gameId
                  )
                  .map((c) => (c as WebSocketWithUsername).username)[0]
              );
              break;
            case "ready":
              res = {
                type: "readyToPlay",
                payload: {
                  canStart:
                    wss.clients.size === 2 &&
                    Array.from(wss.clients).every(
                      (c) =>
                        (c as WebSocketWithUsername).username === username &&
                        (c as WebSocketWithUsername).gameId === gameId &&
                        (c as WebSocketWithUsername).username !== undefined &&
                        (c as WebSocketWithUsername).username !== ""
                    ),
                  username,
                  canShoot:
                    wss.clients.has(client) &&
                    wss.clients.size === 2 &&
                    Array.from(wss.clients)[0] !==
                      Array.from(wss.clients).find(
                        (c) =>
                          c !== client &&
                          (c as WebSocketWithUsername).username === username &&
                          (c as WebSocketWithUsername).gameId === gameId
                      ),
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
        }
      }
    });
  }
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
