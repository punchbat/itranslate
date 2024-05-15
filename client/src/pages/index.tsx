import { FC, lazy, ReactElement } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { Suspense } from "@components";
import { useGetMyProfileQuery } from "@app/services/auth";
import { DomikLayout, MainLayout } from "@app/layouts";
import { isAuthenticatedAndHasRole } from "@utils";
import { Error } from "./error";

const SignUp = lazy(() => import("./domik/sign-up"));
const SignIn = lazy(() => import("./domik/sign-in"));

const Home = lazy(() => import("./home"));
const Analyze = lazy(() => import("./analyze"));
const Profile = lazy(() => import("./profile"));

const Whois = lazy(() => import("./whois"));

const AuthGuard: FC<{ children: ReactElement }> = ({ children }) => {
    const { data, error, isLoading } = useGetMyProfileQuery();

    if (isLoading) {
        return null;
    }

    if (!error && isAuthenticatedAndHasRole(data?.payload)) {
        return children;
    }

    return <Navigate to="/sign-in" />;
};

const router = createBrowserRouter([
    {
        path: "/sign-up",
        element: (
            <DomikLayout>
                <Suspense>
                    <SignUp />
                </Suspense>
            </DomikLayout>
        ),
        errorElement: <Error />,
    },
    {
        path: "/sign-in",
        element: (
            <DomikLayout>
                <Suspense>
                    <SignIn />
                </Suspense>
            </DomikLayout>
        ),
        errorElement: <Error />,
    },
    {
        path: "/",
        element: (
            <AuthGuard>
                <MainLayout>
                    <Suspense>
                        <Home />
                    </Suspense>
                </MainLayout>
            </AuthGuard>
        ),
        errorElement: <Error />,
    },
    {
        path: "/analyze",
        element: (
            <AuthGuard>
                <MainLayout>
                    <Suspense>
                        <Analyze />
                    </Suspense>
                </MainLayout>
            </AuthGuard>
        ),
        errorElement: <Error />,
    },
    {
        path: "/profile",
        element: (
            <AuthGuard>
                <MainLayout>
                    <Suspense>
                        <Profile />
                    </Suspense>
                </MainLayout>
            </AuthGuard>
        ),
        errorElement: <Error />,
    },
    {
        path: "/whois",
        element: (
            <AuthGuard>
                <MainLayout>
                    <Suspense>
                        <Whois />
                    </Suspense>
                </MainLayout>
            </AuthGuard>
        ),
        errorElement: <Error />,
    },
]);

export const Routing: FC = function () {
    return <RouterProvider router={router} />;
};
