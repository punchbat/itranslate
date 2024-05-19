import { createApi } from "@reduxjs/toolkit/query/react";
import { IUser, SuccessResponse } from "@localtypes";
import { baseQuery } from "./base";

export interface SignUpRequest {
    email: string;
    password: string;
    name: string;
    surname: string;
}

export interface SignInRequest {
    email: string;
    password: string;
}

export interface UpdateProfieRequest {
    name: string;
    surname: string;
}

export type GetProfileResponse = SuccessResponse<IUser>;

export const authApiUrl = "/api/auth/v1";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery,
    endpoints: builder => ({
        signUp: builder.mutation<void, SignUpRequest>({
            query: (body: SignUpRequest) => ({
                url: `${authApiUrl}/sign-up`,
                method: "POST",
                body,
            }),
        }),
        signIn: builder.mutation<void, SignInRequest>({
            query: (body: SignInRequest) => ({
                url: `${authApiUrl}/sign-in`,
                method: "POST",
                body,
            }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: `${authApiUrl}/logout`,
                method: "POST",
            }),
        }),
        getMyProfile: builder.query<GetProfileResponse, void>({
            query: () => ({
                url: "/api/profile/v1/get-my-profile",
                method: "GET",
            }),
        }),
        updateProfile: builder.mutation<void, UpdateProfieRequest>({
            query: (body: UpdateProfieRequest) => ({
                url: "/api/profile/v1/update-profile",
                method: "POST",
                body,
            }),
            async onQueryStarted(_: any, { dispatch, queryFulfilled }: { dispatch: any; queryFulfilled: any }) {
                await queryFulfilled;

                await dispatch(authApi.endpoints.getMyProfile.initiate(undefined, { forceRefetch: true }));
            },
        }),
    }),
});

export const {
    useSignUpMutation,
    useSignInMutation,
    useLogoutMutation,
    useGetMyProfileQuery,
    useUpdateProfileMutation,
} = authApi;
