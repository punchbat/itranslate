import { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Typography } from "antd";
import { cn } from "@utils";

import "./index.scss";

const { Text } = Typography;

const b = cn("navbar");

const Navbar: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleClick = (path: string) => {
        navigate(path);
    };

    const items = [
        {
            isActive: location.pathname === "/",
            href: "/",
            text: "Home",
        },
        {
            isActive: location.pathname === "/analyze",
            href: "/analyze",
            text: "Analyze",
        },
        {
            isActive: location.pathname === "/whois",
            href: "/whois",
            text: "WHOIS",
        },
    ];

    return (
        <nav className={b("")}>
            <div className={b("inner")}>
                <div className={b("items")}>
                    {items.map((item, index) => (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                        <div
                            className={b("item")}
                            // eslint-disable-next-line react/no-array-index-key
                            key={index}
                            onClick={() => handleClick(item.href)}
                        >
                            <Text strong={item.isActive}>{item.text}</Text>
                            {/* {item.subItems?.length && (
                                    <div className={}>
                                        {item.subItems?.map((item, index) => (
                                            <div className={item.className} key={index}>
                                                <Link href={item.href}>{item.text}</Link>
                                            </div>
                                        ))}
                                    </div>
                                )} */}
                        </div>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export { Navbar };
