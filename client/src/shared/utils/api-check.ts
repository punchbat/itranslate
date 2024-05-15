import { IUser } from "@localtypes";

const isAuthenticated = (user: IUser) => {
    return user.email;
};

const isAuthenticatedAndHasRole = (user: IUser | undefined) => {
    return user ? isAuthenticated(user) : false;
};

export { isAuthenticatedAndHasRole };
