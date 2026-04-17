import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import config from '../../config';

// ─── Async Thunks ───────────────────────────────────────────────
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await authService.login(credentials);
      // Persist auth tokens
      localStorage.setItem(config.TOKEN_KEY, data.payload.token);
      if (data.payload.refreshToken) {
        localStorage.setItem(config.REFRESH_TOKEN_KEY, data.payload.refreshToken);
      }
      localStorage.setItem(config.USER_KEY, JSON.stringify(data?.payload?.user || data?.payload?.admin));
      return data.payload;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  }
);
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await authService.loginAdmin(credentials);
      // Persist auth tokens
      localStorage.setItem(config.TOKEN_KEY, data.payload.token);
      if (data.payload.refreshToken) {
        localStorage.setItem(config.REFRESH_TOKEN_KEY, data.payload.refreshToken);
      }
      localStorage.setItem(config.USER_KEY, JSON.stringify(data?.payload?.user || data?.payload?.admin));
      return data.payload;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Admin login failed. Please try again.'
      );
    }
  }
);
export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await authService.getProfile();
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile.');
    }
  }
);

// ─── Initial State ──────────────────────────────────────────────
const storedUser = localStorage.getItem(config.USER_KEY);
const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: localStorage.getItem(config.TOKEN_KEY) || null,
  isAuthenticated: !!localStorage.getItem(config.TOKEN_KEY),
  loading: false,
  error: null,
  menuItems: [],
};

// ─── Slice ──────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.menuItems = [];
      localStorage.removeItem(config.TOKEN_KEY);
      localStorage.removeItem(config.REFRESH_TOKEN_KEY);
      localStorage.removeItem(config.USER_KEY);
    },
    setMenuItems: (state, action) => {
      state.menuItems = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.menuItems = action.payload.menuItems || [];
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Admin Login
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user || action.payload.admin;
        state.token = action.payload.token;
        state.menuItems = action.payload.menuItems || [];
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || action.payload;
        state.menuItems = action.payload.menuItems || state.menuItems;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setMenuItems, clearError } = authSlice.actions;
export default authSlice.reducer;
