import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessage: (state, action) => {
        if(action.payload && typeof action.payload[Symbol.iterator] === 'function'){
            return {
              ...state,
              messages: [...state.messages, ...action.payload]
            }
        }else{
            return {
              ...state,
              messages: [...state.messages, action.payload]
            }
        }
    },
    updateMessage: (state, action) => {
        const updatedMessage = action.payload;
        return {
          ...state,
          messages: state.messages.map(message => {
            if (message._id === updatedMessage._id) {
              return updatedMessage;
            } else {
              return message;
            }
          })
        };
    },
    deleteMessage: (state, action) => {
        const messageToDeleteId = action.payload;
        state.messages = state.messages.filter(message => message._id !== messageToDeleteId);
    },
  },
});

export const { addMessage, updateMessage, deleteMessage } = messageSlice.actions;
export default messageSlice.reducer;