import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action) => {
      const { id, updatedUserData } = action.payload;
      const userToUpdate = state.users.find(user => user.id === id);
      if (userToUpdate) {
        Object.assign(userToUpdate, updatedUserData);
      }
    },
    deleteUser: (state, action) => {
      const userIdToDelete = action.payload;
      state.users = state.users.filter(user => user.id !== userIdToDelete);
    },
  },
});

export const { addUser, updateUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;