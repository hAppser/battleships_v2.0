import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: localStorage.username,
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
export const { setUsername, setRivalName } = authSlice.actions;
export default authSlice.reducer;
