import { createApi } from "@reduxjs/toolkit/query/react";
import { IUser, SuccessResponse } from "@localtypes";
import { baseQuery } from "./base";

// * RESPONSES
export type GetProfileResponse = SuccessResponse<IUser>;

// * REQUESTS
export interface SignInput {
    email: string;
    password: string;
}

export interface SignUpInput {
    email: string;
    password: string;
    name: string;
    surname: string;
}

export interface UpdateProfieInput {
    name: string;
    surname: string;
}

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery,
    endpoints: builder => ({
        signUp: builder.mutation<void, SignUpInput>({
            query: (body: any) => ({
                url: "/api/auth/v1/sign-up",
                method: "POST",
                body,
            }),
        }),
        signIn: builder.mutation<void, SignInput>({
            query: (body: any) => ({
                url: "/api/auth/v1/sign-in",
                method: "POST",
                body,
            }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: "/api/auth/v1/logout",
                method: "POST",
            }),
        }),
        getMyProfile: builder.query<GetProfileResponse, void>({
            query: () => ({
                url: "/api/profile/v1/get-my-profile",
                method: "GET",
            }),
        }),
        updateProfile: builder.mutation<void, UpdateProfieInput>({
            query: (body: any) => ({
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
