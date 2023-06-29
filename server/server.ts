import express from "express";
import http from "http";
import WebSocket from "ws";
import { Pool, QueryResult } from "pg";
import { Board } from "./models/Board";

interface WebSocketWithUsername extends WebSocket {
  username?: string;
}

interface GameData {
  player1_username: string;
  player2_username: string;
  player1_ready: boolean;
  player2_ready: boolean;
  player1_can_shoot: boolean;
  player2_can_shoot: boolean;
  player1_health: number;
  player2_health: number;
  player1_board: Board;
  player2_board: Board;
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
      payload: {
        username: string;
        gameId: string;
        message: string;
        x: number;
        y: number;
        isPerfectHit: boolean;
        ready: boolean;
      };
    };

    console.log({ event, payload });

    if (event === "connect") {
      ws.username = payload.username;
      await initGames(ws, payload.gameId);
    }
    if (event === "ready") {
      await setPlayerReadyStatus(payload.username, payload.gameId);
    }
    if (event === "message") {
      await saveMessage(payload.username, payload.gameId, payload.message);
    }
    if (event === "afterShootByMe") {
      const { username, x, y, isPerfectHit } = payload;
      await updateBoard(payload.gameId, username, x, y, isPerfectHit);
    }

    broadcast(event, payload);
  });

  async function getGameData(gameId: string): Promise<GameData | null> {
    try {
      const client = await pool.connect();
      const query = `
        SELECT player1_username, player2_username, player1_ready, player2_ready, player1_can_shoot, player2_can_shoot, player1_health, player2_health, player1_board, player2_board
        FROM games
        WHERE game_id = $1;
      `;
      const result: QueryResult<any> = await client.query(query, [gameId]);
      client.release();

      const gameData = result.rows[0];

      if (!gameData) {
        return null;
      }

      return gameData;
    } catch (error) {
      console.error("Error fetching game data:", error);
      return null;
    }
  }

  function createEmptyBoard(): Board {
    return new Board();
  }

  async function saveMessage(
    username: string,
    gameId: string,
    message: string
  ): Promise<void> {
    try {
      const client = await pool.connect();
      const query =
        "INSERT INTO game_chat (username, game_id, message) VALUES ($1, $2, $3)";
      await client.query(query, [username, gameId, message]);
      client.release();
    } catch (error) {
      console.error("Error saving message:", error);
    }
  }
  async function sendMessagesFromDatabase(gameId: string) {
    try {
      const client = await pool.connect();
      const query =
        "SELECT username, game_id, message FROM game_chat WHERE game_id = $1";
      const result: QueryResult<any> = await client.query(query, [gameId]);
      client.release();

      const messages = result.rows;

      messages.forEach((message) => {
        const { username, game_id, message: msg } = message;
        const res = {
          type: "getMessage",
          payload: {
            username,
            gameId: game_id,
            message: msg,
          },
        };

        ws.send(JSON.stringify(res));
      });
    } catch (error) {
      console.error("Error sending messages from database:", error);
    }
  }
  async function setPlayerReadyStatus(username: string, gameId: string) {
    try {
      const client = await pool.connect();
      const query =
        "UPDATE games SET " +
        "player1_ready = CASE WHEN player1_username = $1 THEN TRUE ELSE player1_ready END, " +
        "player2_ready = CASE WHEN player2_username = $1 THEN TRUE ELSE player2_ready END " +
        "WHERE game_id = $2";
      await client.query(query, [username, gameId]);
      client.release();
    } catch (error) {
      console.error("Error setting player ready status:", error);
    }
  }
  async function updateBoard(
    gameId: string,
    username: string,
    x: number,
    y: number,
    isPerfectHit: boolean
  ): Promise<void> {
    try {
      const client = await pool.connect();
      const query = `
        UPDATE games
        SET
          player1_board = CASE
            WHEN player1_username = $1 THEN jsonb_set(player1_board, ARRAY[$2, $3, 'mark'], '{"name": ${
              isPerfectHit ? "'ship'" : "'miss'"
            } }')
            ELSE player1_board
          END,
          player2_board = CASE
            WHEN player2_username = $1 THEN jsonb_set(player2_board, ARRAY[$2, $3, 'mark'], '{"name": ${
              isPerfectHit ? "'ship'" : "'miss'"
            } }')
            ELSE player2_board
          END
        WHERE game_id = $4;
      `;
      await client.query(query, [username, x, y, gameId]);
      client.release();
    } catch (error) {
      console.error("Error updating board:", error);
    }
  }

  async function initGames(ws: WebSocketWithUsername, gameId: string) {
    try {
      const client = await pool.connect();
      const query = "SELECT player1_username FROM games WHERE game_id = $1";
      const result: QueryResult<any> = await client.query(query, [gameId]);

      if (result.rows.length === 0) {
        await client.query(
          "INSERT INTO games (game_id, player1_username, player1_board, player2_board) VALUES ($1, $2, $3, $4)",
          [gameId, ws.username, createEmptyBoard(), createEmptyBoard()]
        );
      } else {
        const { player1_username } = result.rows[0];

        if (player1_username !== ws.username) {
          await client.query(
            "UPDATE games SET player2_username = $1, player2_board = $3 WHERE game_id = $2",
            [ws.username, gameId, createEmptyBoard()]
          );
        }
      }

      client.release();
    } catch (error) {
      console.error("Error initializing game:", error);
    }
  }

  async function broadcast(event: string, payload: any) {
    try {
      const { username, gameId } = payload;
      const gameData = await getGameData(gameId);

      if (!gameData) {
        return;
      }

      const {
        player1_username,
        player2_username,
        player1_ready,
        player2_ready,
        player1_can_shoot,
        player2_can_shoot,
        player1_health,
        player2_health,
        player1_board,
        player2_board,
      } = gameData;

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
                myBoard: isMe ? player1_board : player2_board,
                rivalBoard: isMe ? player2_board : player1_board,
              },
            };
            sendMessagesFromDatabase(gameId);
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
            console.log(payload);
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
