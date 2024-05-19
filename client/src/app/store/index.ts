import { configureStore } from "@reduxjs/toolkit";

// * сервисы
import { authApi } from "@app/services/auth";
import { translateApi } from "@app/services/translate";
import { translationApi } from "@app/services/translation";
import { languageApi } from "@app/services/language";
// * компоненты
import toastsSlice from "@widgets/toasts-renderer/store";
// * обычные
import appSlice from "./reducers/appSlice";

export function makeStore() {
    return configureStore({
        reducer: {
            // * сервисы
            [authApi.reducerPath]: authApi.reducer,
            [translateApi.reducerPath]: translateApi.reducer,
            [translationApi.reducerPath]: translationApi.reducer,
            [languageApi.reducerPath]: languageApi.reducer,

            // * компоненты
            toasts: toastsSlice,

            // * обычные
            app: appSlice,
        },

        middleware: getdefaultMiddleware =>
            getdefaultMiddleware().concat([
                authApi.middleware,
                translateApi.middleware,
                translationApi.middleware,
                languageApi.middleware,
            ]),
    });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

// export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;

export { store };
