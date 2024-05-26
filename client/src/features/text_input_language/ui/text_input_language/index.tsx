import { useState, useCallback, FC, ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Spin, Input, Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import qs from "qs";

import { useAppDispatch } from "@hooks/index";
import { cn } from "@utils";
import { FailResponse, ILanguageSuggest, QueryLanguageKeyEnum } from "@localtypes";
import { TranslateTextRequest, useTranslateTextMutation } from "@app/services/translate";
import { ToastStore } from "@widgets/index";
import { useLanguageSuggestMutation } from "@app/services/language";

import "./index.scss";

const { Text } = Typography;
const { TextArea } = Input;

const b = cn("textinputlanguage");

interface Props {
    sourceLanguage?: string;
    targetLanguage?: string;
}

const TextInputLanguage: FC<Props> = ({ sourceLanguage, targetLanguage }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const dispatch = useAppDispatch();

    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

    const [sourceText, setSourceText] = useState("");
    const [sourceTextLength, setSourceTextLength] = useState(0);
    const [targetText, setTargetText] = useState("");
    const [suggestedLanguage, setSuggestedLanguage] = useState<ILanguageSuggest | null>(null);

    const [translateText, { isLoading }] = useTranslateTextMutation();

    const [languageSuggest, { isLoading: isLoadingLanguageSuggest }] = useLanguageSuggestMutation();

    const translate = useCallback(
        async (text?: string) => {
            const localSourceText = text || sourceText;

            if (!localSourceText || !localSourceText?.length || !targetLanguage?.length) return;

            const body: TranslateTextRequest = {
                sourceLanguage,
                sourceText: localSourceText,
                targetLanguage,
            };

            try {
                const response = await translateText(body).unwrap();
                setTargetText(response.payload.translatedText);
            } catch (err) {
                const { data } = err as { data: FailResponse };
                dispatch(
                    ToastStore.notify({
                        message: data?.message,
                        options: {
                            type: ToastStore.MessageType.ERROR,
                            duration: 3000,
                            position: ToastStore.MessagePositions["RIGHT-TOP"],
                        },
                    }),
                );
            }
        },
        [translateText, sourceText, sourceLanguage, targetLanguage, dispatch],
    );

    const suggestLanguageFromText = useCallback(
        async (text: string) => {
            try {
                const response = await languageSuggest(text).unwrap();
                setSuggestedLanguage(response?.payload);
            } catch (err) {
                setSuggestedLanguage(null);
            }
        },
        [languageSuggest],
    );

    const handleChangeText = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setSourceText(e.target.value);
        setSourceTextLength(e.target.value.length);

        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        setTypingTimeout(
            setTimeout(() => {
                if (e.target.value) {
                    suggestLanguageFromText(e.target.value);
                    translate(e.target.value);
                }
            }, 900),
        );
    };

    const handleClearText = () => {
        setSourceText("");
        setTargetText("");
        setSourceTextLength(0);
    };

    const handleClickSuggestLanguage = () => {
        const queryObj = qs.parse(location.search.substring(1));
        const newQueryObj = { ...queryObj, [QueryLanguageKeyEnum.SOURCE_LANGUAGE]: suggestedLanguage?.code };
        navigate({ search: qs.stringify(newQueryObj) });

        setSuggestedLanguage(null);

        translate();
    };

    const handleCopyText = async () => {
        if (targetText) {
            await navigator.clipboard.writeText(targetText);
            dispatch(
                ToastStore.notify({
                    message: "Text copied to clipboard!",
                    options: {
                        type: ToastStore.MessageType.SUCCESS,
                        duration: 3000,
                        position: ToastStore.MessagePositions["RIGHT-TOP"],
                    },
                }),
            );
        }
    };

    return (
        <div className={b()}>
            <div className={b("inner")}>
                <div className={b("input")}>
                    <TextArea
                        size="large"
                        maxLength={2000}
                        value={sourceText}
                        onChange={handleChangeText}
                        placeholder="Enter text"
                        autoSize={{ minRows: 6, maxRows: 10 }}
                    />
                    {suggestedLanguage?.name || isLoadingLanguageSuggest ? (
                        <div className={b("suggest")}>
                            {isLoadingLanguageSuggest ? (
                                <Text disabled>Detecting language...</Text>
                            ) : (
                                <>
                                    <Text disabled>Detected language:</Text>
                                    <Button onClick={handleClickSuggestLanguage} type="link">
                                        {suggestedLanguage?.name}
                                    </Button>
                                </>
                            )}
                        </div>
                    ) : null}

                    <div className={b("count")}>
                        <Text disabled>{sourceTextLength} / 1000</Text>
                    </div>
                    <div className={b("clear")}>
                        <Button onClick={handleClearText} size="large" type="text">
                            Х
                        </Button>
                    </div>
                </div>
                {isLoading ? (
                    <Spin />
                ) : (
                    <div className={b("input")}>
                        <TextArea
                            size="large"
                            value={targetText}
                            placeholder="Translation will appear here"
                            autoSize={{ minRows: 6, maxRows: 10 }}
                            readOnly
                            disabled
                        />
                        <div className={b("copy")}>
                            <Button
                                icon={<CopyOutlined />}
                                onClick={handleCopyText}
                                disabled={!targetText}
                                size="large"
                                type="text"
                            >
                                Copy
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export { TextInputLanguage };
