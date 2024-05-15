import { FC } from "react";

import { Typography } from "antd";
import { cn } from "@utils";

import "./index.scss";

const { Text } = Typography;

const b = cn("footer");

const Footer: FC = () => {
    return (
        <footer className={b("")}>
            <div className={b("inner")}>
                <Text disabled>© 2023 By Air Quality</Text>
            </div>
        </footer>
    );
};

export { Footer };
