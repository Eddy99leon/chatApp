import { createSlice } from '@reduxjs/toolkit';

const utilSlice = createSlice({
  name: 'message',
  initialState: {
    newMessage: '',
    receiveId: null,
    update: null,
  },
  reducers: {
    setNewMessage(state, action) {
      state.newMessage = action.payload;
    },
    setReceiveId(state, action) {
      state.receiveId = action.payload;
    },
    setUpdateMessage(state, action) {
      state.update = action.payload;
    }
  }
});

export const { setNewMessage, setReceiveId, setUpdateMessage } = utilSlice.actions;
export default utilSlice.reducer;