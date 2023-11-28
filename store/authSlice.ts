import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Dispatch } from "redux";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

import { LoginData, PasswordData, UserData } from "@/interfaces";

import { apiUrl } from "@/utils/apiUrl";
import { getConfig } from "@/utils/configHelper";

export interface IsAuthenticated {
  IsAuthenticated: boolean;
  token: string | null;
  profile: UserData | null;
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: IsAuthenticated = {
  IsAuthenticated: false,
  token: null,
  profile: null,
  loading: false,
  success: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthenticated: (state, action) => {
      state.IsAuthenticated = action.payload;
    },
    setProfile: (state, action: PayloadAction<UserData>) => {
      state.profile = action.payload;
    },
    setAuthToken: (state, action) => {
      state.token = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetError: (state) => {
      state.error = null;
    },
  },

  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    },
  },
});

export const {
  setIsAuthenticated,
  setAuthToken,
  setProfile,
  setSuccess,
  resetSuccess,
  setLoading,
  setError,
  resetError,
} = authSlice.actions;

export const selectProfile = (state: AppState) => state.auth.profile;
export const selectIsAuthenticated = (state: AppState) =>
  state.auth?.IsAuthenticated;
export const selectSuccess = (state: AppState) => state.auth.success;
export const selectError = (state: AppState) => state.auth.error;
export const selectAuthLoading = (state: AppState) => state.auth.loading;

export const loginUser =
  (loginData: LoginData) => async (dispatch: Dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, loginData);
      const { token } = response.data;
      dispatch(setIsAuthenticated(true));
      dispatch(setAuthToken(token));

      dispatch(setSuccess(true));
    } catch (error: any) {
      console.error(error);
      dispatch(setIsAuthenticated(false));
      dispatch(setError(error.response.data.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const logoutUser = () => async (dispatch: Dispatch) => {
  try {
    dispatch(setIsAuthenticated(false));
  } catch (error) {
    console.error(error);
  }
};

export const updateUserPassword =
  (userPassword: PasswordData) =>
    async (dispatch: Dispatch, getState: () => AppState) => {
      try {
        const { config } = getConfig(getState);
        const url = new URL(`${apiUrl}/api/customer/user-password-update`);
        await axios.post(url.toString(), userPassword, config);
        dispatch(setSuccess(true));
      } catch (error: any) {
        console.error(error);
        dispatch(setError(error.response.data.message));
      }
    };

export const updateUserDetails =
  (userDetails: UserData) =>
    async (dispatch: Dispatch, getState: () => AppState) => {
      try {
        const { config } = getConfig(getState);
        const url = new URL(`${apiUrl}/api/customer/user-update`);
        const response = await axios.post(url.toString(), userDetails, config);
        const { user } = response.data;
        dispatch(setProfile(user));
        dispatch(setSuccess(true));
      } catch (error) {
        console.error(error);
      }
    };

export const userDetails =
  () => async (dispatch: Dispatch, getState: () => AppState) => {
    dispatch(setSuccess(false));
    try {
      const { config } = getConfig(getState);
      const url = new URL(`${apiUrl}/api/customer/user-profile`);
      const response = await axios.get(url.toString(), config);
      const { user } = response.data;
      dispatch(setProfile(user));
    } catch (error) {
      console.error(error);
    }
  };

export const forgotPassword =
  (userData: LoginData) => async (dispatch: Dispatch) => {
    try {
      await axios.post(`${apiUrl}/api/auth/forgot`, userData);
      dispatch(setSuccess(true));
    } catch (error: any) {
      console.error(error);
      dispatch(setIsAuthenticated(false));
      dispatch(setError(error.response.data.message));
    }
  };

export const resetUserPassword =
  (data: PasswordData, tempToken: string | string[] | undefined) =>
    async (dispatch: Dispatch, getState: () => AppState) => {
      try {
        const { config } = getConfig(getState);
        const url = new URL(
          `${apiUrl}/api/auth/reset-password?token=${tempToken}`
        );

        const response = await axios.post(url.toString(), data, config);

        const { token } = response.data;
        dispatch(setIsAuthenticated(true));
        dispatch(setAuthToken(token));
        dispatch(setSuccess(true));
      } catch (error: any) {
        console.error(error);
        dispatch(setError(error.response.data.message));
      }
    };

export default authSlice.reducer;
