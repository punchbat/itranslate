import { createApi } from "@reduxjs/toolkit/query/react";
import { ILanguage, SuccessResponse } from "@localtypes";
import { baseQuery } from "./base";

export type LanguagesReponse = SuccessResponse<Array<ILanguage>>;

export const languageApiUrl = "/api/language/v1";

export const languageApi = createApi({
    reducerPath: "languageApi",
    baseQuery,
    endpoints: builder => ({
        getListLanguage: builder.query<LanguagesReponse, void>({
            query: () => `${languageApiUrl}/list`,
        }),
    }),
});

export const { useGetListLanguageQuery } = languageApi;
