import { configureStore } from "@reduxjs/toolkit";

// * сервисы
import { authApi } from "@app/services/auth";
import { sensorApi } from "@app/services/sensor";
import { sensorDataApi } from "@app/services/sensor-data";
// * компоненты
import toastsSlice from "@widgets/toasts-renderer/store";
// * обычные
import appSlice from "./reducers/appSlice";

export function makeStore() {
    return configureStore({
        reducer: {
            // * сервисы
            [authApi.reducerPath]: authApi.reducer,
            [sensorApi.reducerPath]: sensorApi.reducer,
            [sensorDataApi.reducerPath]: sensorDataApi.reducer,

            // * компоненты
            toasts: toastsSlice,

            // * обычные
            app: appSlice,
        },

        middleware: getdefaultMiddleware =>
            getdefaultMiddleware().concat([authApi.middleware, sensorApi.middleware, sensorDataApi.middleware]),
    });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

// export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;

export { store };
