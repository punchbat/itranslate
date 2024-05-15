import { FC } from "react";

import { Typography } from "antd";
import { cn } from "@utils";
import { AppLogo, UserLogo } from "../logos";

import "./index.scss";

const { Text } = Typography;

const b = cn("header");

const Header: FC = () => {
    return (
        <header className={b("")}>
            <div className={b("inner")}>
                <div className={b("app")}>
                    <AppLogo />

                    <Text strong>ITranslate for People</Text>
                </div>

                <div className={b("user")}>
                    <UserLogo />
                </div>
            </div>
        </header>
    );
};

export { Header };
