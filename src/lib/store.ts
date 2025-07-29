import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types
interface Role {
  id: string;
  name: string;
  permissions: string[];
}

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

interface AuthState {
  user: User | null;
}

// Auth slice (renamed from userSlice for clarity)
const authSlice = createSlice({
  name: "auth",
  initialState: { user: null } as AuthState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

// Configure store with 'auth' reducer
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer, // Changed from 'user' to 'auth'
  },
});

// TypeScript types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;