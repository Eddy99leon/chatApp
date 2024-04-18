import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      if(action.payload && typeof action.payload[Symbol.iterator] === 'function'){
        return {
          ...state,
          users: [...state.users, ...action.payload]
        }
      }else{
        return {
          ...state,
          users: [...state.users, action.payload]
        }
      }
    },
    updateUser: (state, action) => {
      const { id, updatedUserData } = action.payload;
      const userToUpdate = state.users.find(user => user.id === id);
      if (userToUpdate) {
        Object.assign(userToUpdate, updatedUserData);
      }
    },
    deleteUser: (state, action) => {
      const userToDelete = action.payload;
      state.users = state.users.filter(user => user.userId !== userToDelete.userId);
    },
  },
});

export const { addUser, updateUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;