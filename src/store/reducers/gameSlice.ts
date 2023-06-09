import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface GameState {
  username: string;
  rivalName: string;
  gameId: string | number | undefined;
  shipsReady: boolean;
  canShoot: boolean;
  rivalReady: boolean;
}

const initialState: GameState = {
  username: localStorage.username,
  rivalName: "",
  gameId: "",
  shipsReady: false,
  canShoot: false,
  rivalReady: false,
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
    setShipsReady(state, action: PayloadAction<boolean>) {
      state.shipsReady = action.payload;
    },
    setCanShoot(state, action: PayloadAction<boolean>) {
      state.canShoot = action.payload;
    },
    setRivalReady(state, action: PayloadAction<boolean>) {
      state.rivalReady = action.payload;
    },
  },
});
export const {
  setUsername,
  setRivalName,
  setGameId,
  setShipsReady,
  setCanShoot,
  setRivalReady,
} = gameSlice.actions;
export default gameSlice.reducer;
