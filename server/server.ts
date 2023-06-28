import express from "express";
import http from "http";
import WebSocket from "ws";
import { Pool, QueryResult } from "pg";

interface WebSocketWithUsername extends WebSocket {
  username?: string;
}

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const pool = new Pool({
  connectionString: "postgres://postgres:zxcvbnm@localhost:5432/battleships",
});

app.use(express.json());

wss.on("connection", (ws: WebSocketWithUsername) => {
  ws.on("message", async (message: string) => {
    const { event, payload } = JSON.parse(message) as {
      event: string;
      payload: { username: string; gameId: string };
    };

    console.log({ event, payload });

    if (event === "connect") {
      ws.username = payload.username;
      await initGames(ws, payload.gameId);
    }

    broadcast(event, payload);
  });

  async function initGames(ws: WebSocketWithUsername, gameId: string) {
    try {
      const client = await pool.connect();
      const query = "SELECT player1_username FROM games WHERE game_id = $1";
      const result: QueryResult<any> = await client.query(query, [gameId]);
      const { player1_username } = result.rows[0];

      if (!player1_username) {
        await client.query(
          "INSERT INTO games (game_id, player1_username) VALUES ($1, $2)",
          [gameId, ws.username]
        );
      } else if (player1_username !== ws.username) {
        await client.query(
          "UPDATE games SET player2_username = $1 WHERE game_id = $2",
          [ws.username, gameId]
        );
      }

      client.release();
    } catch (error) {
      console.error("Error initializing game:", error);
    }
  }

  async function broadcast(event: string, payload: any) {
    try {
      const { username, gameId } = payload;
      const client = await pool.connect();
      const query = `
        SELECT player1_username, player2_username, player1_ready, player2_ready, player1_can_shoot, player2_can_shoot, player1_health, player2_health
        FROM games
        WHERE game_id = $1;
      `;
      const result: QueryResult<any> = await client.query(query, [gameId]);
      client.release();

      const {
        player1_username,
        player2_username,
        player1_ready,
        player2_ready,
        player1_can_shoot,
        player2_can_shoot,
        player1_health,
        player2_health,
      } = result.rows[0];

      const gameClients: WebSocketWithUsername[] = Array.from(
        wss.clients
      ) as WebSocketWithUsername[];
      const filteredClients = gameClients.filter(
        (client) => client.username && client.username !== ""
      );

      filteredClients.forEach((client) => {
        const isMe = client.username !== player1_username;

        let res: { type: string; payload: any };

        switch (event) {
          case "message":
            res = {
              type: "getMessage",
              payload,
            };
            break;
          case "connect":
            res = {
              type: "connectToPlay",
              payload: {
                success: true,
                gameId,
                username: client.username,
                rivalName: isMe ? player1_username : player2_username,
                shipsReady: isMe ? player1_ready : player2_ready,
                rivalReady: isMe ? player2_ready : player1_ready,
                canShoot: isMe ? player1_can_shoot : player2_can_shoot,
                myHealth: isMe ? player1_health : player2_health,
                rivalHealth: isMe ? player2_health : player1_health,
              },
            };
            break;
          case "ready":
            res = {
              type: "readyToPlay",
              payload: {
                canStart: player1_ready && player2_ready,
                username,
                canShoot: client.username === player1_username,
              },
            };
            break;
          case "shoot":
            res = { type: "afterShootByMe", payload };
            break;
          case "checkShot":
            res = { type: "isPerfectHit", payload };
            break;
          default:
            res = { type: "logout", payload };
            break;
        }

        client.send(JSON.stringify(res));
      });
    } catch (error) {
      console.error("Error broadcasting:", error);
    }
  }
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
