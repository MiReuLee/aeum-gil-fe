import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
}

const { token = null } = localStorage;
const isLoggedIn = !!token;

const initialState: AuthState = {
  isLoggedIn,
  token,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<string>) {
      state.isLoggedIn = true;
      state.token = action.payload;
      localStorage.token = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.token = null;

      delete localStorage.token;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;