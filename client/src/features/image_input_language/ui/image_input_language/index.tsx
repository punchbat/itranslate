import { useState, FC } from "react";
import { Input, Button, Upload, Modal, UploadFile, Spin } from "antd";
import { CopyOutlined, UploadOutlined } from "@ant-design/icons";

import { UploadChangeParam } from "antd/es/upload";
import { useAppDispatch } from "@hooks/index";
import { cn } from "@utils";
import { FailResponse } from "@localtypes";
import { useTranslateImageMutation } from "@app/services/translate";
import { ToastStore } from "@widgets/index";

import "./index.scss";

const { TextArea } = Input;

const b = cn("imageinputlanguage");

interface Props {
    targetLanguage?: string;
}

const ImageInputLanguage: FC<Props> = ({ targetLanguage }) => {
    const dispatch = useAppDispatch();
    const [translateImage, { isLoading }] = useTranslateImageMutation();

    const [fileList, setFileList] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    const [sourceText, setSourceText] = useState("");
    const [translatedText, setTranslatedText] = useState("");

    const handlePreview = (file: UploadFile) => {
        setPreviewImage(file.url || file.thumbUrl);
        setPreviewVisible(true);
    };

    const handleChange = ({ fileList }: UploadChangeParam<UploadFile>) => {
        setFileList(fileList);
        if (fileList.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            handleTranslate(fileList[0]);
        }
    };

    const handleTranslate = async (file: UploadFile) => {
        if (!file.originFileObj || !targetLanguage) return;
        const formData = new FormData();
        formData.append("image", file.originFileObj);
        formData.append("targetLanguage", targetLanguage);

        try {
            const response = await translateImage(formData).unwrap();
            setSourceText(response?.payload?.sourceText);
            setTranslatedText(response?.payload?.translatedText);
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
    };

    const handleCancel = () => {
        setPreviewVisible(false);
    };
    const handleRemove = () => {
        setFileList([]);
        setPreviewVisible(false);
        setPreviewImage("");

        setSourceText("");
        setTranslatedText("");
    };

    const handleCopyText = async () => {
        if (translatedText) {
            await navigator.clipboard.writeText(translatedText);
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
                {isLoading ? (
                    <Spin />
                ) : (
                    <div className={b("upload")}>
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            beforeUpload={() => false}
                            style={{ width: "100%" }}
                            onRemove={handleRemove}
                        >
                            {fileList.length >= 1 ? null : (
                                <div style={{ width: "100%" }}>
                                    <UploadOutlined />
                                    <div style={{ marginTop: 8 }}>Upload Image</div>
                                </div>
                            )}
                        </Upload>
                        <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                            <img alt="example" style={{ width: "100%" }} src={previewImage} />
                        </Modal>
                    </div>
                )}

                <div className={b("text")}>
                    <TextArea rows={4} value={sourceText} readOnly placeholder="Detected text" />
                    <TextArea rows={4} value={translatedText} readOnly placeholder="Translated text" />
                </div>

                <div className={b("action")}>
                    <div className={b("copy")}>
                        <Button
                            icon={<CopyOutlined />}
                            onClick={handleCopyText}
                            disabled={!translatedText}
                            size="large"
                            type="text"
                        >
                            Copy
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { ImageInputLanguage };
