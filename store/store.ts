import {
  Action,
  combineReducers,
  configureStore,
  Middleware,
  Reducer,
  ThunkAction,
} from "@reduxjs/toolkit";
import thunk from "redux-thunk";

import { createWrapper } from "next-redux-wrapper";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice, { IsAuthenticated } from "@/store/authSlice";


type RootState = {
  auth: IsAuthenticated;
};

const rootReducer: Reducer<RootState> = combineReducers({
  auth: authSlice,
});

export default rootReducer;

const makeConfiguredStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }).concat(thunk as Middleware),
    devTools: true,
  });

export const makeStore = () => {
  const isServer = typeof window === "undefined";

  if (isServer) {
    return makeConfiguredStore();
  } else {
    const persistConfig = {
      key: "Backend",
      whitelist: [
        "auth",
      ],
      storage,
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer);
    let store: any = configureStore({
      reducer: persistedReducer,
      devTools: process.env.NODE_ENV !== "production",
    });

    store.__persistor = persistStore(store);

    return store;
  }
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void, ExtraArgument = unknown> = ThunkAction<
  ReturnType,
  AppState,
  ExtraArgument,
  Action
>;

export type AppDispatch = ReturnType<typeof makeConfiguredStore>["dispatch"];

export const wrapper = createWrapper<AppStore>(makeStore);
