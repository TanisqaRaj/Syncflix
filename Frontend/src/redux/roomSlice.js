import { createSlice } from '@reduxjs/toolkit'

const roomSlice = createSlice({
  name: 'room',
  initialState: {
    roomId: null,
    users: [], // [{ socketId, email }]
  },
  reducers: {
    setRoomId: (state, action) => {
      state.roomId = action.payload
    },
    setUsers: (state, action) => {
      state.users = action.payload
    },
    addUser: (state, action) => {
      const exists = state.users.some(u => u.socketId === action.payload.socketId)
      if (!exists) state.users.push(action.payload)
    },
    removeUser: (state, action) => {
      state.users = state.users.filter(u => u.socketId !== action.payload)
    },
    resetRoom: (state) => {
      state.roomId = null
      state.users = []
    }
  }
})

export const { setRoomId, setUsers, addUser, removeUser, resetRoom } = roomSlice.actions
export default roomSlice.reducer;
