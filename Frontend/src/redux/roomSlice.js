// /frontend/src/redux/roomSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roomId: null,
  isRoomActive: false,
  users: [],
  email: "", // email of the user
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoomId: (state, action) => {
      state.roomId = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setRoomActive: (state, action) => {
      state.isRoomActive = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    clearRoom: () => initialState,
  },
});

export const { setRoomId, setUsers, setRoomActive, setEmail, clearRoom } = roomSlice.actions;
export default roomSlice.reducer;
