/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useCallback, FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Spin, Button, Input, Form } from "antd";
import { SaveOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

import { cn } from "@utils";
import {
    UpdateProfieInput,
    useGetMyProfileQuery,
    useLogoutMutation,
    useUpdateProfileMutation,
} from "@app/services/auth";
import { useAppDispatch } from "@hooks/store-hooks";
import { ToastStore } from "@widgets/index";
import { FailResponse, IUser } from "@localtypes";

import "./Page.scss";
import dayjs from "dayjs";
import "dayjs/locale/ru"; // Импорт нужной локали

dayjs.locale("ru");

const { Text } = Typography;

type FormValues = Omit<IUser, "_id" | "email" | "createdAt" | "updatedAt">;

const b = cn("profile");

const Profile: FC = function () {
    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const [updateProfile, { isLoading: isUpdateProfileLoading }] = useUpdateProfileMutation();
    const { data } = useGetMyProfileQuery();
    const [logout] = useLogoutMutation();

    const [isEditMode, setIsEditMode] = useState<boolean>(false);

    const [, forceUpdate] = useState<any>();

    const [form] = Form.useForm<FormValues>();
    const setFormDefaultValues = useCallback(() => {
        form.setFieldsValue({
            name: data?.payload?.name || "",
            surname: data?.payload?.surname || "",
        });
        forceUpdate({});
    }, [data?.payload?.name, data?.payload?.surname, form]);

    useEffect(() => {
        if (data?.payload) {
            setFormDefaultValues();
        }
    }, [data?.payload, setFormDefaultValues]);

    const isMyProfile = () => {
        // eslint-disable-next-line no-underscore-dangle
        return true;
    };

    const onFinish = async (values: UpdateProfieInput) => {
        try {
            await updateProfile(values).unwrap();
        } catch (err) {
            const { data } = err as { data: FailResponse };
            dispatch(
                ToastStore.notify({
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
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

    const handleExit = async () => {
        try {
            await logout().unwrap();

            navigate("/sign-in");
        } catch (err) {
            dispatch(
                ToastStore.notify({
                    message: (err as Object).toString(),
                    options: {
                        type: ToastStore.MessageType.ERROR,
                        duration: 3000,
                        position: ToastStore.MessagePositions["RIGHT-TOP"],
                    },
                }),
            );
        }
    };

    if (isUpdateProfileLoading || !data?.payload) {
        return <Spin />;
    }

    return (
        <div className={b()}>
            <div className={b("inner")}>
                <Form onFinish={onFinish} form={form}>
                    <div className={b("top")}>
                        <div className={b("info")}>
                            <div className={b("email")}>
                                <Text>{data?.payload?.email}</Text>
                            </div>

                            <div className={b("fullname")}>
                                <div className={b("surname")}>
                                    {isEditMode ? (
                                        <Form.Item
                                            name="surname"
                                            rules={[{ required: true, message: "Please enter your surname!" }]}
                                        >
                                            <Input placeholder="Surname" />
                                        </Form.Item>
                                    ) : (
                                        <Text>{form.getFieldValue("surname")}</Text>
                                    )}
                                </div>
                                <div className={b("name")}>
                                    {isEditMode ? (
                                        <Form.Item
                                            name="name"
                                            rules={[{ required: true, message: "Please enter your name!" }]}
                                        >
                                            <Input placeholder="Name" />
                                        </Form.Item>
                                    ) : (
                                        <Text>{form.getFieldValue("name")}</Text>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={b("created_at")}>
                        <Text style={{ fontSize: "10px" }}>Account is created at: </Text>
                        <Text style={{ fontSize: "10px" }} strong>
                            {data?.payload?.createdAt
                                ? new Date(data?.payload?.createdAt).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                      timeZoneName: "short",
                                  })
                                : "Not found"}
                        </Text>
                    </div>
                    <div className={b("actions")}>
                        <Button type="link" htmlType="button" onClick={handleExit}>
                            Exit
                        </Button>
                    </div>
                </Form>
            </div>
            {isMyProfile() && (
                <div className={b("edit_action")}>
                    <Button
                        type={isEditMode ? "primary" : "default"}
                        htmlType="button"
                        onClick={() => {
                            setIsEditMode(!isEditMode);

                            if (isEditMode) {
                                form.submit();
                            }
                        }}
                        icon={isEditMode ? <SaveOutlined /> : <EditOutlined />}
                    >
                        {isEditMode ? "Save" : "Edit"}
                    </Button>
                    {isEditMode && (
                        <Button
                            htmlType="button"
                            onClick={() => {
                                setFormDefaultValues();

                                setIsEditMode(!isEditMode);
                            }}
                            icon={<DeleteOutlined />}
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export { Profile };
