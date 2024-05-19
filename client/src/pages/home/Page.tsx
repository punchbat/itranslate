import { FC } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Typography, Tabs } from "antd";
import type { TabsProps } from "antd";
import qs from "qs";

import { cn } from "@utils";
import { HomePageParams, HomePageTabParams } from "@localtypes";
import { TabText } from "./ui";

import "./Page.scss";

const { Title } = Typography;

const b = cn("home");

const Home: FC = function () {
    const navigate = useNavigate();
    const location = useLocation();

    const queryObj = qs.parse(location.search.substring(1));
    const { tab } = queryObj as HomePageParams;

    const items: TabsProps["items"] = [
        {
            key: "text",
            label: "Text",
            children: <TabText />,
        },
        {
            key: "image",
            label: "Image",
            children: <TabImage />,
        },
    ];

    const handleTabChange = (key: HomePageTabParams) => {
        navigate({
            pathname: location.pathname,
            search: qs.stringify({ ...queryObj, tab: key }),
        });
    };

    const defaultActiveKey = tab.length ? tab : "text";

    return (
        <div className={b()}>
            <div className={b("inner")}>
                <div className={b("title")}>
                    <Title level={1}>Translate</Title>
                </div>
                <div className={b("content")}>
                    <Tabs defaultActiveKey={defaultActiveKey} items={items} onChange={handleTabChange} />
                </div>
            </div>
        </div>
    );
};

export { Home };
