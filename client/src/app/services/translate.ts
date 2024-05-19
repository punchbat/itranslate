import { createApi } from "@reduxjs/toolkit/query/react";
import { ITranslation, SuccessResponse } from "@localtypes";
import { baseQuery } from "./base";

export type TranslateTextRequest = {
    sourceLanguage?: string;
    sourceText: string;
    targetLanguage: string;
};

export type TranslationReponse = SuccessResponse<ITranslation>;

export const translateApiUrl = "/api/translate/v1";

export const translateApi = createApi({
    reducerPath: "translateApi",
    baseQuery,
    endpoints: builder => ({
        translateText: builder.mutation<TranslationReponse, TranslateTextRequest>({
            query: (body: TranslateTextRequest) => ({
                url: `${translateApiUrl}/text`,
                method: "POST",
                body,
            }),
        }),
        translateImage: builder.mutation<TranslationReponse, FormData>({
            query: (body: FormData) => {
                return {
                    url: `${translateApiUrl}/image`,
                    method: "POST",
                    body,
                };
            },
        }),
    }),
});

export const { useTranslateTextMutation, useTranslateImageMutation } = translateApi;
