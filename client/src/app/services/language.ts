import { createApi } from "@reduxjs/toolkit/query/react";
import { ILanguage, ILanguageSuggest, SuccessResponse } from "@localtypes";
import { baseQuery } from "./base";

export type LanguagesReponse = SuccessResponse<ILanguage>;
export type LanguageSuggestReponse = SuccessResponse<ILanguageSuggest>;

export const languageApiUrl = "/api/language/v1";

export const languageApi = createApi({
    reducerPath: "languageApi",
    baseQuery,
    endpoints: builder => ({
        getListLanguage: builder.query<LanguagesReponse, void>({
            query: () => `${languageApiUrl}/list`,
        }),
        languageSuggest: builder.mutation<LanguageSuggestReponse, string>({
            query: (text: string) => ({
                url: `${languageApiUrl}/suggest`,
                method: "POST",
                body: {
                    text,
                },
            }),
        }),
    }),
});

export const { useGetListLanguageQuery, useLanguageSuggestMutation } = languageApi;
