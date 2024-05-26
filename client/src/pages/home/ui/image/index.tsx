import { useState, FC } from "react";

import { cn } from "@utils";
import { ImageInputLanguage, SelectLanguage } from "@features/index";

import "./index.scss";

const b = cn("text");

const TabImage: FC = () => {
    const [sourceLanguage, setSourceLanguage] = useState<string>();
    const [targetLanguage, setTargetLanguage] = useState<string>();

    return (
        <div className={b()}>
            <div className={b("inner")}>
                <div className={b("top")}>
                    <SelectLanguage
                        disableSource
                        sourceLanguage={sourceLanguage}
                        setSourceLanguage={setSourceLanguage}
                        targetLanguage={targetLanguage}
                        setTargetLanguage={setTargetLanguage}
                    />
                </div>
                <div className={b("content")}>
                    <ImageInputLanguage targetLanguage={targetLanguage} />
                </div>
            </div>
        </div>
    );
};

export { TabImage };
