import { createApi } from "@reduxjs/toolkit/query/react";
import { ITranslation, SuccessResponse } from "@localtypes";
import { baseQuery } from "./base";

export interface ListTranslationRequest {
    search?: string;
    createdAtFrom?: string;
    createdAtTo?: string;
    updatedAtFrom?: string;
    updatedAtTo?: string;
}

export type TranslationReponse = SuccessResponse<ITranslation>;
export type TranslationsReponse = SuccessResponse<Array<ITranslation>>;

export const translationApiUrl = "/api/translation/v1";

export const translationApi = createApi({
    reducerPath: "translationApi",
    baseQuery,
    endpoints: builder => ({
        getTranslationByID: builder.query<TranslationReponse, string>({
            query: (id: string) => `${translationApiUrl}/translation/${id}`,
        }),
        getListTranslation: builder.query<TranslationsReponse, ListTranslationRequest>({
            query: (filters = {}) => ({
                url: `${translationApiUrl}/list`,
                method: "GET",
                params: filters,
            }),
        }),
    }),
});

export const { useGetTranslationByIDQuery, useGetListTranslationQuery } = translationApi;
