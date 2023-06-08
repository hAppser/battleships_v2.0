import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { create } from "domain";

const initialState = {
  username: "",
  rivalName: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    setRivalName(state, action: PayloadAction<string>) {
      state.rivalName = action.payload;
    },
  },
});
