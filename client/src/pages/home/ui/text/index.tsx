import { useState, FC } from "react";

import { cn } from "@utils";
import { TextInputLanguage, SelectLanguage } from "@features/index";

import "./index.scss";

const b = cn("text");

const TabText: FC = () => {
    const [sourceLanguage, setSourceLanguage] = useState<string>();
    const [targetLanguage, setTargetLanguage] = useState<string>();

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
                <div className={b("content")}>
                    <TextInputLanguage sourceLanguage={sourceLanguage} targetLanguage={targetLanguage} />
                </div>
            </div>
        </div>
    );
};

export { TabText };
