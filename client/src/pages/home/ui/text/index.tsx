import { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import qs from "qs";

import { useTranslateTextMutation } from "@app/services/translate";
import { cn } from "@utils";
import { HomePageParams } from "@localtypes";

import "./index.scss";
import { Typography } from "antd";

const { Title, Text } = Typography;

const b = cn("text");

const TabText: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const queryObj = qs.parse(location.search.substring(1));
    const { sourceLanguage, targetLanguage } = queryObj as HomePageParams;
    const handleLanguageChange = (key: string, value: string) => {
        navigate({
            pathname: location.pathname,
            search: qs.stringify({ ...queryObj, [key]: value }),
        });
    };

    const [translateText, { isLoading: isTranslateTextLoading }] = useTranslateTextMutation();

    return (
        <div className={b()}>
            <div className={b("inner")}>
                <div className={b("title")}>
                    <Title level={1}>Translate</Title>
                </div>
                <div className={b("content")}>asda</div>
            </div>
        </div>
    );
};

export { TabText };
