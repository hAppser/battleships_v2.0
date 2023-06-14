import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IMessage } from "../../Interfaces/IMessage";
interface GameState {
  username: string;
  rivalName: string;
  gameId: string | number | undefined;
  shipsPlaced: boolean;
  shipsReady: boolean;
  rivalReady: boolean;
  canShoot: boolean;
  myHealth: number;
  rivalHealth: number;
  chat: IMessage[];
}

const initialState: GameState = {
  username: localStorage.username,
  rivalName: "",
  gameId: "",
  shipsPlaced: false,
  shipsReady: false,
  rivalReady: false,
  canShoot: false,
  myHealth: 20,
  rivalHealth: 20,
  chat: [],
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    setRivalName(state, action: PayloadAction<string>) {
      state.rivalName = action.payload;
    },
    setGameId(state, action: PayloadAction<string | number | undefined>) {
      state.gameId = action.payload;
    },
    setShipsPlaced(state, action: PayloadAction<boolean>) {
      state.shipsPlaced = action.payload;
    },
    setShipsReady(state, action: PayloadAction<boolean>) {
      state.shipsReady = action.payload;
    },
    setRivalReady(state, action: PayloadAction<boolean>) {
      state.rivalReady = action.payload;
    },
    setCanShoot(state, action: PayloadAction<boolean>) {
      state.canShoot = action.payload;
    },
    setMyHealth(state, action: PayloadAction<number>) {
      state.myHealth = action.payload;
    },
    setRivalHealth(state, action: PayloadAction<number>) {
      state.rivalHealth = action.payload;
    },
    setChat(state, action: PayloadAction<Array<IMessage>>) {
      state.chat = action.payload;
    },
  },
});
export const {
  setUsername,
  setRivalName,
  setGameId,
  setShipsPlaced,
  setShipsReady,
  setRivalReady,
  setCanShoot,
  setMyHealth,
  setRivalHealth,
  setChat,
} = gameSlice.actions;
export default gameSlice.reducer;
