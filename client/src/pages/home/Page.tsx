/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect, FC } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Typography, Spin, Tabs } from "antd";
import type { TabsProps } from "antd";
import { cn } from "@utils";
import { useGetListSensorQuery } from "@app/services/translate";
import qs from "qs";

import "./Page.scss";

const { Title, Text } = Typography;

const b = cn("home");

type TabParams = "text" | "image";

interface Params {
    tab?: TabParams;
    sourceLanguage?: string;
    targetLanguage?: string;
}

const Home: FC = function () {
    const navigate = useNavigate();
    const location = useLocation();

    const queryObj = qs.parse(location.search.substring(1));
    const { tab, sourceLanguage, targetLanguage } = queryObj as Params;

    const { data: dataSensors, isLoading } = useGetListSensorQuery();

    const items: TabsProps["items"] = [
        {
            key: "text",
            label: "Text",
            children: "Content of Tab Pane 1",
        },
        {
            key: "image",
            label: "Image",
            children: "Content of Tab Pane 2",
        },
    ];

    const handleTabChange = (key: TabParams) => {
        navigate({
            pathname: location.pathname,
            search: qs.stringify({ ...queryObj, tab: key }),
        });
    };

    const defaultActiveKey = tab.length ? tab : "text";

    if (isLoading) {
        return <Spin />;
    }

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
