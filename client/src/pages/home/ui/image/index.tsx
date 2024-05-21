import { useState, FC } from "react";
import { Spin, Typography } from "antd";

import { useTranslateTextMutation } from "@app/services/translate";
import { cn } from "@utils";
import { SelectLanguage } from "@features/index";

import "./index.scss";

const { Title, Text } = Typography;

const b = cn("text");

const TabImage: FC = () => {
    const [sourceLanguage, setSourceLanguage] = useState<string>();
    const [targetLanguage, setTargetLanguage] = useState<string>();

    const [translateText, { isLoading: isTranslateTextLoading }] = useTranslateTextMutation();

    return (
        <div className={b()}>
            <div className={b("inner")}>
                <div className={b("top")}>
                    <SelectLanguage
                        sourceLanguage={sourceLanguage}
                        setSourceLanguage={setSourceLanguage}
                        targetLanguage={targetLanguage}
                        setTargetLanguage={setTargetLanguage}
                    />
                </div>
                <div className={b("content")}>content</div>
            </div>
        </div>
    );
};

export { TabImage };
